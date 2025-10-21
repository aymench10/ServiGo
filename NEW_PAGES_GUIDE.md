# Contact & Pricing Pages - Documentation

## Overview
Two new modern, smooth, and visually stunning pages have been created for ServiGo:
1. **Contact Page** (`/contact`)
2. **Pricing Page** (`/tarifs`)

---

## 🎨 Design Features

### Modern & Smooth Design Elements:
- ✨ **Gradient Backgrounds** - Beautiful blue-purple-pink gradients
- 🌊 **Smooth Animations** - Hover effects, scale transforms, and transitions
- 💫 **Blur Effects** - Backdrop blur and decorative blur elements
- 🎯 **Shadow Layers** - Multi-level shadows for depth
- 🔄 **Interactive Elements** - Hover states with scale and shadow changes
- 📱 **Fully Responsive** - Mobile-first design approach
- 🎭 **Glass Morphism** - Modern glassmorphism effects
- 🌈 **Color Gradients** - Smooth color transitions throughout

---

## 📞 Contact Page (`/contact`)

### URL
```
http://localhost:5173/contact
```

### Features

#### 1. Hero Section
- Full-width gradient background (blue → purple → pink)
- Animated decorative blur circles
- Back button to previous page
- Badge with "Nous sommes là pour vous"

#### 2. Contact Information Cards
Four beautiful cards with gradient icons:
- **📞 Téléphone** - Blue gradient
- **📧 Email** - Green gradient  
- **📍 Adresse** - Purple gradient
- **🕐 Horaires** - Orange gradient

Each card:
- Hover effects with shadow
- Clickable (tel:, mailto: links)
- Icon with gradient background
- Smooth transitions

#### 3. Contact Form
Full-featured form with:
- First Name & Last Name
- Email & Phone
- Service Selection dropdown
- Message textarea
- Submit button with loading state
- Success message animation
- Form validation

#### 4. Social Media Links
- Facebook, Instagram, LinkedIn, Twitter
- Hover effects with color changes
- Icon-based design

#### 5. Map Placeholder
- Gradient background
- Ready for Google Maps integration

#### 6. FAQ Section
4 common questions with answers:
- Response time
- Direct booking
- Free quotes
- Coverage area

### Technical Details
- **State Management**: React hooks for form data
- **Animations**: CSS transitions and transforms
- **Loading States**: Spinner animation during submit
- **Success Feedback**: Auto-dismiss after 5 seconds
- **Validation**: HTML5 form validation

---

## 💰 Pricing Page (`/tarifs`)

### URL
```
http://localhost:5173/tarifs
```

### Features

#### 1. Hero Section
- Gradient background with animated blur circles
- "Offres Spéciales Disponibles" badge
- Large heading with gradient text
- Back button

#### 2. Billing Toggle
Beautiful toggle switch:
- Monthly / Yearly options
- Active state with gradient
- "-20%" badge on yearly option
- Smooth transitions

#### 3. Three Pricing Plans

**Plan Basique (Free)**
- 0 DT/month
- 5 requests per month
- Email support
- Basic features
- Gray theme

**Plan Pro (Popular)** ⭐
- 29 DT/month or 290 DT/year
- Unlimited requests
- 24/7 priority support
- All features
- Purple gradient theme
- "POPULAIRE" badge
- Scale effect (105%)

**Plan Entreprise**
- 99 DT/month or 990 DT/year
- Everything in Pro
- Team management
- Dedicated API
- Custom training
- Blue gradient theme

#### 4. Features Display
Each plan shows:
- ✅ Included features (green checkmark)
- ❌ Not included (gray X)
- Feature descriptions
- Hover effects on cards
- Gradient pricing text

#### 5. Savings Calculator
- Automatically calculates yearly savings
- Shows "Économisez X DT par an"
- Updates when switching billing cycle

#### 6. Why Choose ServiGo Section
4 feature cards:
- ⭐ Quality Guaranteed
- 🕐 24/7 Availability
- 🏆 Customer Satisfaction
- 📈 Assured Growth

#### 7. Detailed Comparison Table
Full comparison table showing:
- Requests per month
- Support level
- Statistics access
- API availability
- Training options

#### 8. FAQ Section
6 common questions:
- Plan changes
- Minimum commitment
- Payment methods
- Refund policy
- Free plan details
- Priority support details

#### 9. CTA Section
Final call-to-action with:
- Gradient background
- "Prêt à commencer?" heading
- Two action buttons:
  - Talk to Expert
  - 14-Day Free Trial

### Technical Details
- **State Management**: Billing cycle toggle
- **Dynamic Pricing**: Calculates monthly/yearly prices
- **Savings Calculator**: Auto-calculates discounts
- **Animations**: Hover effects, scale transforms
- **Responsive Tables**: Overflow scroll on mobile

---

## 🎯 Design System

### Color Palette
```css
Primary Gradient: from-blue-600 via-purple-600 to-pink-500
Blue Gradient: from-blue-500 to-blue-600
Purple Gradient: from-purple-500 to-purple-600
Green Gradient: from-green-500 to-green-600
Orange Gradient: from-orange-500 to-orange-600
```

### Spacing
- Container: `max-w-7xl mx-auto`
- Padding: `px-4 sm:px-6 lg:px-8`
- Section spacing: `py-16` or `py-20`

### Border Radius
- Cards: `rounded-2xl` or `rounded-3xl`
- Buttons: `rounded-xl`
- Badges: `rounded-full`

### Shadows
- Cards: `shadow-lg` with `hover:shadow-xl`
- Buttons: `hover:shadow-xl`
- Icons: `shadow-lg`

### Transitions
- All interactive elements: `transition-all duration-300`
- Hover scale: `hover:scale-[1.02]` or `hover:scale-110`
- Hover translate: `hover:-translate-y-1` or `hover:-translate-y-2`

---

## 📱 Responsive Design

### Breakpoints
- Mobile: Default (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `md:` (≥ 768px)
- Large: `lg:` (≥ 1024px)

### Grid Layouts
- Contact: 1 column mobile → 3 columns desktop
- Pricing: 1 column mobile → 3 columns desktop
- Features: 1 column mobile → 2 tablet → 4 desktop

---

## 🚀 Navigation

### Header Links Updated
The Header component now includes direct links:
- `/contact` - Contact Page
- `/tarifs` - Pricing Page

### Routes Added
```javascript
<Route path="/contact" element={<ContactPage />} />
<Route path="/tarifs" element={<PricingPage />} />
```

---

## ✨ Animations & Effects

### Hover Effects
1. **Cards**: Scale up, shadow increase
2. **Buttons**: Scale, shadow, color change
3. **Icons**: Rotate, scale, color shift
4. **Links**: Color transition

### Loading States
1. **Form Submit**: Spinner animation
2. **Button States**: Disabled opacity
3. **Success Messages**: Fade in animation

### Decorative Elements
1. **Blur Circles**: Animated background elements
2. **Gradient Overlays**: Smooth color transitions
3. **Backdrop Blur**: Glass morphism effects

---

## 🎨 Component Structure

### Contact Page
```
ContactPage
├── Header
├── Hero Section (Gradient)
├── Main Content
│   ├── Contact Info Cards (Left)
│   │   ├── Phone Card
│   │   ├── Email Card
│   │   ├── Address Card
│   │   └── Hours Card
│   ├── Social Media Links
│   ├── Map Placeholder
│   └── Contact Form (Right)
└── FAQ Section
```

### Pricing Page
```
PricingPage
├── Header
├── Hero Section (Gradient)
├── Billing Toggle
├── Pricing Cards (3)
│   ├── Basique
│   ├── Pro (Popular)
│   └── Entreprise
├── Features Grid (4)
├── Comparison Table
├── FAQ Section (6)
└── CTA Section
```

---

## 🔧 Customization Guide

### Change Colors
Edit the gradient classes:
```jsx
// Current
className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"

// Custom
className="bg-gradient-to-r from-[your-color] via-[your-color] to-[your-color]"
```

### Change Pricing
Update the `plans` array in `PricingPage.jsx`:
```javascript
{
  monthlyPrice: '29',
  yearlyPrice: '290',
  // ...
}
```

### Add More FAQs
Add to the `faqs` array:
```javascript
{
  question: 'Your question?',
  answer: 'Your answer.'
}
```

### Modify Contact Info
Update the `contactInfo` array in `ContactPage.jsx`:
```javascript
{
  icon: Phone,
  title: 'Your Title',
  details: ['Detail 1', 'Detail 2'],
  color: 'from-blue-500 to-blue-600',
  bgColor: 'bg-blue-50',
  link: 'tel:+123456789'
}
```

---

## 📊 Performance Optimizations

1. **Lazy Loading**: Images load on demand
2. **CSS Transitions**: Hardware-accelerated
3. **Minimal Re-renders**: Optimized state management
4. **Responsive Images**: Proper sizing for devices

---

## 🐛 Testing Checklist

### Contact Page
- [ ] Form submission works
- [ ] Validation works (required fields)
- [ ] Success message appears
- [ ] Phone/email links work
- [ ] Social media links work
- [ ] Back button works
- [ ] Mobile responsive
- [ ] Hover effects work

### Pricing Page
- [ ] Billing toggle works
- [ ] Prices update correctly
- [ ] Savings calculation correct
- [ ] All buttons clickable
- [ ] Comparison table scrolls on mobile
- [ ] FAQ cards display properly
- [ ] Back button works
- [ ] Mobile responsive
- [ ] Hover effects work

---

## 🎯 Future Enhancements

### Contact Page
- [ ] Google Maps integration
- [ ] Live chat widget
- [ ] Email integration (SendGrid, etc.)
- [ ] File upload for attachments
- [ ] CAPTCHA for spam protection

### Pricing Page
- [ ] Payment integration (Stripe, PayPal)
- [ ] Currency selector
- [ ] Plan comparison modal
- [ ] Testimonials section
- [ ] ROI calculator
- [ ] Video demos

---

## 📝 Notes

- Both pages use the same design system for consistency
- All animations are smooth (300ms duration)
- Colors match the ServiGo brand
- Fully accessible with proper ARIA labels
- SEO-friendly with semantic HTML
- Print-friendly layouts

---

## 🎉 Summary

Two beautiful, modern pages have been created with:
- ✨ Stunning gradient designs
- 🌊 Smooth animations and transitions
- 📱 Fully responsive layouts
- 🎯 Clear call-to-actions
- 💫 Interactive hover effects
- 🎨 Consistent design system
- ⚡ Optimized performance

Both pages are ready to use and can be accessed via the header navigation!
