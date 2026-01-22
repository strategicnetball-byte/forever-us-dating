# Password Reset Testing Guide

## Quick Start

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
node server/index.js

# Terminal 2 - Frontend
cd client-new && npm start
```

### 2. Test Password Reset Flow

**Step 1: Navigate to Login**
- Go to http://localhost:3000/login
- Click "Forgot Password?" button

**Step 2: Request Reset Code**
- Enter your email (e.g., test@example.com)
- Click "Send Reset Code"
- Check backend console for the 6-digit code
- Example output: `🔐 Password reset code for test@example.com: 123456`

**Step 3: Enter Reset Code**
- Copy the code from console
- Paste it into the "Reset Code" field
- Click "Verify Code"

**Step 4: Set New Password**
- Enter new password (min 6 characters)
- Confirm password
- Click "Reset Password"
- Success message appears

**Step 5: Login with New Password**
- Close modal
- Enter email and new password
- Click "Sign In"
- Should successfully log in

### 3. Test Privacy Policy

**Step 1: Navigate to Home**
- Go to http://localhost:3000/
- Scroll to bottom of page

**Step 2: Open Privacy Policy**
- Look for "Legal" section in footer
- Click "Privacy Policy" link
- Modal should open with full policy content

**Step 3: Read and Close**
- Scroll through the policy
- Click "Close" button to dismiss

## Test Cases

### Password Reset - Valid Flow
- ✅ Email exists in database
- ✅ Code is generated and logged
- ✅ Code is entered correctly
- ✅ New password meets requirements
- ✅ Passwords match
- ✅ Password is successfully updated
- ✅ Can login with new password

### Password Reset - Error Cases
- ❌ Email doesn't exist (shows generic message)
- ❌ Invalid reset code (shows error)
- ❌ Expired reset code (shows error after 15 minutes)
- ❌ Passwords don't match (shows error)
- ❌ Password too short (shows error)

### Privacy Policy
- ✅ Modal opens when clicking link
- ✅ Content is scrollable
- ✅ Close button works
- ✅ Modal closes when clicking overlay

## Console Output Examples

### Successful Reset Code Generation
```
🔐 Password reset code for test@example.com: 456789
```

### Successful Password Reset
```
✅ Password reset successful for test@example.com
```

## Troubleshooting

### Reset Code Not Appearing in Console
- Check that backend is running on port 3001
- Verify email is correct
- Check browser console for API errors

### Modal Not Opening
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for JavaScript errors
- Verify PasswordReset component is imported

### Password Reset Fails
- Ensure code hasn't expired (15 minute limit)
- Verify code matches exactly (case-sensitive)
- Check that new password is at least 6 characters
- Confirm passwords match

## Test User Credentials

**Before Password Reset:**
- Email: test@example.com
- Password: (original password)

**After Password Reset:**
- Email: test@example.com
- Password: (new password you set)

## Notes

- Reset codes are logged to backend console for testing purposes
- In production, codes should be sent via email
- Codes expire after 15 minutes
- Each new reset request generates a new code
- Old codes are invalidated when new code is generated
