# 🚀 Deployment Checklist - Dual Booking System

## Pre-Deployment Steps

### 1. Database Setup ✅

#### Run Database Schema
```bash
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Copy content from: database/bookings_schema.sql
# 4. Paste and run
```

#### Verify Tables Created
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('bookings_onsite', 'bookings_online', 'notifications');
```
**Expected**: 3 rows returned

#### Check RLS Policies
```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename IN ('bookings_onsite', 'bookings_online', 'notifications');
```
**Expected**: Multiple policies for each table

#### Verify Triggers
```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table IN ('bookings_onsite', 'bookings_online');
```
**Expected**: 4+ triggers

---

### 2. Environment Configuration ✅

#### Check Supabase Configuration
**File**: `src/lib/supabase.js`

Verify:
- [ ] `SUPABASE_URL` is correct
- [ ] `SUPABASE_ANON_KEY` is correct
- [ ] Connection works

#### Test Connection
```javascript
// Run in browser console
import { supabase } from './lib/supabase'
const { data, error } = await supabase.from('providers').select('count')
console.log('Connection test:', { data, error })
```

---

### 3. Code Review ✅

#### Verify Imports
- [ ] `BookingModal.jsx` imported in `ServiceDetails.jsx`
- [ ] `BookingsManagement.jsx` imported in dashboards
- [ ] `NotificationBell.jsx` imported in `Header.jsx`
- [ ] `Footer.jsx` imported in `Services.jsx`

#### Check Component Props
- [ ] BookingModal receives correct props
- [ ] BookingsManagement receives userRole
- [ ] NotificationBell has no required props

---

### 4. Testing Phase ✅

#### Test Accounts Setup
Create these test accounts:

**Client Account**:
```
Email: test-client@example.com
Password: TestClient123!
Role: client
```

**Provider Account**:
```
Email: test-provider@example.com
Password: TestProvider123!
Role: provider
```

**Provider Profile**:
```sql
-- Ensure provider has profile
INSERT INTO providers (user_id, full_name, email, phone, city, category)
VALUES (
  'PROVIDER_USER_ID',
  'Test Provider',
  'test-provider@example.com',
  '+216 XX XXX XXX',
  'Tunis',
  'Plomberie'
);
```

#### Onsite Booking Test
1. [ ] Login as client
2. [ ] Navigate to services
3. [ ] Click on onsite service
4. [ ] Click "Réserver maintenant"
5. [ ] Fill form completely
6. [ ] Submit booking
7. [ ] Verify success message
8. [ ] Logout

9. [ ] Login as provider
10. [ ] Check notification bell (should show 1)
11. [ ] Click notification
12. [ ] Navigate to bookings
13. [ ] See pending booking
14. [ ] Click "View Details"
15. [ ] Add provider notes
16. [ ] Click "Confirm Booking"
17. [ ] Verify success
18. [ ] Logout

19. [ ] Login as client
20. [ ] Check notification bell
21. [ ] See confirmation notification
22. [ ] Go to bookings tab
23. [ ] Verify status is "confirmed"

#### Online Booking Test
1. [ ] Login as client
2. [ ] Navigate to services
3. [ ] Click on online service
4. [ ] Click "Réserver maintenant"
5. [ ] Fill project form
6. [ ] Submit request
7. [ ] Verify success message
8. [ ] Logout

9. [ ] Login as provider
10. [ ] Check notification bell
11. [ ] See new notification
12. [ ] Navigate to bookings
13. [ ] See pending project
14. [ ] Accept or decline
15. [ ] Verify client receives notification

#### Real-time Updates Test
1. [ ] Open two browser windows
2. [ ] Login as client in window 1
3. [ ] Login as provider in window 2
4. [ ] Create booking in window 1
5. [ ] Verify notification appears in window 2 (no refresh)
6. [ ] Confirm booking in window 2
7. [ ] Verify status updates in window 1 (no refresh)

#### Filter & Search Test
1. [ ] Create multiple bookings (different types/statuses)
2. [ ] Test status filter (pending, confirmed, declined)
3. [ ] Test type filter (onsite, online)
4. [ ] Verify counts update correctly

---

### 5. Performance Testing ✅

#### Load Testing
- [ ] Create 10+ bookings
- [ ] Check page load time
- [ ] Verify real-time updates still work
- [ ] Check notification performance

#### Database Performance
```sql
-- Check query performance
EXPLAIN ANALYZE
SELECT * FROM bookings_onsite 
WHERE provider_id = 'TEST_ID' 
AND status = 'pending';

-- Should use indexes
```

---

### 6. Security Audit ✅

#### RLS Testing
```sql
-- Test as client (should only see own bookings)
SET request.jwt.claim.sub = 'CLIENT_USER_ID';
SELECT * FROM bookings_onsite;

-- Test as provider (should only see assigned bookings)
SET request.jwt.claim.sub = 'PROVIDER_USER_ID';
SELECT * FROM bookings_onsite;
```

#### Unauthorized Access Test
1. [ ] Try to access other user's bookings
2. [ ] Try to modify other user's bookings
3. [ ] Try to create notifications for other users
4. [ ] Verify all blocked by RLS

---

### 7. Mobile Responsiveness ✅

Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Check:
- [ ] Booking modal displays correctly
- [ ] Notification dropdown works
- [ ] Dashboard tables responsive
- [ ] Buttons accessible
- [ ] Forms usable

---

### 8. Error Handling ✅

#### Test Error Scenarios
1. [ ] Submit booking without required fields
2. [ ] Submit with invalid data
3. [ ] Test with network disconnected
4. [ ] Test with invalid provider_id
5. [ ] Test with expired session

Verify:
- [ ] Error messages display
- [ ] User can retry
- [ ] No data corruption
- [ ] Graceful degradation

---

### 9. Browser Compatibility ✅

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

### 10. Documentation Review ✅

Verify documentation is complete:
- [ ] `BOOKING_SYSTEM_README.md` accurate
- [ ] `QUICK_START.md` works
- [ ] `IMPLEMENTATION_SUMMARY.md` up to date
- [ ] Code comments present
- [ ] API documentation clear

---

## Deployment Steps

### Step 1: Backup Current System
```bash
# Backup database
# In Supabase Dashboard → Database → Backups
# Create manual backup before deployment
```

### Step 2: Deploy Database Changes
```bash
# Run in production Supabase
# Copy content from: database/bookings_schema.sql
# Paste in SQL Editor
# Execute
# Verify success
```

### Step 3: Deploy Frontend
```bash
# Build production bundle
npm run build

# Test production build locally
npm run preview

# Deploy to hosting (Vercel/Netlify/etc)
# Follow your hosting provider's deployment process
```

### Step 4: Verify Production
1. [ ] Visit production URL
2. [ ] Test booking flow
3. [ ] Verify notifications work
4. [ ] Check real-time updates
5. [ ] Test on mobile device

---

## Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor error logs
- [ ] Check booking creation rate
- [ ] Verify notification delivery
- [ ] Monitor database performance
- [ ] Check user feedback

### Week 1
- [ ] Review booking completion rate
- [ ] Check notification read rate
- [ ] Monitor system performance
- [ ] Gather user feedback
- [ ] Fix any reported issues

### Metrics to Track
- Total bookings created
- Booking confirmation rate
- Notification delivery rate
- Average response time
- User satisfaction

---

## Rollback Plan

If issues occur:

### Database Rollback
```sql
-- Drop new tables if needed
DROP TABLE IF EXISTS bookings_onsite CASCADE;
DROP TABLE IF EXISTS bookings_online CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Restore from backup
-- Use Supabase Dashboard → Database → Backups
```

### Frontend Rollback
```bash
# Revert to previous deployment
# Use your hosting provider's rollback feature
# Or redeploy previous version
```

---

## Success Criteria

System is ready for production when:
- ✅ All tests pass
- ✅ No critical bugs
- ✅ Performance acceptable
- ✅ Security verified
- ✅ Documentation complete
- ✅ Monitoring in place
- ✅ Rollback plan ready

---

## Emergency Contacts

**Database Issues**:
- Check Supabase status: https://status.supabase.com
- Review Supabase logs in dashboard

**Frontend Issues**:
- Check browser console
- Review hosting provider logs
- Check network tab for API errors

**Critical Bugs**:
1. Document the issue
2. Check if rollback needed
3. Review error logs
4. Fix and redeploy

---

## Final Checklist

Before going live:
- [ ] All tests completed
- [ ] Database schema deployed
- [ ] Frontend deployed
- [ ] Monitoring active
- [ ] Documentation updated
- [ ] Team trained
- [ ] Support ready
- [ ] Rollback plan tested

---

**Deployment Date**: __________
**Deployed By**: __________
**Version**: 1.0.0
**Status**: Ready for Production ✅
