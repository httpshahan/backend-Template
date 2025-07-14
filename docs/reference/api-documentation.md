# API Documentation

Complete API reference for the Backend Template.

## Base URL

- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this structure:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    // Only for paginated endpoints
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## HTTP Status Codes

| Code | Description                             |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid request data      |
| 401  | Unauthorized - Authentication required  |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Resource already exists      |
| 422  | Unprocessable Entity - Validation error |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error - Server error    |

## Endpoints

### Health Check

#### GET /health

Check if the API server is running.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2023-07-14T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

#### GET /health/ready

Check if the API server and database are ready.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2023-07-14T10:30:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## Authentication Endpoints

### Register User

#### POST /auth/register

Register a new user account.

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**

- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters, at least one uppercase, one lowercase, one number, one special character

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-07-14T10:30:00.000Z"
    },
    "token": "jwt-token-string"
  }
}
```

### Login User

#### POST /auth/login

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-string",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "lastLoginAt": "2023-07-14T10:30:00.000Z"
    },
    "token": "jwt-token-string"
  }
}
```

### Get Profile

#### GET /auth/profile

Get current user's profile information.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-07-14T10:30:00.000Z",
      "updatedAt": "2023-07-14T10:30:00.000Z"
    }
  }
}
```

### Update Profile

#### PUT /auth/profile

Update current user's profile information.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "role": "user",
      "updatedAt": "2023-07-14T10:35:00.000Z"
    }
  }
}
```

### Change Password

#### PUT /auth/change-password

Change current user's password.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Forgot Password

#### POST /auth/forgot-password

Request password reset link.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

### Reset Password

#### POST /auth/reset-password

Reset password using reset token.

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## User Management Endpoints

### List Users

#### GET /users

Get list of users (Admin only).

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in firstName, lastName, email
- `role` (optional): Filter by role (user, admin)
- `isActive` (optional): Filter by active status (true, false)
- `sortBy` (optional): Sort field (createdAt, firstName, lastName, email)
- `sortOrder` (optional): Sort order (asc, desc)

**Example Request:**

```
GET /users?page=1&limit=20&search=john&role=user&sortBy=createdAt&sortOrder=desc
```

**Response (200):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "uuid-string",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": true,
        "createdAt": "2023-07-14T10:30:00.000Z"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Get User by ID

#### GET /users/:id

Get specific user by ID (Admin only).

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-07-14T10:30:00.000Z",
      "updatedAt": "2023-07-14T10:30:00.000Z"
    }
  }
}
```

### Update User

#### PUT /users/:id

Update user information (Admin only).

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "role": "admin",
  "isActive": true
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "firstName": "John",
      "lastName": "Smith",
      "role": "admin",
      "isActive": true,
      "updatedAt": "2023-07-14T10:35:00.000Z"
    }
  }
}
```

### Delete User

#### DELETE /users/:id

Soft delete user (Admin only).

**Headers:**

```
Authorization: Bearer <admin-jwt-token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Handling

### Validation Errors

When request data fails validation:

**Response (422):**

```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters long"
      }
    ]
  }
}
```

### Authentication Errors

When token is missing or invalid:

**Response (401):**

```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "error": {
    "code": "NO_TOKEN"
  }
}
```

**Response (401):**

```json
{
  "success": false,
  "message": "Invalid token.",
  "error": {
    "code": "INVALID_TOKEN"
  }
}
```

### Authorization Errors

When user lacks required permissions:

**Response (403):**

```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions.",
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS"
  }
}
```

### Rate Limiting

When rate limit is exceeded:

**Response (429):**

```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 900
  }
}
```

---

## Code Examples

### JavaScript/Node.js (axios)

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api/v1';

// Register user
async function registerUser() {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'SecurePass123!'
    });

    console.log('User registered:', response.data);
    return response.data.data.token;
  } catch (error) {
    console.error('Registration failed:', error.response.data);
  }
}

// Login and get token
async function loginUser() {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'john@example.com',
      password: 'SecurePass123!'
    });

    return response.data.data.token;
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
}

// Get profile with authentication
async function getProfile(token) {
  try {
    const response = await axios.get(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Profile:', response.data.data.user);
  } catch (error) {
    console.error('Failed to get profile:', error.response.data);
  }
}

// Usage
async function main() {
  const token = await loginUser();
  if (token) {
    await getProfile(token);
  }
}
```

### Python (requests)

```python
import requests
import json

API_BASE = 'http://localhost:3000/api/v1'

def register_user():
    data = {
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'john@example.com',
        'password': 'SecurePass123!'
    }

    response = requests.post(f'{API_BASE}/auth/register', json=data)

    if response.status_code == 201:
        return response.json()['data']['token']
    else:
        print('Registration failed:', response.json())
        return None

def login_user():
    data = {
        'email': 'john@example.com',
        'password': 'SecurePass123!'
    }

    response = requests.post(f'{API_BASE}/auth/login', json=data)

    if response.status_code == 200:
        return response.json()['data']['token']
    else:
        print('Login failed:', response.json())
        return None

def get_profile(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{API_BASE}/auth/profile', headers=headers)

    if response.status_code == 200:
        print('Profile:', response.json()['data']['user'])
    else:
        print('Failed to get profile:', response.json())

# Usage
token = login_user()
if token:
    get_profile(token)
```

### curl Commands

```bash
# Register user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Login user
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Get profile (replace TOKEN with actual JWT token)
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer TOKEN"

# List users (admin only)
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Testing

Use the provided `api-tests.http` file with VS Code REST Client extension for interactive testing:

1. Open `api-tests.http` in VS Code
2. Install the REST Client extension
3. Click "Send Request" above each HTTP request
4. View responses in the adjacent panel

## Rate Limiting

- **Default limit**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 attempts per 15 minutes per IP
- **Headers returned**:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

## Pagination

Paginated endpoints support these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## CORS Configuration

The API supports CORS for cross-origin requests. Configure allowed origins in `config.json`:

```json
{
  "development": {
    "security": {
      "corsOrigins": ["http://localhost:3000", "http://localhost:3001", "https://yourdomain.com"]
    }
  }
}
```

---

For more information about the backend implementation, see the [Setup Guide](../guides/setup-guide.md) and [Configuration Guide](../guides/configuration-guide.md).
