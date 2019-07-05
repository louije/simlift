import { BuildingRenderer } from "../interfaces/building_renderer";
import { Building } from "../interfaces/building";
import { Lift } from "../interfaces/lift";

export class BuildingHTMLRenderer implements BuildingRenderer {
  building: Building;

  shaft(id: number, initialPosition = 0): string {
    return `
      <div class="Shaft" data-shaft-id="${id}">
        <div class="Lift" style="--lift-position: ${initialPosition}"></div>
      </div>
    `;
  }
  shafts(shafts: number): string {
    const shaftsHTML = Array.from(Array(shafts)).map((_, x) => { return this.shaft(x); }).join("");
    return `
      <div class="Shafts">
        ${shaftsHTML}
      </div>
    `;
  }

  floor(level: number): string {
    return `<div class="Floor" data-floor-number="${level}"></div>`;
  }
  floors(floors: number): string {
    const floorsHTML = Array.from(Array(floors)).map((_, x) => this.floor(x)).reverse().join("");
    return `
    <div class="Floors">
      ${floorsHTML}
    </div>
    `;
  }

  root(floors: number, lifts: Lift[]): string {
    const floorsHTML = this.floors(floors);
    const shaftsHTML = this.shafts(lifts.length);

    return `
      <div class="Building" style="--floors: ${floors}; --lifts: ${lifts}">
        ${floorsHTML}
        ${shaftsHTML}
      </div>
    `;
  }

  render(element: HTMLElement): void {
    element.innerHTML = this.root(this.building.floors, this.building.lifts);
  }
}
