# V6 Signal Layer (Public Spec)

This repository intentionally open-sources **only the signal layer** of our V6-style analysis.

- ✅ Safe to share: signal schema, interpretation, sample outputs
- ❌ Not shared: private keys, automated execution, wallet control, privileged credentials

## Goals
- Make agentic commerce *auditable*: a paid request can reference a deterministic signal payload.
- Keep security intact: no key material or execution automation is required to run this demo.

## Signal schema (suggested)
A typical V6 signal payload is a JSON object with:

- `asset`: string (e.g., `BTC-USD`)
- `timestamp`: ISO string
- `verdict`: `LONG | SHORT | HOLD`
- `confidence`: number (0..1)
- `risk`:
  - `var95`: number (percentage)
  - `riskScore`: number (0..100)
- `agreement`: `STRONG | WEAK | MIXED`
- `evidence`: array of concise factors (no secrets)

### Example
See: `examples/v6_sample_output.json`

## Public/Private split
**Public**
- Technical indicators summary (RSI, SMA, Bollinger squeeze, momentum)
- Fusion output (verdict/confidence)
- Risk metrics summary (e.g., VaR)

**Private (kept out of repo)**
- Trading keys / signer code / bridge automation
- Paid execution routing to wallets
- Any RPC / API tokens

## How this ties into Agentic Commerce
In a pay-to-deliver flow, the deliverable can include:
- the signal payload (JSON)
- a hash of the payload (for integrity)
- a timestamp / orderId reference

This makes the delivery verifiable without exposing operational secrets.
