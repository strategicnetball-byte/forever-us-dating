# Profile & Photo Reporting System

## Overview

The reporting system allows users to report offensive, obscene, or inappropriate profiles and photos. Reports are reviewed by admins who can take appropriate action.

## Features

### User-Facing
- Report profiles or specific photos
- Select from predefined violation categories
- Add optional description for context
- View their own submitted reports
- Receive confirmation when report is submitted

### Admin-Facing
- View pending reports with pagination
- Review report details including user info and photos
- Take action: warning, photo removal, profile suspension, or ban
- Add admin notes
- Track report history

## Report Categories

1. **Offensive Content** - Hateful, discriminatory, or insulting content
2. **Obscene/Explicit Content** - Sexually explicit or graphic content
3. **Fake Profile** - Impersonation or fraudulent account
4. **Harassment** - Threatening, bullying, or abusive behavior
5. **Spam** - Repetitive or promotional content
6. **Inappropriate Photos** - Photos violating community standards
7. **Underage Content** - Content involving minors
8. **Other** - Other violations not listed above

## Admin Actions

- **None** - Report reviewed but no action taken
- **Warning** - User receives warning (future: implement notification)
- **Photo Removed** - Specific photo is deleted from profile
- **Profile Suspended** - Account temporarily disabled
- **Profile Banned** - Account permanently banned

## API Endpoints

### User Endpoints

#### Submit Report
```
POST /api/reports/submit
Authorization: Bearer {token}

Body:
{
  "reportedUserId": "user_id",
  "reportType": "profile" | "photo",
  "photoId": "photo_id" (optional, required if reportType is "photo"),
  "reason": "offensive_content" | "obscene_content" | "fake_profile" | "harassment" | "spam" | "inappropriate_photos" | "underage_content" | "other",
  "description": "Additional context (optional, max 500 chars)"
}

Response:
{
  "message": "Report submitted successfully",
  "reportId": "report_id"
}
```

#### Get My Reports
```
GET /api/reports/my-reports
Authorization: Bearer {token}

Response:
[
  {
    "_id": "report_id",
    "reportedUser": { "profile": { "name": "..." } },
    "reason": "offensive_content",
    "status": "pending",
    "createdAt": "2026-01-20T..."
  }
]
```

### Admin Endpoints

#### List Reports
```
GET /api/reports/admin/list?status=pending&page=1&limit=20
Authorization: Bearer {admin_token}

Query Parameters:
- status: pending | reviewed | resolved | dismissed
- page: page number (default: 1)
- limit: items per page (default: 20)

Response:
{
  "reports": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 5
  }
}
```

#### Get Report Details
```
GET /api/reports/admin/:reportId
Authorization: Bearer {admin_token}

Response:
{
  "_id": "report_id",
  "reportedBy": { "profile": { "name": "..." }, "email": "..." },
  "reportedUser": { "profile": { "name": "...", "photos": [...] }, "email": "..." },
  "reportType": "profile",
  "reason": "offensive_content",
  "description": "...",
  "status": "pending",
  "createdAt": "2026-01-20T..."
}
```

#### Review Report
```
POST /api/reports/admin/:reportId/review
Authorization: Bearer {admin_token}

Body:
{
  "action": "none" | "warning" | "photo_removed" | "profile_suspended" | "profile_banned",
  "adminNotes": "Admin review notes (optional)"
}

Response:
{
  "message": "Report reviewed",
  "report": { ... }
}
```

## Implementation in Components

### Adding Report Button to Profile

```tsx
import ReportModal from './ReportModal/ReportModal';

const [reportModalOpen, setReportModalOpen] = useState(false);

return (
  <>
    <button onClick={() => setReportModalOpen(true)} className="btn-report">
      🚩 Report Profile
    </button>
    
    <ReportModal
      isOpen={reportModalOpen}
      onClose={() => setReportModalOpen(false)}
      reportedUserId={userId}
      reportedUserName={userName}
      reportType="profile"
    />
  </>
);
```

### Adding Report Button to Photos

```tsx
<button 
  onClick={() => setReportModalOpen(true)}
  className="btn-report-photo"
>
  Report Photo
</button>

<ReportModal
  isOpen={reportModalOpen}
  onClose={() => setReportModalOpen(false)}
  reportedUserId={userId}
  reportedUserName={userName}
  reportType="photo"
  photoId={photoId}
/>
```

## Database Schema

### Report Model

```javascript
{
  reportedBy: ObjectId (User),
  reportedUser: ObjectId (User),
  reportType: 'profile' | 'photo',
  photoId: String (optional),
  reason: String (enum),
  description: String (max 500),
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed',
  adminNotes: String (max 1000),
  action: 'none' | 'warning' | 'photo_removed' | 'profile_suspended' | 'profile_banned',
  createdAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId (User)
}
```

## Duplicate Report Prevention

The system prevents duplicate reports by checking if:
- Same user has already reported the same profile/photo
- Report status is pending or reviewed (not dismissed)

## Future Enhancements

1. **Automated Moderation** - Use AI/ML to flag suspicious content
2. **Appeal System** - Allow users to appeal suspensions/bans
3. **Report Analytics** - Dashboard showing report trends
4. **Notification System** - Notify users of actions taken
5. **Photo Verification** - Require photo verification for new accounts
6. **Reputation System** - Track user report accuracy
7. **Escalation** - Auto-escalate repeated violations
8. **Integration** - Connect with external moderation services

## Testing

### Test Report Submission
```bash
curl -X POST http://localhost:3001/api/reports/submit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reportedUserId": "user_id",
    "reportType": "profile",
    "reason": "offensive_content",
    "description": "Test report"
  }'
```

### Test Admin Review
```bash
curl -X POST http://localhost:3001/api/reports/admin/{reportId}/review \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "warning",
    "adminNotes": "Reviewed and warned user"
  }'
```

## Notes

- Reports are immutable once submitted
- Admin actions are logged with timestamp and admin ID
- Suspended/banned users cannot log in
- Photos are permanently deleted when action is taken
- All timestamps are in UTC
