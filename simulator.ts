import { Building } from "./interfaces/building";
import { BuildingRenderer } from "./interfaces/building_renderer";
import { Lift } from "./interfaces/lift";

import { BasicBuilding } from "./implementations/basic_building";

export class Simulator {
  building: Building;

  constructor(public floors: number,
              public lifts: Lift[],
              public destination: HTMLElement,
              public renderer: BuildingRenderer) {
    this.building = new BasicBuilding(floors, lifts);
    this.renderer.building = this.building;
    this.render();
  }

  render() {
    this.renderer.render(this.destination);
  }
}
