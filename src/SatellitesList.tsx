import React from 'react';
type SatelliteData = {
    name: string;
    tle1: string;
    tle2: string;
  };

type SatellitesListProps = {
  satellites: SatelliteData[];
  onSatelliteClick: (name: string) => void;
  satellitePositions: { [name: string]: { lat: number; lon: number, alt?: number } };
};

const SatellitesList: React.FC<SatellitesListProps> = ({
  satellites,
  onSatelliteClick,
  satellitePositions,
}) => {
  return (
    <div>
      <h2>Satellites</h2>
      <ul>
        {satellites.map((satellite) => (
          <li key={satellite.tle1} onClick={() => onSatelliteClick(satellite.name)}>
            {satellite.name}
            <br />
            {satellitePositions[satellite.name] && (
              <span>
                Lat: {satellitePositions[satellite.name].lat.toFixed(2)}, Lon: {satellitePositions[satellite.name].lon.toFixed(2)}
                <br />
              </span>
            )}
            {/* {satellitePositions[satellite.name] && (
                // <span>
                //     Alt: {satellitePositions[satellite.name].alt.toFixed(2)}
                // </span>
            )} */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SatellitesList;
