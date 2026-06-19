# 🚀 Postman Quick Reference - GET vs PUT

## Installation (3 Options)

### 1️⃣ Desktop App (Best)
- Download: https://www.postman.com/downloads/
- Install → Sign up (free) → Done

### 2️⃣ VS Code Extension
- Ctrl+Shift+X → Search "Postman" → Install

### 3️⃣ Web Browser
- Go: https://web.postman.co → Sign up (free)

---

## Import Collection

1. Open Postman
2. Click **Import** (top-left)
3. Choose `Postman_Donors_API_Tests.json` file
4. Click **Import**

---

## GET vs PUT at a Glance

```
┌─────────────────────────────────────────────┐
│               GET REQUEST                   │
├─────────────────────────────────────────────┤
│ Purpose: FETCH/READ DATA                    │
│ ✅ Safe (doesn't modify)                    │
│ ❌ No request body                          │
│ Used: Retrieve donors, check status         │
│ Status: 200 (OK), 404 (Not Found)          │
└─────────────────────────────────────────────┘

Example:
  GET http://localhost:5000/api/donors
  GET http://localhost:5000/api/donors/123
```

```
┌─────────────────────────────────────────────┐
│               PUT REQUEST                   │
├─────────────────────────────────────────────┤
│ Purpose: UPDATE/MODIFY DATA                 │
│ ❌ Modifies data (not safe)                 │
│ ✅ Requires JSON body                       │
│ Used: Update donor info, change blood type  │
│ Status: 200 (OK), 400 (Bad Request)        │
└─────────────────────────────────────────────┘

Example:
  PUT http://localhost:5000/api/donors/123
  Body: {
    "blood_type": "O+",
    "age": 30
  }
```

---

## API Endpoints

| Method | Endpoint | What It Does |
|--------|----------|--------------|
| **GET** | `/api/donors` | 📋 Get all donors |
| **GET** | `/api/donors/:id` | 👤 Get one donor |
| **GET** | `/api/donors/me` | 🙋 Get your profile |
| **PUT** | `/api/donors/:id` | ✏️ Update donor info |
| **POST** | `/api/donors` | ➕ Create new donor |
| **DELETE** | `/api/donors/:id` | 🗑️ Delete donor |

---

## Step-by-Step: First Test

### 1. Open Postman & Import
```
File → Import → Select JSON file → Import ✅
```

### 2. Set Variables
```
Click Eye Icon (top-right)
↓
Click Edit
↓
Set: base_url = http://localhost:5000
Set: auth_token = YOUR_JWT_TOKEN
Set: donor_id = actual-uuid
```

### 3. Run GET Request
```
Select: "1. GET - Retrieve All Donors"
↓
Click SEND button
↓
See response in bottom panel ✅
```

### 4. Run PUT Request
```
Select: "4. PUT - Update Donor Information"
↓
Change body values (name, phone, etc.)
↓
Click SEND button
↓
Check response for "success": true ✅
```

---

## Get Authentication Token

```
1. Create new request:
   Method: POST
   URL: http://localhost:5000/api/auth/login
   
2. Body (JSON):
   {
     "email": "admin@bloodbank.com",
     "password": "password123"
   }
   
3. Click SEND
4. Copy token from response
5. Paste in Variables section
```

---

## Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| **200** | ✅ Success | Data retrieved or updated |
| **201** | ✅ Created | New donor registered |
| **400** | ❌ Bad Request | Invalid JSON body |
| **401** | ❌ Unauthorized | Missing/invalid token |
| **404** | ❌ Not Found | Wrong donor ID |
| **500** | ❌ Server Error | Backend issue |

---

## Troubleshooting

### 🔴 401 Unauthorized
```
❌ Problem: Invalid auth token
✅ Fix: Update auth_token variable with fresh token
```

### 🔴 404 Not Found
```
❌ Problem: Wrong donor ID
✅ Fix: Get actual ID from GET /api/donors response
```

### 🔴 400 Bad Request
```
❌ Problem: Invalid JSON
✅ Fix: Check JSON syntax - use commas, quotes correctly
```

### 🔴 500 Server Error
```
❌ Problem: Backend crashed
✅ Fix: Check backend logs, restart server
```

---

## Example Requests

### GET All Donors
```bash
GET /api/donors
Authorization: Bearer token123
Content-Type: application/json
```

### GET Single Donor
```bash
GET /api/donors/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer token123
```

### PUT Update Donor
```bash
PUT /api/donors/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer token123
Content-Type: application/json

Body:
{
  "name": "Ahmed Hassan",
  "blood_type": "O+",
  "age": 30,
  "weight": 75
}
```

---

## Headers Needed

Every request needs:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
```

---

## Files You Have

✅ `Postman_Donors_API_Tests.json` - Import this in Postman
✅ `POSTMAN_TESTING_GUIDE.md` - Full detailed guide
✅ `POSTMAN_QUICK_REFERENCE.md` - This file (quick reference)

---

## Next Steps

1. ✅ Download Postman
2. ✅ Import JSON collection
3. ✅ Get auth token from login
4. ✅ Set variables
5. ✅ Run GET request
6. ✅ Run PUT request
7. ✅ Check responses

---

**Time to test:** 5-10 minutes  
**Difficulty:** Beginner-friendly  
**Need help?** Check POSTMAN_TESTING_GUIDE.md
