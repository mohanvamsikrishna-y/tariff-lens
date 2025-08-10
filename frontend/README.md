# Tariff Lens Frontend

This folder contains the Next.js frontend for the Tariff Lens project.

## Setup

1. Install dependencies using npm:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

The app will be available at http://localhost:3000.

## Pages

- `/` – Main page showing a searchable tariff table and AI chat.
- `/visualizations` – Visualizations page with charts (coming soon).

## Components

- `Layout` – Provides site-wide layout and styling.
- `TariffTable` – Displays tariff data from `/api/tariffs` with search.
- `ChatDock` – Simple chat interface to interact with the calculator.

## API

API routes are located in `pages/api`:

- `tariffs.js` – Returns tariff data. Accepts `q` query for search.
- `calc.js` – Calculates duties based on query parameters.

## Styling

The app uses Tailwind CSS and global styles defined in `styles/globals.css`. The design uses a warm beige background and serif fonts (`Inter`, `Playfair Display`).

---
