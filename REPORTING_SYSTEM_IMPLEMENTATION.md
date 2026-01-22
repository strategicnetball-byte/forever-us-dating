# Reporting System Implementation

## Overview
A comprehensive user reporting system for handling inappropriate content, harassment, scams, and other violations on the Forever Us platform.

## Features

### Report Types
- **Inappropriate Photos** - Explicit or offensive images
- **Offensive Language** - Abusive or hateful messages
- **Harassment** - Unwanted contact or threats
- **Scam/Fraud** - Suspicious financial or romantic scams
- **Fake Profile** - Impersonation or misleading information
- **Underage User** - Suspected minor on platform
- **Explicit Content** - Sexual or adult content
- **Spam** - Repetitive or promotional messages
- **Other** - Any other violation

### Report Status Flow
1. **Pending** - Initial submission
2. **Under Review** - Moderator is investigating
3. **Resolved** - Action taken
4. **Dismissed** - No violation found

### Resolution Actions
- **Warning** - User receives warning (tracked in settings.warnings)
- **Suspended** - Account disabled for 7 days
- **Banned** - Permanent account ban
- **No Action** - Report dismissed

## API Endpoints

### Submit Report
```
POST /api/reports/submit
Authorization: Bearer {token}

Body:
{
  "reportedUserId": "user_id",
  "reportType": "inappropriate-photos",
  "description": "Detailed description of the issue",
  "evidence": {
    "messageId": "optional_message_id",
    "photoUrl": "optional_photo_url",
    "timestamp": "optional_timestamp"
  }
}

Response:
{
  "message": "Report submitted successfully",
  "reportId": "report_id"
}
```

### Get Pending Reports (Admin)
```
GET /api/reports/admin/pending
Authorization: Bearer {token}

Response: Array of pending reports with reporter and reported user details
```

### Get Report Details
```
GET /api/reports/:reportId
Authorization: Bearer {token}

Response: Full report details with resolution information
```

### Update Report Status
```
PUT /api/reports/:reportId/status
Authorization: Bearer {token}

Body:
{
  "status": "under-review" | "resolved" | "dismissed"
}
```

### Resolve Report with Action
```
PUT /api/reports/:reportId/resolve
Authorization: Bearer {token}

Body:
{
  "action": "warning" | "suspended" | "banned" | "no-action",
  "notes": "Optional resolution notes"
}

Response: Updated report with resolution details
```

### Get User Report History
```
GET /api/reports/user/:userId/history
Authorization: Bearer {token}

Response: All reports filed against a specific user
```

### Get Statistics
```
GET /api/reports/admin/stats
Authorization: Bearer {token}

Response:
{
  "total": 42,
  "pending": 5,
  "underReview": 3,
  "resolved": 30,
  "dismissed": 4,
  "byType": [
    { "_id": "inappropriate-photos", "count": 15 },
    { "_id": "harassment", "count": 12 },
    ...
  ]
}
```

## Frontend Integration

### ReportModal Component
Located at: `client-new/src/components/ReportModal/ReportModal.tsx`

Usage:
```tsx
import ReportModal from './components/ReportModal/ReportModal';

const [showReportModal, setShowReportModal] = useState(false);

<ReportModal
  isOpen={showReportModal}
  userId={userToReport._id}
  userName={userToReport.profile.name}
  onClose={() => setShowReportModal(false)}
  onSubmit={async (reportData) => {
    const response = await fetch('/api/reports/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reportData)
    });
    if (!response.ok) throw new Error('Failed to submit report');
  }}
/>

<button onClick={() => setShowReportModal(true)}>
  Report User
</button>
```

## Database Schema

### Report Model
```javascript
{
  reportedBy: ObjectId (User),
  reportedUser: ObjectId (User),
  reportType: String (enum),
  description: String (max 1000),
  evidence: {
    messageId: ObjectId,
    photoUrl: String,
    timestamp: Date
  },
  status: String (pending, under-review, resolved, dismissed),
  resolution: {
    action: String (warning, suspended, banned, no-action),
    notes: String,
    resolvedAt: Date,
    resolvedBy: ObjectId (User)
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Safety Features

1. **Duplicate Prevention** - Users cannot file multiple reports on the same person
2. **Self-Report Prevention** - Users cannot report themselves
3. **Character Limits** - Descriptions limited to 1000 characters
4. **Minimum Description** - At least 10 characters required
5. **False Report Penalties** - System tracks false reports (future implementation)

## Moderation Workflow

1. User submits report with details
2. Report appears in admin pending queue
3. Moderator reviews report and evidence
4. Moderator marks as "under-review"
5. Moderator takes action (warning/suspend/ban/dismiss)
6. Report marked as "resolved"
7. User account updated with action

## User Account Restrictions

### Warnings
- Tracked in `user.settings.warnings`
- Multiple warnings can lead to suspension

### Suspension
- Account disabled for 7 days
- Stored in `user.settings.suspendedUntil`
- Auto-reactivates after period expires

### Ban
- Permanent account deactivation
- Stored in `user.settings.banned`
- Manual admin action required to unban

## Future Enhancements

1. **Automated Detection** - AI/ML for flagging inappropriate content
2. **Appeal System** - Users can appeal suspensions/bans
3. **Report Analytics** - Dashboard for moderation team
4. **Escalation** - Automatic escalation for serious violations
5. **Legal Holds** - Preserve evidence for legal action
6. **Community Guidelines** - Detailed violation categories
7. **Notification System** - Alert users of actions taken

## Testing

### Create Test Report
```bash
curl -X POST http://localhost:3001/api/reports/submit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "reportedUserId": "dummy1_id",
    "reportType": "inappropriate-photos",
    "description": "This user has inappropriate photos in their profile"
  }'
```

### View Pending Reports
```bash
curl http://localhost:3001/api/reports/admin/pending \
  -H "Authorization: Bearer {token}"
```

### Resolve Report
```bash
curl -X PUT http://localhost:3001/api/reports/{reportId}/resolve \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "warning",
    "notes": "First offense - user warned"
  }'
```

## Deployment

The reporting system has been deployed to the production instance at 18.141.201.176:
- Backend routes: `/api/reports/*`
- Frontend component: ReportModal
- Database: MongoDB Atlas (Report collection)

All changes are live and ready for testing.
