# Overview

This is a modern Snowflake Analytics and Observability application built as a full-stack web platform. The application provides comprehensive monitoring and analysis of Snowflake user activities, query performance, resource consumption, and data lineage tracking. It features a sophisticated dashboard interface for visualizing user analytics, tracking expensive queries, monitoring object usage patterns, and understanding data dependencies within Snowflake environments.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints following standard HTTP conventions
- **Data Layer**: In-memory storage implementation with interface-based design for future database integration
- **Development**: Hot module replacement and development middleware integration

## Data Storage Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Comprehensive data models for Snowflake users, analytics, activities, queries, and lineage tracking
- **Database**: PostgreSQL (configured but currently using in-memory storage for development)
- **Migrations**: Drizzle Kit for database schema management and versioning

## Component Architecture
- **Layout**: Sidebar navigation with main content area and header
- **Sections**: Modular dashboard sections for Overview, User Analytics, Activities, Expensive Queries, Object Usage, and Lineage Tracking
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Data Visualization**: Integration-ready for Chart.js and other visualization libraries

## Authentication & Authorization
- **Session Management**: Express session handling with PostgreSQL session store
- **User Management**: Basic user authentication system with password-based login
- **Security**: CORS configuration and request validation middleware

# External Dependencies

## Frontend Dependencies
- **UI Framework**: React ecosystem with TypeScript support
- **Component Library**: Radix UI for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **State Management**: TanStack Query for server state synchronization
- **Form Handling**: React Hook Form with Zod validation
- **Date Utilities**: date-fns for date manipulation and formatting
- **Icons**: Lucide React for consistent iconography

## Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL for cloud-native data storage
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Session Storage**: connect-pg-simple for PostgreSQL session persistence
- **Development Tools**: tsx for TypeScript execution and esbuild for production builds

## Development Tools
- **Build System**: Vite with React plugin for fast development experience
- **Type Checking**: TypeScript compiler with strict configuration
- **Code Quality**: ESLint and Prettier integration (configured via editor)
- **Development**: Replit-specific plugins for cloud development environment

## External Services
- **Database Hosting**: Configured for Neon Database PostgreSQL hosting
- **Analytics Data**: Mock Snowflake data structure for demonstration purposes
- **Deployment**: Ready for cloud deployment with environment-based configuration