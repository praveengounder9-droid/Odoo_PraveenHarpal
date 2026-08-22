export interface MapMarkerData {
  id: string;
  cityName: string;
  name: string;
  category: 'Attraction' | 'Hotel' | 'Dining' | 'Culture' | 'Transport' | 'Stop';
  lat: number;
  lng: number;
  dayIndex?: number;
  cost?: number;
  rating?: number;
  description?: string;
  coverImage?: string;
}

export interface CityGeoLocation {
  id: string;
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  markers: MapMarkerData[];
}

export const WORLD_CITY_GEO_DATA: Record<string, CityGeoLocation> = {
  'cty-paris': {
    id: 'cty-paris',
    cityName: 'Paris',
    country: 'France',
    lat: 48.8566,
    lng: 2.3522,
    zoom: 13,
    markers: [
      { id: 'm-eiffel', cityName: 'Paris', name: 'Eiffel Tower Tour', category: 'Attraction', lat: 48.8584, lng: 2.2945, dayIndex: 1, cost: 35, rating: 4.9, description: 'Iconic iron lattice tower on the Champ de Mars.', coverImage: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-louvre', cityName: 'Paris', name: 'Louvre Museum Guided Visit', category: 'Culture', lat: 48.8606, lng: 2.3376, dayIndex: 1, cost: 25, rating: 4.8, description: 'World famous art museum holding the Mona Lisa.', coverImage: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-le-meurice', cityName: 'Paris', name: 'Le Meurice Luxury Stay', category: 'Hotel', lat: 48.8653, lng: 2.3292, dayIndex: 1, cost: 450, rating: 4.9, description: 'Palace hotel located in the heart of historic Paris.', coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-bistro-paris', cityName: 'Paris', name: 'Le Jules Verne Gourmet Dinner', category: 'Dining', lat: 48.8583, lng: 2.2944, dayIndex: 2, cost: 180, rating: 4.7, description: 'Michelin star dining experience overlooking Paris.', coverImage: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80' },
    ]
  },
  'cty-rome': {
    id: 'cty-rome',
    cityName: 'Rome',
    country: 'Italy',
    lat: 41.9028,
    lng: 12.4964,
    zoom: 13,
    markers: [
      { id: 'm-colosseum', cityName: 'Rome', name: 'Colosseum & Roman Forum Tour', category: 'Attraction', lat: 41.8902, lng: 12.4922, dayIndex: 1, cost: 40, rating: 4.9, description: 'Ancient Roman amphitheatre and gladiatorial arena.', coverImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-vatican', cityName: 'Rome', name: 'Vatican Museums & Sistine Chapel', category: 'Culture', lat: 41.9065, lng: 12.4536, dayIndex: 2, cost: 30, rating: 4.9, description: 'Masterpieces of Renaissance art and papal history.', coverImage: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-hassler', cityName: 'Rome', name: 'Hotel Hassler Spanish Steps', category: 'Hotel', lat: 41.9061, lng: 12.4831, dayIndex: 1, cost: 380, rating: 4.8, description: 'Five-star hotel atop the legendary Spanish Steps.', coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' },
    ]
  },
  'cty-barcelona': {
    id: 'cty-barcelona',
    cityName: 'Barcelona',
    country: 'Spain',
    lat: 41.3851,
    lng: 2.1734,
    zoom: 13,
    markers: [
      { id: 'm-sagrada', cityName: 'Barcelona', name: 'Sagrada Familia Fast-Track Entry', category: 'Attraction', lat: 41.4036, lng: 2.1744, dayIndex: 1, cost: 32, rating: 4.9, description: 'Antoni Gaudí’s breathtaking basilica masterpiece.', coverImage: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-park-guell', cityName: 'Barcelona', name: 'Park Güell Mosaic Architecture', category: 'Attraction', lat: 41.4145, lng: 2.1527, dayIndex: 2, cost: 15, rating: 4.7, description: 'Colorful ceramic mosaic park with views over Barcelona.', coverImage: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=80' },
    ]
  },
  'cty-tokyo': {
    id: 'cty-tokyo',
    cityName: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    zoom: 12,
    markers: [
      { id: 'm-sensoji', cityName: 'Tokyo', name: 'Senso-ji Temple Asakusa Walk', category: 'Culture', lat: 35.7148, lng: 139.7967, dayIndex: 1, cost: 0, rating: 4.8, description: 'Tokyo’s oldest and most iconic Buddhist temple.', coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-shibuya', cityName: 'Tokyo', name: 'Shibuya Sky & Crossing', category: 'Attraction', lat: 35.6595, lng: 139.7004, dayIndex: 1, cost: 22, rating: 4.9, description: '360-degree open-air observation deck over Tokyo.', coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-aman-tokyo', cityName: 'Tokyo', name: 'Aman Tokyo Sanctuary', category: 'Hotel', lat: 35.6866, lng: 139.7628, dayIndex: 1, cost: 650, rating: 4.9, description: 'Luxury sanctuary perched atop Otemachi Tower.', coverImage: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  'cty-kyoto': {
    id: 'cty-kyoto',
    cityName: 'Kyoto',
    country: 'Japan',
    lat: 35.0116,
    lng: 135.7681,
    zoom: 13,
    markers: [
      { id: 'm-fushimi', cityName: 'Kyoto', name: 'Fushimi Inari Torii Shrine', category: 'Culture', lat: 34.9671, lng: 135.7727, dayIndex: 1, cost: 0, rating: 4.9, description: 'Famous shrine with thousands of vermilion torii gates.', coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-bamboo', cityName: 'Kyoto', name: 'Arashiyama Bamboo Grove Walk', category: 'Attraction', lat: 35.0170, lng: 135.6713, dayIndex: 2, cost: 12, rating: 4.8, description: 'Towering green bamboo stalks in serene Arashiyama.', coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  'cty-mumbai': {
    id: 'cty-mumbai',
    cityName: 'Mumbai',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    zoom: 12,
    markers: [
      { id: 'm-gateway', cityName: 'Mumbai', name: 'Gateway of India & Taj Palace Visit', category: 'Attraction', lat: 18.9220, lng: 72.8347, dayIndex: 1, cost: 0, rating: 4.8, description: 'Historic waterfront archway built in 1924.', coverImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-taj-mahal-hotel', cityName: 'Mumbai', name: 'The Taj Mahal Palace Luxury Stay', category: 'Hotel', lat: 18.9217, lng: 72.8330, dayIndex: 1, cost: 350, rating: 4.9, description: 'World-renowned sea-facing luxury heritage hotel.', coverImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' }
    ]
  },
  'cty-dubai': {
    id: 'cty-dubai',
    cityName: 'Dubai',
    country: 'UAE',
    lat: 25.2048,
    lng: 55.2708,
    zoom: 12,
    markers: [
      { id: 'm-burj-khalifa', cityName: 'Dubai', name: 'Burj Khalifa At the Top Observation', category: 'Attraction', lat: 25.1972, lng: 55.2744, dayIndex: 1, cost: 50, rating: 4.9, description: 'The tallest skyscraper in the world with panoramic desert and gulf views.', coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
      { id: 'm-burj-al-arab', cityName: 'Dubai', name: 'Burj Al Arab Afternoon High Tea', category: 'Dining', lat: 25.1412, lng: 55.1852, dayIndex: 2, cost: 180, rating: 4.9, description: '7-star sail-shaped luxury dining experience on private island.', coverImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80' }
    ]
  }
};

/**
 * Returns geographic coordinate for any city ID or city name
 */
export function getCityCoordinates(cityIdOrName: string): { lat: number; lng: number; cityName: string } {
  const match = WORLD_CITY_GEO_DATA[cityIdOrName] || 
    Object.values(WORLD_CITY_GEO_DATA).find(c => c.cityName.toLowerCase() === cityIdOrName.toLowerCase());

  if (match) {
    return { lat: match.lat, lng: match.lng, cityName: match.cityName };
  }

  // Fallback defaults for unmapped cities
  return { lat: 48.8566, lng: 2.3522, cityName: cityIdOrName };
}
