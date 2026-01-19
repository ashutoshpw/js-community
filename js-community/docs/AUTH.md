# Better-Auth Setup Documentation

This document provides an overview of the better-auth implementation in the js-community application.

## Overview

Better-auth has been successfully configured for the Next.js application with support for:
- Email/password authentication
- OAuth providers (Google and GitHub)
- Session management with database persistence
- Secure token handling

## Architecture

### Database Schema

Four new tables have been added to support authentication:

1. **sessions** - Stores active user sessions
   - `id` (primary key)
   - `userId` (foreign key to users)
   - `expiresAt`
   - `ipAddress`, `userAgent` for tracking

2. **accounts** - Manages OAuth provider accounts
   - `id` (primary key)
   - `userId` (foreign key to users)
   - `providerId` (google, github, etc.)
   - `accountId` (provider's user ID)
   - OAuth tokens (access, refresh, id tokens)
   - `password` (hashed, for email/password auth)

3. **verification_tokens** - Email verification tokens
   - `id` (primary key)
   - `identifier` (email address)
   - `token` (verification token)
   - `expiresAt`

4. **password_reset_tokens** - Password reset tokens
   - `id` (primary key)
   - `userId` (foreign key to users)
   - `token` (reset token)
   - `expiresAt`
   - `used` (boolean flag)

### Configuration Files

- **`src/lib/auth.ts`** - Main auth configuration
  - Configures better-auth with Drizzle ORM adapter
  - Sets up email/password authentication
  - Configures OAuth providers
  - Defines session settings

- **`src/app/api/auth/[...all]/route.ts`** - API route handlers
  - Handles all authentication requests via GET/POST
  - Routes: `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/callback/*`, etc.

## Environment Variables

Add these to your `.env` file:

```bash
# Required
DATABASE_URL=postgres://user:password@localhost:5432/js_community
BETTER_AUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32

# Optional - Base URL (auto-detected in most environments)
BETTER_AUTH_URL=http://localhost:3000

# Optional - OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Getting Started

### 1. Database Migration

Run migrations to create the auth tables:

```bash
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
# OR
npm run db:push      # Push schema changes directly (development)
```

### 2. Configure OAuth Providers (Optional)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

### 3. Test the Setup

The implementation includes comprehensive tests:

```bash
npm test  # Run all tests
```

Test coverage:
- Auth configuration: 14 tests
- Auth schema: 19 tests
- API routes: 10 tests

## Usage Examples

### Client-Side Authentication

```typescript
// Sign up with email/password
const response = await fetch('/api/auth/sign-up', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    name: 'User Name'
  })
});

// Sign in with email/password
const response = await fetch('/api/auth/sign-in', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword'
  })
});

// OAuth sign-in (redirect to provider)
window.location.href = '/api/auth/signin/google';
// or
window.location.href = '/api/auth/signin/github';

// Sign out
await fetch('/api/auth/sign-out', { method: 'POST' });

// Get current session
const session = await fetch('/api/auth/session').then(r => r.json());
```

### Server-Side Session Access

```typescript
import { auth } from '@/lib/auth';

// In API routes or server components
export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Access user data
  const userId = session.user.id;
  const userEmail = session.user.email;
  
  // Your logic here
}
```

## Session Configuration

- **Session Duration**: 7 days
- **Update Age**: 24 hours (session refreshed if older than 24 hours)
- **Cookie Cache**: Enabled with 5-minute max age
- **Password Requirements**: 8-128 characters
- **Email Verification**: Disabled by default (set `requireEmailVerification: true` in production)

## API Endpoints

All authentication endpoints are handled by `/api/auth/[...all]`:

- `POST /api/auth/sign-up` - Create new account
- `POST /api/auth/sign-in` - Sign in with email/password
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/signin/google` - Initiate Google OAuth
- `GET /api/auth/signin/github` - Initiate GitHub OAuth
- `GET /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/callback/github` - GitHub OAuth callback
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

## Security Features

✅ Secure session management with database persistence
✅ Password hashing (handled by better-auth)
✅ CSRF protection
✅ Secure cookie settings
✅ Token expiration
✅ OAuth state validation

## Testing

All authentication components are thoroughly tested:

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Generate coverage report
```

Test files:
- `src/lib/auth.test.ts` - Auth configuration tests
- `src/db/schema/auth.test.ts` - Schema validation tests
- `src/app/api/auth/[...all]/route.test.ts` - API route tests

## Troubleshooting

### Build Errors

**Issue**: "DATABASE_URL environment variable is not set"
- **Solution**: The database module is configured to allow builds without DATABASE_URL. Ensure you set it for runtime.

### Authentication Errors

**Issue**: "BETTER_AUTH_SECRET not set" warning
- **Solution**: Generate a secret: `openssl rand -base64 32` and add to `.env`

**Issue**: OAuth not working
- **Solution**: Verify client IDs and secrets are correct, and callback URLs match your configuration

### Session Issues

**Issue**: Session not persisting
- **Solution**: Check that database migrations have been applied and sessions table exists

## Next Steps

1. **Add Middleware** - Protect routes with authentication middleware
2. **Email Verification** - Enable email verification in production
3. **Rate Limiting** - Add rate limiting to prevent brute force attacks
4. **Two-Factor Auth** - Consider adding 2FA support
5. **Password Recovery** - Implement password reset flow
6. **User Profile** - Create user profile management pages

## References

- [Better-Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
