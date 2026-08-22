# GlobeTrotter – Empowering Personalized Travel Planning

> A modern, responsive travel planning platform designed to dream, build, and visualize multi-city trip itineraries with dynamic budget tracking and public sharing.

![GlobeTrotter Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80)

---

## ✨ Features

- **REST API Ready Architecture**: Modular API abstraction layer (`src/services/api/`) built for seamless REST API & PostgreSQL backend integration.
- **Light Warm Vanilla Design System**: Clean, elegant travel-tech aesthetic with editorial headings, crisp warm cards, and controlled earthy accents.
- **13 Complete Application Screens**:
  - **Authentication**: Login, Signup, Forgot Password with input validation.
  - **Dashboard**: Personal travel workspace with upcoming trips, destination discovery, and quick metrics.
  - **Create Trip**: Trip parameters form with date validation and cover gallery selection.
  - **My Trips**: Travel collection grid with status filtering (`All`, `Upcoming`, `Completed`, `Planning`) and search.
  - **Itinerary Builder**: Multi-city journey route sequence (`Paris` ↓ `Rome` ↓ `Barcelona`), reorderable stop cards, catalog & custom activities.
  - **City Discovery**: Global search, region/country filtering, cost index, and bookmarking.
  - **Activity Search**: Filter by categories (`Sightseeing`, `Food`, `Adventure`, `Culture`, `Entertainment`), duration, and cost.
  - **Itinerary View**: Structured day-wise travel schedule with List View vs Timeline View toggle.
  - **Budget & Cost Breakdown**: Financial dashboard with category donut charts, daily spending bar charts, and overbudget alerts.
  - **Calendar & Timeline**: Chronological vertical timeline with expandable daily schedules.
  - **Public Sharing**: Public URL generator and one-click "Copy Trip to My Account".
  - **Profile & Settings**: User preferences, preferred currency/language, saved destinations, and theme toggle.
  - **Admin Analytics**: Platform adoption metrics, top booked cities, and category interest stats.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Icons**: Lucide React (`lucide-react`)
- **Styling**: Vanilla CSS tokens & custom properties (`src/index.css`)
- **Typography**: Playfair Display + Plus Jakarta Sans + Outfit

---

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/globetrotter.git
   cd globetrotter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## 🔌 Connecting to a Live Backend

By default, the application runs using local state fallback (`VITE_USE_MOCK=true`).
To connect to your live PostgreSQL REST API backend, set the environment variable in `.env`:

```env
VITE_API_URL=https://your-backend-api.com/api
VITE_USE_MOCK=false
```
