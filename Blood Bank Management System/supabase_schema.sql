-- Phase 1: Database Setup
-- Run this SQL in your Supabase SQL Editor

-- 1. Users Table (inherits from auth.users optionally, or managed logically)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'donor', 'patient')),
    phone VARCHAR(15) UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Donors Table
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blood_type VARCHAR(5) NOT NULL,
    age INT NOT NULL CHECK (age >= 18 AND age <= 65),
    weight INT NOT NULL CHECK (weight >= 50),
    last_donation TIMESTAMP WITH TIME ZONE,
    next_eligible_date TIMESTAMP WITH TIME ZONE,
    is_eligible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Inventory Table
CREATE TABLE blood_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blood_type VARCHAR(5) NOT NULL,
    units INT NOT NULL CHECK (units > 0),
    collection_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'sufficient' CHECK (status IN ('sufficient', 'low', 'critical', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Donations Table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    units INT NOT NULL CHECK (units IN (1, 2)),
    test_status VARCHAR(50) DEFAULT 'pending' CHECK (test_status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Patients Table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blood_type VARCHAR(5) NOT NULL,
    medical_condition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Requests Table
CREATE TABLE blood_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    blood_type VARCHAR(5) NOT NULL,
    units INT NOT NULL CHECK (units > 0 AND units <= 10),
    urgency VARCHAR(50) NOT NULL CHECK (urgency IN ('normal', 'urgent', 'critical')),
    condition TEXT NOT NULL,
    required_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'fulfilled')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Staff Table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    shift VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security (RLS) Enable
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Note: Specific Policies will be applied per feature in upcoming phases,
-- but the tables are fully ready per Phase 1 instructions.