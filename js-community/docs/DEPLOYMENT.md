# Deployment Guide

This project can be deployed to Vercel for the alpha release if the supporting services are configured before the first production build.

## Required services

- Vercel project connected to this repository
- PostgreSQL database
- Vercel Blob store
- Resend account with a verified sender address

## Required environment variables

Set these in Vercel for the Production environment:

```bash
DATABASE_URL=postgres://user:password@host:5432/js_community?sslmode=require
BETTER_AUTH_URL=https://your-domain.example
BETTER_AUTH_SECRET=generated-secret
NEXT_PUBLIC_APP_URL=https://your-domain.example
BLOB_READ_WRITE_TOKEN=vercel_blob_token
RESEND_API_KEY=re_xxx
EMAIL_FROM=JS Community <no-reply@your-domain.example>
NEXT_PUBLIC_ENABLE_REALTIME=false
```

Add OAuth variables only if social login is part of the alpha scope:

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## Deployment checklist

1. Install project dependencies locally with `npm install`.
2. Generate or update SQL migrations after schema changes with `npm run db:generate`.
3. Apply migrations to the target database before promoting the deployment with `npm run db:migrate`.
4. In Vercel, configure all required environment variables.
5. Attach a Vercel Blob store to the project.
6. Configure Resend with the `EMAIL_FROM` sender used above.
7. Deploy the application.
8. Verify these user journeys on the deployed URL:
   - sign up / sign in
   - forgot password email delivery
   - browse categories
   - create a topic and reply
   - upload an avatar
   - open the admin dashboard

## Alpha-specific notes

- Realtime, typing, and presence are disabled by default for the alpha deployment because the current implementation does not use a shared pub/sub backend.
- Password reset email delivery fails in production if `RESEND_API_KEY` or `EMAIL_FROM` is missing.
- Server-rendered forum pages use `NEXT_PUBLIC_APP_URL` to generate absolute URLs when needed. Keep it aligned with the public production domain.
