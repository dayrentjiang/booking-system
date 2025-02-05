# Court Booking Management System - Technical Documentation

## Overview

A comprehensive court booking management system designed for court owners to manage bookings, courts, and customer data. The application provides real-time booking management, court administration, and reporting capabilities.

## Tech Stack

### Frontend

- Next.js (React Framework)
- Tailwind CSS for styling
- React Components for UI elements

### Backend

- Prisma as ORM
- Supabase for:
  - Database (PostgreSQL)
  - Authentication
  - Real-time features

## Core Features

### 1. Authentication & Authorization

#### User Types

- Court Owner (admin)
- System Admin (super admin)

#### Implementation Details

- Utilize Supabase Auth for user management
- Protected routes using Next.js middleware
- Role-based access control (RBAC)

### 2. Dashboard

#### Overview Statistics

- Total bookings (daily, weekly, monthly)
- Revenue metrics
- Court utilization rates
- Upcoming bookings

#### Implementation Notes

- Real-time updates using Supabase subscriptions
- Data aggregation using Prisma queries
- Charts and visualizations using a preferred charting library

### 3. Booking Management

#### Calendar View

- Monthly/weekly/daily views
- Color-coded booking status
- Time slot visualization

#### Booking Features

- Manual booking creation by owner
- Booking modification
- Cancellation handling
- Conflict prevention

#### Implementation Details

- Use a React calendar library (e.g., FullCalendar)
- Real-time updates for booking changes
- Booking validation middleware

### 4. Court Management

#### Features

- Add new courts
- Edit existing court details
- Set court availability
- Pricing configuration

#### Court Properties

- Name/identifier
- Type/category
- Operating hours
- Pricing structure
- Maintenance schedules

#### Implementation Notes

- CRUD operations using Prisma
- Image upload for court photos
- Validation for court data

### 5. Reporting System

#### Report Types

- Revenue reports
- Booking analytics
- Court utilization
- Customer statistics

#### Features

- Customizable date ranges
- Export functionality (CSV/PDF)
- Data visualization

#### Implementation Details

- Server-side data processing
- Caching for performance
- PDF generation library integration

## Database Schema

### Users

```sql
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  role          UserRole  @default(COURT_OWNER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  courts        Court[]
  bookings      Booking[]
}

enum UserRole {
  SYSTEM_ADMIN
  COURT_OWNER
}
```

### Courts

```sql
model Court {
  id              String        @id @default(uuid())
  name            String
  type            CourtType
  hourlyRate      Decimal       @db.Decimal(10, 2)
  description     String?
  imageUrl        String?
  operatingHours  Json          // Store as { open: "09:00", close: "22:00" }
  maintenanceDay  DayOfWeek?
  ownerId         String
  owner           User          @relation(fields: [ownerId], references: [id])
  bookings        Booking[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([ownerId])
}

enum CourtType {
  TENNIS
  BADMINTON
  SQUASH
  BASKETBALL
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}
```

### Bookings

```sql
model Booking {
  id          String        @id @default(uuid())
  startTime   DateTime
  endTime     DateTime
  status      BookingStatus @default(CONFIRMED)
  totalAmount Decimal       @db.Decimal(10, 2)
  courtId     String
  court       Court         @relation(fields: [courtId], references: [id])
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([courtId])
  @@index([userId])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── courts/
│   │   │   ├── bookings/
│   │   │   └── reports/
│   │   ├── api/
│   │   │   ├── courts/
│   │   │   ├── bookings/
│   │   │   └── reports/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── courts/
│   │   │   ├── CourtCard.tsx
│   │   │   ├── CourtForm.tsx
│   │   │   └── ...
│   │   ├── bookings/
│   │   │   ├── BookingCalendar.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   └── ...
│   │   └── reports/
│   │       ├── RevenueChart.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCourts.ts
│   │   └── useBookings.ts
│   └── types/
│       └── index.ts
├── prisma/
│   └── schema.prisma
├── public/
│   ├── images/
│   └── icons/
├── .env
├── package.json
└── tsconfig.json
```

### Directory Structure Explanation

#### `/src/app`

- Next.js 13+ app directory using the new App Router
- Routes are organized by feature (auth, dashboard, etc.)
- API routes for backend functionality

#### `/src/components`

- Reusable React components organized by feature
- `ui/` contains basic UI components
- Feature-specific components in their respective directories

#### `/src/lib`

- Utility functions and configuration
- Database and third-party service setup

#### `/src/hooks`

- Custom React hooks for shared logic
- Feature-specific hooks for data fetching and state management

#### `/src/types`

- TypeScript type definitions and interfaces

#### `/prisma`

- Database schema and migrations
- Prisma client configuration

#### `/public`

- Static assets like images and icons

This structure follows the feature-first organization principle, making it easy to:

- Locate related code quickly
- Scale the application
- Maintain separation of concerns
- Share components and utilities across features
