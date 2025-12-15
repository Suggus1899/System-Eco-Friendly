# API Documentation - EcoGestión Local

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "zone": "Centro"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "zone": "Centro",
    "points": 0
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "zone": "Centro",
    "points": 150
  }
}
```

## Materials

### Get All Materials
**GET** `/materials`

**Query Parameters:**
- `category` (optional): Filter by category (organico, plastico, vidrio, papel, electronico)
- `search` (optional): Search by name or description

**Response:**
```json
[
  {
    "id": 1,
    "name": "Botella de Plástico PET",
    "category": "plastico",
    "description": "Botellas de bebidas...",
    "disposal_instructions": "Enjuagar antes de depositar...",
    "recyclable": true,
    "image_url": "/images/materials/plastic-bottle.png"
  }
]
```

### Get Material by ID
**GET** `/materials/:id`

### Create Material (Admin only)
**POST** `/materials`

**Request Body:**
```json
{
  "name": "Material Name",
  "category": "plastico",
  "description": "Description",
  "disposal_instructions": "Instructions",
  "recyclable": true
}
```

### Update Material (Admin only)
**PUT** `/materials/:id`

### Delete Material (Admin only)
**DELETE** `/materials/:id`

## Recycling Centers

### Get All Centers
**GET** `/centers`

**Query Parameters:**
- `status` (optional): Filter by status (active, inactive, pending)

### Get Nearby Centers
**GET** `/centers/nearby`

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `radius` (optional): Search radius in km (default: 10)

**Response:**
```json
[
  {
    "id": 1,
    "name": "La Recuperadora Guárico 2016 C.A.",
    "address": "Av. Principal, Calabozo",
    "latitude": 8.9247,
    "longitude": -67.4297,
    "phone": "+58-246-8710000",
    "email": "contacto@recuperadora.com",
    "accepted_materials": ["plastico", "vidrio", "papel"],
    "hours_operation": "Lun-Vie: 8:00-17:00",
    "status": "active",
    "distance": 2.5
  }
]
```

### Create Center (Admin only)
**POST** `/centers`

### Update Center (Admin only)
**PUT** `/centers/:id`

### Delete Center (Admin only)
**DELETE** `/centers/:id`

## Schedules

### Get All Schedules
**GET** `/schedules`

**Query Parameters:**
- `zone` (optional): Filter by zone

### Get Schedules by Zone
**GET** `/schedules/zone/:zone`

**Response:**
```json
[
  {
    "id": 1,
    "zone": "Centro",
    "material_category": "organico",
    "day_of_week": 1,
    "time": "07:00",
    "description": "Recolección de residuos orgánicos",
    "active": true
  }
]
```

### Create Schedule (Admin only)
**POST** `/schedules`

### Update Schedule (Admin only)
**PUT** `/schedules/:id`

### Delete Schedule (Admin only)
**DELETE** `/schedules/:id`

## Challenges

### Get All Challenges
**GET** `/challenges`

**Query Parameters:**
- `status` (optional): Filter by status (active, inactive, completed)

### Get Weekly Challenges
**GET** `/challenges/weekly`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Recicla 5 Botellas Plásticas",
    "description": "Recicla al menos 5 botellas...",
    "points_reward": 20,
    "challenge_type": "weekly",
    "start_date": "2024-01-01",
    "end_date": "2024-01-07",
    "status": "active",
    "target_value": 5
  }
]
```

### Complete Challenge (Authenticated)
**POST** `/challenges/:id/complete`

**Response:**
```json
{
  "message": "Challenge completed successfully",
  "points_earned": 20
}
```

### Create Challenge (Admin only)
**POST** `/challenges`

### Update Challenge (Admin only)
**PUT** `/challenges/:id`

### Delete Challenge (Admin only)
**DELETE** `/challenges/:id`

## Users

### Get User Profile (Authenticated)
**GET** `/users/profile`

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "zone": "Centro",
  "points": 150,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Get User Progress (Authenticated)
**GET** `/users/progress`

**Response:**
```json
{
  "points": 150,
  "completed_challenges": 5,
  "in_progress_challenges": [
    {
      "id": 2,
      "title": "Compostaje Diario",
      "progress": 3,
      "target_value": 7,
      "completed": false
    }
  ]
}
```

### Get User Badges (Authenticated)
**GET** `/users/badges`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Principiante Eco",
    "description": "Has comenzado tu viaje ecológico",
    "icon": "eco-start",
    "earned_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update Profile (Authenticated)
**PUT** `/users/profile`

**Request Body:**
```json
{
  "name": "John Doe",
  "zone": "Norte"
}
```

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "error": "Validation Error",
  "details": "..."
}
```

**401 Unauthorized:**
```json
{
  "error": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied. Admin role required."
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Health Check

**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
