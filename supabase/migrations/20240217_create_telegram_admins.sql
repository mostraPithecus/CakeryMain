-- Drop existing objects if they exist
DROP TRIGGER IF EXISTS set_updated_at ON public.telegram_admins;
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP TABLE IF EXISTS public.telegram_admins;

-- Create telegram_admins table
CREATE TABLE public.telegram_admins (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    telegram_id text NOT NULL UNIQUE,
    username text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.telegram_admins ENABLE ROW LEVEL SECURITY;

-- Allow public read and write
CREATE POLICY "Allow public access to telegram_admins" 
    ON public.telegram_admins 
    TO anon
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.telegram_admins
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial admin
INSERT INTO public.telegram_admins (telegram_id, username, is_active)
VALUES ('537190136', 'admin', true)
ON CONFLICT (telegram_id) 
DO UPDATE SET 
    username = EXCLUDED.username,
    is_active = EXCLUDED.is_active;
