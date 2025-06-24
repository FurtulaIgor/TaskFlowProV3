/*
  # Update RLS policies for admin access

  1. Changes
    - Update RLS policies for clients, services, appointments, and invoices tables
    - Allow admins to view all data while regular users see only their own data
    - Fix admin_actions table to only allow admins to view action logs
    - Use existing is_admin() function for secure admin role checking

  2. Security
    - Maintain data isolation for regular users
    - Grant full visibility to administrators
    - Secure admin action logs
*/

-- Drop existing SELECT policies for main tables
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
DROP POLICY IF EXISTS "Users can view their own services" ON services;
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;
DROP POLICY IF EXISTS "authenticated_users_can_read_admin_actions" ON admin_actions;

-- Create new SELECT policies for clients table
CREATE POLICY "users_can_view_own_clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admins_can_view_all_clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create new SELECT policies for services table
CREATE POLICY "users_can_view_own_services"
  ON services
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admins_can_view_all_services"
  ON services
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create new SELECT policies for appointments table
CREATE POLICY "users_can_view_own_appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admins_can_view_all_appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create new SELECT policies for invoices table
CREATE POLICY "users_can_view_own_invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admins_can_view_all_invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create new SELECT policy for admin_actions table (only admins can view)
CREATE POLICY "admins_can_view_admin_actions"
  ON admin_actions
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));