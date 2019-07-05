import { Building } from "./building";

export interface BuildingRenderer {
  building: Building;
  render(destination: HTMLElement): void;
}
