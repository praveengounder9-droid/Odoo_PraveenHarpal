import * as THREE from 'three';

export interface GeoCoordinate {
  cityName: string;
  country: string;
  lat: number;
  lng: number;
}

export const CITY_COORDINATES: Record<string, GeoCoordinate> = {
  'cty-paris': { cityName: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  'cty-rome': { cityName: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  'cty-barcelona': { cityName: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
  'cty-tokyo': { cityName: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  'cty-kyoto': { cityName: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681 },
  'cty-bali': { cityName: 'Bali', country: 'Indonesia', lat: -8.4095, lng: 115.1889 },
  'cty-nyc': { cityName: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
  'cty-santorini': { cityName: 'Santorini', country: 'Greece', lat: 36.3932, lng: 25.4615 },
  'cty-dubai': { cityName: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  'cty-singapore': { cityName: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  'cty-mumbai': { cityName: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  'cty-london': { cityName: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  'cty-sydney': { cityName: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 }
};

/**
 * Converts Latitude and Longitude to 3D Cartesian coordinates (Vector3) on a sphere
 */
export function latLngToVector3(lat: number, lng: number, radius: number = 2.0, altitude: number = 0): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const r = radius + altitude;

  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

/**
 * Creates 3D Quadratic Bezier flight arc curve points between two sphere positions
 */
export function createFlightArcPoints(startVec: THREE.Vector3, endVec: THREE.Vector3, radius: number = 2.0, segments: number = 40): THREE.Vector3[] {
  const distance = startVec.distanceTo(endVec);
  const maxArcHeight = Math.min(0.8, distance * 0.25);

  const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const controlPoint = midPoint.clone().normalize().multiplyScalar(radius + maxArcHeight);

  const curve = new THREE.QuadraticBezierCurve3(startVec, controlPoint, endVec);
  return curve.getPoints(segments);
}
