# Hotel Reservation and Guest Management System — API Reference

## 5. REST API Design


### 5.1 Conventions

- Base URL: http://localhost:3000/api — all bodies are JSON.
- Resource-oriented plural URIs; HTTP verbs express the action (GET read, POST create, PATCH update, DELETE remove).
- Protected routes require the header Authorization: Bearer <access_token>.
- Errors share one shape: {"statusCode": 400, "message": "...", "error": "Bad Request"}.


### 5.2 Endpoint Summary

| Method | Endpoint | JWT | Success | Purpose |
|---|---|---|---|---|
| POST | /api/auth/register | No | 201 | Register a user |
| POST | /api/auth/login | No | 200 | Log in, receive JWT |
| GET | /api/auth/me | Yes | 200 | Current user |
| GET | /api/guests | Yes | 200 | List Guest |
| GET | /api/guests/count | Yes | 200 | Count Guest |
| GET | /api/guests/:id | Yes | 200 | Get one Guest |
| POST | /api/guests | Yes | 201 | Create Guest |
| PATCH | /api/guests/:id | Yes | 200 | Update Guest |
| DELETE | /api/guests/:id | Yes | 200 | Delete Guest |
| GET | /api/rooms | Yes | 200 | List Room |
| GET | /api/rooms/count | Yes | 200 | Count Room |
| GET | /api/rooms/:id | Yes | 200 | Get one Room |
| POST | /api/rooms | Yes | 201 | Create Room |
| PATCH | /api/rooms/:id | Yes | 200 | Update Room |
| DELETE | /api/rooms/:id | Yes | 200 | Delete Room |
| GET | /api/reservations | Yes | 200 | List Reservation |
| GET | /api/reservations/count | Yes | 200 | Count Reservation |
| GET | /api/reservations/:id | Yes | 200 | Get one Reservation |
| POST | /api/reservations | Yes | 201 | Create Reservation |
| PATCH | /api/reservations/:id | Yes | 200 | Update Reservation |
| DELETE | /api/reservations/:id | Yes | 200 | Delete Reservation |
| GET | /api/invoices | Yes | 200 | List Invoice |
| GET | /api/invoices/count | Yes | 200 | Count Invoice |
| GET | /api/invoices/:id | Yes | 200 | Get one Invoice |
| POST | /api/invoices | Yes | 201 | Create Invoice |
| PATCH | /api/invoices/:id | Yes | 200 | Update Invoice |
| DELETE | /api/invoices/:id | Yes | 200 | Delete Invoice |

Total: 27 endpoints (methods used: GET, POST, PATCH, DELETE).


### 5.3 Status Codes

| Code | Meaning in this API |
|---|---|
| 200 OK | Successful read, update, delete, login. |
| 201 Created | Resource or user created. |
| 400 Bad Request | Validation failed, or a referenced foreign-key record does not exist. |
| 401 Unauthorized | Missing, invalid or expired token; wrong login credentials. |
| 404 Not Found | No record with the requested id. |
| 409 Conflict | Duplicate e-mail on register, or deleting a record that is still referenced. |


### 5.4 Authentication Endpoints


#### POST /api/auth/register  →  201 Created

```
Request
{
  "email": "demo@example.com",
  "fullName": "Demo User",
  "password": "Password123"
}

Response
{
  "id": 1,
  "email": "demo@example.com",
  "fullName": "Demo User",
  "role": "user"
}
```

Errors: 400 (invalid e-mail or password shorter than 8 characters), 409 (e-mail already registered).


#### POST /api/auth/login  →  200 OK

```
Request
{
  "email": "demo@example.com",
  "password": "Password123"
}

Response
{
  "access_token": "<JWT>",
  "token_type": "Bearer"
}
```

Errors: 400 (invalid input), 401 (wrong e-mail or password).


#### GET /api/auth/me  →  200 OK   (header: Authorization: Bearer <JWT>)

```
{
  "id": 1,
  "email": "demo@example.com",
  "fullName": "Demo User",
  "role": "user",
  "createdAt": "2026-12-01T09:00:00.000Z"
}
```

Errors: 401 (missing, invalid or expired token).


### 5.5 Resource Endpoints

All resource endpoints require the Bearer token. The examples below are the exact shapes returned by the implementation. Decimal columns are returned by MySQL as strings in read responses; relations are expanded one level in GET responses and shown as {"id": n} in create/update responses.


#### Guest  —  /api/guests

| Field | Validation rules | DB column |
|---|---|---|
| fullname | required, string, not empty | FullName |
| email | required, valid e-mail | Email |
| phone | optional, string | Phone |

```
POST /api/guests   → 201
Request
{
  "fullname": "Sample FullName",
  "email": "sample@example.com",
  "phone": "Sample Phone"
}

Response
{
  "id": 1,
  "fullname": "Sample FullName",
  "email": "sample@example.com",
  "phone": "Sample Phone",
  "createdAt": "2026-12-01T09:00:00.000Z",
  "updatedAt": "2026-12-01T09:00:00.000Z"
}
```

```
GET /api/guests   → 200  (array)
[
  {
    "id": 1,
    "fullname": "Sample FullName",
    "email": "sample@example.com",
    "phone": "Sample Phone",
    "createdAt": "2026-12-01T09:00:00.000Z",
    "updatedAt": "2026-12-01T09:00:00.000Z"
  }
]
```

```
PATCH /api/guests/1   → 200
Request
{
  "fullname": "Sample FullName (Updated)"
}
```

```
DELETE /api/guests/1   → 200
{
  "deleted": true,
  "id": 1
}
```

Other responses: GET /api/guests/count → 200 {"total": 1}; GET/PATCH/DELETE /api/guests/:id with an unknown id → 404 {"message": "Guest not found"}; invalid body → 400; unknown foreign-key id → 400; deleting a record that is still referenced → 409.


#### Room  —  /api/rooms

| Field | Validation rules | DB column |
|---|---|---|
| roomnumber | required, string, not empty | RoomNumber |
| roomtype | required, string, not empty | RoomType |
| rate | required, number, max 2 decimals, min 0 | Rate |
| status | required, string, not empty | Status |

```
POST /api/rooms   → 201
Request
{
  "roomnumber": "Sample RoomNumber",
  "roomtype": "Sample RoomType",
  "rate": 100.0,
  "status": "Sample Status"
}

Response
{
  "id": 1,
  "roomnumber": "Sample RoomNumber",
  "roomtype": "Sample RoomType",
  "rate": 100.0,
  "status": "Sample Status",
  "createdAt": "2026-12-01T09:00:00.000Z",
  "updatedAt": "2026-12-01T09:00:00.000Z"
}
```

```
GET /api/rooms   → 200  (array)
[
  {
    "id": 1,
    "roomnumber": "Sample RoomNumber",
    "roomtype": "Sample RoomType",
    "rate": "100.00",
    "status": "Sample Status",
    "createdAt": "2026-12-01T09:00:00.000Z",
    "updatedAt": "2026-12-01T09:00:00.000Z"
  }
]
```

```
PATCH /api/rooms/1   → 200
Request
{
  "roomnumber": "Sample RoomNumber (Updated)"
}
```

```
DELETE /api/rooms/1   → 200
{
  "deleted": true,
  "id": 1
}
```

Other responses: GET /api/rooms/count → 200 {"total": 1}; GET/PATCH/DELETE /api/rooms/:id with an unknown id → 404 {"message": "Room not found"}; invalid body → 400; unknown foreign-key id → 400; deleting a record that is still referenced → 409.


#### Reservation  —  /api/reservations

| Field | Validation rules | DB column |
|---|---|---|
| checkindate | required, ISO-8601 date string | CheckInDate |
| checkoutdate | required, ISO-8601 date string | CheckOutDate |
| status | required, string, not empty | Status |
| guestid (→ Guest) | required, integer, min 1 | GuestID |
| roomid (→ Room) | required, integer, min 1 | RoomID |

```
POST /api/reservations   → 201
Request
{
  "checkindate": "2026-12-01",
  "checkoutdate": "2026-12-01",
  "status": "Sample Status",
  "guestid": 1,
  "roomid": 1
}

Response
{
  "id": 1,
  "checkindate": "2026-12-01",
  "checkoutdate": "2026-12-01",
  "status": "Sample Status",
  "guest": {
    "id": 1
  },
  "room": {
    "id": 1
  },
  "createdAt": "2026-12-01T09:00:00.000Z",
  "updatedAt": "2026-12-01T09:00:00.000Z"
}
```

```
GET /api/reservations   → 200  (array)
[
  {
    "id": 1,
    "checkindate": "2026-12-01",
    "checkoutdate": "2026-12-01",
    "status": "Sample Status",
    "guest": {
      "id": 1,
      "fullname": "Sample FullName",
      "email": "sample@example.com",
      "phone": "Sample Phone",
      "createdAt": "2026-12-01T09:00:00.000Z",
      "updatedAt": "2026-12-01T09:00:00.000Z"
    },
    "room": {
      "id": 1,
      "roomnumber": "Sample RoomNumber",
      "roomtype": "Sample RoomType",
      "rate": 100.0,
      "status": "Sample Status",
      "createdAt": "2026-12-01T09:00:00.000Z",
      "updatedAt": "2026-12-01T09:00:00.000Z"
    },
    "createdAt": "2026-12-01T09:00:00.000Z",
    "updatedAt": "2026-12-01T09:00:00.000Z"
  }
]
```

```
PATCH /api/reservations/1   → 200
Request
{
  "status": "Sample Status (Updated)"
}
```

```
DELETE /api/reservations/1   → 200
{
  "deleted": true,
  "id": 1
}
```

Other responses: GET /api/reservations/count → 200 {"total": 1}; GET/PATCH/DELETE /api/reservations/:id with an unknown id → 404 {"message": "Reservation not found"}; invalid body → 400; unknown foreign-key id → 400; deleting a record that is still referenced → 409.


#### Invoice  —  /api/invoices

| Field | Validation rules | DB column |
|---|---|---|
| invoicenumber | required, string, not empty | InvoiceNumber |
| totalamount | required, number, max 2 decimals, min 0 | TotalAmount |
| paymentstatus | required, string, not empty | PaymentStatus |
| reservationid (→ Reservation) | required, integer, min 1 | ReservationID |

```
POST /api/invoices   → 201
Request
{
  "invoicenumber": "Sample InvoiceNumber",
  "totalamount": 100.0,
  "paymentstatus": "Sample PaymentStatus",
  "reservationid": 1
}

Response
{
  "id": 1,
  "invoicenumber": "Sample InvoiceNumber",
  "totalamount": 100.0,
  "paymentstatus": "Sample PaymentStatus",
  "reservation": {
    "id": 1
  },
  "createdAt": "2026-12-01T09:00:00.000Z",
  "updatedAt": "2026-12-01T09:00:00.000Z"
}
```

```
GET /api/invoices   → 200  (array)
[
  {
    "id": 1,
    "invoicenumber": "Sample InvoiceNumber",
    "totalamount": "100.00",
    "paymentstatus": "Sample PaymentStatus",
    "reservation": {
      "id": 1,
      "checkindate": "2026-12-01",
      "checkoutdate": "2026-12-01",
      "status": "Sample Status",
      "guest": {
        "id": 1,
        "fullname": "Sample FullName",
        "email": "sample@example.com",
        "phone": "Sample Phone",
        "createdAt": "2026-12-01T09:00:00.000Z",
        "updatedAt": "2026-12-01T09:00:00.000Z"
      },
      "room": {
        "id": 1,
        "roomnumber": "Sample RoomNumber",
        "roomtype": "Sample RoomType",
        "rate": 100.0,
        "status": "Sample Status",
        "createdAt": "2026-12-01T09:00:00.000Z",
        "updatedAt": "2026-12-01T09:00:00.000Z"
      },
      "createdAt": "2026-12-01T09:00:00.000Z",
      "updatedAt": "2026-12-01T09:00:00.000Z"
    },
    "createdAt": "2026-12-01T09:00:00.000Z",
    "updatedAt": "2026-12-01T09:00:00.000Z"
  }
]
```

```
PATCH /api/invoices/1   → 200
Request
{
  "invoicenumber": "Sample InvoiceNumber (Updated)"
}
```

```
DELETE /api/invoices/1   → 200
{
  "deleted": true,
  "id": 1
}
```

Other responses: GET /api/invoices/count → 200 {"total": 1}; GET/PATCH/DELETE /api/invoices/:id with an unknown id → 404 {"message": "Invoice not found"}; invalid body → 400; unknown foreign-key id → 400; deleting a record that is still referenced → 409.
