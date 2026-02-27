# UniSport

A full-stack campus sports facility booking web application that lets students browse facilities, reserve time slots, and manage bookings, while admins manage facilities and system-wide bookings.

## Team Members

| Name  
| ----------------------
| **[Thant Zin Oo](https://github.com/thantzinoo-au?tab=repositories)**
| **[Shoon Moe Aung](https://github.com/Shoon-moe-aung?tab=repositories)**

## Tech Stack

| Layer          | Technology                                                            |
| -------------- | --------------------------------------------------------------------- |
| **Frontend**   | React 19, Vite 7, React Router v7, Material UI (MUI), Recharts, Axios |
| **Backend**    | Next.js 16 (API Routes), Mongoose                                     |
| **Database**   | MongoDB                                                               |
| **Proxy**      | Nginx + Certbot (`jonasal/nginx-certbot`)                             |
| **Auth**       | JWT (7-day expiry) + bcryptjs                                         |
| **Deployment** | Docker Compose                                                        |

---

## Features

- **Authentication** – Register and log in with student credentials; supports role-based access (`Student` / `Admin`).
- **Facility Catalog** – Browse facilities by sport type and status, then open detail pages for booking.
- **Slot Availability** – Live availability API returns open one-hour slots between `08:00` and `22:00`.
- **Booking System** – Students can create bookings, view personal bookings, and cancel upcoming bookings.
- **Auto-Completion** – Confirmed bookings are automatically marked `Completed` when their end time passes.
- **Admin Facility Management** – Admins can create, update, and delete facilities; set `Active` or `Maintenance` status.
- **Admin Booking Management** – Admins can review all bookings and update status (`Confirmed` -> `Cancelled`/`Completed`).
- **Analytics Dashboard** – Admin dashboard provides overview metrics, trends, top facilities, peak hours, and active users.
- **Profile Management** – Users can update profile name, change password, and upload profile images (JPEG/PNG/GIF/WebP up to 2 MB).
- **Initial Seeder Endpoint** – Protected setup endpoint ensures indexes and seeds starter users/facilities.

---

## Screenshots

### Login Page

![Login page](docs/screenshots/Login%20Page.png)

### Facility Showcases

![Facility showcases](docs/screenshots/Facility%20Showcases.png)

### Facility Booking

![Facility booking](docs/screenshots/Facility%20Booking.png)
![Facility booking detail](docs/screenshots/Facility%20Booking%201.png)

### My Bookings

![My bookings](docs/screenshots/My%20Booking%201.png)
![My bookings history](docs/screenshots/My%20Booking%202.png)

### User Profile

![User profile](docs/screenshots/User%20Profile.png)

### Admin Dashboard

![Admin dashboard overview](docs/screenshots/Admin%20Dashboard%201.png)
![Admin dashboard analytics](docs/screenshots/Admin%20Dashboard%202.png)

### Manage Facility

![Manage facility](docs/screenshots/Manage%20Facility.png)

### Booking Management

![Booking management](docs/screenshots/Booking%20Management.png)

### Admin Profile

![Admin profile](docs/screenshots/Admin%20Profile.png)

---

## Project Structure

```
unisport/
├── docker-compose.yml           # Orchestrates nginx, frontend, backend
├── nginx-certbot.env            # Certbot/Nginx certificate settings
├── user_conf.d/                 # Nginx virtual host configuration
├── backend/                     # Next.js app (API-focused backend)
│   └── src/
│       ├── app/api/
│       │   ├── auth/login/          POST  – log in
│       │   ├── auth/register/       POST  – create account
│       │   ├── auth/me/             GET   – current user profile
│       │   ├── auth/profile/        PUT   – update profile name
│       │   ├── auth/profile/image/  POST  – upload profile image
│       │   ├── auth/password/       PUT   – change password
│       │   ├── facilities/          GET / POST
│       │   ├── facilities/[id]/     GET / PUT / DELETE
│       │   ├── bookings/            GET / POST
│       │   ├── bookings/[id]/       GET / PUT / DELETE
│       │   ├── bookings/availability/ GET – available slots
│       │   ├── stats/               GET   – admin analytics
│       │   └── admin/initial/       GET   – seed/index bootstrap
│       ├── lib/
│       │   ├── auth.js              JWT sign / verify helpers
│       │   ├── mongodb.js           Mongoose connection cache
│       │   ├── autoComplete.js      Auto-mark expired bookings
│       │   ├── seed.js              Initial seed data and loaders
│       │   └── ensureIndexes.js     Ensure model indexes
│       └── models/
│           ├── User.js
│           ├── Facility.js
│           └── Booking.js
└── frontend/                    # React + Vite SPA
    └── src/
        ├── api/axios.js         # Axios instance (Bearer token + 401 handler)
        ├── App.jsx              # Route tree and protected routes
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ColorModeContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Layout.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── HomePage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── FacilitiesPage.jsx
            ├── FacilityDetailPage.jsx
            ├── MyBookingsPage.jsx
            ├── ProfilePage.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AdminFacilities.jsx
                └── AdminBookings.jsx
```

---

## Data Models

### User

| Field          | Type   | Notes                |
| -------------- | ------ | -------------------- |
| `name`         | String | required             |
| `studentId`    | String | required, unique     |
| `email`        | String | required, unique     |
| `password`     | String | bcrypt hash          |
| `role`         | String | `Student` \| `Admin` |
| `profileImage` | String | uploaded filename    |
| `createdAt`    | Date   | auto timestamp       |
| `updatedAt`    | Date   | auto timestamp       |

### Facility

| Field       | Type   | Notes                                  |
| ----------- | ------ | -------------------------------------- |
| `name`      | String | required                               |
| `type`      | String | `Snooker` \| `Football` \| `Badminton` |
| `location`  | String | required                               |
| `capacity`  | Number | required, positive                     |
| `status`    | String | `Active` \| `Maintenance`              |
| `createdAt` | Date   | auto timestamp                         |
| `updatedAt` | Date   | auto timestamp                         |

### Booking

| Field        | Type     | Notes                                     |
| ------------ | -------- | ----------------------------------------- |
| `userId`     | ObjectId | ref User                                  |
| `facilityId` | ObjectId | ref Facility                              |
| `date`       | String   | `YYYY-MM-DD`                              |
| `startTime`  | String   | `HH:MM`                                   |
| `endTime`    | String   | `HH:MM`                                   |
| `status`     | String   | `Confirmed` \| `Cancelled` \| `Completed` |
| `createdAt`  | Date     | auto timestamp                            |
| `updatedAt`  | Date     | auto timestamp                            |

---

## API Reference

All endpoints are prefixed with `/api`.  
Endpoints marked **🔒** require `Authorization: Bearer <token>`.

### Auth

| Method | Path                  | Auth | Description                                             |
| ------ | --------------------- | ---- | ------------------------------------------------------- |
| `POST` | `/auth/register`      | —    | Create account and return JWT + user.                   |
| `POST` | `/auth/login`         | —    | Authenticate and return JWT + user.                     |
| `GET`  | `/auth/me`            | 🔒   | Get current authenticated user profile.                 |
| `PUT`  | `/auth/profile`       | 🔒   | Update profile name.                                    |
| `PUT`  | `/auth/password`      | 🔒   | Change password (`currentPassword`, `newPassword`).     |
| `POST` | `/auth/profile/image` | 🔒   | Upload profile image (`multipart/form-data`, max 2 MB). |

### Facilities

| Method   | Path              | Auth       | Description                                      |
| -------- | ----------------- | ---------- | ------------------------------------------------ |
| `GET`    | `/facilities`     | —          | List facilities. Query params: `type`, `status`. |
| `POST`   | `/facilities`     | 🔒 (Admin) | Create a new facility.                           |
| `GET`    | `/facilities/:id` | —          | Get a single facility by ID.                     |
| `PUT`    | `/facilities/:id` | 🔒 (Admin) | Update facility fields.                          |
| `DELETE` | `/facilities/:id` | 🔒 (Admin) | Delete a facility.                               |

### Bookings

| Method   | Path                     | Auth | Description                                                        |
| -------- | ------------------------ | ---- | ------------------------------------------------------------------ |
| `GET`    | `/bookings`              | 🔒   | List bookings (`Admin`: all, `Student`: own).                      |
| `POST`   | `/bookings`              | 🔒   | Create booking with conflict checks and operating-hour validation. |
| `GET`    | `/bookings/:id`          | 🔒   | Get booking by ID (owner/admin only).                              |
| `PUT`    | `/bookings/:id`          | 🔒   | Update booking status with allowed transitions.                    |
| `DELETE` | `/bookings/:id`          | 🔒   | Delete booking (owner/admin only).                                 |
| `GET`    | `/bookings/availability` | —    | Get available and all hourly slots for `facilityId` + `date`.      |

### Statistics

| Method | Path     | Auth       | Description                                               |
| ------ | -------- | ---------- | --------------------------------------------------------- |
| `GET`  | `/stats` | 🔒 (Admin) | Returns booking, facility, and user analytics aggregates. |

### Admin Setup

| Method | Path                                     | Auth | Description                                         |
| ------ | ---------------------------------------- | ---- | --------------------------------------------------- |
| `GET`  | `/admin/initial?pass=<ADMIN_SETUP_PASS>` | —    | Ensures indexes and seeds initial users/facilities. |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- A running MongoDB instance reachable by `MONGODB_URI`

### Running with Docker Compose

```bash
# Clone the repository
git clone <your-repository-url>
cd unisport

# Set required environment variables in your shell
export MONGODB_URI="mongodb://<user>:<password>@<host>:27017/<db>?authSource=admin"
export JWT_SECRET="change_me_in_production"
export ADMIN_SETUP_PASS="set_a_strong_secret"
export CORS_ORIGIN="https://your-domain.com"

# Configure certificate/domain values
# Edit nginx-certbot.env and files in user_conf.d as needed

# Build and start all services
docker compose up --build
```

The application will be available at **http://localhost** (and **https://localhost** if certificates are configured).

| Service           | Internal Port | Exposed                         |
| ----------------- | ------------- | ------------------------------- |
| Nginx + Certbot   | 80 / 443      | **80 / 443** (main entry point) |
| Frontend (Nginx)  | 80            | 8080 (direct access)            |
| Backend (Next.js) | 3000          | 3000 (direct access)            |

---

## Environment Variables

### Backend (docker-compose.yml)

| Variable           | Default                   | Description                                     |
| ------------------ | ------------------------- | ----------------------------------------------- |
| `MONGODB_URI`      | —                         | MongoDB connection string (required)            |
| `JWT_SECRET`       | —                         | JWT signing secret (required)                   |
| `ADMIN_SETUP_PASS` | —                         | Secret for `/api/admin/initial` bootstrap route |
| `CORS_ORIGIN`      | `https://your-domain.com` | Allowed frontend origin                         |
| `NODE_ENV`         | `production`              | Node runtime mode                               |

### Nginx Certbot (nginx-certbot.env)

| Variable                | Default          |
| ----------------------- | ---------------- |
| `CERTBOT_EMAIL`         | `your@email.com` |
| `DHPARAM_SIZE`          | `2048`           |
| `ELLIPTIC_CURVE`        | `secp256r1`      |
| `RENEWAL_INTERVAL`      | `8d`             |
| `RSA_KEY_SIZE`          | `2048`           |
| `STAGING`               | `0`              |
| `USE_ECDSA`             | `1`              |
| `CERTBOT_AUTHENTICATOR` | `webroot`        |
| `DEBUG`                 | `0`              |

---

## Docker Volumes

| Volume          | Used By                        | Purpose                              |
| --------------- | ------------------------------ | ------------------------------------ |
| `nginx_secrets` | `nginx`                        | Persistent TLS certificates and keys |
| `uploads`       | `backend`, `frontend`, `nginx` | Shared profile-image uploads         |

Uploaded files are written by backend to `/app/public/uploads` and shared read-only to frontend/nginx containers.

---

## Notes

- JWT tokens are signed for **7 days**.
- Booking hours are validated server-side to the range **08:00–22:00**.
- The `/api/admin/initial` route should be used only for controlled setup and protected with a strong `ADMIN_SETUP_PASS`.
- Change placeholder values in `nginx-certbot.env` and your Nginx vhost config before public deployment.
