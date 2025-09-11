# CYGLABS 3D E-commerce Platform

## Overview

CYGLABS 3D is a modern e-commerce platform specializing in 3D printed products and services. The application enables customers to browse and purchase 3D printed items, view interactive STL models, and subscribe to premium plans for exclusive content. The platform supports both resin and filament printing types and includes a comprehensive shopping cart system, order management, and subscription services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **3D Visualization**: Three.js with STL loader for interactive 3D model viewing

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for products, categories, cart, orders, and subscriptions
- **File Uploads**: Multer middleware for STL file handling with 50MB size limit
- **Session Management**: Session-based cart management with localStorage integration

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon PostgreSQL serverless database
- **Schema**: Comprehensive relational schema including products, categories, customers, orders, cart items, subscriptions, and reviews
- **Migrations**: Drizzle Kit for schema migrations and database management

### Key Features
- **Product Catalog**: Categorized browsing with search functionality and featured products
- **STL Viewer**: Interactive 3D model preview using Three.js
- **Shopping Cart**: Session-based cart with persistent storage
- **Order Management**: Complete order lifecycle with payment status tracking
- **Subscription System**: Premium membership tiers with exclusive access
- **Admin Panel**: Product and category management interface
- **Responsive Design**: Mobile-first approach with desktop optimization

### Security & Performance
- **File Validation**: STL file type validation and size limits
- **Error Handling**: Comprehensive error boundaries and API error management
- **Development Tools**: Replit integration with runtime error overlays and cartographer

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL serverless database via `@neondatabase/serverless`
- **ORM**: Drizzle ORM for type-safe database operations
- **UI Components**: Radix UI primitives for accessible components
- **3D Graphics**: Three.js for STL file rendering and interactive 3D views

### Development & Build Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Replit Integration**: Development environment with runtime error modal and cartographer

### Third-party Services
- **Font Provider**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Session Storage**: PostgreSQL-based session storage via `connect-pg-simple`
- **File Processing**: Multer for handling STL file uploads
- **Form Handling**: React Hook Form with Zod validation schemas

### API Integrations
- **Payment Processing**: Configured for future payment gateway integration
- **Email Services**: Prepared for transactional email integration
- **Analytics**: Ready for tracking and analytics service integration