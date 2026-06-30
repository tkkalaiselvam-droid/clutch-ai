import type { Crisis, AgentStep, Habit } from '../types';

export const crises: Crisis[] = [
  {
    id: '1',
    title: 'Fintech Pitch Deck & Financial Model Submission',
    dueInMinutes: 45,
    urgency: 'critical',
    fileAttachment: 'brief_v2.pdf',
    description: 'Complete 12-slide investor deck with 3-year financial projections and go-to-market strategy.',
    category: 'Presentation',
  },
  {
    id: '2',
    title: 'Quarterly Production Cloud Infra Invoice Payment',
    dueInMinutes: 120,
    urgency: 'high',
    fileAttachment: 'invoice_q3_2024.pdf',
    description: 'Process $47,500 AWS/GCP invoice before grace period expires to avoid service suspension.',
    category: 'Finance',
  },
  {
    id: '3',
    title: 'Client Bug Hotfix & Mainnet Deployment',
    dueInMinutes: 240,
    urgency: 'high',
    fileAttachment: 'bug_report_4412.md',
    description: 'Critical smart contract vulnerability patch requiring immediate audit review and mainnet redeployment.',
    category: 'Engineering',
  },
];

export const initialAgentSteps: AgentStep[] = [
  {
    id: 1,
    agent: 'Triage Agent',
    label: 'Analyzing context window, calculating deadline velocity, and calculating time-to-impact.',
    status: 'pending',
    content: '',
  },
  {
    id: 2,
    agent: 'Scaffold Agent',
    label: 'Actively writing the artifact.',
    status: 'pending',
    content: '',
  },
  {
    id: 3,
    agent: 'Logistics Agent',
    label: 'Injecting Deep Work Sprints into calendar and preparing negotiation email draft.',
    status: 'pending',
    content: '',
  },
];

export const habits: Habit[] = [
  { id: 'h1', name: 'Code Review', completed: true, streak: 12, linkedTo: 'Client Bug Hotfix' },
  { id: 'h2', name: 'LeetCode', completed: false, streak: 8, linkedTo: 'System Architecture' },
  { id: 'h3', name: 'Invoice Clear', completed: false, streak: 3, linkedTo: 'Cloud Infra Payment' },
  { id: 'h4', name: 'Pitch Rehearsal', completed: true, streak: 5, linkedTo: 'Fintech Pitch Deck' },
];

export const scaffoldOutputs: Record<string, string> = {
  '1': `## Fintech Pitch Deck — Scaffold Output

### Slide 1: Cover
**NovaFin — Autonomous Treasury Infrastructure for DeFi Protocols**
*Prepared for Series A Raise | $12M Target*

---

### Slide 2: Problem
- $4.2B in idle liquidity across major DeFi protocols
- Manual rebalancing costs average 340 bps annually
- No unified risk-adjusted yield optimization layer exists

---

### Slide 3: Solution
**NovaFin Engine** — Agentic treasury that:
1. Autoroutes liquidity across 14 chains
2. Dynamically hedges impermanent loss
3. Self-executes rebalancing every 8 blocks

---

### Slide 4: Traction
| Metric | Value |
|--------|-------|
| TVL Managed | $890M |
| Chains | 14 |
| Avg Yield Improvement | +18.4% |
| Clients | 37 protocols |

---

### Slide 5: Financial Model (3-Year)
| Year | Revenue | EBITDA | Burn |
|------|---------|--------|------|
| Y1 | $2.1M | -$4.8M | $6.2M |
| Y2 | $14.7M | $3.1M | $1.8M |
| Y3 | $48.3M | $19.4M | Profitable |

---

### Slide 6: Ask
**$12M Series A**
- 40% Engineering (agent expansion, audit)
- 30% GTM (protocol partnerships)
- 20% Regulatory & Compliance
- 10% Reserve

---

*[Scaffold Agent: 94% confidence | 11 slides generated | Ready for human refinement]*`,

  '2': `## Q3 Cloud Infrastructure Invoice — Breakdown

### Vendor Summary
| Provider | Service | Amount | Due |
|----------|---------|--------|-----|
| AWS | EC2 Reserved + RDS | $28,400.00 | Oct 15 |
| GCP | GKE + BigQuery | $14,200.00 | Oct 15 |
| Cloudflare | Enterprise CDN | $4,900.00 | Oct 15 |
| **Total** | | **$47,500.00** | |

---

### Cost Optimization Opportunities
1. **AWS Savings Plan Migration** — potential 22% reduction ($6,248/qtr)
2. **GCP Committed Use Discounts** — potential 18% reduction ($2,556/qtr)
3. **Cloudflare Rate Limit Tuning** — potential $900/qtr savings

---

### Payment Authorization
- **Account:** Operating Treasury (ending 8842)
- **Approval Chain:** CFO auto-approved (pre-authorized up to $75K)
- **Execution:** Immediate wire transfer upon confirmation

---

*[Scaffold Agent: 97% confidence | Invoice validated against PO #4421 | Ready for payment execution]*`,

  '3': `## Bug Hotfix PR #4412 — Patch Summary

### Vulnerability
**Re-entrancy guard bypass** in \\\"withdrawAndDistribute()\\\" via nested delegatecall.

### Root Cause
Missing \\\"nonReentrant\\\" modifier on internal helper \\\"_processDistribution()\\\" introduced in v2.3.1.

### Patch
\\\"\\\"solidity
function _processDistribution(address vault) internal nonReentrant {
    uint256 balance = IERC20(token).balanceOf(vault);
    require(balance > 0, \\\"No funds\\\");
    // Added re-entrancy guard + CEI pattern
    _updateState(vault);
    IERC20(token).safeTransfer(recipient, balance);
    emit DistributionProcessed(vault, balance);
}
\\\"\\\"

### Audit Checklist
- [x] Static analysis (Slither: 0 critical, 1 low)
- [x] Formal verification (Certora: all invariants hold)
- [x] Testnet simulation (47K tx, 100% branch coverage)
- [ ] Mainnet dry-run (pending)

### Deployment Plan
1. **Staging** — complete
2. **Audit final** — 2 hrs
3. **Mainnet multisig** — 4 hrs
4. **Monitoring** — 24 hr elevated alert

---

*[Scaffold Agent: 91% confidence | Patch ready for audit sign-off | Estimated mainnet deployment: 4 hours]*`,
};

export const logisticsOutputs: Record<string, string> = {
  '1': `## Logistics Agent — Sprint Injection & Negotiation

### Deep Work Sprints Injected
| Block | Time | Focus |
|-------|------|-------|
| Sprint A | 14:00–15:00 | Deck narrative & financial model polish |
| Sprint B | 15:00–15:30 | Speaker notes & rehearsal |
| Sprint C | 15:30–15:45 | Final PDF export & submission |

### Negotiation Email Draft
**Subject:** Request for 90-Minute Extension — NovaFin Series A Materials

*Hi [Investor Name],*

*Given the complexity of our updated financial model (post-audit adjustments), we request a brief 90-minute extension to ensure the deck reflects our most current traction metrics. We remain fully committed to the 4:00 PM deadline and can provide a partial preview at 3:30 PM if helpful.*

*Best,*
*Founder, NovaFin*

---

*[Logistics Agent: Calendar updated | Email drafted | Awaiting send authorization]*`,

  '2': `## Logistics Agent — Sprint Injection & Negotiation

### Deep Work Sprints Injected
| Block | Time | Focus |
|-------|------|-------|
| Sprint A | 14:00–14:30 | Invoice validation & PO reconciliation |
| Sprint B | 14:30–15:00 | CFO approval chain & wire prep |
| Sprint C | 15:00–15:15 | Payment execution & confirmation |

### Negotiation Email Draft
**Subject:** Early Payment Discount Inquiry — Q3 Cloud Infrastructure

*Dear Finance Team,*

*We are prepared to remit the full Q3 invoice today. In exchange, we request a 2% early-payment discount ($950) or equivalent service credit applied to Q4. This reflects our strong payment history and commitment to a long-term partnership.*

*Regards,*
*Treasury Operations*

---

*[Logistics Agent: Calendar updated | Wire form pre-filled | Awaiting CFO biometric auth]*`,

  '3': `## Logistics Agent — Sprint Injection & Negotiation

### Deep Work Sprints Injected
| Block | Time | Focus |
|-------|------|-------|
| Sprint A | 14:00–15:30 | Audit review & testnet dry-run |
| Sprint B | 15:30–16:30 | Multisig coordination & signing |
| Sprint C | 16:30–18:00 | Mainnet deployment & monitoring |

### Negotiation Email Draft
**Subject:** Coordinated Disclosure Timeline — Critical Patch #4412

*Hello [Client Lead],*

*We have identified and patched a critical vulnerability. To protect user funds, we propose an expedited 4-hour mainnet deployment window beginning at 16:30 UTC. We will provide real-time status updates and have rollback procedures ready. Your engineering team's presence during the deployment window is appreciated but not required.*

*Security Team*

---

*[Logistics Agent: Calendar updated | Multisig signers notified | Awaiting quorum confirmation]*`,
};
