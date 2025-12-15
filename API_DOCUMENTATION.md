# API Documentation

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

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "zone": "Norte"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "zone": "Norte",
    "points": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "zone": "Norte",
    "points": 50
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "zone": "Norte",
  "points": 50
}
```

## Materials

### List All Materials
**GET** `/materials`

**Query Parameters:**
- `category` (optional): Filter by category (plastico, vidrio, papel, organico, electronicos, metal)
- `approved` (optional): Filter by approval status (true/false)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Botellas de Plástico PET",
    "category": "plastico",
    "description": "Botellas de bebidas transparentes",
    "disposal_instructions": "Enjuagar antes de desechar. Aplastar para ahorrar espacio.",
    "image_url": null,
    "is_approved": true
  }
]
```

### Search Materials
**GET** `/materials/search?q=plastico`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Botellas de Plástico PET",
    "category": "plastico",
    "description": "Botellas de bebidas transparentes",
    "disposal_instructions": "Enjuagar antes de desechar.",
    "is_approved": true
  }
]
```

### Get Material by ID
**GET** `/materials/:id`

### Create Material
**POST** `/materials`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "name": "Nuevo Material",
  "category": "plastico",
  "description": "Descripción del material",
  "disposal_instructions": "Instrucciones de disposición",
  "image_url": "https://example.com/image.jpg"
}
```

### Update Material (Admin only)
**PUT** `/materials/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "name": "Material Actualizado",
  "is_approved": true
}
```

### Delete Material (Admin only)
**DELETE** `/materials/:id`

## Recycling Centers

### List All Centers
**GET** `/centers`

**Query Parameters:**
- `approved` (optional): Filter by approval status

### Get Center by ID
**GET** `/centers/:id`

### Create Center
**POST** `/centers`

**Body:**
```json
{
  "name": "Centro de Reciclaje",
  "address": "Calle Principal 123",
  "latitude": 8.7489,
  "longitude": -67.9243,
  "phone": "+58-247-1234567",
  "email": "info@centro.com",
  "accepted_materials": ["plastico", "vidrio", "papel"],
  "schedule": "Lunes a Viernes: 8:00-17:00"
}
```

### Update Center (Admin only)
**PUT** `/centers/:id`

### Delete Center (Admin only)
**DELETE** `/centers/:id`

## Collection Schedules

### List All Schedules
**GET** `/schedules`

### Get Schedules by Zone
**GET** `/schedules/zone/:zone`

Example: `/schedules/zone/Norte`

**Response:**
```json
[
  {
    "id": 1,
    "zone": "Norte",
    "material_type": "plastico",
    "day_of_week": 1,
    "time": "08:00",
    "description": "Recolección de plásticos los lunes"
  }
]
```

### Create Schedule (Admin only)
**POST** `/schedules`

**Body:**
```json
{
  "zone": "Norte",
  "material_type": "plastico",
  "day_of_week": 1,
  "time": "08:00",
  "description": "Recolección de plásticos"
}
```

Note: `day_of_week` is 0-6 (0 = Sunday, 1 = Monday, etc.)

### Update Schedule (Admin only)
**PUT** `/schedules/:id`

### Delete Schedule (Admin only)
**DELETE** `/schedules/:id`

## Challenges

### List All Challenges
**GET** `/challenges`

**Query Parameters:**
- `active` (optional): Filter by active status (true/false)

### Get Challenge by ID
**GET** `/challenges/:id`

### Get User's Challenges
**GET** `/challenges/user/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Semana del Reciclaje",
    "description": "Recicla al menos 5 items diferentes esta semana",
    "points": 50,
    "start_date": "2025-12-15",
    "end_date": "2025-12-22",
    "difficulty": "easy",
    "is_active": true,
    "completed": false,
    "completed_at": null
  }
]
```

### Complete Challenge
**POST** `/challenges/:challengeId/complete`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Challenge completed",
  "points_earned": 50
}
```

### Create Challenge (Admin only)
**POST** `/challenges`

**Body:**
```json
{
  "title": "Nuevo Reto",
  "description": "Descripción del reto",
  "points": 100,
  "start_date": "2025-12-15",
  "end_date": "2025-12-22",
  "difficulty": "medium"
}
```

### Update Challenge (Admin only)
**PUT** `/challenges/:id`

### Delete Challenge (Admin only)
**DELETE** `/challenges/:id`

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized**
```json
{
  "error": "No token provided"
}
```
or
```json
{
  "error": "Invalid token"
}
```

**403 Forbidden**
```json
{
  "error": "Admin access required"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Server error"
}
```
