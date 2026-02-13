import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/**
 * In-memory order store.
 * This is intentionally local-only for hackathon/demo reproducibility.
 *
 * State machine:
 * CREATED -> CHALLENGED -> PAID -> DELIVERED
 */
const orders = new Map();

function nowIso() {
  return new Date().toISOString();
}

function id(prefix = 'ord') {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

function requireOrder(req, res, next) {
  const { orderId } = req.params;
  const order = orders.get(orderId);
  if (!order) {
    return res.status(404).json({ error: 'ORDER_NOT_FOUND', orderId });
  }
  req.order = order;
  next();
}

// Swagger UI (local docs)
const openApiPath = path.resolve(process.cwd(), 'openapi.yaml');
let openApiDoc = null;
try {
  const raw = fs.readFileSync(openApiPath, 'utf8');
  openApiDoc = YAML.parse(raw);
} catch (e) {
  console.warn('⚠️ Could not load openapi.yaml. Swagger UI will be unavailable.', e?.message || e);
}

if (openApiDoc) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
}

app.get('/', (req, res) => {
  res.json({
    name: '$7 Bootstrap Protocol — Agentic Commerce with x402 (Mock Payment)',
    ok: true,
    docs: openApiDoc ? `${BASE_URL}/docs` : null,
    endpoints: {
      createOrder: 'POST /request',
      getInvoice: 'GET /invoice/:orderId',
      verifyPaymentMock: 'POST /verify/:orderId',
      deliver: 'POST /deliver/:orderId'
    }
  });
});

/**
 * Step 1 — Request: create an order for an agent deliverable.
 */
app.post('/request', (req, res) => {
  const { product = 'quant_snapshot_5m', input = {} } = req.body || {};

  const orderId = id('order');
  const createdAt = nowIso();

  const order = {
    orderId,
    product,
    input,
    state: 'CREATED',
    createdAt,
    challenge: null,
    invoice: null,
    paidAt: null,
    deliveredAt: null,
    delivery: null
  };

  orders.set(orderId, order);

  res.status(201).json({
    orderId,
    state: order.state,
    next: {
      invoice: `${BASE_URL}/invoice/${orderId}`
    }
  });
});

/**
 * Step 2 — Invoice / Challenge: return an x402-style payment challenge.
 *
 * In a real x402 flow:
 * - server returns a payment challenge
 * - client signs proof + attaches it to a request
 * - server verifies proof before delivery
 */
app.get('/invoice/:orderId', requireOrder, (req, res) => {
  const order = req.order;

  if (order.state === 'CREATED') {
    const challengeId = id('x402');
    const amount = '0.01';
    const currency = 'USDC';

    order.challenge = {
      challengeId,
      kind: 'x402_payment_challenge',
      note: 'MOCK challenge for hackathon demo. Replace with real x402 challenge/proof verification in production.',
      createdAt: nowIso()
    };

    order.invoice = {
      invoiceId: id('inv'),
      amount,
      currency,
      recipient: 'mock-recipient',
      status: 'UNPAID'
    };

    order.state = 'CHALLENGED';
  }

  res.json({
    orderId: order.orderId,
    state: order.state,
    challenge: order.challenge,
    invoice: order.invoice,
    next: {
      verify: `${BASE_URL}/verify/${order.orderId}`
    }
  });
});

/**
 * Step 3 — Verify Payment (Mock)
 *
 * This endpoint simulates payment verification and marks the order as paid.
 * In production, you'd verify an x402 proof here.
 */
app.post('/verify/:orderId', requireOrder, (req, res) => {
  const order = req.order;

  if (order.state === 'CREATED') {
    return res.status(400).json({
      error: 'NO_CHALLENGE_YET',
      message: 'Call GET /invoice/:orderId first to receive a challenge.'
    });
  }

  if (order.state === 'PAID' || order.state === 'DELIVERED') {
    return res.json({
      orderId: order.orderId,
      state: order.state,
      alreadyPaid: true,
      paidAt: order.paidAt
    });
  }

  // Accept any payload as a mock "proof".
  const { proof = { mocked: true } } = req.body || {};

  order.invoice.status = 'PAID';
  order.invoice.proof = proof;
  order.paidAt = nowIso();
  order.state = 'PAID';

  res.json({
    orderId: order.orderId,
    state: order.state,
    paidAt: order.paidAt,
    next: {
      deliver: `${BASE_URL}/deliver/${order.orderId}`
    }
  });
});

/**
 * Step 4 — Deliver
 *
 * The agent only delivers after payment is verified.
 * For demo purposes, we return a deterministic JSON payload.
 */
app.post('/deliver/:orderId', requireOrder, (req, res) => {
  const order = req.order;

  if (order.state !== 'PAID' && order.state !== 'DELIVERED') {
    return res.status(402).json({
      error: 'PAYMENT_REQUIRED',
      message: 'Payment not verified. Complete /invoice then /verify first.',
      state: order.state
    });
  }

  if (order.state === 'DELIVERED') {
    return res.json({
      orderId: order.orderId,
      state: order.state,
      deliveredAt: order.deliveredAt,
      delivery: order.delivery
    });
  }

  // Mock "agent execution"
  const deliveredAt = nowIso();
  const payload = {
    kind: 'quant_snapshot_5m',
    requestedAt: order.createdAt,
    paidAt: order.paidAt,
    deliveredAt,
    input: order.input,
    output: {
      summary: 'Mock quant snapshot generated after payment verification.',
      signal: 'LONG',
      confidence: 0.62,
      notes: 'Replace this with real tool execution / report generation.'
    }
  };

  order.delivery = payload;
  order.deliveredAt = deliveredAt;
  order.state = 'DELIVERED';

  res.json({
    orderId: order.orderId,
    state: order.state,
    deliveredAt,
    result: payload
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running: ${BASE_URL}`);
  console.log('Try:');
  console.log('  POST /request');
  console.log('  GET  /invoice/:orderId');
  console.log('  POST /verify/:orderId');
  console.log('  POST /deliver/:orderId');
});
