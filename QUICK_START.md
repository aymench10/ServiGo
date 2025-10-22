# 🚀 Quick Start Guide - Dual Booking System

## ⚡ 3-Step Setup

### Step 1: Database Setup (5 minutes)

1. **Open Supabase Dashboard**
   - Go to your project: https://supabase.com/dashboard
   - Navigate to SQL Editor

2. **Run Database Schema**
   - Open file: `database/bookings_schema.sql`
   - Copy entire content
   - Paste into Supabase SQL Editor
   - Click "Run"
   - Wait for success message

3. **Verify Installation**
   ```sql
   -- Run this query to verify tables exist
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('bookings_onsite', 'bookings_online', 'notifications');
   
   -- Should return 3 rows
   ```

### Step 2: Test the System (2 minutes)

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Login as Client**
   - Go to http://localhost:5173
   - Login with client account
   - Navigate to Services page

3. **Create Test Booking**
   - Click on any service
   - Click "Réserver maintenant"
   - Fill the booking form
   - Submit

4. **Login as Provider**
   - Logout and login with provider account
   - Check notification bell (should show 1)
   - Go to Provider Dashboard → Bookings tab
   - See the pending booking

5. **Confirm Booking**
   - Click "View Details" on the booking
   - Add optional notes
   - Click "Confirm Booking"
   - Logout and login as client
   - Check notification bell
   - See confirmation notification

### Step 3: Verify Everything Works ✅

**Check these features:**
- [ ] Booking modal opens
- [ ] Form submits successfully
- [ ] Provider receives notification
- [ ] Notification bell shows unread count
- [ ] Booking appears in provider dashboard
- [ ] Provider can confirm/decline
- [ ] Client receives response notification
- [ ] Booking status updates in real-time

---

## 🎯 Key Features to Test

### Onsite Service Booking
1. Go to Services → Select onsite service
2. Fill form:
   - ✅ Address
   - ✅ Governorate
   - ✅ Preferred date
   - ✅ Mark as urgent
   - ✅ Add notes
3. Submit and verify notification

### Online Project Booking
1. Go to Services → Select online service
2. Fill form:
   - ✅ Project title
   - ✅ Description
   - ✅ Budget range
   - ✅ Timeline
   - ✅ Add notes
3. Submit and verify notification

---

## 🐛 Common Issues & Quick Fixes

### Issue: "Table does not exist"
**Fix**: Run the database schema again in Supabase SQL Editor

### Issue: "Permission denied"
**Fix**: Check RLS policies are created:
```sql
SELECT * FROM pg_policies 
WHERE tablename IN ('bookings_onsite', 'bookings_online', 'notifications');
```

### Issue: Notifications not appearing
**Fix**: 
1. Check browser console for errors
2. Verify Supabase Realtime is enabled
3. Check user is authenticated

### Issue: Booking not saving
**Fix**:
1. Verify provider exists in `providers` table
2. Check all required fields are filled
3. Review browser console errors

---

## 📱 Quick Test Accounts

Create these test accounts for testing:

**Client Account:**
- Email: `client@test.com`
- Role: client

**Provider Account:**
- Email: `provider@test.com`
- Role: provider
- Must have profile in `providers` table

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Booking form submits without errors
- ✅ Notification bell shows red badge
- ✅ Clicking bell shows notification list
- ✅ Provider dashboard shows pending booking
- ✅ Confirm/Decline buttons work
- ✅ Client receives response notification
- ✅ Status updates in real-time

---

## 📚 Next Steps

1. **Customize Forms**: Edit `BookingModal.jsx` to add custom fields
2. **Style Notifications**: Modify `NotificationBell.jsx` for custom styling
3. **Add Features**: Check `BOOKING_SYSTEM_README.md` for enhancement ideas
4. **Deploy**: Push to production when ready

---

## 🆘 Need Help?

1. Check `BOOKING_SYSTEM_README.md` for detailed documentation
2. Review browser console for error messages
3. Check Supabase logs in dashboard
4. Verify all files are in correct locations

---

**Estimated Setup Time**: 10 minutes
**Difficulty**: Easy ⭐
**Status**: Production Ready ✅
