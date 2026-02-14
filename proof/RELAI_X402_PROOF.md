# RelAI x402 Proof (Base) — E2E 402 → Pay → Settle → 200

This repository's main demo uses **mock payment verification** for hackathon reliability.

To strengthen proof that the **real x402 flow works end-to-end**, we validated an on-chain settlement using **RelAI's x402 facilitator** on **Base (eip155:8453)**.

## TL;DR
- ✅ 402 challenge returned with `accepts[]`
- ✅ Client signed payment (EIP-3009 `transferWithAuthorization`)
- ✅ Facilitator settled
- ✅ Server returned `200 OK`
- ✅ On-chain transaction visible on BaseScan

## On-chain transaction
- BaseScan: https://basescan.org/tx/0x1834074badf1d65fcc40226384fbea4e387f9c694102c3e3b1bd5205a1fcb565

## 402 challenge evidence (curl)
```bash
curl -i http://localhost:3007/answer
```

Expected output (trimmed):
```http
HTTP/1.1 402 Payment Required

{"x402Version":2, ...
 "accepts":[{"scheme":"exact","network":"eip155:8453","amount":"1000",
 "asset":"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
 "payTo":"0x0B42745f125163b67D7408527F10857F72eEFe8d"}]}
```

## Settlement success evidence (client)
Client run produced `200` with a verified payment response:
- `verified: true`
- `network: base`
- `amount: 0.001`
- `transactionId: 0x1834...b565`

## How we ran it (local)
A minimal server/client harness lives at:
- `/tmp/api-paywall-cookbook/skale-hackaton/relai-proof` (local-only; not committed with keys)

Notes:
- Private keys are stored **only** in local `.env` and never committed.
- This proof is additive; it does not change the repo's main demo flow.
