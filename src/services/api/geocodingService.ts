export interface GeocodedPlace {
  id: string;
  cityName: string;
  country: string;
  displayName: string;
  lat: number;
  lng: number;
  category: 'City' | 'Attraction' | 'Hotel' | 'Dining' | 'Place';
}

export const geocodingService = {
  /**
   * Performs real-time search for arbitrary world cities, landmarks, hotels, or places
   */
  async searchPlaces(query: string): Promise<GeocodedPlace[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
      const res = await fetch(endpoint, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'GlobeTrotterTravelApp/1.0'
        }
      });

      if (!res.ok) throw new Error('Geocoding search failed');
      const data = await res.json();

      return data.map((item: any, idx: number) => {
        const address = item.address || {};
        const cityName = address.city || address.town || address.village || address.state || item.display_name.split(',')[0];
        const country = address.country || 'World';

        let category: GeocodedPlace['category'] = 'Place';
        if (item.type === 'administrative' || item.class === 'boundary') category = 'City';
        else if (item.class === 'tourism' || item.class === 'historic') category = 'Attraction';
        else if (item.class === 'amenity' && (item.type === 'restaurant' || item.type === 'cafe')) category = 'Dining';
        else if (item.class === 'tourism' && item.type === 'hotel') category = 'Hotel';

        return {
          id: `geo-${item.place_id || idx}`,
          cityName,
          country,
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          category
        };
      });
    } catch (err) {
      console.warn('Real geocoding API offline, using verified geographic reference dataset', err);
      // Verified geographic reference fallback for key world cities
      const fallbackList: GeocodedPlace[] = [
        { id: 'f-paris', cityName: 'Paris', country: 'France', displayName: 'Paris, Île-de-France, France', lat: 48.8566, lng: 2.3522, category: 'City' },
        { id: 'f-rome', cityName: 'Rome', country: 'Italy', displayName: 'Rome, Lazio, Italy', lat: 41.9028, lng: 12.4964, category: 'City' },
        { id: 'f-barcelona', cityName: 'Barcelona', country: 'Spain', displayName: 'Barcelona, Catalonia, Spain', lat: 41.3851, lng: 2.1734, category: 'City' },
        { id: 'f-tokyo', cityName: 'Tokyo', country: 'Japan', displayName: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, category: 'City' },
        { id: 'f-mumbai', cityName: 'Mumbai', country: 'India', displayName: 'Mumbai, Maharashtra, India', lat: 19.0760, lng: 72.8777, category: 'City' },
        { id: 'f-dubai', cityName: 'Dubai', country: 'UAE', displayName: 'Dubai, United Arab Emirates', lat: 25.2048, lng: 55.2708, category: 'City' },
      ];

      return fallbackList.filter(p => p.displayName.toLowerCase().includes(query.toLowerCase()) || p.cityName.toLowerCase().includes(query.toLowerCase()));
    }
  }
};
