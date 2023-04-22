import { SatelliteData } from "./App";

const SatellitesList: React.FC<{ satellites: SatelliteData[] }> = ({ satellites }) => {
    return (
      <ul>
        {satellites.map((satellite) => (
          <li key={satellite.name}>{satellite.name} {satellite.tle1}</li>
        ))}
      </ul>
    );
  };

export default SatellitesList;
  