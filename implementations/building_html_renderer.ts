import { BuildingRenderer } from "../interfaces/building_renderer";
import { Building } from "../interfaces/building";
import { Lift } from "../interfaces/lift";

export class BuildingHTMLRenderer implements BuildingRenderer {
  building: Building;

  shaft(lift: Lift): string {
    return `
      <div class="Shaft" data-shaft-id="${lift.id}">
        <div class="Lift" style="--lift-position: ${lift.position}"></div>
      </div>
    `;
  }
  shafts(lifts: Lift[]): string {
    const shaftsHTML = lifts.map(lift => this.shaft(lift)).join("");
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
    const shaftsHTML = this.shafts(lifts);

    return `
      <div class="Building" style="--floors: ${floors}; --lifts: ${lifts.length}">
        ${floorsHTML}
        ${shaftsHTML}
      </div>
    `;
  }

  render(element: HTMLElement): void {
    element.innerHTML = this.root(this.building.floors, this.building.lifts);
  }
}
