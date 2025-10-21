# Service Details Page - Documentation

## Overview
A comprehensive service details page that displays full information about a service and its provider, with a booking functionality that allows clients to request services.

---

## 🎨 Page Layout

### Structure:
```
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────────────────────────────┤
│ [← Back Button]                         │
├──────────────────┬──────────────────────┤
│                  │                      │
│  Service Image   │   Provider Card     │
│                  │   - Profile Photo   │
│  Service Info    │   - Name & Rating   │
│  - Title         │   - Experience      │
│  - Price         │   - Bio             │
│  - Description   │   - Contact Info    │
│  - Details       │   [Book Now Button] │
│                  │   [Message Button]  │
└──────────────────┴──────────────────────┘
```

---

## 📋 Key Features

### 1. Service Information Section

#### Service Image
- Full-width image (h-96)
- Fallback gradient background
- Premium/Featured badges overlay
- Hover effects

#### Service Details
- **Title**: Large, bold heading
- **Location**: City (onsite) or "Service en ligne"
- **Category**: Service category
- **Price**: Large, prominent display with TND/hr
- **Availability**: Green badge "Disponible"
- **Description**: Full service description
- **Service Type Specific Info**:
  - Onsite: Location and availability grid
  - Online: Remote service indicators

### 2. Provider Information Sidebar

#### Profile Section
- **Profile Photo**: Circular, 96px
- **Name**: Provider full name
- **Category**: Provider specialty
- **Rating**: 5-star display with score (4.9)

#### Provider Stats
- **Experience**: Years of experience
- **Verification**: "Prestataire vérifié" badge
- **Location**: Provider city

#### About Section
- Provider bio (if available)
- Background information

#### Contact Information
- **Phone**: Clickable tel: link
- **Email**: Clickable mailto: link

#### Action Buttons
- **Book Now**: Primary CTA (gradient blue-purple)
- **Send Message**: Secondary CTA (outlined)

### 3. Booking Modal

#### Form Fields:
- **Date**: Date picker (minimum: today)
- **Time**: Time picker
- **Message**: Optional textarea

#### Actions:
- **Cancel**: Close modal
- **Confirm**: Submit booking request

#### Success State:
- Green checkmark icon
- Success message
- Auto-close after 2 seconds

---

## 🔗 Navigation Flow

### Entry Points:
```
Services Page → Click "View Details" → Service Details Page
```

### URL Structure:
```
/service/:serviceType/:serviceId

Examples:
/service/onsite/123
/service/online/456
```

### Parameters:
- **serviceType**: 'onsite' or 'online'
- **serviceId**: Service UUID

---

## 💾 Database Integration

### Data Fetched:
```sql
SELECT 
  services.*,
  providers.*
FROM services_onsite/services_online
JOIN providers ON providers.user_id = services.provider_id
WHERE services.id = :serviceId
```

### Booking Creation:
```javascript
{
  client_id: user.id,
  provider_id: provider.user_id,
  service_id: service.id,
  service_type: 'onsite' | 'online',
  service_title: service.title,
  date: '2025-10-25',
  time: '14:00',
  message: 'Optional message',
  status: 'pending',
  price: service.price
}
```

---

## 🎨 Design Elements

### Color Scheme:
- **Primary**: Blue-600 (#2563eb)
- **Secondary**: Purple-600 (#9333ea)
- **Success**: Green-600 (#16a34a)
- **Background**: Gray-50 (#f9fafb)
- **Cards**: White (#ffffff)

### Typography:
- **Page Title**: text-3xl, bold
- **Section Titles**: text-xl, bold
- **Body Text**: text-base, regular
- **Labels**: text-sm, medium

### Spacing:
- **Container**: max-w-7xl
- **Grid Gap**: 32px (gap-8)
- **Card Padding**: 32px (p-8)
- **Section Spacing**: 24px (space-y-6)

---

## 📱 Responsive Design

### Desktop (lg):
```
┌────────────────────────────────┐
│  2/3 Main Content  │ 1/3 Side │
└────────────────────────────────┘
```

### Mobile:
```
┌──────────────┐
│ Main Content │
├──────────────┤
│   Sidebar    │
└──────────────┘
```

### Breakpoints:
- **Mobile**: Full width, stacked
- **Tablet**: 2-column grid
- **Desktop**: 3-column grid (2:1 ratio)

---

## ✨ Interactive Elements

### Hover Effects:
- **Share Button**: Gray → Blue
- **Contact Links**: Gray → Blue
- **Book Now Button**: Shadow + Scale
- **Message Button**: Border Blue + Text Blue

### Loading States:
- **Page Load**: Centered spinner
- **Booking Submit**: Button disabled + "Envoi..."
- **Success**: Green checkmark animation

### Error States:
- **Service Not Found**: Error message + Back button
- **Booking Error**: Alert message

---

## 🔐 Authentication Flow

### Unauthenticated User:
```
Click "Book Now" → Redirect to /login
```

### Authenticated User:
```
Click "Book Now" → Show Booking Modal → Submit → Success
```

---

## 🎯 User Actions

### Primary Actions:
1. **Book Now**: Opens booking modal
2. **Send Message**: Contact provider
3. **Share**: Share service (placeholder)
4. **Back**: Return to previous page

### Secondary Actions:
1. **Call**: Click phone number
2. **Email**: Click email address

---

## 📊 Component Structure

```
ServiceDetails
├── Header
├── Back Button
├── Main Grid
│   ├── Service Section (2/3)
│   │   ├── Image
│   │   ├── Info Card
│   │   │   ├── Title & Meta
│   │   │   ├── Price Display
│   │   │   ├── Description
│   │   │   └── Service Details
│   │   └── ...
│   └── Provider Sidebar (1/3)
│       ├── Profile
│       ├── Stats
│       ├── Bio
│       ├── Contact
│       └── Action Buttons
└── Booking Modal (conditional)
    ├── Form
    └── Success State
```

---

## 🎨 Badge System

### Premium Badge:
```jsx
<span className="bg-blue-600 text-white">
  ⭐ PREMIUM
</span>
```

### Featured Badge:
```jsx
<span className="bg-orange-500 text-white">
  🔥 FEATURED
</span>
```

### Availability Badge:
```jsx
<span className="bg-green-100 text-green-700">
  ✓ Disponible
</span>
```

### Verification Badge:
```jsx
<span className="text-green-600">
  ✓ Prestataire vérifié
</span>
```

---

## 💡 Features Highlights

### Service Information:
- ✅ Full service details
- ✅ High-quality image display
- ✅ Clear pricing
- ✅ Service type indicators
- ✅ Location information

### Provider Information:
- ✅ Profile photo
- ✅ Rating display
- ✅ Experience years
- ✅ Verification status
- ✅ Bio/About section
- ✅ Direct contact options

### Booking System:
- ✅ Date/time selection
- ✅ Optional message
- ✅ Instant booking request
- ✅ Success confirmation
- ✅ Provider notification (backend)

---

## 🔧 Technical Details

### File Location:
`src/pages/ServiceDetails.jsx`

### Dependencies:
- `react`
- `react-router-dom` (useParams, useNavigate)
- `../context/AuthContext` (useAuth)
- `../lib/supabase`
- `lucide-react` (Icons)
- `../components/Header`

### State Management:
```javascript
const [service, setService] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [showBookingModal, setShowBookingModal] = useState(false)
const [imageError, setImageError] = useState(false)
```

### Props (BookingModal):
```javascript
{
  service: Object,
  provider: Object,
  onClose: Function
}
```

---

## 🚀 Performance Optimizations

### Data Loading:
- Single database query with JOIN
- Efficient data fetching
- Error handling

### Image Handling:
- Error fallback
- Gradient placeholder
- Proper sizing

### Modal:
- Conditional rendering
- Auto-close on success
- Form validation

---

## 📝 Form Validation

### Required Fields:
- ✅ Date (minimum: today)
- ✅ Time

### Optional Fields:
- Message (textarea)

### Validation Rules:
- Date cannot be in the past
- Time must be valid format
- Message max length (implicit)

---

## 🎉 Success Flow

### Booking Submission:
```
1. User fills form
2. Clicks "Confirmer"
3. Loading state (button disabled)
4. Data sent to Supabase
5. Success state shown
6. Modal auto-closes (2s)
7. Provider receives notification
```

---

## 🐛 Error Handling

### Service Not Found:
- Display error message
- Show "Retour aux services" button
- Redirect to services page

### Booking Error:
- Alert message
- Form remains open
- User can retry

### Image Load Error:
- Show gradient placeholder
- Display service type icon
- No broken image

---

## ♿ Accessibility

### Implemented:
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ ARIA labels (implicit)
- ✅ Color contrast (WCAG AA)
- ✅ Touch targets (44px min)

### Form Accessibility:
- ✅ Label associations
- ✅ Required field indicators
- ✅ Error messages
- ✅ Success feedback

---

## 📊 Analytics Tracking

### Recommended Events:
```javascript
// Page view
analytics.track('Service Details Viewed', {
  service_id: serviceId,
  service_type: serviceType,
  provider_id: provider.id
})

// Booking initiated
analytics.track('Booking Started', {
  service_id: serviceId,
  service_type: serviceType
})

// Booking completed
analytics.track('Booking Completed', {
  service_id: serviceId,
  booking_date: formData.date
})
```

---

## 🎯 Future Enhancements

### Potential Features:
- [ ] Reviews and ratings section
- [ ] Photo gallery
- [ ] Similar services recommendations
- [ ] Favorite/Save service
- [ ] Share on social media
- [ ] Provider response time
- [ ] Instant messaging
- [ ] Video consultation option
- [ ] Calendar availability view
- [ ] Price negotiation
- [ ] Multi-service booking
- [ ] Booking history

---

## 🎉 Summary

### What Was Created:
1. ✅ **ServiceDetails Page** - Full service information display
2. ✅ **Provider Sidebar** - Complete provider profile
3. ✅ **Booking Modal** - Date/time selection and booking
4. ✅ **Success State** - Confirmation feedback
5. ✅ **Navigation Integration** - Routes and links
6. ✅ **Database Integration** - Supabase queries

### Key Benefits:
- 🎯 Complete service information
- 👤 Detailed provider profiles
- 📅 Easy booking process
- 💬 Direct communication options
- 📱 Fully responsive design
- ✨ Smooth user experience
- 🔒 Authentication protected
- 💾 Database integrated

The service details page provides a comprehensive view of services and enables seamless booking! 🚀
