# JS Community

A modern JavaScript/TypeScript-based community platform built with Next.js 16, migrating from Discourse (Ruby).

## 🚀 Overview

This repository contains the JS Community platform, a Next.js 16 application that is migrating from a Discourse-based (Ruby) community forum to a modern, full-stack JavaScript/TypeScript solution.

## 📁 Repository Structure

```
js-community/
├── .github/                    # GitHub configuration and workflows
│   ├── copilot-instructions.md # GitHub Copilot coding agent instructions
│   └── copilot-setup-steps.yml # Environment setup for Copilot
├── discourse/                  # Legacy Discourse (Ruby) application
├── js-community/               # Main Next.js application
│   ├── src/                    # Source code
│   │   └── app/                # Next.js App Router pages
│   ├── public/                 # Static assets
│   ├── biome.json              # Biome configuration
│   ├── next.config.ts          # Next.js configuration
│   ├── package.json            # Project dependencies
│   ├── postcss.config.mjs      # PostCSS and TailwindCSS v4 configuration
│   └── tsconfig.json           # TypeScript configuration
└── scripts/                    # Build and deployment scripts
```

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Package Manager**: [pnpm](https://pnpm.io/) 11.0.8
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **React Version**: 19.2.3

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [pnpm](https://pnpm.io/) 11.0.8
- [Node.js](https://nodejs.org/) - Version 20 or higher

## 🚀 Getting Started

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ashutoshpw/js-community.git
cd js-community
```

2. **Navigate to the Next.js application**

```bash
cd js-community
```

3. **Install dependencies**

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

Build the application:

```bash
pnpm run build
```

Start the production server:

```bash
pnpm start
```

### Code Quality

**Lint your code:**

```bash
pnpm run lint
```

**Format your code:**

```bash
pnpm run format
```

## 📝 Development Workflow

1. Create a new branch for your feature or fix
2. Make your changes in the `js-community/` directory
3. Run `pnpm run lint` to check for issues
4. Run `pnpm run format` to format your code
5. Test your changes locally with `pnpm run dev`
6. Build the project with `pnpm run build` to ensure it compiles
7. Commit your changes and create a pull request

## 🔄 Migration from Discourse

This project is actively migrating from a Discourse-based community platform to a Next.js application. The `discourse/` directory contains the legacy Ruby application for reference during the migration process.

### Migration Goals

- Maintain feature parity with the existing Discourse platform
- Improve performance and user experience
- Leverage modern web technologies and frameworks
- Ensure data integrity during the migration process

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow the code standards defined in `.github/copilot-instructions.md`
2. Use TypeScript for all new code
3. Follow the existing project structure
4. Ensure all linting and formatting checks pass
5. Write clear commit messages
6. Update documentation as needed

## 📄 License

[Add your license information here]

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/motivation)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Biome Documentation](https://biomejs.dev/)
- [React Documentation](https://react.dev/)

## 🐛 Issues & Support

If you encounter any issues or have questions, please [open an issue](https://github.com/ashutoshpw/js-community/issues) on GitHub.

## 🎯 Project Status

🚧 **In Active Development** - Migrating from Discourse to Next.js

---

Built with Next.js, TypeScript, and pnpm
