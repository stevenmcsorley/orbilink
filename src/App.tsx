import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EarthVisualization from './EarthVisualization';
import SatellitesList from './SatellitesList';

export type SatelliteData = {
  name: string;
  tle1: string;
  tle2: string;
};

const App: React.FC = () => {
  const [satellites, setSatellites] = useState<SatelliteData[]>([]);

  useEffect(() => {
    const fetchSatellites = async () => {
      try {
        const response = await axios.get(
          'https://www.celestrak.com/NORAD/elements/stations.txt'
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

  return (
    <div>
      <h1>OrbiLink 3D Earth Visualization</h1>
      <EarthVisualization width={800} height={600} satellites={satellites} />
      <SatellitesList satellites={satellites} />
    </div>
  );
};

export default App;
