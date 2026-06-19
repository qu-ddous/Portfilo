# 🩸 Blood Bank API Testing Guide - GET vs PUT Operations

## 📌 Quick Overview

This guide explains how to test the **Donors API** using **Postman** with a focus on **GET** and **PUT** operations.

---

## 🔄 GET vs PUT - Key Differences

### **GET Request** (Read/Retrieve Data)
```
Purpose: Fetch/Retrieve data from the server
Safe: YES - Does not modify data
Idempotent: YES - Multiple calls return same result
Body: NO - Should not include request body
Cache: YES - Can be cached by browsers
Status Codes: 200 (OK), 404 (Not Found), 401 (Unauthorized)
```

**Use Cases:**
- Retrieve all donors
- Get specific donor details
- Get current user's profile
- Fetch donor eligibility status

**Example:**
```bash
GET /api/donors
GET /api/donors/123
GET /api/donors/me
```

---

### **PUT Request** (Update/Modify Data)
```
Purpose: Update existing data on the server
Safe: NO - Modifies data
Idempotent: YES - Multiple identical calls have same effect
Body: YES - Contains data to update
Cache: NO - Should not be cached
Status Codes: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found)
```

**Use Cases:**
- Update donor information
- Change blood type
- Update eligibility status
- Modify donor contact info

**Example:**
```bash
PUT /api/donors/123
Body: { "blood_type": "O+", "age": 30 }
```

---

## 📊 Comparison Table

| Feature | GET | PUT |
|---------|-----|-----|
| **Data Retrieval** | ✅ Yes | ❌ No |
| **Data Modification** | ❌ No | ✅ Yes |
| **Request Body** | ❌ None | ✅ JSON/Data |
| **Idempotent** | ✅ Yes | ✅ Yes |
| **Safe Operation** | ✅ Yes | ❌ No |
| **Cacheable** | ✅ Yes | ❌ No |
| **Database Query** | SELECT | UPDATE |
| **Example** | Fetch donor list | Update donor info |

---

## 🚀 How to Use Postman - Step by Step

### **Step 1: Download & Install Postman**

#### Option A: Desktop Application (Recommended)
1. Visit: https://www.postman.com/downloads/
2. Download for your OS (Windows, Mac, Linux)
3. Install the application
4. Create a free account or skip login

#### Option B: Postman Extension for VS Code
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Postman"
4. Install "Postman for Visual Studio Code" by Postman

#### Option C: Web Browser Version
1. Visit: https://web.postman.co
2. Login with free account
3. No installation needed

---

### **Step 2: Import the Collection**

#### Method A: Import JSON File
1. Open Postman Desktop App
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `Postman_Donors_API_Tests.json`
5. Click **Import**

#### Method B: Paste Raw JSON
1. Click **Import** → **Raw text** tab
2. Copy entire JSON from the file
3. Paste it
4. Click **Import**

---

### **Step 3: Set Up Variables**

In Postman, update these variables:

```json
{
  "base_url": "http://localhost:5000",
  "auth_token": "YOUR_JWT_TOKEN_HERE",
  "donor_id": "actual-donor-id-uuid"
}
```

**Where to set variables:**
1. Click the **eye icon** (top right)
2. Click **Edit** next to collection name
3. Go to **Variables** tab
4. Update values

---

## 📝 Testing Workflow

### **Test 1: GET All Donors**

```
Method: GET
URL: {{base_url}}/api/donors
Headers: 
  - Authorization: Bearer {{auth_token}}
  - Content-Type: application/json

Expected Response (200 OK):
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "user_id": "uuid-user",
      "blood_type": "O+",
      "age": 28,
      "weight": 70,
      "is_eligible": true,
      "name": "Ahmed Hassan",
      "email": "ahmed@example.com",
      "phone": "+92-300-123456"
    }
  ]
}
```

---

### **Test 2: GET Single Donor**

```
Method: GET
URL: {{base_url}}/api/donors/{{donor_id}}
Headers: 
  - Authorization: Bearer {{auth_token}}
  - Content-Type: application/json

Expected Response (200 OK):
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "blood_type": "O+",
    "age": 28,
    "weight": 70,
    "is_eligible": true,
    "name": "Ahmed Hassan",
    "email": "ahmed@example.com",
    "phone": "+92-300-123456"
  }
}
```

---

### **Test 3: GET Current User's Profile**

```
Method: GET
URL: {{base_url}}/api/donors/me
Headers: 
  - Authorization: Bearer {{auth_token}}
  - Content-Type: application/json

Response: Your own donor profile
```

---

### **Test 4: PUT - Update Donor Information**

```
Method: PUT
URL: {{base_url}}/api/donors/{{donor_id}}
Headers: 
  - Authorization: Bearer {{auth_token}}
  - Content-Type: application/json

Request Body:
{
  "name": "Ahmed Hassan",
  "phone": "+92-300-9876543",
  "blood_type": "O+",
  "age": 30,
  "weight": 75,
  "is_eligible": true
}

Expected Response (200 OK):
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "blood_type": "O+",
    "age": 30,
    "weight": 75,
    "is_eligible": true
  },
  "message": "Donor updated successfully"
}
```

---

### **Test 5: PUT - Partial Update (Only Blood Type)**

```
Method: PUT
URL: {{base_url}}/api/donors/{{donor_id}}

Request Body:
{
  "blood_type": "AB+"
}

Note: PUT allows partial updates - only send fields you want to change
```

---

### **Test 6: PUT - Update Eligibility**

```
Method: PUT
URL: {{base_url}}/api/donors/{{donor_id}}

Request Body:
{
  "is_eligible": false
}

Use Case: Mark donor ineligible after health checkup
```

---

## 🔐 Authentication Setup

### Get Your Auth Token:

1. **Login Request:**
```
Method: POST
URL: {{base_url}}/api/auth/login
Body: {
  "email": "your@email.com",
  "password": "your-password"
}
```

2. **Copy the token** from response
3. **Paste in Variables:** `auth_token = "jwt-token-here"`

---

## ✅ Postman Testing Checklist

### For GET Requests:
- [ ] Authorization header included
- [ ] Correct endpoint URL
- [ ] Valid donor ID in path
- [ ] Response status is 200
- [ ] Response body contains expected data
- [ ] No request body sent

### For PUT Requests:
- [ ] Authorization header included
- [ ] Correct endpoint URL
- [ ] Valid donor ID in path
- [ ] Request body is valid JSON
- [ ] Content-Type is "application/json"
- [ ] Response status is 200
- [ ] Updated data matches request

### Common Errors:
| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Missing/invalid token | Update auth_token variable |
| 404 Not Found | Wrong donor ID | Verify donor_id variable |
| 400 Bad Request | Invalid JSON | Check request body syntax |
| 500 Server Error | Server issue | Check backend logs |

---

## 🎯 Real-World Usage Scenarios

### Scenario 1: Check All Available Donors
```
1. Use: GET /api/donors
2. Purpose: See which donors are available
3. Filter by blood type in response
```

### Scenario 2: Update Donor After Health Checkup
```
1. Use: GET /api/donors/{id}  → Get current data
2. Use: PUT /api/donors/{id}  → Update eligibility
3. Example: Mark as ineligible if health issues found
```

### Scenario 3: Change Blood Type Record
```
1. Use: PUT /api/donors/{id}
2. Body: { "blood_type": "O+" }
3. Update if donor reports wrong type
```

---

## 💡 Pro Tips

1. **Use Collections**: Keep all related tests organized
2. **Use Variables**: Don't hardcode values
3. **Add Pre-request Scripts**: Set up data before tests
4. **Add Tests Scripts**: Validate responses automatically
5. **Use Environments**: Different settings for dev/prod
6. **Save Responses**: Document API behavior
7. **Monitor Network**: Check actual requests/responses

---

## 🔗 Important Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---|
| `/api/donors` | GET | Get all donors | ✅ Yes |
| `/api/donors/{id}` | GET | Get specific donor | ✅ Yes |
| `/api/donors/me` | GET | Get current donor | ✅ Yes |
| `/api/donors/{id}` | PUT | Update donor | ✅ Yes |
| `/api/donors` | POST | Create donor | ✅ Yes |
| `/api/donors/{id}` | DELETE | Delete donor | ✅ Yes |

---

## 📚 Resources

- **Postman Docs:** https://learning.postman.com/
- **API Best Practices:** https://restfulapi.net/
- **HTTP Methods:** https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- **JWT Authentication:** https://jwt.io/

---

**Created:** May 18, 2026  
**Project:** Blood Bank Management System  
**API Component:** Donors Endpoint Testing
