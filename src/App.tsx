import React, { useState, useEffect } from 'react';
import SatelliteList from './SatellitesList';
import SatelliteMap from './SatelliteMap';
import { getSatellitePosition } from './services/getSatellitePosition';
import CelestrakAPI from './api/CelestrakAPI';

type SatelliteData = {
  name: string;
  tle1: string;
  tle2: string;
};


const App: React.FC = () => {
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null);
  const [satellitePositions, setSatellitePositions] = useState<{ [name: string]: { lat: number; lon: number, alt?: number } }>({});

  useEffect(() => {
    const fetchSatellites = async () => {
      try {
        const satellites = await CelestrakAPI.getDisasterMonitoringSatellites();
        setSatellites(satellites);
      } catch (error) {
        console.error('Error fetching satellite data:', error);
      }
    };
  
    fetchSatellites();
  }, []);

  useEffect(() => {
    const updatePositions = () => {
      const updatedPositions: { [name: string]: { lat: number; lon: number, alt: number } } = {};
      satellites.forEach((satellite) => {
        const position = getSatellitePosition(satellite.tle1, satellite.tle2);

        if (position) {
          updatedPositions[satellite.name] = {
            lat: position.lat,
            lon: position.lon,
            alt: position.alt,
          };
        }
      });

      setSatellitePositions(updatedPositions);
      requestAnimationFrame(updatePositions);
    };

    requestAnimationFrame(updatePositions);

    return () => cancelAnimationFrame(requestAnimationFrame(updatePositions));
  }, [satellites]);

  return (
    <div>
      <h1>OrbiLink 3D Earth Visualization</h1>
      <div style={{ display: 'flex' }}>
        <SatelliteList
          satellites={satellites}
          onSatelliteClick={setSelectedSatellite}
          satellitePositions={satellitePositions}
        />
        <SatelliteMap satellitePositions={satellitePositions} onSatellitePositionsUpdate={setSatellitePositions}/>
      </div>
    </div>
  );
};

export default App;
