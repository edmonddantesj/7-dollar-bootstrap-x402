# Security Context Card (Public Summary)

This repo demonstrates **agentic commerce** and a sustainability loop. It does **not** ship any key material.

When a system performs sensitive actions (bridging, withdrawals, approvals), users often can’t tell if an action is safe.
A **Security Context Card** is a human-readable explanation that accompanies any high-risk action.

## What the card answers
- **What is happening?** (action type + amount + destination)
- **Why now?** (business reason / signal reason)
- **What did we verify?** (checks passed)
- **What could go wrong?** (worst-case scenarios)
- **What is the user decision?** (approve / reject)

## Recommended safety gates (conceptual)
1. **Wallet compartmentalization**
   - use a low-funds hot wallet for experiments.
2. **Fixed destination / allowlist**
   - only allow known destinations.
3. **No unlimited approvals**
   - avoid broad token approvals; prefer exact-amount or scoped approvals.
4. **Canary transaction (test first)**
   - send a tiny test transfer before sending the full amount.
5. **Human-in-the-loop**
   - for high-impact actions, require explicit approval.

## Autonomy tiers (optional)
- **Tier 1 — Guarded autonomy:** small actions can run automatically under strict limits; large actions ask for approval.
- **Tier 2 — Condition-based autonomy:** autonomy only when confidence and safety signals are strong.
- **Tier 3 — Full autonomy (not recommended by default):** run fully autonomous within a tightly bounded budget.

## Non-goals of this repo
- No private keys / seeds / API tokens
- No automated wallet control shipped publicly
