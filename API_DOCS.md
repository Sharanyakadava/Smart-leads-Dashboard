# 📡 API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### POST `/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "sales"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "John Doe", "email": "...", "role": "sales" }
  }
}
```

---

### POST `/auth/login`
Log in and receive a JWT.

**Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "token": "<jwt>", "user": { ... } }
}
```

---

### GET `/auth/profile`
Get the authenticated user's profile. **Protected.**

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "...", "email": "...", "role": "admin", "createdAt": "..." }
}
```

---

## 📋 Leads Endpoints

All leads routes are **protected**.

### GET `/leads`
Get paginated leads with optional filters.

**Query Params:**

| Param    | Type   | Description                        | Example          |
|----------|--------|------------------------------------|------------------|
| `status` | string | Filter by status                   | `Qualified`      |
| `source` | string | Filter by source                   | `Instagram`      |
| `search` | string | Search by name or email            | `Rahul`          |
| `sort`   | string | `latest` or `oldest`               | `latest`         |
| `page`   | number | Page number (default: 1)           | `2`              |
| `limit`  | number | Records per page (default: 10, max: 50) | `10`        |

**Response 200:**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [ { "_id": "...", "name": "...", "email": "...", "status": "New", "source": "Website", "createdAt": "..." } ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET `/leads/:id`
Get a single lead by ID.

**Response 200:**
```json
{
  "success": true,
  "data": { "_id": "...", "name": "...", "status": "Qualified", ... }
}
```

---

### POST `/leads`
Create a new lead. **Admin only.**

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Met at conference"
}
```

**Response 201:**
```json
{ "success": true, "message": "Lead created successfully", "data": { ... } }
```

---

### PUT `/leads/:id`
Update a lead.
- **Admin** — can update all fields.
- **Sales** — can only update `status`.

**Body (Admin):**
```json
{ "name": "Updated Name", "status": "Qualified", "source": "Referral" }
```

**Body (Sales):**
```json
{ "status": "Contacted" }
```

**Response 200:**
```json
{ "success": true, "message": "Lead updated successfully", "data": { ... } }
```

---

### DELETE `/leads/:id`
Delete a lead by ID. **Admin only.**

**Response 200:**
```json
{ "success": true, "message": "Lead deleted successfully", "data": null }
```

---

### GET `/leads/export`
Export leads as CSV. **Admin only.**

Supports the same query params as `GET /leads` (except `page`, `limit`, `sort`).

**Response:** `text/csv` file download — `leads.csv`

---

## ❗ Error Format

All errors follow this shape:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": ["field-level validation errors (optional)"]
}
```

**Common Status Codes:**

| Code | Meaning              |
|------|----------------------|
| 200  | Success              |
| 201  | Created              |
| 400  | Bad request          |
| 401  | Unauthorized         |
| 403  | Forbidden            |
| 404  | Not found            |
| 409  | Conflict (duplicate) |
| 422  | Validation error     |
| 500  | Server error         |
