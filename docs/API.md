# API Documentation

## Authentication

### Login
```typescript
POST /api/auth/login
```
Request body:
```json
{
  "email": "string",
  "password": "string"
}
```
Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

### Register
```typescript
POST /api/auth/register
```
Request body:
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

## User Management

### Get User Profile
```typescript
GET /api/user/profile
```
Headers:
```
Authorization: Bearer <token>
```

### Update User Profile
```typescript
PUT /api/user/profile
```
Headers:
```
Authorization: Bearer <token>
```
Request body:
```json
{
  "name": "string",
  "preferences": {
    "theme": "light" | "dark",
    "notifications": boolean
  }
}
```

## Error Responses

All API endpoints may return the following error responses:

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Internal Server Error

Error response format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": object
  }
}
``` 