/*
  # Insert Test Data

  1. Changes
    - Insert 1 admin user role
    - Insert 3 test clients
    
  2. Test Data
    - Admin user with role
    - Three clients with different profiles
*/

-- Insert admin role for the first user
INSERT INTO user_roles (user_id, role)
VALUES 
  ('a73990b4-8aca-4ebd-becd-dcccd3a2809d', 'admin');

-- Insert test clients
INSERT INTO clients (user_id, name, email, phone, notes)
VALUES
  (
    'a73990b4-8aca-4ebd-becd-dcccd3a2809d',
    'John Smith',
    'john.smith@example.com',
    '+1-555-123-4567',
    'Regular customer, prefers afternoon appointments'
  ),
  (
    'a73990b4-8aca-4ebd-becd-dcccd3a2809d',
    'Sarah Johnson',
    'sarah.j@example.com',
    '+1-555-234-5678',
    'New client, interested in premium services'
  ),
  (
    'a73990b4-8aca-4ebd-becd-dcccd3a2809d',
    'Michael Brown',
    'michael.b@example.com',
    '+1-555-345-6789',
    'Prefers morning appointments, allergic to certain products'
  );