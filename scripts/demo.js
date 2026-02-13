// Demo script: runs the full pay-to-deliver loop against a local server.
// Usage:
//   1) npm run dev   (in one terminal)
//   2) npm run demo  (in another terminal)

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function jfetch(path, opts = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: {
      'content-type': 'application/json',
      ...(opts.headers || {})
    }
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function print(title, obj) {
  console.log(`\n=== ${title} ===`);
  console.log(JSON.stringify(obj, null, 2));
}

async function main() {
  console.log(`Running demo against: ${BASE_URL}`);

  const order = await jfetch('/request', {
    method: 'POST',
    body: JSON.stringify({
      product: 'quant_snapshot_5m',
      input: { asset: 'BTC', horizon: '5m' }
    })
  });
  print('1) REQUEST (create order)', order);

  const orderId = order.orderId;
  if (!orderId) throw new Error('Missing orderId from /request');

  const invoice = await jfetch(`/invoice/${orderId}`);
  print('2) INVOICE / CHALLENGE', invoice);

  const paid = await jfetch(`/verify/${orderId}`, {
    method: 'POST',
    body: JSON.stringify({ proof: { mocked: true } })
  });
  print('3) VERIFY (mock payment)', paid);

  const delivered = await jfetch(`/deliver/${orderId}`, { method: 'POST' });
  print('4) DELIVER (pay-to-deliver)', delivered);

  console.log('\n✅ Demo complete.');
  console.log(`Tip: open Swagger UI at ${BASE_URL}/docs/`);
}

main().catch((e) => {
  console.error('\n❌ Demo failed:', e.message);
  if (e.data) {
    console.error('Response:', JSON.stringify(e.data, null, 2));
  }
  process.exit(1);
});
