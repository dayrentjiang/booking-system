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

erDiagram
OWNERS ||--o{ VENUES : owns
VENUES ||--o{ COURTS : contains
SPORT_TYPES ||--o{ COURTS : categorizes
COURTS ||--o{ COURT_PRICING : has
TIME_SLOTS ||--o{ COURT_PRICING : defines
COURTS ||--o{ BOOKINGS : receives
CUSTOMERS ||--o{ BOOKINGS : makes
HOLIDAYS }o--o{ COURT_PRICING : affects

    OWNERS {
        UUID id PK
        VARCHAR name
        VARCHAR email
        VARCHAR phone
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    VENUES {
        UUID id PK
        UUID owner_id FK
        VARCHAR name
        TEXT address
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    SPORT_TYPES {
        UUID id PK
        VARCHAR name
    }

    COURTS {
        UUID id PK
        UUID venue_id FK
        UUID sport_type_id FK
        VARCHAR name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    TIME_SLOTS {
        UUID id PK
        TIME start_time
        TIME end_time
        VARCHAR name
    }

    COURT_PRICING {
        UUID id PK
        UUID court_id FK
        UUID time_slot_id FK
        ENUM day_type
        DECIMAL rate
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    CUSTOMERS {
        UUID id PK
        VARCHAR name
        VARCHAR email
        VARCHAR phone
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    BOOKINGS {
        UUID id PK
        UUID court_id FK
        UUID customer_id FK
        TIMESTAMP start_time
        TIMESTAMP end_time
        ENUM booking_status
        ENUM payment_status
        DECIMAL total_amount
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    HOLIDAYS {
        UUID id PK
        DATE date
        VARCHAR name
        TIMESTAMP created_at
    }

```

## Project Structure

```

├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── login/
│ │ │ └── register/
│ │ ├── (dashboard)/
│ │ │ ├── courts/
│ │ │ ├── bookings/
│ │ │ └── reports/
│ │ ├── api/
│ │ │ ├── courts/
│ │ │ ├── bookings/
│ │ │ └── reports/
│ │ └── layout.tsx
│ ├── components/
│ │ ├── ui/
│ │ │ ├── Button.tsx
│ │ │ ├── Input.tsx
│ │ │ └── ...
│ │ ├── courts/
│ │ │ ├── CourtCard.tsx
│ │ │ ├── CourtForm.tsx
│ │ │ └── ...
│ │ ├── bookings/
│ │ │ ├── BookingCalendar.tsx
│ │ │ ├── BookingForm.tsx
│ │ │ └── ...
│ │ └── reports/
│ │ ├── RevenueChart.tsx
│ │ └── ...
│ ├── lib/
│ │ ├── prisma.ts
│ │ ├── supabase.ts
│ │ └── utils.ts
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useCourts.ts
│ │ └── useBookings.ts
│ └── types/
│ └── index.ts
├── prisma/
│ └── schema.prisma
├── public/
│ ├── images/
│ └── icons/
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
```
