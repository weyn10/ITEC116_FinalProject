# Hotel Reservation and Guest Management System (HRGMS) — Technical Documentation


## 1. Project Overview

The Hotel Reservation and Guest Management System (HRGMS) is a backend prototype for the hospitality domain. It is a RESTful web service that stores its data in a MySQL database through TypeORM, exposes 27 REST endpoints built with NestJS, and protects every business route with JWT authentication.


### 1.1 Objectives

- Design and implement a RESTful backend following resource-oriented URIs, correct HTTP methods and status codes.
- Model the domain as a normalised relational database and map it to TypeORM entities with correct relationships.
- Secure the API with JWT login, bcrypt password hashing, protected routes and input validation.
- Test and document every endpoint using Postman and an exported collection.
- Use Git and GitHub for incremental, version-controlled development.


### 1.2 Major Features

- User registration and login with hashed passwords and JWT access tokens.
- Full CRUD (create, list, count, read, update, delete) for 4 resources: Guest, Room, Reservation, Invoice.
- Foreign-key integrity enforced by MySQL (ON DELETE RESTRICT) and reported to clients as clear 400 / 409 responses.
- Global request validation that rejects invalid or unknown fields.
- Postman collection with automated assertions, auto-saved token and auto-saved record IDs.


### 1.3 Technology Stack

| Component | Technology |
|---|---|
| Backend framework | NestJS 10 (Node.js 20+) |
| ORM | TypeORM 0.3 |
| Database | MySQL 8 (mysql2 driver) |
| Authentication | JWT (@nestjs/jwt, passport-jwt), bcrypt |
| Validation | class-validator, class-transformer |
| API testing | Postman |
| Version control | Git & GitHub |


## 2. System Analysis

The system manages the core records of a hospitality information system: Guest, Room, Reservation, Invoice. All records are created and maintained by authenticated users through the API.


### 2.1 Actors

| Actor | Description |
|---|---|
| Registered user | Registers, logs in, and manages all domain records through authenticated API calls. |
| API client | Postman (or any HTTP client / future frontend) that sends JSON requests with a Bearer token. |


### 2.2 Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | A visitor can register an account; the password is stored only as a bcrypt hash. |
| FR-02 | A registered user can log in and receive a signed JWT. |
| FR-03 | A logged-in user can retrieve their own profile (GET /auth/me). |
| FR-04 | A user can create, list, count, retrieve, update and delete Guest records. |
| FR-05 | A user can create, list, count, retrieve, update and delete Room records. |
| FR-06 | A user can create, list, count, retrieve, update and delete Reservation records. |
| FR-07 | A user can create, list, count, retrieve, update and delete Invoice records. |
| FR-08 | Requests without a valid token are rejected with 401 on every business route. |
| FR-09 | Invalid input is rejected with 400; unknown ids return 404; foreign-key conflicts return 400 / 409. |


### 2.3 Non-Functional Requirements

- Security: JWT authentication, bcrypt hashing, secrets only in environment variables.
- Data integrity: primary keys, foreign keys and NOT NULL constraints in MySQL.
- Maintainability: one module per resource (entity, DTO, service, controller, module).
- Testability: every endpoint is covered by a Postman request with assertions.


### 2.4 Scope and Assumptions

This is a backend-focused prototype; no frontend is included. Authorisation is limited to “authenticated user”; the role column and JWT role claim are in place for future role-based rules.


## 3. System Architecture

The application follows a layered architecture. Each request travels Client → Guard → Pipe → Controller → Service → Repository → MySQL, and the result travels back along the same path. A global exception filter converts database constraint errors into proper HTTP responses.

![diagram](architecture.png)

*Figure 1 — Request flow through the application layers*


### 3.1 Layer Responsibilities

| Layer | Responsibility |
|---|---|
| JwtAuthGuard | Verifies the Bearer token; rejects missing/invalid/expired tokens with 401. |
| ValidationPipe | Validates and whitelists the request body against the DTO; returns 400 on violations. |
| Controller | Declares routes and HTTP methods, extracts params/body, returns the service result. |
| Service | Business logic: maps foreign-key ids to relations, throws 404 when a record is missing. |
| Repository / Entity | TypeORM maps entities to tables and runs parameterised SQL. |
| TypeOrmExceptionFilter | Maps MySQL errors (1062, 1451, 1452, …) to 409 / 400 instead of 500. |
| MySQL | Stores the data and enforces keys and constraints. |


### 3.2 Project Structure

```
src/
  main.ts                 bootstrap, global prefix /api, pipes, filter
  app.module.ts           ConfigModule, TypeORM connection, feature modules
  auth/                   register, login, me, JwtStrategy, JwtAuthGuard, jwt.config.ts
  users/                  User entity
  common/                 TypeOrmExceptionFilter
  modules/<resource>/     entity, dto, service, controller, module
```


### 3.3 Configuration

Configuration is read through ConfigService from a .env file (never committed): DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, JWT_EXPIRES_IN, PORT. The JWT secret is read in one function (jwt.config.ts) that is used by both the token signer and the token verifier, so they always agree.


## 4. Database Design

The MySQL database 03_hrgms_db contains 5 tables. Every table has an auto-increment primary key; relationships are enforced with foreign keys using ON DELETE RESTRICT, so a parent record cannot be deleted while child records still reference it.

![diagram](erd.png)

*Figure 2 — Entity-relationship diagram (PK = primary key, FK = foreign key, UQ = unique)*


### 4.1 Tables


#### users

| Column | Type | Null | Key |
|---|---|---|---|
| UserID | INT | NOT NULL | PK |
| FullName | VARCHAR(100) | NOT NULL |  |
| Email | VARCHAR(160) | NOT NULL | UNIQUE |
| PasswordHash | VARCHAR(255) | NOT NULL |  |
| Role | VARCHAR(30) | NOT NULL |  |
| CreatedAt | DATETIME | NOT NULL |  |
| UpdatedAt | DATETIME | NOT NULL |  |


#### guests

| Column | Type | Null | Key |
|---|---|---|---|
| id | INT | NOT NULL | PK |
| FullName | VARCHAR(255) | NOT NULL |  |
| Email | VARCHAR(160) | NOT NULL |  |
| Phone | VARCHAR(255) | NULL |  |
| createdAt | DATETIME | NOT NULL |  |
| updatedAt | DATETIME | NOT NULL |  |


#### rooms

| Column | Type | Null | Key |
|---|---|---|---|
| id | INT | NOT NULL | PK |
| RoomNumber | VARCHAR(255) | NOT NULL |  |
| RoomType | VARCHAR(255) | NOT NULL |  |
| Rate | DECIMAL(12,2) | NOT NULL |  |
| Status | VARCHAR(255) | NOT NULL |  |
| createdAt | DATETIME | NOT NULL |  |
| updatedAt | DATETIME | NOT NULL |  |


#### reservations

| Column | Type | Null | Key |
|---|---|---|---|
| id | INT | NOT NULL | PK |
| CheckInDate | DATE | NOT NULL |  |
| CheckOutDate | DATE | NOT NULL |  |
| Status | VARCHAR(255) | NOT NULL |  |
| GuestID | INT | NOT NULL | FK → guests(id) |
| RoomID | INT | NOT NULL | FK → rooms(id) |
| createdAt | DATETIME | NOT NULL |  |
| updatedAt | DATETIME | NOT NULL |  |


#### invoices

| Column | Type | Null | Key |
|---|---|---|---|
| id | INT | NOT NULL | PK |
| InvoiceNumber | VARCHAR(255) | NOT NULL |  |
| TotalAmount | DECIMAL(12,2) | NOT NULL |  |
| PaymentStatus | VARCHAR(255) | NOT NULL |  |
| ReservationID | INT | NOT NULL | FK → reservations(id) |
| createdAt | DATETIME | NOT NULL |  |
| updatedAt | DATETIME | NOT NULL |  |


### 4.2 Relationships

| Parent | Child | Cardinality | Foreign key | On delete |
|---|---|---|---|---|
| guests | reservations | One guests to many reservations | reservations.GuestID → guests.id | RESTRICT |
| rooms | reservations | One rooms to many reservations | reservations.RoomID → rooms.id | RESTRICT |
| reservations | invoices | One reservations to many invoices | invoices.ReservationID → reservations.id | RESTRICT |


### 4.3 Normalisation

Each table stores one entity type, every column depends on the primary key only, and repeating groups are modelled as separate tables linked by foreign keys. The design therefore satisfies third normal form (3NF).


### 4.4 TypeORM Entities

Every table has a matching TypeORM entity (src/users/user.entity.ts and src/modules/<resource>/<resource>.entity.ts). Foreign keys are mapped with @ManyToOne and @JoinColumn. The schema is created by database/schema.sql and TypeORM synchronize is disabled so the SQL file is the single source of truth.


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


## 6. Authentication & Security


### 6.1 Login Flow

- Client sends e-mail and password to POST /api/auth/login.
- AuthService loads the user (including the hidden password hash) and compares the password with bcrypt.compare.
- On success it signs a JWT (payload: sub = user id, email, role) with the secret from ConfigService and the configured expiry.
- The client sends the token in the Authorization: Bearer header on every later request.
- JwtAuthGuard + JwtStrategy verify the signature and expiry with the same secret; req.user is set; otherwise the API answers 401.


### 6.2 Security Measures

| Measure | Implementation |
|---|---|
| Password hashing | bcrypt with cost factor 12; the hash column is excluded from queries (select: false) and never returned. |
| JWT | Signed token, configurable expiry (JWT_EXPIRES_IN, default 1 day), Bearer scheme. |
| Protected routes | JwtAuthGuard on every business controller and on GET /auth/me. |
| Input validation | Global ValidationPipe: whitelist, forbidNonWhitelisted, transform; per-field rules in DTOs. |
| SQL injection | TypeORM uses parameterised queries. |
| Secrets | Only in .env (git-ignored); .env.example contains placeholders. Startup fails with a clear message if JWT_SECRET is missing. |
| Error handling | Database constraint errors are mapped to 400 / 409; internal details are not leaked. |


### 6.3 Known Limitations / Future Work

- Authorisation is “any authenticated user”; role-based access control (using the role claim) can be added with a guard and decorator.
- Add rate limiting and restrict CORS origins before any public deployment.
- Add refresh tokens and token revocation.


## 7. Backend Implementation


### 7.1 Module Pattern

Every resource is a self-contained Nest module with five files: *.entity.ts (table mapping), *.dto.ts (validation), *.service.ts (logic), *.controller.ts (routes), *.module.ts (wiring). Controllers are decorated with @UseGuards(JwtAuthGuard).


### 7.2 Controller → Service → Repository Example

```
// guest.controller.ts
@UseGuards(JwtAuthGuard)
@Controller('guests')
export class GuestController {
  @Post() create(@Body() dto: CreateGuestDto) { return this.service.create(dto); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
}

// guest.service.ts
async findOne(id: number) {
  const item = await this.repo.findOne({ where: { id } });
  if (!item) throw new NotFoundException('Guest not found');
  return item;
}
```


### 7.3 JWT Secret Handling

```
// jwt.config.ts — used by BOTH the signer and the verifier
export function getJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET');
  if (!secret || !secret.trim()) throw new Error('JWT_SECRET is not set ...');
  return secret;
}

// auth.module.ts
JwtModule.registerAsync({ inject: [ConfigService],
  useFactory: (config) => ({ secret: getJwtSecret(config), signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') || '1d' } }) })
```


### 7.4 Error Handling

NotFoundException (404) is thrown by services; ValidationPipe produces 400; JwtAuthGuard produces 401; TypeOrmExceptionFilter converts MySQL errors 1062/1451 to 409 and 1452/1048/1406/1264/1265/1292/1366 to 400.


## 8. API Testing and Validation


### 8.1 How to Run the Tests

- Import database/schema.sql, create .env, run npm install and npm run start:dev.
- Import postman/collection.json into Postman.
- Run Authentication → Register → Login. The JWT is stored automatically in the {{token}} variable; IDs of created records are stored automatically as well.
- Run the resource folders in order, then the Security & Validation folder, then Cleanup — or use Run collection.


### 8.2 Postman Collection Structure

| Folder | Requests |
|---|---|
| 1. Authentication | Register, Login (saves token), Me (JWT) |
| 2.1 Guest | List, Count, Create (saves id), Read one, Update |
| 2.2 Room | List, Count, Create (saves id), Read one, Update |
| 2.3 Reservation | List, Count, Create (saves id), Read one, Update |
| 2.4 Invoice | List, Count, Create (saves id), Read one, Update, Delete |
| 3. Security & Validation Tests | No token → 401, invalid token → 401, wrong password → 401, invalid input → 400, empty body → 400, unknown id → 404, bad foreign key → 400 |
| 4. Cleanup | Deletes the parent records last (child records first) |


### 8.3 Expected Results

| Test | Expected status |
|---|---|
| Register | 201 (409 if the demo user already exists) |
| Login | 200 + access_token |
| Me (JWT) | 200 + user without password |
| Protected route, no token | 401 |
| Protected route, invalid token | 401 |
| Create / Read / Update / Delete | 201 / 200 / 200 / 200 |
| Create with empty body | 400 |
| Create with non-existent foreign key | 400 |
| Read non-existent id | 404 |
| Delete a parent that still has children | 409 |


### 8.4 Test Evidence (screenshots)

Insert your own screenshots from Postman and phpMyAdmin below. Only genuine results from your machine should be included.

- [ ] Screenshot: Backend started with no errors (npm run start:dev)
- [ ] Screenshot: Login response showing the JWT token
- [ ] Screenshot: Create (201) response for one module
- [ ] Screenshot: Read, Update and Delete responses for the same module
- [ ] Screenshot: Protected route without token returning 401
- [ ] Screenshot: Postman collection runner — all tests passed
- [ ] Screenshot: phpMyAdmin showing the stored data

## 9. Conclusion

The HRGMS backend delivers a working NestJS + TypeORM + MySQL REST API with JWT-secured routes, 4 CRUD resources, 27 endpoints, a normalised relational schema with enforced foreign keys, and an automated Postman test collection. Challenges included keeping the signing and verification secrets identical and surfacing database constraint errors as meaningful HTTP responses; both are solved by a single shared secret helper and a global exception filter. Future improvements: role-based authorisation, pagination and filtering on list endpoints, refresh tokens, and an optional React frontend.


## 10. References

- ITEC 116 Final Project — Systems Integration Backend Prototype (course handout).
- Laboratory Activities 03–06 — system proposal, architecture and API/interaction patterns.
- NestJS Documentation — https://docs.nestjs.com/
- TypeORM Documentation — https://typeorm.io/
- Passport JWT strategy — https://www.passportjs.org/packages/passport-jwt/
- MySQL 8 Reference Manual — https://dev.mysql.com/doc/refman/8.0/en/
- Postman Learning Center — https://learning.postman.com/


## Appendix A — Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| DB_HOST / DB_PORT | MySQL host and port | localhost / 3306 |
| DB_USER / DB_PASSWORD | MySQL credentials | root / (your password) |
| DB_NAME | Database name | 03_hrgms_db |
| JWT_SECRET | Token signing secret (32+ random chars) | (random string) |
| JWT_EXPIRES_IN | Token lifetime | 1d |
| PORT | HTTP port | 3000 |


## Appendix B — Deliverable Files

| Deliverable | File |
|---|---|
| Documentation (PDF) | docs/Technical_Documentation.pdf |
| SQL schema | database/schema.sql (export your populated database from phpMyAdmin for the final .sql) |
| Postman collection | postman/collection.json |
| Source code | GitHub repository (see cover page) |
| Demo video | Link on cover page |
