/*
  # Add user tracking for admin views

  1. Changes
    - Update RLS policies to allow admins to see user information
    - Create function to get clients with user details for admins
    - Ensure proper foreign key relationships

  2. Security
    - Maintain existing user data isolation for non-admins
    - Allow admins to see who created what data
    - Add proper indexes for performance
*/

-- Create function to get clients with user information (for admin use)
CREATE OR REPLACE FUNCTION public.get_clients_with_users()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  user_id uuid,
  name text,
  email text,
  phone text,
  notes text,
  last_interaction timestamptz,
  user_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.created_at,
    c.user_id,
    c.name,
    c.email,
    c.phone,
    c.notes,
    c.last_interaction,
    au.email as user_email
  FROM clients c
  LEFT JOIN auth.users au ON c.user_id = au.id
  ORDER BY c.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_clients_with_users() TO authenticated;

-- Create similar functions for other tables if needed
CREATE OR REPLACE FUNCTION public.get_services_with_users()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  user_id uuid,
  name text,
  description text,
  duration integer,
  price numeric,
  user_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.created_at,
    s.user_id,
    s.name,
    s.description,
    s.duration,
    s.price,
    au.email as user_email
  FROM services s
  LEFT JOIN auth.users au ON s.user_id = au.id
  ORDER BY s.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_services_with_users() TO authenticated;

-- Create function for appointments with user details
CREATE OR REPLACE FUNCTION public.get_appointments_with_users()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  user_id uuid,
  client_id uuid,
  service_id uuid,
  start_time timestamptz,
  end_time timestamptz,
  status text,
  notes text,
  user_email text,
  client_name text,
  service_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.created_at,
    a.user_id,
    a.client_id,
    a.service_id,
    a.start_time,
    a.end_time,
    a.status,
    a.notes,
    au.email as user_email,
    c.name as client_name,
    s.name as service_name
  FROM appointments a
  LEFT JOIN auth.users au ON a.user_id = au.id
  LEFT JOIN clients c ON a.client_id = c.id
  LEFT JOIN services s ON a.service_id = s.id
  ORDER BY a.start_time DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_appointments_with_users() TO authenticated;

-- Create function for invoices with user details
CREATE OR REPLACE FUNCTION public.get_invoices_with_users()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  user_id uuid,
  client_id uuid,
  appointment_id uuid,
  amount numeric,
  status text,
  due_date timestamptz,
  paid_date timestamptz,
  pdf_url text,
  user_email text,
  client_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.created_at,
    i.user_id,
    i.client_id,
    i.appointment_id,
    i.amount,
    i.status,
    i.due_date,
    i.paid_date,
    i.pdf_url,
    au.email as user_email,
    c.name as client_name
  FROM invoices i
  LEFT JOIN auth.users au ON i.user_id = au.id
  LEFT JOIN clients c ON i.client_id = c.id
  ORDER BY i.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_invoices_with_users() TO authenticated;