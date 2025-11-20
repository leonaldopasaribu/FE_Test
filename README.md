# FE Test - Traffic & Gate Management System

A modern web application for traffic and gate management built with React, TypeScript, and Vite. This system provides an intuitive interface for monitoring and managing traffic data and gate operations.

## 📸 Demo

### 1. Sign In Page
<img width="1470" height="715" alt="Sign In Page" src="https://github.com/user-attachments/assets/4f36379d-4b97-4d0b-b821-36487bf4c3f0" />

### 2. Dashboard Page
<img width="1470" height="676" alt="Dashboard Page" src="https://github.com/user-attachments/assets/6def3ed7-ebdb-4755-b714-972a8c18ba4f" />

### 3. Traffic Management Page
<img width="1470" height="691" alt="Traffic Page" src="https://github.com/user-attachments/assets/8103532b-3221-4347-a46a-5609752e4530" />

### 4. Gate Master Page
<img width="1470" height="669" alt="Gate Master Page" src="https://github.com/user-attachments/assets/f1e41d2c-e310-4559-8d65-ef4c00413267" />

## ✨ Features

- 🔐 **Authentication System** - Secure sign-in functionality
- 📊 **Dashboard** - Real-time monitoring and analytics
- 🚗 **Traffic Management** - Comprehensive traffic data tracking
- 🚧 **Gate Master** - Gate operations and management
- 🎨 **Modern UI** - Built with Chakra UI and TailwindCSS
- 🌙 **Dark Mode** - Theme switching support
- 📱 **Responsive Design** - Mobile-friendly interface
- ⚡ **Fast Performance** - Powered by Vite

## 🛠️ Tech Stack

### Core
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite 7** - Build tool and dev server

### Styling
- **TailwindCSS 4** - Utility-first CSS framework
- **Chakra UI** - Component library
- **Emotion** - CSS-in-JS

### Routing & State
- **React Router 7** - Client-side routing
- **Context API** - State management

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Testing Library** - Component testing

### Additional Libraries
- **Lucide React** - Icon library
- **React Helmet Async** - Head management
- **React Dropzone** - File upload
- **Flatpickr** - Date picker
- **Swiper** - Carousel/slider
- **SimpleBar** - Custom scrollbar

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm/yarn

## 🚀 Getting Started

### Installation

1. Clone the repository
```bash
git clone https://github.com/leonaldopasaribu/FE_Test.git
cd FE_Test
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Start the development server
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check code formatting |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Generate test coverage report |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=your_api_base_url
VITE_API_TIMEOUT=30000

# Add other environment variables as needed
```

### Vite Configuration

The project uses Vite for fast development and optimized builds. Configuration can be found in `vite.config.ts`.

## 🧪 Testing

This project uses Jest and React Testing Library for testing:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 🎨 Code Style

This project follows strict code quality standards:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Run the following commands to maintain code quality:

```bash
# Check linting
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## 📝 Development Guidelines

1. **Component Structure**: Follow the established component structure in `src/components`
2. **TypeScript**: Use proper TypeScript types and interfaces
3. **Styling**: Use TailwindCSS utility classes and Chakra UI components
4. **API Integration**: Place API calls in the `src/api` directory
5. **Testing**: Write tests for critical components and functions
6. **Code Formatting**: Run `pnpm format` before committing

## 👤 Author

**Leonaldo Pasaribu**

- GitHub: [@leonaldopasaribu](https://github.com/leonaldopasaribu)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Chakra UI](https://chakra-ui.com/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

Made with ❤️ by Leonaldo Pasaribu
