# Coup Game Monorepo

A digital implementation of the popular social deduction card game "Coup" built with modern web technologies.

## 📦 Project Structure

This is a monorepo managed with PNPM workspaces containing three main packages:

### Packages

#### 🎨 Web (`packages/web`)

The frontend client application built with:

- React 18
- TypeScript
- Vite
- TailwindCSS
- Radix UI for accessible components
- Socket.io-client for real-time game communication
- Storybook for component development

#### 🖥️ Server (`packages/server`)

The game server handling game logic and real-time communication:

- Node.js with Express
- TypeScript
- Socket.io for real-time game events
- UUID for unique identifiers
- CORS enabled for development

#### 📚 Shared (`packages/shared`)

Common code shared between frontend and backend:

- TypeScript types and interfaces
- Game constants and utilities
- Shared validation logic

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PNPM (v8+)

### Installation

##### Install dependencies for all packages

```bash
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev-server

# In another terminal, start the client
pnpm dev-client
```

The client will be available at `http://localhost:5173`
The server will run on `http://localhost:3000`

### Storybook

```bash
# Run Storybook for component development
pnpm --filter web storybook
```

## 🛠️ Tech Stack

### Frontend

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS
- **Radix UI**: Accessible component primitives
- **Socket.io-client**: Real-time communication
- **Storybook**: Component development environment

### Backend

- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Type safety
- **Socket.io**: Real-time game events
- **UUID**: Unique identifier generation

### Shared

- **TypeScript**: Type definitions
- **PNPM Workspaces**: Monorepo management

## 📝 Development Guidelines

- Use TypeScript for all new code
- Follow conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- Write components in isolation using Storybook
- Keep shared types in the `shared` package
- Ensure proper error handling in both client and server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
