# POS Admin Dashboard Mock

A static frontend portfolio project for a modern POS and store-operations admin dashboard. It demonstrates practical React UI work across authentication, role-based navigation, reports, inventory, master data, users, cash entry, stock transfers, and store expense workflows.

This project is intentionally frontend-only. There is no backend, API server, or production authentication layer. All data and state are mocked locally so the interface can be reviewed as a complete product-style frontend demo.

## Demo Access

License key:

```text
VAISHALI
```

Demo users:

```text
vaishali / test
samyu / sam
```

## Features

- Static license and login flow
- Role-based module visibility
- Responsive admin layout with collapsible sidebar
- Light and dark mode support
- Dashboard with operational KPIs
- Reports module with filters, sorting, pagination, export-style actions, and bill preview
- Inventory and material movement workflows
- Master data management screens
- User management with role controls
- Cash entry, store expense, stock transfer, invoice, GRN, and pricing screens
- Local draft/state persistence using `localStorage`
- Shared design-system layer for headers, modal shells, auth panels, and icon badges
- Lazy-loaded modules for better initial bundle size

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React icons
- date-fns

## Design System

Reusable UI primitives live in:

```text
src/components/ui
```

Current shared components:

- `PageHeader`
- `IconBadge`
- `ModalShell`
- `AuthPanel`

The goal is to keep repeated layout patterns consistent while preserving each module’s workflow and visual behavior.

## Project Structure

```text
src/
  components/
    ui/
  context/
  data/
  pages/
  theme/
  utils/
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Notes

- This is a static portfolio mock, not a production POS system.
- Mock credentials and localStorage persistence are included only for demonstration.
- Generated output such as `dist/` and installed dependencies such as `node_modules/` are ignored.
- The UI is designed to showcase frontend architecture, state handling, reusable components, responsive layouts, and workflow-rich screens.
