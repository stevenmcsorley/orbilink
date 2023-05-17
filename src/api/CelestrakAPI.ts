import axios from "axios";

interface SatelliteData {
  name: string;
  tle1: string;
  tle2: string;
}

class CelestrakAPI {
  private static BASE_URL = "https://celestrak.org/NORAD/elements/gp.php";

  private static async fetchSatellites(
    group: string
  ): Promise<SatelliteData[]> {
    const response = await axios.get(
      `${this.BASE_URL}?GROUP=${group}&FORMAT=tle`
    );
    const rawData = response.data.split("\n");
    const parsedSatellites: SatelliteData[] = [];

    for (let i = 0; i < rawData.length - 2; i += 3) {
      parsedSatellites.push({
        name: rawData[i].trim(),
        tle1: rawData[i + 1].trim(),
        tle2: rawData[i + 2].trim(),
      });
    }

    return parsedSatellites;
  }

  public static async getSpaceStations(): Promise<SatelliteData[]> {
    return this.fetchSatellites("stations");
  }

  public static async brightest(): Promise<SatelliteData[]> {
    return this.fetchSatellites("visual");
  }

  public static async getActiveSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("active");
  }
  public static async getAnalystSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("analyst");
  }

  public static async getFengyun1CDebris(): Promise<SatelliteData[]> {
    return this.fetchSatellites("1999-025");
  }

  public static async getRussianASATtestDebris(): Promise<SatelliteData[]> {
    return this.fetchSatellites("1982-092");
  }

  public static async getIridium33Debris(): Promise<SatelliteData[]> {
    return this.fetchSatellites("iridium-33-debris");
  }

  public static async getCosmos2251Debris(): Promise<SatelliteData[]> {
    return this.fetchSatellites("cosmos-2251-debris");
  }

  public static async getBreezeMDebris(): Promise<SatelliteData[]> {
    return this.fetchSatellites("breeze-m-debris");
  }

  public static async getIridium33Cosmos2251CollisionDebris(): Promise<
    SatelliteData[]
  > {
    return this.fetchSatellites("iridium-33-cosmos-2251-collision-debris");
  }

  public static async getWeatherSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("weather");
  }

  public static async getNoaaSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("noaa");
  }

  public static async getGoesSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("goes");
  }

  public static async getEarthResourcesSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("resource");
  }

  public static async getSarsatSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("sarsat");
  }

  public static async getDisasterMonitoringSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("dmc");
  }

  public static async getTdrssSatellites(): Promise<SatelliteData[]> {
    return this.fetchSatellites("tdrss");
  }
  // Add more methods for other satellite groups here
}

export default CelestrakAPI;
