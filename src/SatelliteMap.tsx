import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L, { Icon } from 'leaflet';


type SatellitePosition = {
  lat: number;
  lon: number;
  alt?: number;
};

type SatelliteMapProps = {
  satellitePositions: { [name: string]: SatellitePosition };
  onSatellitePositionsUpdate: (positions: { [name: string]: SatellitePosition }) => void;
};



const SatelliteMap: React.FC<SatelliteMapProps> = ({ satellitePositions, onSatellitePositionsUpdate }) => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ width: '100%', height: '800px' }}
    >
      <TileLayer
       attribution='&copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
       url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
      />
      {Object.entries(satellitePositions).map(([name, position]) => (
        <Marker key={name} position={[position.lat, position.lon]}           
        icon={new L.Icon({
            iconUrl: process.env.PUBLIC_URL + '/satellite.svg',
            iconSize: [20, 20],
            iconAnchor: [15, 15],
            iconColor: "cyan"
          })}>
          <Tooltip>{name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SatelliteMap;
