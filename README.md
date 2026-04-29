# Nexus - Modern Event Management Platform

> A comprehensive, high-performance event management and ticketing platform built with Next.js, Convex, and Clerk.

**[🚀 View Live Demo Here](#)** *(https://nexus-one-liard.vercel.app/)*

---

## 📸 Screenshots

*(Replace these placeholders with actual screenshots from your app)*

| Landing Page | Explore Events | Create Events | My Tickets Page |
| :---: | :---: | :---: |
| <img src="https://drive.google.com/file/d/1BY5JzAVXuHQu1vqF3WWhsefEeLA9yDGz/view?usp=sharing" alt="Landing Page" width="300" /> | <img src="https://drive.google.com/file/d/1s01SRXMCYOV9_gUKOWQRuKQo80h54fsT/view?usp=sharing" alt="Explore Events Details" width="300" /> | <img src="https://drive.google.com/file/d/1hNZpnWwtJdaeDuxF3M4z2kpHNPttkMzT/view?usp=sharing" alt="Create Events" width="300" /> | <img src="https://drive.google.com/file/d/1L1h4nb13LZYqLRrVEs--0xrIi9tRPG4_/view?usp=sharing" alt="My Tickets Page" width="300" /> |
| Discover events with advanced location filtering. | View details, ticket pricing, and register. | Scan QR codes and manage attendees. |

---

## ✨ Features

- **Event Creation & Discovery**: Seamlessly create, manage, and discover free or paid events.
- **Ticketing & Check-in**: Automatic QR code generation for tickets and a built-in QR scanner for event organizers to check in attendees at the door.
- **Advanced Waitlist System**: Automated waitlist management when events reach capacity, complete with auto-promotions when attendees cancel.
- **Location-Based Filtering**: Find events near you using country, state, and city-level search capabilities.
- **Pro Tier Membership**: 
  - **Early Access ⚡**: 48-hour head start on registering for new events.
  - **Priority Waitlist 🥇**: Pro members automatically jump to the front of the queue.
  - **Exclusive Discounts**: Flat 10% off on all paid events.
  - **Gated Content 🔒**: Host and attend "Pro-Only" events.
  - **Verified Badge**: A glowing #CCFF00 PRO badge to show off status.
- **Robust Authentication**: Secure login and user management powered by Clerk.

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 16](https://nextjs.org/) (App Router) + React 19
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database**: [Convex](https://convex.dev/) (Real-time serverless database)
- **Authentication**: [Clerk](https://clerk.dev/)
- **Forms & Validation**: `react-hook-form` + `zod`
- **QR Codes**: `react-qr-code` (Generation) + `html5-qrcode` (Scanning)

---

## 🚀 Quick Start

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nexus.git
cd nexus
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root directory and add the following keys. You will need to create accounts on Clerk and Convex to get these credentials.

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Convex Database
CONVEX_DEPLOYMENT=dev:... # Added by `npx convex dev`
NEXT_PUBLIC_CONVEX_URL=https://...
```

### 4. Start the development environment

You need to run both the Next.js frontend and the Convex backend simultaneously.

In one terminal, start Convex:
```bash
npx convex dev
```

In a second terminal, start Next.js:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Core Architecture Overview

- **`app/(public)`**: Contains the public-facing pages such as the landing page, event discovery (`/explore`), and event detail pages.
- **`app/(main)`**: Contains authenticated routes like the user dashboard, ticket wallet, and event creation workflow.
- **`app/(public)/events/[slug]/manage`**: The dedicated organizer hub for managing a specific event, viewing attendees, and checking them in via QR scanner.
- **`convex/`**: Contains all backend functions, database schema definitions (`schema.js`), and API endpoints for interacting with the data layer.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
