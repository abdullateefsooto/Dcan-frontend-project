# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




Dcan Mart

Dcan Mart is a modern e-commerce web application built with React and Vite, designed to deliver a seamless shopping experience with fast rendering, dynamic product listings, and a fully responsive design.

Tech Stack

Frontend: React, Vite, Tailwind CSS

State Management: React Hooks

Routing: React Router

Backend (Optional): Firebase / Node.js

Linting: ESLint

Version Control: Git

Key Features

Browse products by category

Search and filter products

Responsive design for both desktop and mobile devices

Admin dashboard for managing products

Integration with payment systems (Paystack or Stripe)

Dynamic product detail pages

Installation

Follow these steps to set up the project locally:

Clone the repository:

git clone https://github.com/yourusername/dcan-mart.git


Navigate to the project directory:

cd dcan-mart


Install dependencies:

npm install


Start the development server:

npm run dev


Open the application:
Open your browser and navigate to the URL displayed in the terminal (usually http://localhost:5173
).

Project Structure
dcan-mart/
├─ node_modules/          # Project dependencies (do not commit)
├─ public/                # Static assets
├─ src/
│  ├─ assets/             # Images, icons, and other assets
│  ├─ components/         # Reusable UI components
│  ├─ pages/              # Application pages
│  ├─ App.jsx             # Root application component
│  ├─ main.jsx            # Entry point of the app
│  └─ ...                 # Other source files
├─ .gitignore             # Specifies files/folders to ignore in Git
├─ package.json           # Project metadata and dependencies
├─ vite.config.js         # Vite configuration
└─ README.md              # Project documentation

Available Scripts
Command	Description
npm run dev	Start the development server
npm run build	Create a production build
npm run preview	Preview the production build locally
npm run lint	Run ESLint for code quality checks
Contribution Guidelines

We welcome contributions to improve Dcan Mart. To contribute:

Fork the repository

Create a feature branch:

git checkout -b feature-name


Make your changes and commit:

git commit -m "Add feature"


Push your branch:

git push origin feature-name


Open a Pull Request for review

Files and Folders to Exclude from GitHub

node_modules/ — contains installed dependencies; regenerate via npm install

.env — contains sensitive environment variables such as API keys or database credentials

dist/ or build/ — production build output

.DS_Store — macOS system files

*.log — log files

npm-debug.log* — npm debug logs

.vscode/ or other IDE-specific configuration folders