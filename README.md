# $7 Bootstrap Protocol — Agentic Commerce with x402 (Mock Payment)

[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?logo=openapi-initiative&logoColor=white)](./openapi.yaml)
[![Swagger UI](https://img.shields.io/badge/Swagger-UI-85EA2D?logo=swagger&logoColor=black)](#api-docs-swagger-ui)

**Demo Video (YouTube):** https://youtu.be/mWYOmNb489M  
**Hackathon Repo:** https://github.com/edmonddantesj/7-dollar-bootstrap-x402

## What this is
Aoineco is a minimal **Agentic Commerce** demo that enforces **pay-to-deliver**: the agent only delivers after a payment check succeeds.

In a real **x402** flow, the client receives a payment challenge, signs a proof, and the server verifies it before allowing delivery.
For hackathon clarity and reliability, this submission uses **MOCK payment verification** while keeping the same end-to-end product loop:

**Request → Invoice/Challenge → (Mock) Payment Verified → Agent Executes → Deliverable + artifacts**

## Why it matters
This showcases a core business primitive for AI agents and marketplaces: **automated commerce where delivery is gated by payment**.
It’s aligned with the **$7 Bootstrap Protocol** philosophy: cheap, fast, composable.

## Architecture (high-level)
- **Client** requests a deliverable.
- **Server** issues an invoice and an x402-style challenge.
- **Verifier** checks payment proof (mocked in this demo).
- **Agent** executes only after paid, then returns a result payload + artifacts.

```mermaid
flowchart LR
  U[User / Client] -->|POST /request| S[Server]
  S -->|GET /invoice/:id\nchallenge + invoice| U
  U -->|POST /verify/:id\n(mock proof)| S
  S -->|paid=true| A[Agent Executor]
  A -->|POST /deliver/:id\nresult + artifacts| U
```

## Run locally (recommended)
```bash
git clone https://github.com/edmonddantesj/7-dollar-bootstrap-x402
cd 7-dollar-bootstrap-x402

npm install
npm run dev
```

### Quick demo (curl)
```bash
# 1) create order
ORDER_ID=$(curl -s -X POST http://localhost:3000/request \
  -H 'content-type: application/json' \
  -d '{"product":"quant_snapshot_5m","input":{"asset":"BTC","horizon":"5m"}}' \
  | node -p "JSON.parse(require('fs').readFileSync(0,'utf8')).orderId")

echo "ORDER_ID=$ORDER_ID"

# 2) get invoice/challenge
curl -s http://localhost:3000/invoice/$ORDER_ID | node -p "JSON.stringify(JSON.parse(require('fs').readFileSync(0,'utf8')), null, 2)"

# 3) mock verify payment
curl -s -X POST http://localhost:3000/verify/$ORDER_ID \
  -H 'content-type: application/json' \
  -d '{"proof":{"mocked":true}}' | node -p "JSON.stringify(JSON.parse(require('fs').readFileSync(0,'utf8')), null, 2)"

# 4) deliver (pay-to-deliver)
curl -s -X POST http://localhost:3000/deliver/$ORDER_ID | node -p "JSON.stringify(JSON.parse(require('fs').readFileSync(0,'utf8')), null, 2)"
```

## API docs (Swagger UI)
After starting the server, open:
- http://localhost:3000/docs/

## API spec
- `openapi.yaml` (OpenAPI 3.0)

## Links
- **Repo:** https://github.com/edmonddantesj/7-dollar-bootstrap-x402
- **Demo video:** https://youtu.be/mWYOmNb489M

## Notes
- Swap the mock verifier with real x402 proof verification in production.
- No secrets (keys/seeds) are stored in this repository.

---

## Aoineco & Co. (context)
Aoineco & Co. is a small multi-agent squad concept (Oracle / Sound / Blade / Eye) focused on autonomous commerce.
This repo is the hackathon-facing, submission-ready package for the x402 track.
