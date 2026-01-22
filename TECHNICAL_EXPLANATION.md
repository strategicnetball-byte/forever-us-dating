# Technical Explanation - AWS Deployment Fix

## The Problem

When you deployed to AWS, the app had hardcoded references to `localhost:3001`:

```typescript
// OLD - Hardcoded to localhost
axios.defaults.baseURL = 'http://localhost:3001';
<img src={`http://localhost:3001${userPhoto}`} alt="Profile" />
```

When accessed from AWS IP (52.221.223.55):
1. Browser tries to connect to `http://localhost:3001` (which doesn't exist on the user's machine)
2. Connection times out
3. App doesn't work

## The Solution

### 1. Dynamic API Base URL

Created `client-new/src/utils/api.ts`:
```typescript
export const getApiBaseUrl = (): string => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:3001';
  }
  return `http://${window.location.hostname}`;
};
```

This function:
- Checks the current hostname in the browser
- If it's `localhost`, returns `http://localhost:3001`
- Otherwise, returns the current hostname (e.g., `http://52.221.223.55`)

### 2. Dynamic Image URLs

Created `getImageUrl()` utility:
```typescript
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${getApiBaseUrl()}${imagePath}`;
};
```

This function:
- Takes an image path like `/uploads/photos/123.jpg`
- Prepends the correct API base URL
- Returns `http://52.221.223.55/uploads/photos/123.jpg` on AWS
- Returns `http://localhost:3001/uploads/photos/123.jpg` locally

### 3. Backend CORS Configuration

Updated `server/index.js` to accept AWS IP:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://52.221.223.55',
  'http://52.221.223.55:80',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

This allows:
- All localhost origins (for local development)
- AWS IP (52.221.223.55)
- Any URL in CLIENT_URL env variable

## How It Works in Practice

### Scenario 1: Local Development
1. User opens `http://localhost:3000`
2. `window.location.hostname` = `localhost`
3. `getApiBaseUrl()` returns `http://localhost:3001`
4. API calls go to `http://localhost:3001/api/...`
5. Images load from `http://localhost:3001/uploads/...`

### Scenario 2: AWS Deployment
1. User opens `http://52.221.223.55`
2. `window.location.hostname` = `52.221.223.55`
3. `getApiBaseUrl()` returns `http://52.221.223.55`
4. API calls go to `http://52.221.223.55/api/...`
5. Nginx proxies to backend on `localhost:3001`
6. Images load from `http://52.221.223.55/uploads/...`
7. Nginx serves from `/home/ubuntu/uploads/`

## Architecture Diagram

```
Local Development:
┌─────────────────┐
│  Browser        │
│ localhost:3000  │
└────────┬────────┘
         │ getApiBaseUrl() → localhost:3001
         ▼
┌─────────────────┐
│  Backend        │
│ localhost:3001  │
└─────────────────┘

AWS Deployment:
┌──────────────────────┐
│  Browser             │
│ 52.221.223.55        │
└──────────┬───────────┘
           │ getApiBaseUrl() → 52.221.223.55
           ▼
┌──────────────────────┐
│  Nginx (Port 80)     │
│ 52.221.223.55        │
└──────────┬───────────┘
           │ Proxy to localhost:3001
           ▼
┌──────────────────────┐
│  Backend (Port 3001) │
│ localhost:3001       │
└──────────────────────┘
```

## Files Updated

### Core Utilities
- `client-new/src/utils/api.ts` - NEW utility functions

### Context & Auth
- `client-new/src/contexts/AuthContext.tsx` - Uses getApiBaseUrl()
- `client-new/src/components/Auth/PasswordReset.tsx` - Uses getApiBaseUrl()

### Components with Images
- `client-new/src/components/Profile/Profile.tsx` - Uses getImageUrl()
- `client-new/src/components/Dashboard/Dashboard.tsx` - Uses getImageUrl()
- `client-new/src/components/Messages/Messages.tsx` - Uses getImageUrl()
- `client-new/src/components/Likes/Likes.tsx` - Uses getImageUrl()
- `client-new/src/components/Browse/Browse.tsx` - Uses getImageUrl()
- `client-new/src/components/Matches/Matches.tsx` - Uses getImageUrl()
- `client-new/src/components/Compatibility/CompatibilityMatches.tsx` - Uses getImageUrl()

### Backend
- `server/index.js` - Updated CORS for AWS IP

### Environment
- `.env` - Updated CLIENT_URL to AWS IP

## Why This Works

1. **No hardcoding** - URLs are determined at runtime based on where the app is accessed from
2. **Backward compatible** - Local development still works exactly the same
3. **Scalable** - Works with any hostname/IP without code changes
4. **CORS compliant** - Backend accepts requests from the correct origin
5. **Image serving** - Nginx correctly serves images from the uploads directory

## Testing

After deployment, test:
1. ✅ Register new account
2. ✅ Login
3. ✅ Upload profile photo
4. ✅ Browse profiles
5. ✅ Like/match profiles
6. ✅ Send messages
7. ✅ View rewards

All should work without any localhost references!
