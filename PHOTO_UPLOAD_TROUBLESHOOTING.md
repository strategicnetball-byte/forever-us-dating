# Photo Upload Troubleshooting Guide

## What I Fixed

### 1. **Port Issue in Browse & Dashboard Components**
- Changed photo URLs from `http://localhost:5000` to `http://localhost:3001`
- This was preventing photos from loading in the Browse and Dashboard pages

### 2. **Enhanced Error Handling in Profile Component**
- Added proper error and success message display
- Updated photo upload handler to show actual error messages instead of generic alerts
- Added state variables for `error` and `successMessage`

### 3. **Improved CORS Configuration**
- Updated server CORS middleware to explicitly allow file uploads
- Added proper headers for Authorization and Content-Type

### 4. **Added Debug Logging to Backend**
- Added console logs to the photo upload endpoint to help diagnose issues
- Logs show: user ID, file received, success/failure

## How to Test Photo Upload

### Step 1: Ensure Both Servers Are Running
```
Terminal 1 (Backend):
cd server
npm run server
# Should show: Server running on port 3001

Terminal 2 (Frontend):
cd client-new
npm start
# Should show: Compiled successfully on port 3000
```

### Step 2: Sign Up or Log In
- Create a new account or log in with existing credentials
- Complete the compatibility questionnaire if prompted
- You should be redirected to the Dashboard

### Step 3: Navigate to Profile
- Click "Profile" button in the Dashboard header
- You should see the photo upload section with 6 photo slots

### Step 4: Upload a Photo
- Click on the main photo slot (top left)
- Select an image file from your computer
- Wait for the upload to complete
- You should see a success message
- The page will reload and show your uploaded photo

### Step 5: Verify Photo Display
- Go to Dashboard - your photo should appear in the header
- Go to Browse - your photo should appear in the profile card
- Go back to Profile - your photo should still be there

## If Upload Still Fails

### Check Browser Console (F12)
1. Open Developer Tools (F12)
2. Go to Console tab
3. Try uploading a photo
4. Look for error messages - they should now show the actual error

### Check Server Logs
1. Look at the terminal running the backend server
2. You should see logs like:
   ```
   📸 Photo upload attempt for user: [userId]
   📁 File received: [filename] ([size] bytes)
   ✅ Photo uploaded successfully for user: [userId]
   ```
3. If you see errors, they'll be logged with ❌

### Common Issues & Solutions

**Issue: "No photo uploaded"**
- Make sure you selected a file before clicking upload
- Check that the file is an image (jpg, png, gif, etc.)
- File size must be under 5MB

**Issue: "User not found"**
- Your authentication token might be invalid
- Try logging out and logging back in
- Clear browser cache and try again

**Issue: "Server error"**
- Check that MongoDB is running
- Check that the backend server is running on port 3001
- Look at server logs for more details

**Issue: Photo uploads but doesn't display**
- Make sure the backend is serving static files correctly
- Check that the photo URL is using `http://localhost:3001`
- Try refreshing the page

## File Locations

- **Backend upload endpoint**: `server/routes/users.js` (line ~60)
- **Frontend upload handler**: `client-new/src/components/Profile/Profile.tsx` (line ~37)
- **Uploaded photos stored in**: `uploads/photos/`
- **Server static file serving**: `server/index.js` (line ~26)

## Next Steps

Once photo upload is working:
1. Test uploading multiple photos
2. Verify photos display in Browse page
3. Test deleting photos (if implemented)
4. Check that photos persist after logout/login
