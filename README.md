# MFauth

**MFauth** is a simple, secure and modern authentication platform **built from scratch** with Next.js, Supabase, and Prisma without any third party features involvement. supporting MFA, OAuth and secure user interactions. It is designed for me to explore, understand and implement advanced security concepts.

## Key Features

- **Secure authentication** using **JWT** and **bcrypt** for email/password login.
- **Manual OAuth integration** with **GitHub** and **Google** for external sign-in.
- **Email verification** and **password** reset via secure, token-based links.
- **Transactional emails** powered by **Nodemailer**.
- **Full user profile management** with edit, delete, and avatar customization.
- **Route protection** and session validation through custom **middleware**.
- **AES encryption/decryption** support for handling sensitive data securely(**simple activity for user**).
- **Structured logging** and **user event reporting** for tracking actions.
## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4
- **Backend:** Prisma ORM, Supabase (PostgreSQL), Node.js
- **Language:** TypeScript (used across frontend & backend)
- **Auth & Security:** JWT, bcryptjs, jose, crypto-js, Zod
- **Email & Utilities:** Nodemailer, axios, date-fns, react-hot-toast
- **UI & Components:** react-icons, lucide-react, react-nice-avatar, Tailwind CSS

## Why I Built This

I built **mfauth** to challenge myself—no shortcuts, no third-party auth magic.  
Just me, raw logic, and a drive to understand authentication and security from the ground up.

## Acknowledgement

This project was inspired by various **open-source tutorials** and **my knowledge**. Their guidance helped me combine practical knowledge with real-world implementation, shaping this project into a valuable learning experience.