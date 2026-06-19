-- Seed Data for BloodLink
-- Run this in Supabase SQL Editor AFTER running the schema.sql

-- 1. Sample Blood Inventory
INSERT INTO blood_inventory (blood_type, units, collection_date, expiry_date, status)
VALUES 
('O+',  50, NOW() - INTERVAL '5 days', NOW() + INTERVAL '30 days', 'sufficient'),
('A+',  30, NOW() - INTERVAL '10 days', NOW() + INTERVAL '25 days', 'sufficient'),
('B-',  4,  NOW() - INTERVAL '20 days', NOW() + INTERVAL '15 days', 'low'),
('AB-', 2,  NOW() - INTERVAL '25 days', NOW() + INTERVAL '10 days', 'critical'),
('O-',  8,  NOW() - INTERVAL '2 days',  NOW() + INTERVAL '33 days', 'low');

-- 2. Test Users for Login (Using 'users' table)
-- IMPORTANT: These use a hardcoded UUID or let Supabase generate them.
-- For simple testing, we insert directly into users table.
INSERT INTO users (name, email, role, phone)
VALUES 
('Super Admin', 'admin@bloodlink.com',  'admin',   '03001111111'),
('Staff Nurse', 'staff@bloodlink.com',  'staff',   '03002222222'),
('Ali Raza',    'donor@example.com',    'donor',   '03003333333'),
('Ahmad Khan',  'patient@example.com',  'patient', '03004444444');

-- 3. Sample Donors/Patients linked to above users is complex via SQL manual insert due to UUIDs,
-- but for UI testing, the 'users' table entry is enough for Login to work.
