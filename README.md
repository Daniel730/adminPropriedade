# PropFlow | Property Management Simplified

PropFlow is a state-of-the-art SaaS platform designed to bridge the gap between property managers, tenants, and service vendors. It streamlines maintenance workflows, automates SLA monitoring, and provides transparent financial reporting.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/propflow.git
    cd propflow
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Copy `.env.example` to `.env` and fill in your secrets.
    ```bash
    cp .env.example .env
    ```

4.  **Database Migration**:
    Initialize the local SQLite database.
    ```bash
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## 🤖 Context for AI Assistants

PropFlow is built with modern web technologies:
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Database**: [Prisma](https://www.prisma.io/) with SQLite (Dev) and Postgres (Prod compatibility).
- **Authentication**: [Auth.js (NextAuth)](https://nextauthjs.org/) with role-based session mapping.
- **Styling**: Tailwind CSS with a custom **Glassmorphism** design system.
- **Payments**: Stripe (Subscription-based model for Managers).
- **Emails**: Resend.

### Role Hierarchy
1.  **MANAGER**: Owns properties, manages units/tenants, assigns vendors, and views financial reports.
2.  **TENANT**: Assigned to a specific unit. Can submit maintenance requests and view property announcements.
3.  **VENDOR**: Independent contractors invited by managers to handle specific maintenance tasks.

---

## 🛠️ Development Tools & God Mode

To speed up development and testing, PropFlow includes a built-in **God Mode** to bypass authentication:

Adjust these in your `.env`:
```env
NEXT_PUBLIC_AUTH_BYPASS=true
NEXT_PUBLIC_AUTH_BYPASS_ROLE=MANAGER  # Options: MANAGER, TENANT, VENDOR
```
*Note: This is strictly for development and is automatically ignored in production code.*

---

## 📈 Business Logic Reference

### Maintenance Request Lifecycle
- **OPEN**: Tenant submitted the request.
- **IN_PROGRESS**: Vendor has been assigned and job is active.
- **RESOLVED**: Vendor finished the job; Manager has confirmed and provided a rating/final cost.

### SLA Monitoring
The platform implements a **48-hour Service Level Agreement (SLA)**. Any request not resolved within 48 hours of creation is flagged with high-visibility alerts in the Manager dashboard for immediate attention.

### Subscription Model
Managers are restricted based on their Stripe subscription tier. The `isAccountRestricted` utility prevents creating new properties or units if payments are delinquent.

---

## 🌐 Production Deployment

### Prerequisites
- **Postgres Database**: Required for scalable production use.
- **SSL Certificate**: Next-Auth requires HTTPS for secure cookie handling.
- **Webhook Secrets**: Ensure `STRIPE_WEBHOOK_SECRET` is configured to receive payment updates.

### Commands
```bash
npm run build
npm start
```

For more detailed logic documentation, see [Business Logic Deep Dive](docs/BUSINESS_LOGIC.md).
