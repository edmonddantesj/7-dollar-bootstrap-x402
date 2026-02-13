# $7 Bootstrap Protocol — Agentic Commerce with x402 (Mock Payment)

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
