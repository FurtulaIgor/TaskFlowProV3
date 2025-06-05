/*
  # Add admin_actions table and policies

  1. New Tables
    - `admin_actions`
      - `id` (uuid, primary key)
      - `admin_id` (uuid, foreign key to auth.users)
      - `action_type` (text)
      - `target_user_id` (uuid, foreign key to auth.users)
      - `notes` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Create admin_actions table
CREATE TABLE IF NOT EXISTS admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users NOT NULL,
  action_type text NOT NULL,
  target_user_id uuid REFERENCES auth.users NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "admins_can_manage_actions"
ON admin_actions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Create index for better performance
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target_user_id ON admin_actions(target_user_id);