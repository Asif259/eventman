# Nexus: Modern Event Management & Ticketing Platform

## Description

Nexus is a high-performance event management platform that simplifies the entire event lifecycle—from creation and discovery to ticketing and real-time attendee check-ins. Built for speed and scalability, it offers a seamless experience for organizers and attendees alike.

## Long Description

Nexus is a comprehensive digital ecosystem for event management, built with modern web technologies to handle real-time interactions and complex logistics. The platform enables organizers to host free or paid events, manage attendee lists with an automated waitlist system, and verify tickets via integrated QR scanning. For attendees, Nexus provides a rich discovery experience with advanced location filtering and a premium Pro tier that offers early access, exclusive discounts, and priority status. Powered by a serverless real-time backend, Nexus ensures data integrity and instant updates across all user interfaces.

## Technology Used

### Frontend

- **Next.js 16.2 (App Router)** - Leveraging the latest Next.js features for high-performance server-side rendering and routing.
- **React 19** - Utilizing the newest React primitives for building dynamic, responsive user interfaces.
- **Tailwind CSS v4** - Modern, utility-first styling with native CSS-first configuration and container queries.
- **Base UI & shadcn/ui** - A blend of unstyled primitives and beautifully crafted components for a premium look.
- **Lucide React** - A comprehensive set of modern, lightweight icons.
- **Sonner** - Sleek, toast-based notification system for better user feedback.
- **Embla Carousel** - Smooth and flexible carousel for event displays.

### Backend & Authentication

- **Convex (v1.35)** - A real-time serverless database and backend platform that ensures instant data synchronization and ACID transactions.
- **Clerk (v7.1)** - Enterprise-grade authentication and user management with advanced identity metadata features.
- **Google Generative AI** - Integration for AI-driven capabilities within the platform.

### Utilities & Form Handling

- **Zod** - Robust, TypeScript-first schema declaration and validation.
- **React Hook Form** - Efficient, flexible form management with minimal re-renders.
- **country-state-city** - Extensive dataset for hierarchical location filtering.
- **date-fns** - Modern JavaScript date utility library for precise event scheduling.
- **html5-qrcode & react-qr-code** - Integrated tools for generating and scanning secure event tickets.

### Infrastructure & DevOps

- **Vercel** - Optimized cloud hosting with seamless CI/CD integration.
- **Docker** - (Mentioned if present, but the README/package.json focus on serverless)
- **Git & GitHub** - Version control and collaborative development workflow.

## Features

### Organizer Features
- **Event Creation Hub**: Effortlessly create events with detailed descriptions, pricing, and location data.
- **Real-time Attendee Management**: Monitor registrations, manage waitlists, and track attendance as it happens.
- **QR Check-in System**: A built-in mobile-responsive scanner to verify attendee tickets at the door.
- **Data Export**: Export attendee lists to CSV for external reporting and logistics.
- **Pro-Only Events**: Capability to host exclusive events limited to premium members.

### Attendee Features
- **Event Discovery**: Powerful search with hierarchical location filtering (Country > State > City).
- **Seamless Ticketing**: Register for events and receive digital tickets with unique QR codes instantly.
- **Automated Waitlist**: Join waitlists for at-capacity events with automatic promotion upon cancellations.
- **My Tickets Dashboard**: A centralized wallet for all upcoming and past event registrations.

### Pro Membership Perks
- **Early Access ⚡**: Register for high-demand events 48 hours before the general public.
- **Priority Waitlist 🥇**: Pro members automatically jump to the front of any registration queue.
- **Exclusive Discounts**: A flat 10% discount automatically applied to all paid events.
- **Verified Status**: A glowing #CCFF00 PRO badge and access to exclusive "Pro-Only" gatherings.

### Platform-Wide Features
- **Real-time Updates**: Live synchronization of event availability and ticket status via Convex.
- **Premium Aesthetics**: A dark-themed, glassmorphic UI designed for a modern, high-end feel.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## Challenges

- **Server-Side Security**: Transitioning from client-side trust to authoritative server-side validation for Pro membership and event access control.
- **Hierarchical Location Filtering**: Implementing efficient, dependent selectors for Country, State, and City within a serverless architecture.
- **Race Condition Prevention**: Managing simultaneous registrations and QR scans to ensure data integrity and prevent overbooking.
- **Backend Synchronization**: Maintaining a consistent state between Clerk’s authentication metadata and the Convex database records.
- **Performance at Scale**: Optimizing real-time subscriptions to handle high-traffic event launches without latency.
- **Complex Waitlist Logic**: Automating the promotion of waitlisted users while respecting Pro-tier priority and availability.

## Solution

Nexus addresses these challenges by leveraging the power of **Convex’s ACID-compliant transactions**, which eliminate race conditions during critical operations like ticket booking. The architecture enforces **server-side authoritative checks** for all sensitive actions, ensuring that Pro benefits and gated events are securely managed. By using **Next.js 15 and Tailwind CSS v4**, the platform achieves near-instant load times and a premium look, while **Clerk** provides a robust security layer that seamlessly syncs user status across the entire stack. This combination creates a reliable, real-time, and highly aesthetic event management experience.
