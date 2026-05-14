// Lightweight point-in-polygon utilities for matching NWS alert geometries
// against subscriber locations. Uses the ray-cast algorithm; supports Polygon
// and MultiPolygon GeoJSON inputs.

type Coord = [number, number]; // [lon, lat]
type Ring = Coord[];

export function pointInGeometry(
  lon: number,
  lat: number,
  geometry: any
): boolean {
  if (!geometry || !geometry.type) return false;
  if (geometry.type === "Polygon") {
    return pointInPolygon(lon, lat, geometry.coordinates as Ring[]);
  }
  if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates as Ring[][]) {
      if (pointInPolygon(lon, lat, poly)) return true;
    }
    return false;
  }
  return false;
}

function pointInPolygon(lon: number, lat: number, rings: Ring[]): boolean {
  // First ring outer, subsequent rings holes
  if (!rings.length) return false;
  if (!pointInRing(lon, lat, rings[0])) return false;
  for (let i = 1; i < rings.length; i++) {
    if (pointInRing(lon, lat, rings[i])) return false; // inside a hole
  }
  return true;
}

function pointInRing(lon: number, lat: number, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
