# 🎬 IMovies - Next-Gen Cinema Experience & Ticket Booking Platform

A full-stack, state-of-the-art online movie ticket reservation platform built with **React 18**, **Node.js**, **Express.js**, **MongoDB**, and modern **Bootstrap 5 + Glassmorphism Cinema UI**. It features an interactive curved auditorium screen & tiered seating layout, real-time seat lock tracking, secure JWT authentication, instant digital QR boarding passes, booking cancellation with automated seat release, and an administrative cinema management portal.

---

## 🌟 Key Features & Modern UI Enhancements

- **Modern Cinematic UI**:
  - Deep obsidian dark theme (`#070a12`, `#0e1526`, `#131d33`) with glowing crimson neon accents.
  - Premium Google typography (**Outfit** & **Plus Jakarta Sans**).
  - Ambient glassmorphism panels with smooth frosted blurs and hover elevation.
- **Hero Showcase & Discovery**:
  - Full-width cinematic hero stage with background backdrop blurs, rating badges, and one-click seat booking.
  - Real-time search by movie title and quick genre pill filtering (Action, Sci-Fi, Drama, Adventure, etc.).
  - Language and sorting dropdowns (Top Rated, Duration, Alphabetical).
- **Interactive Visual Auditorium Seating**:
  - Realistic curved laser cinema screen with light projection beam effect.
  - Multi-tier seat pricing: **VIP Recliner** (Rows A–B), **Premium Executive** (Rows C–D), and **Standard Classic** (Rows E–F).
  - Real-time seat statuses: Available, Selected (emerald glow), and Reserved.
  - Live seat price calculator with convenience fee & GST breakdown.
- **Instant Digital QR Boarding Passes**:
  - Ultra-realistic perforated ticket stub design with side cutout notches.
  - Booking reference ID (`IMV-XXXXX`), QR code simulation, and barcode verification.
  - One-click print/save PDF formatted specifically for clean printing.
- **User Dashboard & Ticket Wallet**:
  - Access past and active bookings with status tags (Completed / Cancelled).
  - Single-click booking cancellation that instantly releases reserved seats back to the hall.
- **Admin Management Console**:
  - Live dashboard metrics: Catalog Movies, Active Screens, Seats Per Auditorium, Server Status.
  - Add new movies with live poster preview.
  - Schedule auditorium showtimes with automatic 48-seat matrix generation.
  - Manage and delete catalog movies.

---

## 🏗️ System Architecture

```
IMovies/
├── client/                     # Frontend (React 18 + Vite + Bootstrap 5 + Glassmorphism)
│   ├── public/
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── Navbar.jsx      # Sticky frosted glass navbar with user dropdown
│   │   │   ├── Footer.jsx      # Cinema footer with trust badges & newsletter
│   │   │   ├── MovieCard.jsx   # Movie card with zoom, rating badge & specs
│   │   │   └── SeatGrid.jsx    # Realistic curved screen & tiered auditorium seats
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global JWT auth state & helper actions
│   │   ├── pages/
│   │   │   ├── HomePage.jsx               # Hero banner, format cards, filters, catalog
│   │   │   ├── MovieDetailPage.jsx        # Backdrop overview, specs & date showtime selector
│   │   │   ├── SeatSelectionPage.jsx      # Real-time seat picker & checkout summary
│   │   │   ├── BookingConfirmationPage.jsx# Perforated digital QR pass
│   │   │   ├── MyBookingsPage.jsx         # User ticket wallet & cancellation
│   │   │   ├── LoginPage.jsx              # Sign-in with password toggle & demo quick-fill
│   │   │   ├── RegisterPage.jsx           # Registration with validation
│   │   │   └── AdminPage.jsx              # Admin control panel with metrics & tabs
│   │   ├── App.jsx             # React router configuration
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Modern cinema dark theme & custom styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy to port 5000
│
├── server/                     # Backend (Node.js + Express.js + Mongoose)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Resilient MongoDB connection handler with DNS fallbacks
│   │   ├── controllers/
│   │   │   ├── authController.js    # Register, login, user profile
│   │   │   ├── movieController.js   # CRUD operations for movies
│   │   │   ├── showtimeController.js# Showtimes & seating layouts
│   │   │   └── bookingController.js # Seat reservation & cancellations
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verification & admin guard
│   │   │   └── errorHandler.js # Centralized API error handling
│   │   ├── models/
│   │   │   ├── User.js         # User model with bcrypt password hashing
│   │   │   ├── Movie.js        # Movie schema with genres, duration, posters
│   │   │   ├── Showtime.js     # Showtimes schema with embedded seat matrix
│   │   │   └── Booking.js      # Booking schema with reference & seat items
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── movieRoutes.js
│   │   │   ├── showtimeRoutes.js
│   │   │   └── bookingRoutes.js
│   │   ├── seed/
│   │   │   ├── seedData.js     # Blockbuster movies catalog
│   │   │   └── seeder.js       # Database seeder script
│   │   └── server.js           # Express app initialization & route mounting
│   ├── .env                    # Environment variables (configured with your MongoDB URI)
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package with concurrent dev scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB (`mongodb://127.0.0.1:27017/imovies`) or MongoDB Atlas cloud connection string.

### 2. Configure Your MongoDB Connection URL
Open `server/.env` and update `MONGODB_URI` with your own MongoDB Atlas connection string or local MongoDB URL:

```env
PORT=5000
# Example for MongoDB Atlas:
MONGODB_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/imovies?retryWrites=true&w=majority

# Or Example for Local MongoDB:
# MONGODB_URI=mongodb://127.0.0.1:27017/imovies

JWT_SECRET=imovies_super_secret_jwt_key_2026
NODE_ENV=development
```

### 3. Seed Database with Realistic Data
To populate sample blockbuster movies (*Dune: Part Two*, *Oppenheimer*, *Spider-Man*, *Interstellar*, *Inception*, etc.), auditorium showtimes, and demo accounts:
```bash
npm run seed
```

#### Demo Credentials Created:
- **Customer**: `user@imovies.com` / `password123`
- **Admin**: `admin@imovies.com` / `password123`
*(One-click demo login buttons are provided on the Sign In page!)*

### 4. Run the Full Application Concurrently
Start both backend API server (port 5000) and frontend client (port 3000):
```bash
npm run dev
```

- Web App: **`http://localhost:3000`**
- API Health Check: **`http://localhost:5000/api/health`**

---

## 📤 Upload to Your GitHub Repository

To upload this project to your GitHub account:

1. Create a new repository on your GitHub (e.g. `https://github.com/<your-username>/IMovies.git`).
2. Run the following commands in the root `IMovies` folder:

```bash
# Verify current status
git status

# Stage all files
git add .

# Commit changes
git commit -m "feat: complete modern cinematic UI redesign and MongoDB configuration"

# Set remote origin to your GitHub repository
git remote set-url origin https://github.com/<your-username>/<your-repo-name>.git

# Push to your repository
git branch -M main
git push -u origin main
```
*(If you need to authenticate, use your GitHub Personal Access Token or sign in via browser).*

---

## 📡 REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user account |
| POST | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| GET | `/api/auth/me` | Private | Fetch logged-in user profile |

### Movies (`/api/movies`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/movies` | Public | Get all active movies (search, genre, language) |
| GET | `/api/movies/:id` | Public | Get movie details along with scheduled showtimes |
| POST | `/api/movies` | Admin | Add new movie to catalog |
| PUT | `/api/movies/:id` | Admin | Update movie information |
| DELETE | `/api/movies/:id` | Admin | Delete movie and associated showtimes |

### Showtimes (`/api/showtimes`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/showtimes` | Public | List showtimes by movie or date |
| GET | `/api/showtimes/:id` | Public | Get auditorium seat status map |
| POST | `/api/showtimes` | Admin | Schedule showtime with seat matrix |
| DELETE | `/api/showtimes/:id` | Admin | Cancel and remove showtime |

### Bookings (`/api/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/bookings` | Private | Reserve selected seats & complete payment |
| GET | `/api/bookings/my-bookings` | Private | List all bookings for current user |
| GET | `/api/bookings/:id` | Private | Get single booking receipt details |
| PUT | `/api/bookings/:id/cancel` | Private | Cancel reservation & release seats |
