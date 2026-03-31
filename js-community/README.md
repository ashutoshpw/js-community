JS Community is a Next.js 16 forum platform that is replacing the legacy Discourse app in this repository.

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

This project uses [Vitest](https://vitest.dev) for testing. See [docs/TESTING.md](./docs/TESTING.md) for detailed testing guidelines and best practices.

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Open Vitest UI
npm run test:ui
```

## Database

This project uses [Drizzle ORM](https://orm.drizzle.team) with PostgreSQL. See [DATABASE.md](./DATABASE.md) for database setup and [docs/MIGRATIONS.md](./docs/MIGRATIONS.md) for migration workflows.

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Documentation

- [Testing guide](./docs/TESTING.md)
- [Authentication guide](./docs/AUTH.md)
- [Migration guide](./docs/MIGRATIONS.md)
- [Deployment guide](./docs/DEPLOYMENT.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This project is intended to deploy on Vercel with PostgreSQL, Vercel Blob, and Resend.

Before deploying:

1. Create and migrate a PostgreSQL database.
2. Configure the environment variables listed in [`.env.example`](./.env.example).
3. Add a Vercel Blob store for uploads.
4. Add a Resend API key and verified sender for password reset emails.
5. Keep `NEXT_PUBLIC_ENABLE_REALTIME=false` for the alpha deployment.

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for the full checklist.
