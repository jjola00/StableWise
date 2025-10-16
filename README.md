# StableWise

> **Transparent Sport Horse & Pony Sales Platform**

StableWise is a comprehensive marketplace that brings transparency to sport horse and pony sales through verified performance data, AI-powered insights, and competition histories. Built for serious buyers and sellers in the international equestrian market.

## 🌟 Key Features

- **Verified Performance Data**: Competition results from verified sources across international venues
- **AI Performance Analysis**: Intelligent summaries of competition performance and trends using OpenAI
- **Transparent Listings**: No inflated claims - just documented performance history
- **International Scope**: Sport horses and ponies from competitions worldwide
- **Advanced Search**: Comprehensive database with filtering capabilities
- **Seller Dashboard**: Professional tools for listing and managing horses/ponies
- **Email Integration**: Automated communication system for buyer-seller interactions

## 🚀 Live Demo

Visit the live application at [stablewise.org](https://stablewise.org)

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks and functional components
- **TypeScript** - Type-safe development with full IntelliSense support
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible component library
- **React Router** - Client-side routing for SPA navigation
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time subscriptions** - Live updates for listings and messages
- **Authentication** - Secure user management with email verification

### AI & Integrations
- **OpenAI GPT-4** - AI-powered performance analysis and summaries
- **Netlify Functions** - Serverless functions for email handling
- **Zoho SMTP** - Professional email delivery system

### Deployment
- **Netlify** - Static site hosting with serverless functions
- **Custom Domain** - Professional stablewise.org domain

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │   Supabase      │    │   OpenAI API    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (AI Analysis) │
│                 │    │                 │    │                 │
│ • TypeScript    │    │ • PostgreSQL    │    │ • GPT-4         │
│ • Tailwind CSS  │    │ • Auth & RLS    │    │ • Performance   │
│ • shadcn/ui     │    │ • Real-time     │    │   Summaries     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Netlify       │    │   Zoho SMTP     │
│   (Hosting)     │    │   (Email)       │
│                 │    │                 │
│ • Static Host   │    │ • Transactional │
│ • Functions     │    │   Emails        │
│ • CDN           │    │ • Notifications │
└─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── SearchBar.tsx   # Advanced search functionality
│   └── ...
├── pages/              # Route components
│   ├── HomePage.tsx    # Landing page with hero section
│   ├── ForSale.tsx     # Horse/pony listings
│   ├── AnimalProfile.tsx # Individual animal details
│   ├── SellerDashboard.tsx # Seller management interface
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── integrations/       # External service integrations
│   └── supabase/       # Database client and types
└── main.tsx           # Application entry point

supabase/
├── functions/          # Edge functions
│   ├── generate-performance-summary/ # AI analysis
│   ├── send-contact-email/          # Email notifications
│   └── send-waitlist-email/         # Waitlist management
└── migrations/         # Database schema migrations
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Supabase Account** - [Sign up here](https://supabase.com/)
- **OpenAI API Key** - [Get your key here](https://platform.openai.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stablewise.git
   cd stablewise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Set up Row Level Security policies
   - Configure email templates

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |

## 🚀 Deployment

The application is deployed on Netlify with the following features:

- **Automatic deployments** from the main branch
- **Serverless functions** for email handling
- **Custom domain** (stablewise.org)
- **SSL certificates** automatically managed
- **CDN** for fast global delivery

### Netlify Configuration

The `netlify.toml` file configures:
- Build command: `npm run build`
- Publish directory: `dist`
- Function directory: `netlify/functions`

## 🎯 Features Showcase

### Technical Implementation
- **Type-Safe Development**: Full TypeScript implementation with strict type checking
- **Modern React Patterns**: Hooks, context, and functional components throughout
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Code splitting, lazy loading, and optimized builds
- **Real-time Updates**: Live data synchronization with Supabase
- **AI Integration**: Seamless OpenAI API integration for intelligent analysis

### Business Value
- **Market Transparency**: Verified data eliminates guesswork in horse sales
- **Professional Tools**: Comprehensive seller dashboard and listing management
- **International Reach**: Support for competitions and venues worldwide
- **Trust & Security**: Secure authentication and data protection
- **Scalable Architecture**: Built to handle growth in users and data

## 📄 License

All Rights Reserved. This project is proprietary software. No permission is granted for use, modification, or distribution without explicit authorization from the copyright holder.
---

*Built with ❤️ for the equestrian community*