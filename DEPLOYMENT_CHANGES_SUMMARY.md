# Deployment Changes Summary

## Files Modified

### 1. `.env`
- Changed `CLIENT_URL` from `http://localhost:3000` to `http://52.221.223.55`

### 2. `server/index.js`
- Added dynamic CORS configuration that accepts AWS IP (52.221.223.55)
- CORS now includes: localhost origins + AWS IP + CLIENT_URL from env
- Socket.io also updated to accept AWS IP

### 3. `client-new/src/utils/api.ts` (NEW FILE)
- Created utility functions for dynamic API configuration
- `getApiBaseUrl()` - Returns correct API base URL based on hostname
- `getImageUrl()` - Returns correct image URL based on hostname

### 4. `client-new/src/contexts/AuthContext.tsx`
- Updated to use `getApiBaseUrl()` from new utility
- Axios now dynamically configures baseURL

### 5. `client-new/src/components/Auth/PasswordReset.tsx`
- Updated to use `getApiBaseUrl()` for forgot-password and reset-password endpoints

### 6. `client-new/src/components/Profile/Profile.tsx`
- Updated to use `getApiBaseUrl()` for upload-photo and profile endpoints
- Updated all image URLs to use `getImageUrl()` utility

### 7. `client-new/src/components/Dashboard/Dashboard.tsx`
- Added import for `getImageUrl` utility
- Updated all image URLs to use `getImageUrl()`

### 8. `client-new/src/components/Messages/Messages.tsx`
- Added import for `getImageUrl` utility
- Updated match profile photo URLs to use `getImageUrl()`

### 9. `client-new/src/components/Likes/Likes.tsx`
- Added import for `getImageUrl` utility
- Updated profile photo URLs to use `getImageUrl()`

### 10. `client-new/src/components/Browse/Browse.tsx`
- Added import for `getImageUrl` utility
- Updated profile photo URLs to use `getImageUrl()`

### 11. `client-new/src/components/Matches/Matches.tsx`
- Added import for `getImageUrl` utility
- Updated profile photo URLs to use `getImageUrl()`

### 12. `client-new/src/components/Compatibility/CompatibilityMatches.tsx`
- Added import for `getImageUrl` utility
- Updated match profile photo URLs to use `getImageUrl()`

## Key Changes

### Before (Hardcoded)
```typescript
axios.defaults.baseURL = 'http://localhost:3001';
<img src={`http://localhost:3001${userPhoto}`} alt="Profile" />
```

### After (Dynamic)
```typescript
axios.defaults.baseURL = getApiBaseUrl(); // Returns correct URL based on hostname
<img src={getImageUrl(userPhoto)} alt="Profile" />
```

## How It Works

When deployed to AWS:
- `window.location.hostname` = `52.221.223.55`
- `getApiBaseUrl()` returns `http://52.221.223.55`
- All API calls go to the correct server
- All images load from the correct server

When running locally:
- `window.location.hostname` = `localhost`
- `getApiBaseUrl()` returns `http://localhost:3001`
- All API calls go to localhost
- All images load from localhost

## Deployment Steps

1. Rebuild frontend: `cd ~/client-new && npm run build`
2. Restart backend: `pm2 delete forever-us && pm2 start node --name "forever-us" -- server/index.js`
3. Save PM2 config: `pm2 save`
4. Test: Open http://52.221.223.55 in browser
