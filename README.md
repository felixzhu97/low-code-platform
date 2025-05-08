L My Lowcode Project - Low Code Platform

A modern low-code platform built with Next.js and React 19, featuring drag-and-drop UI building, theme customization, and real-time collaboration.

## ✨ Features

- 🏗️ Drag-and-drop component builder
- 🎨 Theme editor with color picker
- ✨ Animation editor for interactive components
- 🤝 Real-time collaboration
- 📱 Responsive design controls
- 📦 Template gallery for quick starts
- 📊 Data visualization with Recharts
- 🎭 Radix UI based component library

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2
- **UI**: Radix UI + Tailwind CSS
- **State**: React 19
- **Forms**: react-hook-form + Zod validation
- **Styling**: Tailwind CSS + tailwind-merge + tailwindcss-animate
- **Utilities**: date-fns, clsx, class-variance-authority
- **Components**: 50+ pre-built components

## 🚀 Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Run development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📂 Project Structure

```
.
├── app/               # Next.js app router
├── components/        # UI components
│   ├── ui/            # Radix-based primitives
│   ├── form-builder/  # Drag-and-drop form builder
│   ├── theme-editor/  # Theme customization
│   └── ...            # Other feature components
├── hooks/             # Custom hooks
├── lib/               # Utilities and types
├── public/            # Static assets
└── styles/            # Global styles
```

## ⚙️ Configuration

- ESLint and TypeScript errors are ignored during builds
- Image optimization is disabled (see `next.config.mjs`)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT
