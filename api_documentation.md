# Weather and AQI API Documentation

## Base URL
```
https://healthtrip-assignment-kzyx.onrender.com/weather
```

## Authentication
All API requests require authentication using cookies for session handling.

---

## Endpoints

### 1. Get Weather Data
**Endpoint:**
```
GET /weather/{city}
```
**Description:**
Fetches weather data for the specified city.

**Parameters:**
- `city` (string) - The name of the city (e.g., `Delhi`).

**Response:**
```json
{
  "city": "Delhi",
  "country": "India",
  "forecast": [
    {
      "date": "2025-02-21",
      "avgTemp": 25,
      "condition": "Clear",
      "icon": "https://example.com/icon.png",
      "maxTemp": 30,
      "minTemp": 20,
      "humidity": 60,
      "windSpeed": 10
    },
    ...
  ]
}
```

**Errors:**
- `400 Bad Request` - Invalid city name
- `404 Not Found` - City not found
- `500 Internal Server Error` - Server error

---

### 2. Get AQI Data
**Endpoint:**
```
GET /aqi/{city}
```
**Description:**
Fetches Air Quality Index (AQI) data for the specified city.

**Parameters:**
- `city` (string) - The name of the city (e.g., `Delhi`).

**Response:**
```json
{
  "city": "Delhi",
  "aqi": 120,
  "time": "2025-02-21T10:00:00Z",
  "dominantPollutant": "PM2.5"
}
```

**Errors:**
- `400 Bad Request` - Invalid city name
- `404 Not Found` - City not found
- `500 Internal Server Error` - Server error

---

## Admin APIs

### 1. Get All Users
**Endpoint:**
```
GET /admin/
```
**Description:**
Retrieves a list of all registered users.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "status": "inactive"
  }
]
```

**Errors:**
- `403 Forbidden` - Unauthorized access
- `500 Internal Server Error` - Server error

---

### 2. Toggle User Status
**Endpoint:**
```
POST /admin/users/{userId}
```
**Description:**
Toggles user status.

**Parameters:**
- `userId` (integer) - The ID of the user to change status.

**Request Body:**
```json
{
  "userId": 1
}
```

**Response:**
```json
{
  "message": "User successfully deactivated."
}
```

**Errors:**
- `400 Bad Request` - Invalid user ID
- `403 Forbidden` - Unauthorized access
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

## Notes
- The API supports `CORS` for cross-origin requests.
- Ensure cookies are enabled for authentication.
- This API runs on Render free instance which can spin down with inactivity, delaying requests by 50 seconds or more.


