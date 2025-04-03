# Project Overview

This project is a modern web application built with cutting-edge technologies
and follows a monorepo architecture powered by Deno workspaces.

## Technology Stack

- **React 19**: The latest version of React for building user interfaces
- **Tailwind CSS v4**: For utility-first styling
- **Deno**: Used for dependency management, linting, formatting, and type
  checking
- **Vite**: Powering the development server and build process
- **shadcn/ui**: Component library for the UI package

## Project Structure

The project follows a monorepo structure with two main directories:

### `/apps`

Contains individual applications:

- `chat`: A Vite-powered React application

### `/packages`

Contains shared packages and libraries:

- `ui`: A shared UI component library built with shadcn/ui

## Development Workflow

The project leverages Deno for various development tasks:

- Dependency management
- Code linting
- Code formatting
- Type checking

## Getting Started

1. Ensure you have Deno installed on your system
2. Clone the repository
3. Run the following commands:
   ```bash
   # Install dependencies
   deno task install

   # Start development server
   deno task dev

   # Run linting
   deno task lint

   # Format code
   deno task fmt

   # Type checking
   deno task check
   ```

## Architecture

The monorepo structure allows for:

- Shared code and components across applications
- Consistent development experience
- Efficient dependency management
- Simplified versioning and deployment

## UI Components

The `packages/ui` package provides a collection of reusable components built
with shadcn/ui, ensuring a consistent design system across all applications in
the monorepo.
