# API Endpoints Documentation

## Reports Module (`/reports`)

### Get Templates
```
GET /reports/templates
```
Returns all available report templates.

### Get Template by ID
```
GET /reports/templates/:id
```
Returns a specific template by ID.

### Generate Report
```
POST /reports/generate
Body: {
  templateId: string
  dateRange: { start: Date, end: Date }
  format: 'pdf' | 'csv' | 'xlsx'
}
```
Generates a new report and returns report metadata.

### Get Reports
```
GET /reports?userId=string
```
Returns all generated reports for a user.

### Get Report by ID
```
GET /reports/:id
```
Returns report metadata by ID.

### Download Report
```
GET /reports/:id/download
```
Downloads the generated report file.

### Get Scheduled Reports
```
GET /reports/scheduled
```
Returns all scheduled reports.

### Create Scheduled Report
```
POST /reports/scheduled
Body: {
  name: string
  templateId: string
  frequency: 'daily' | 'weekly' | 'monthly'
  format: 'pdf' | 'csv'
  recipients: string[]
}
```
Creates a new scheduled report.

### Delete Scheduled Report
```
DELETE /reports/scheduled/:id
```
Deletes a scheduled report.

---

## Activity Module (`/activity`)

### Get Activity Logs
```
GET /activity/logs?type=string&userId=string&limit=number&offset=number
```
Returns activity logs with optional filtering.

Query Parameters:
- `type`: Filter by activity type (system, user, automation, device)
- `userId`: Filter by user ID
- `limit`: Number of records (default: 50)
- `offset`: Starting position (default: 0)

### Get Field Notes
```
GET /activity/notes?type=string&zone=string&authorId=string&tags=string&search=string&limit=number&offset=number
```
Returns field notes with optional filtering.

Query Parameters:
- `type`: Filter by note type (observation, treatment, harvest, etc.)
- `zone`: Filter by zone name
- `authorId`: Filter by author ID
- `tags`: Comma-separated list of tags
- `search`: Full-text search in title/content
- `limit`: Number of records (default: 50)
- `offset`: Starting position (default: 0)

### Get Field Note by ID
```
GET /activity/notes/:id
```
Returns a specific field note.

### Create Field Note
```
POST /activity/notes
Body: {
  title: string
  content: string
  type: 'observation' | 'treatment' | 'harvest' | 'planting' | 'maintenance' | 'weather' | 'pest' | 'irrigation'
  zone: string
  tags: string[]
  images?: string[]
  attachments?: { name: string, size: string, url: string }[]
}
```
Creates a new field note.

### Update Field Note
```
PUT /activity/notes/:id
Body: Partial<FieldNote>
```
Updates an existing field note.

### Delete Field Note
```
DELETE /activity/notes/:id
```
Deletes a field note.

### Get Zones
```
GET /activity/notes/meta/zones
```
Returns all unique zones from field notes.

### Get Tags
```
GET /activity/notes/meta/tags
```
Returns all unique tags from field notes.

---

## Notifications Module (`/notifications`)

### Get User Preferences
```
GET /notifications/preferences/:userId
```
Returns notification preferences for a user.

### Update User Preferences
```
PUT /notifications/preferences/:userId
Body: {
  emailEnabled?: boolean
  smsEnabled?: boolean
  pushEnabled?: boolean
  quietHoursStart?: string
  quietHoursEnd?: string
  digestFrequency?: 'realtime' | 'hourly' | 'daily'
}
```
Updates notification preferences.

### Send Notification
```
POST /notifications/send
Body: {
  userId: string
  title: string
  message: string
  type: 'alert' | 'info' | 'warning' | 'success'
  channels: ('email' | 'sms' | 'push' | 'websocket')[]
}
```
Sends a notification through specified channels.

### Send Test Notification
```
POST /notifications/test/:userId
```
Sends a test notification to a user.

---

## Event-Driven Activity Logging

The Activity module automatically logs events from other modules:

- `irrigation.started` → Logs irrigation start
- `irrigation.completed` → Logs irrigation completion
- `alert.created` → Logs alert creation
- `device.status_changed` → Logs device online/offline
- `automation.triggered` → Logs automation rule triggers

To emit these events from other modules:
```typescript
this.eventEmitter.emit('irrigation.started', {
  zone: 'North Field',
  duration: 30
});
```
