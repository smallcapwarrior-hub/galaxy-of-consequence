# Galaxy of Consequence

## Overview

A Star Wars-themed text-based RPG game powered by AI. Players interact with a Game Master AI that maintains world state, tracks character progression, and responds to player actions with immersive narrative. The game features a retro sci-fi terminal aesthetic with CRT effects and typewriter animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui components (New York style)
- **Animations**: Framer Motion for UI transitions, react-type-animation for typewriter effects
- **Build Tool**: Vite with custom path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ESM modules
- **API Design**: Type-safe routes defined in shared/routes.ts with Zod validation
- **AI Integration**: OpenAI-compatible API via Replit AI Integrations for game master responses

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Session Storage**: In-memory storage (MemStorage class) for game sessions
- **Schema Location**: shared/schema.ts defines both database tables and API schemas
- **Client Persistence**: localStorage for session ID retention

### Key Design Patterns
- **Shared Types**: Zod schemas in shared/ folder used by both client and server
- **API Contract**: Routes defined with method, path, input schema, and response schemas
- **Game State**: World state stored as JSONB in sessions table, managed by AI responses
- **Component Library**: Full shadcn/ui component suite installed and configured

## External Dependencies

### AI Services
- **OpenAI API**: Accessed through Replit AI Integrations (AI_INTEGRATIONS_OPENAI_API_KEY, AI_INTEGRATIONS_OPENAI_BASE_URL environment variables)
- **Models Used**: Text completion for game master responses, image generation (gpt-image-1) available

### Database
- **PostgreSQL**: Required via DATABASE_URL environment variable
- **Drizzle Kit**: Used for schema migrations (db:push command)

### Build & Development
- **Vite**: Development server with HMR
- **esbuild**: Production server bundling
- **tsx**: TypeScript execution for development

### Replit-Specific Integrations
- Audio utilities for voice chat (client and server)
- Batch processing utilities with rate limiting
- Chat storage and routes infrastructure
- Image generation routes