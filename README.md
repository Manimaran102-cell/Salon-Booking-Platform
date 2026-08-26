# GlowUp - Salon Booking Platform

A full-stack salon booking platform built with the MERN stack where customers can discover salons, explore services, choose a stylist, and book appointments.

## Architecture

```
glowup/
├── backend/              # Express.js + MongoDB REST API
├── customer-web/         # React (Vite) - Customer booking app
├── salon-dashboard/      # React (Vite) - Salon owner/staff dashboard
├── admin-dashboard/      # React (Vite) - Platform admin dashboard
├── mobile-app/           # React Native (Expo) - Mobile booking app
└── marketing-website/    # Static HTML/CSS - Landing page
```

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT Auth
- **Customer Web**: React 18, React Router, Vite, Axios
- **Dashboards**: React 18, React Router, Vite
- **Mobile**: React Native (Expo), React Navigation
- **Marketing**: HTML5, CSS3, Vanilla JS

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend API

```bash
cd backend
npm install
cp .env.example .env    # Edit with your MongoDB URI and JWT secret
npm run seed            # Populate demo data
npm run dev             # Starts on http://localhost:5000
```

**Hiding your .env file:**
The `.env` file contains secrets (database URI, JWT key). It is listed in `.gitignore` so it will **never** be committed to Git. Use `.env.example` as a template. Always use real values only in your local `.env` file. Never commit `.env` to version control.

### 2. Customer Web App

```bash
cd customer-web
npm install
npm run dev             # Starts on http://localhost:3000
```

### 3. Salon Dashboard

```bash
cd salon-dashboard
npm install
npm run dev             # Starts on http://localhost:3001
```

### 4. Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev             # Starts on http://localhost:3002
```

### 5. Mobile App

```bash
cd mobile-app
npm install
npx expo start          # Scan QR code with Expo Go
```

> **Note**: Update `src/utils/api.js` in mobile-app to point to your machine's IP address instead of `localhost` (e.g., `http://192.168.1.x:5000/api`) for mobile device testing.

### 6. Marketing Website

Open `marketing-website/index.html` in a browser, or serve with any static server.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@glowup.com | admin123 |
| **Salon Owner 1** | jessica@demo.com | demo123 |
| **Salon Owner 2** | david@demo.com | demo123 |
| **Customer 1** | sarah@demo.com | demo123 |
| **Customer 2** | mike@demo.com | demo123 |
| **Customer 3** | emily@demo.com | demo123 |
| **Staff 1** | anna@demo.com | demo123 |
| **Staff 2** | chris@demo.com | demo123 |
| **Staff 3** | mia@demo.com | demo123 |
| **Staff 4** | ryan@demo.com | demo123 |

## User Flows

### Customer Flow
1. **Login/Register** → Create account or sign in
2. **Discover Salons** → Browse/search salons by location, category, rating
3. **View Salon** → See services, staff, hours, reviews
4. **Book Appointment** → Select services → Choose stylist → Pick date/time → Confirm
5. **Manage Bookings** → View history, cancel upcoming appointments

### Salon Owner Flow
1. **Dashboard** → View stats, recent appointments, revenue
2. **Manage Services** → CRUD for services with pricing and duration
3. **Manage Staff** → Add/remove staff, set specialties and working hours
4. **Manage Appointments** → View, confirm, start, complete appointments
5. **Salon Settings** → Update salon info, address, opening hours

### Admin Flow
1. **Dashboard** → Platform-wide stats, revenue, appointment breakdown
2. **Manage Users** → View, activate/deactivate customers, owners, staff
3. **Manage Salons** → Toggle active status, feature/unfeature salons
4. **View All Appointments** → Filter by status, view across all salons
5. **View Reviews** → Monitor platform reviews

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Salons
- `GET /api/salons` - List salons (with search, filter, pagination)
- `GET /api/salons/:id` - Get salon with staff, services, reviews
- `POST /api/salons` - Create salon (salon_owner, admin)
- `PUT /api/salons/:id` - Update salon
- `DELETE /api/salons/:id` - Deactivate salon

### Services
- `GET /api/services` - List services
- `POST /api/services` - Create service (salon_owner)
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Deactivate service

### Staff
- `GET /api/staff` - List staff
- `POST /api/staff` - Add staff (salon_owner)
- `PUT /api/staff/:id` - Update staff
- `PUT /api/staff/:id/working-hours` - Update working hours
- `POST /api/staff/:id/leave` - Request leave
- `PUT /api/staff/:staffId/leave/:leaveId` - Approve/reject leave

### Availability
- `GET /api/availability?staffId=&date=&serviceId=` - Get available time slots

### Appointments
- `GET /api/appointments` - List appointments (role-filtered)
- `POST /api/appointments` - Create booking (with conflict check)
- `PUT /api/appointments/:id/status` - Update status (salon_owner, staff)
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review (customer)
- `PUT /api/reviews/:id/reply` - Reply to review (salon_owner)

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/salons` - All salons
- `GET /api/admin/appointments` - All appointments
- `GET /api/admin/reviews` - All reviews

## Key Technical Decisions

1. **Double-booking prevention**: Appointments are checked for time overlap before creation using MongoDB queries comparing start/end times
2. **Role-based access**: JWT tokens carry user role; middleware enforces permissions per route
3. **Availability calculation**: Server generates time slots dynamically based on staff working hours, leave, and existing appointments
4. **Shared backend**: All four frontends (customer web, salon dashboard, admin dashboard, mobile app) consume the same REST API
5. **Text search**: MongoDB text indexes on salon name and description for search functionality
6. **Rating aggregation**: Salon and staff ratings are recalculated using MongoDB aggregation pipeline when reviews are added

## Security

- Passwords hashed with bcrypt
- JWT-based authentication with expiration
- Rate limiting on API endpoints (200 req/15min)
- Helmet.js for HTTP security headers
- Input validation with express-validator patterns
- CORS configuration
- Role-based route protection

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/glowup
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

**⚠️ Important**: Never commit your `.env` file. Always use `.env.example` as a template and create your own `.env` locally.

## License

MIT
