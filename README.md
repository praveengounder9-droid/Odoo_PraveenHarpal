# GlobeTrotter – Immersive RAG AI & Real Vector Map Travel Platform

> A luxury, responsive travel planning platform designed to dream, build, and visualize multi-city trip itineraries with dynamic budget tracking, MapLibre GL JS vector maps, and a RAG-powered Gemini AI assistant.

![GlobeTrotter Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80)

---

## ✨ Master Features

1. **🔒 Authentication-First Security & Data Isolation**:
   - Mandatory Login/Sign Up entry point for all visitors.
   - Strict multi-user data isolation: each user accesses strictly their own saved trips, itineraries, budgets, and profile data.

2. **🤖 GlobeTrotter RAG AI Assistant (Google Gemini API)**:
   - Floating Light Vanilla AI Assistant powered by Google GenAI SDK (`@google/genai`).
   - RAG (Retrieval-Augmented Generation) pipeline: extracts authorized trip stops, day itineraries, and costs to construct grounded context for Gemini.
   - Hackathon Demonstration feature: Expandable *"Based on your trip data"* source metadata breakdown below responses.

3. **🗺️ MapLibre GL JS Real Vector Map Engine**:
   - Real-world vector mapping powered by MapLibre GL JS and CARTO Voyager vector tiles.
   - 3D camera pitch/bearing controls with smooth `flyTo` camera easing when clicking "Focus Map".
   - `fitBounds` auto-fitting for multi-stop journeys with dynamic GeoJSON route lines connecting ordered destinations.

4. **🔍 Global Place Search & Geocoding Disambiguation**:
   - Real-time place search powered by Nominatim OpenStreetMap Geocoding API.
   - Unambiguous search disambiguation for cities, landmarks, hotels, restaurants, and airports worldwide.

5. **📊 Clean Financial & Budget Dashboard**:
   - Financial breakdown with clean flat charts (no 3D chart clutter).
   - Explicit data source badges: `[User Entered]`, `[Calculated]`, `[Estimated]`.

6. **📷 PC & Gallery Profile Photo Upload**:
   - Native file picker upload allowing users to choose profile pictures directly from their PC or gallery.

---

## 🛠️ Languages & Tech Stack

- **Primary Language**: TypeScript (Strict Type Safety)
- **Frontend Core**: React 19 + Vite
- **Vector Mapping**: MapLibre GL JS (`maplibre-gl`)
- **Geocoding API**: Nominatim OpenStreetMap Geocoding API
- **AI / LLM Provider**: Google GenAI SDK (`@google/genai` / Gemini 2.5 Flash)
- **Icons**: Lucide React (`lucide-react`)
- **Design System**: Vanilla CSS Custom Properties (`src/index.css`) styled in Light Vanilla (`#F7F4EE`, `#FFFDF9`, `#B86F52`)

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/praveengounder9-droid/Odoo_PraveenHarpal.git

# Navigate to project directory
cd Odoo_PraveenHarpal

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
