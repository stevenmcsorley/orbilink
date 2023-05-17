import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SatelliteList from './SatellitesList';
import SatelliteMap from './SatelliteMap';
import { getSatellitePosition } from './services/getSatellitePosition';

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
        const response = await axios.get(
          'https://celestrak.org/NORAD/elements/gp.php?GROUP=sarsat&FORMAT=tle'
        );
        const rawData = response.data.split('\n');
        const parsedSatellites: SatelliteData[] = [];

        for (let i = 0; i < rawData.length - 2; i += 3) {
          parsedSatellites.push({
            name: rawData[i].trim(),
            tle1: rawData[i + 1].trim(),
            tle2: rawData[i + 2].trim(),
          });
        }

        setSatellites(parsedSatellites);
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
