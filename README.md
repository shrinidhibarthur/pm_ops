<<<<<<< HEAD
## Product Initiative Lifecycle Management System

Internal operating system for product teams to manage initiatives end-to-end (idea → approvals → UX/PRD → funding → Jira execution → launch → impact), with a **config-driven workflow engine**, **approvals/checklist gating**, **auditability**, and **role-based access**.

## Getting Started

### Prerequisites
- **Node**: 22+
- **Docker Desktop**: running (for local Postgres)

### Local database

Start Postgres:

```bash
docker compose up -d
```

Run migrations + seed:

```bash
npm run prisma:migrate
npm run db:seed
```

### Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

### Seeded dev users
- `pm@example.com` (Product Manager)
- `director@example.com` (Director)
- `finance@example.com` (Finance/ART approver)
- `ada@example.com` (ADA reviewer)
- `admin@example.com` (Admin)

### Notes
- Workflow stage order, approvals, and checklists are **DB-configured** via `StageTemplate`, `ApprovalMatrix`, and `WorkflowConfig`.
- Every state-changing action will be written to `AuditLog`.
=======
# pm_ops
>>>>>>> f4c6c18deb3a7f570c1ffb7a5c4a8c8280db1ec1
