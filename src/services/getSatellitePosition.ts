import * as satellite from 'satellite.js';
import { DateHelper } from './DateHelper';

const dateHelper = new DateHelper();

export const getSatellitePosition = (tle1: string, tle2: string) => {
    const satrec = satellite.twoline2satrec(tle1, tle2);
    const date = new Date();
    const positionAndVelocity = satellite.propagate(satrec, date);
  
    if (!positionAndVelocity.position || !positionAndVelocity.velocity) {
      console.error('Error calculating satellite position.');
      return null;
    }
  
    const gmst = satellite.gstime(date);
    const latLon = satellite.eciToGeodetic(positionAndVelocity.position as satellite.EciVec3<number>, gmst);
  
    const lat = satellite.degreesLat(latLon.latitude);
    const lon = satellite.degreesLong(latLon.longitude);
  
    const earthRadius = 6371; // Earth radius in kilometers
    const alt = latLon.height * earthRadius;
  
    return { lat, lon, alt };
};
