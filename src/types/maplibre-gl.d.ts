declare module 'maplibre-gl' {
  export class Map {
    constructor(options: any);
    addControl(control: any, position?: string): void;
    on(event: string, listener: (e?: any) => void): void;
    flyTo(options: any): void;
    remove(): void;
    getSource(id: string): any;
    addSource(id: string, source: any): void;
    addLayer(layer: any, beforeId?: string): void;
  }

  export class Marker {
    constructor(options?: any);
    setLngLat(lngLat: [number, number] | { lng: number; lat: number }): this;
    setPopup(popup: any): this;
    addTo(map: Map): this;
    remove(): void;
  }

  export class Popup {
    constructor(options?: any);
    setHTML(html: string): this;
  }

  export class NavigationControl {
    constructor(options?: any);
  }

  export interface GeoJSONSource {
    setData(data: any): void;
  }

  const maplibregl: {
    Map: typeof Map;
    Marker: typeof Marker;
    Popup: typeof Popup;
    NavigationControl: typeof NavigationControl;
  };

  export default maplibregl;
}
