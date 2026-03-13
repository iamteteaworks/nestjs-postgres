### NestJS + Postgres API

This project is a NestJS REST API using PostgreSQL and TypeORM. It includes:

- Google sign‑in (OAuth2) + JWT access/refresh tokens
- User/workout management (nested workouts with days & exercises)
- Training sessions/availabilities and date filtering

---

### 1. Prerequisites

- Node.js (LTS)
- PostgreSQL
- Google OAuth 2.0 client (for Google sign‑in)

---

### 2. Setup

#### Install dependencies

```bash
npm install
```

#### Environment variables

Copy `.env.example` to `.env` and fill values:

```bash
APP_PORT=3000
APP_ENV=development
APP_NAME=nestjs-postgres

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

JWT_ACCESS_SECRET=your_access_jwt_secret
JWT_REFRESH_SECRET=your_refresh_jwt_secret
JWT_ACCESS_EXPIRES_IN=1d
```

#### Database

Use TypeORM migrations (recommended):

```bash
# generate from current entities
npm run migration:generate

# run all pending migrations
npm run migration:run
```

For development, `synchronize: true` is enabled in `AppModule` to keep schema in sync automatically.

---

### 3. Run the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run build
npm run start:prod
```

Global validation is enabled; request bodies must match DTOs.

---

### 4. Authentication flow

#### 4.1. Google sign‑in (Postman flow)

1. **Start the API**

   ```bash
   npm run start:dev
   ```

2. **Configure Google OAuth redirect URI** in Google Cloud Console:

   ```text
   http://localhost:3000/auth/google/callback
   ```

3. **Log in with Google (in your browser)**  
   Open:

   ```text
   http://localhost:3000/auth/google
   ```

   After you choose your Google account, you’ll be redirected to `/auth/google/callback` and see a JSON response like:

   ```json
   {
     "user": {
       "id": "user-uuid",
       "username": "Your Name",
       "email": "you@example.com",
       "authProvider": "google",
       "authProviderId": "google-id",
       "avatarPath": "https://..."
     },
     "tokens": {
       "accessToken": "ACCESS_JWT_HERE",
       "refreshToken": "REFRESH_JWT_HERE"
     }
   }
   ```

4. **Use tokens in Postman**

   - For any protected endpoint:

     ```http
     Authorization: Bearer ACCESS_JWT_HERE
     ```

   - To refresh tokens:

     ```http
     POST http://localhost:3000/auth/refresh
     Content-Type: application/json

     {
       "refreshToken": "REFRESH_JWT_HERE"
     }
     ```

   The response will contain a new `accessToken` and `refreshToken` to paste back into Postman.

#### 4.2. Refresh token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "REFRESH_JWT"
}
```

Returns new `accessToken` and `refreshToken`.

#### 4.3. Auth profile

```http
GET /auth/profile
Authorization: Bearer ACCESS_JWT
```

Returns the same json structure as the Google callback (user + tokens).

---

### 8. Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```
