-- =====================================================
-- DUAL BOOKING SYSTEM - DATABASE SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor to create all necessary tables

-- =====================================================
-- 1. ONSITE BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookings_onsite (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL,
    service_id UUID NOT NULL REFERENCES public.services_onsite(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    location TEXT NOT NULL,
    governorate TEXT NOT NULL,
    urgency BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed', 'cancelled')),
    client_notes TEXT,
    provider_notes TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_provider FOREIGN KEY (provider_id) REFERENCES public.providers(user_id) ON DELETE CASCADE
);

-- =====================================================
-- 2. ONLINE BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookings_online (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL,
    service_id UUID NOT NULL REFERENCES public.services_online(id) ON DELETE CASCADE,
    project_title TEXT NOT NULL,
    project_description TEXT NOT NULL,
    budget_range TEXT NOT NULL CHECK (budget_range IN ('< 100 TND', '100-500 TND', '500-1000 TND', '> 1000 TND')),
    timeline TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'in_progress', 'completed', 'cancelled')),
    client_notes TEXT,
    provider_notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_provider_online FOREIGN KEY (provider_id) REFERENCES public.providers(user_id) ON DELETE CASCADE
);

-- =====================================================
-- 3. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('booking_created', 'booking_confirmed', 'booking_declined', 'booking_completed', 'booking_cancelled', 'message', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    booking_type TEXT CHECK (booking_type IN ('onsite', 'online')),
    booking_id UUID,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_bookings_onsite_client ON public.bookings_onsite(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_onsite_provider ON public.bookings_onsite(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_onsite_status ON public.bookings_onsite(status);
CREATE INDEX IF NOT EXISTS idx_bookings_onsite_created ON public.bookings_onsite(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_online_client ON public.bookings_online(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_online_provider ON public.bookings_online(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_online_status ON public.bookings_online(status);
CREATE INDEX IF NOT EXISTS idx_bookings_online_created ON public.bookings_online(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.bookings_onsite ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_online ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Bookings Onsite Policies
CREATE POLICY "Users can view their own onsite bookings as client"
    ON public.bookings_onsite FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Providers can view their onsite bookings"
    ON public.bookings_onsite FOR SELECT
    USING (auth.uid() = provider_id);

CREATE POLICY "Clients can create onsite bookings"
    ON public.bookings_onsite FOR INSERT
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Providers can update their onsite bookings"
    ON public.bookings_onsite FOR UPDATE
    USING (auth.uid() = provider_id);

CREATE POLICY "Clients can update their own onsite bookings"
    ON public.bookings_onsite FOR UPDATE
    USING (auth.uid() = client_id);

-- Bookings Online Policies
CREATE POLICY "Users can view their own online bookings as client"
    ON public.bookings_online FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Providers can view their online bookings"
    ON public.bookings_online FOR SELECT
    USING (auth.uid() = provider_id);

CREATE POLICY "Clients can create online bookings"
    ON public.bookings_online FOR INSERT
    WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Providers can update their online bookings"
    ON public.bookings_online FOR UPDATE
    USING (auth.uid() = provider_id);

CREATE POLICY "Clients can update their own online bookings"
    ON public.bookings_online FOR UPDATE
    USING (auth.uid() = client_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- 6. FUNCTIONS FOR AUTOMATIC NOTIFICATIONS
-- =====================================================

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_booking_type TEXT DEFAULT NULL,
    p_booking_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        booking_type,
        booking_id,
        metadata
    ) VALUES (
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_booking_type,
        p_booking_id,
        p_metadata
    ) RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for new onsite booking
CREATE OR REPLACE FUNCTION notify_new_onsite_booking()
RETURNS TRIGGER AS $$
DECLARE
    v_service_title TEXT;
    v_client_name TEXT;
BEGIN
    -- Get service title
    SELECT title INTO v_service_title
    FROM public.services_onsite
    WHERE id = NEW.service_id;
    
    -- Get client name
    SELECT COALESCE(raw_user_meta_data->>'full_name', email)
    INTO v_client_name
    FROM auth.users
    WHERE id = NEW.client_id;
    
    -- Notify provider
    PERFORM create_notification(
        NEW.provider_id,
        'booking_created',
        'New Onsite Booking Request',
        v_client_name || ' has requested your service: ' || v_service_title,
        'onsite',
        NEW.id,
        jsonb_build_object('urgency', NEW.urgency, 'location', NEW.governorate)
    );
    
    -- Notify client (confirmation)
    PERFORM create_notification(
        NEW.client_id,
        'booking_created',
        'Booking Request Sent',
        'Your booking request for "' || v_service_title || '" has been sent to the provider.',
        'onsite',
        NEW.id,
        '{}'::jsonb
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for new online booking
CREATE OR REPLACE FUNCTION notify_new_online_booking()
RETURNS TRIGGER AS $$
DECLARE
    v_service_title TEXT;
    v_client_name TEXT;
BEGIN
    -- Get service title
    SELECT title INTO v_service_title
    FROM public.services_online
    WHERE id = NEW.service_id;
    
    -- Get client name
    SELECT COALESCE(raw_user_meta_data->>'full_name', email)
    INTO v_client_name
    FROM auth.users
    WHERE id = NEW.client_id;
    
    -- Notify provider
    PERFORM create_notification(
        NEW.provider_id,
        'booking_created',
        'New Online Project Request',
        v_client_name || ' has requested your service: ' || NEW.project_title,
        'online',
        NEW.id,
        jsonb_build_object('budget', NEW.budget_range, 'timeline', NEW.timeline)
    );
    
    -- Notify client (confirmation)
    PERFORM create_notification(
        NEW.client_id,
        'booking_created',
        'Project Request Sent',
        'Your project request "' || NEW.project_title || '" has been sent to the provider.',
        'online',
        NEW.id,
        '{}'::jsonb
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for booking status updates (onsite)
CREATE OR REPLACE FUNCTION notify_onsite_booking_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_service_title TEXT;
    v_provider_name TEXT;
    v_notification_title TEXT;
    v_notification_message TEXT;
BEGIN
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- Get service and provider info
    SELECT title INTO v_service_title
    FROM public.services_onsite
    WHERE id = NEW.service_id;
    
    SELECT full_name INTO v_provider_name
    FROM public.providers
    WHERE user_id = NEW.provider_id;
    
    -- Determine notification based on status
    IF NEW.status = 'confirmed' THEN
        v_notification_title := '✅ Booking Confirmed';
        v_notification_message := v_provider_name || ' has confirmed your booking for "' || v_service_title || '".';
    ELSIF NEW.status = 'declined' THEN
        v_notification_title := '❌ Booking Declined';
        v_notification_message := v_provider_name || ' has declined your booking for "' || v_service_title || '".';
    ELSIF NEW.status = 'completed' THEN
        v_notification_title := '✅ Service Completed';
        v_notification_message := 'Your service "' || v_service_title || '" has been marked as completed.';
    ELSIF NEW.status = 'cancelled' THEN
        v_notification_title := '🚫 Booking Cancelled';
        v_notification_message := 'Your booking for "' || v_service_title || '" has been cancelled.';
    ELSE
        RETURN NEW;
    END IF;
    
    -- Notify client
    PERFORM create_notification(
        NEW.client_id,
        'booking_' || NEW.status,
        v_notification_title,
        v_notification_message,
        'onsite',
        NEW.id,
        '{}'::jsonb
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for booking status updates (online)
CREATE OR REPLACE FUNCTION notify_online_booking_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_provider_name TEXT;
    v_notification_title TEXT;
    v_notification_message TEXT;
BEGIN
    IF OLD.status = NEW.status THEN
        RETURN NEW;
    END IF;
    
    -- Get provider info
    SELECT full_name INTO v_provider_name
    FROM public.providers
    WHERE user_id = NEW.provider_id;
    
    -- Determine notification based on status
    IF NEW.status = 'confirmed' THEN
        v_notification_title := '✅ Project Accepted';
        v_notification_message := v_provider_name || ' has accepted your project "' || NEW.project_title || '".';
    ELSIF NEW.status = 'declined' THEN
        v_notification_title := '❌ Project Declined';
        v_notification_message := v_provider_name || ' has declined your project "' || NEW.project_title || '".';
    ELSIF NEW.status = 'in_progress' THEN
        v_notification_title := '🚀 Project Started';
        v_notification_message := 'Work has started on your project "' || NEW.project_title || '".';
    ELSIF NEW.status = 'completed' THEN
        v_notification_title := '✅ Project Completed';
        v_notification_message := 'Your project "' || NEW.project_title || '" has been completed.';
    ELSIF NEW.status = 'cancelled' THEN
        v_notification_title := '🚫 Project Cancelled';
        v_notification_message := 'Your project "' || NEW.project_title || '" has been cancelled.';
    ELSE
        RETURN NEW;
    END IF;
    
    -- Notify client
    PERFORM create_notification(
        NEW.client_id,
        'booking_' || NEW.status,
        v_notification_title,
        v_notification_message,
        'online',
        NEW.id,
        '{}'::jsonb
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. CREATE TRIGGERS
-- =====================================================

-- Trigger for new onsite bookings
DROP TRIGGER IF EXISTS trigger_new_onsite_booking ON public.bookings_onsite;
CREATE TRIGGER trigger_new_onsite_booking
    AFTER INSERT ON public.bookings_onsite
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_onsite_booking();

-- Trigger for new online bookings
DROP TRIGGER IF EXISTS trigger_new_online_booking ON public.bookings_online;
CREATE TRIGGER trigger_new_online_booking
    AFTER INSERT ON public.bookings_online
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_online_booking();

-- Trigger for onsite booking status changes
DROP TRIGGER IF EXISTS trigger_onsite_booking_status_change ON public.bookings_onsite;
CREATE TRIGGER trigger_onsite_booking_status_change
    AFTER UPDATE ON public.bookings_onsite
    FOR EACH ROW
    EXECUTE FUNCTION notify_onsite_booking_status_change();

-- Trigger for online booking status changes
DROP TRIGGER IF EXISTS trigger_online_booking_status_change ON public.bookings_online;
CREATE TRIGGER trigger_online_booking_status_change
    AFTER UPDATE ON public.bookings_online
    FOR EACH ROW
    EXECUTE FUNCTION notify_online_booking_status_change();

-- =====================================================
-- 8. UPDATED_AT TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bookings_onsite_updated_at ON public.bookings_onsite;
CREATE TRIGGER update_bookings_onsite_updated_at
    BEFORE UPDATE ON public.bookings_onsite
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_online_updated_at ON public.bookings_online;
CREATE TRIGGER update_bookings_online_updated_at
    BEFORE UPDATE ON public.bookings_online
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run this script in Supabase SQL Editor
-- 2. Verify all tables are created successfully
-- 3. Test RLS policies with different user roles
-- =====================================================
