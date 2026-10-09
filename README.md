# EstateOS

**AI Operating System for Real Estate Agencies** — qualify buyers on official WhatsApp, recommend inventory, command your morning, automate marketing.

## Phase 0 (this repo)

| Deliverable | Location |
|-------------|----------|
| Brand & product | [docs/01-brand-product.md](docs/01-brand-product.md) |
| System architecture | [docs/02-system-architecture.md](docs/02-system-architecture.md) |
| Database schema | [docs/03-database-schema.md](docs/03-database-schema.md) + [packages/database/prisma/schema.prisma](packages/database/prisma/schema.prisma) |
| REST API spec | [docs/04-api-specification.md](docs/04-api-specification.md) |
| AI conversation engine | [docs/05-ai-conversation-engine.md](docs/05-ai-conversation-engine.md) |
| UI/UX (every page) | [docs/06-ui-ux-specification.md](docs/06-ui-ux-specification.md) + **implemented shells in `apps/web`** |
| Roadmap | [docs/07-development-roadmap.md](docs/07-development-roadmap.md) |
| Deployment | [docs/08-production-deployment.md](docs/08-production-deployment.md) |
| Implementation plan | [ESTATEOS_IMPLEMENTATION_PLAN.md](ESTATEOS_IMPLEMENTATION_PLAN.md) |

## Local development

```bash
npm install
npm run db:generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — landing page  
Open [http://localhost:3000/command-center](http://localhost:3000/command-center) — app shell (use Login → Continue for demo navigation)

## Stack

Next.js 15 · Next.js Route Handlers · Prisma · MySQL · Clerk · Stripe · Meta WhatsApp Cloud API · Gemini · Docker Compose

## WhatsApp worker and deployment

Inbound Meta events are acknowledged after signature validation and stored in a durable database inbox. Start the separate worker locally with:

```bash
npm run worker --workspace=api
```

`docker compose up` starts the API, web app, MySQL, and this worker. Before enabling a Meta webhook, configure `META_APP_SECRET`, `META_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_TOKEN_ENCRYPTION_KEY`, and the Meta account credentials listed in `.env.example`. The encryption key must be a base64-encoded 32-byte value; it encrypts the WhatsApp access token before it is persisted.

For an existing database, apply the migration before deployment:

```bash
npx prisma migrate deploy --schema packages/database/prisma/schema.prisma
npm run migrate:whatsapp-tokens --workspace=api
```

Set `WHATSAPP_TOKEN_ENCRYPTION_KEY` before running the token migration. The command is idempotent and upgrades only legacy plaintext tokens. Free-form WhatsApp messages are restricted to the 24-hour customer-service window. Any scheduled or re-engagement send outside that window must use an approved Meta template; no outside-window automation should be enabled until a template sender is configured.

## Product one-liner

EstateOS is an AI employee for real estate agents that qualifies buyers, recommends properties, follows up with leads, and automates marketing.

## Next build steps

1. Clerk auth + tenant middleware  
2. NestJS API on Railway wired to Prisma  
3. Meta WhatsApp webhook + AI qualification loop  
4. Pilot with 2–3 Dubai agencies  

---

Built to reach **100 paying agencies** — validate after WhatsApp + recommendations before marketing module.
