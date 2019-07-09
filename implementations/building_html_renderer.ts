import { arrayTo } from "../util/array_utils";

import { BuildingRenderer } from "../interfaces/building_renderer";
import { Building } from "../interfaces/building";
import { Lift } from "../interfaces/lift";

import { Person } from "../implementations/person";

export class BuildingHTMLRenderer implements BuildingRenderer {
  building: Building;

  shaft(lift: Lift): string {
    const peopleHTML = this.people(lift.people, "traveling");
    return `
      <div class="Shaft" data-shaft-id="${lift.id}">
        <div class="Lift Lift--${lift.state}" style="--lift-position: ${lift.position}">
          ${peopleHTML}
        </div>
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

  people(ppl: Person[], className: string): string {
    return ppl.map(p => `<div class="Person Person--${className}">${p.desiredFloor}</div>`).join("");
  }

  floor(level: number, people: Person[] = []): string {
    const peopleHTML = this.people(people, "waiting");
    return `<div class="Floor" data-floor-number="${level}">
      <div class="WaitingArea">
        ${peopleHTML}
      </div>
    </div>`;
  }
  floors(floors: number): string {
    // Could be better done with a ViewModel
    const floorsHTML = arrayTo(floors - 1).map((floor) => {
      return this.floor(floor, this.building.peopleAtFloor(floor));
    }).reverse().join("");

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
