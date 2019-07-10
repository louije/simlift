import { arrayTo } from "../util/array_utils";
import { Building } from "./building";
import { Lift } from "./lift";
import { Person } from "./person";

export interface BuildingRenderer {
  building: Building;
  render(destination: HTMLElement): void;
}

export class BuildingHTMLRenderer implements BuildingRenderer {
  building: Building;

  shaft(lift: Lift): string {
    const peopleHTML = this.people(lift.peopleVisible, "traveling");
    return `
      <div class="Shaft" data-shaft-id="${lift.id}">
        <div class="Lift Lift--${lift.state}"
             style="--lift-position: ${lift.position}"
             data-id="${lift.id}">
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
    return ppl.map((p) => {
      return `<div class="Person Person--${className}">${p.desiredFloor}</div>`;
    }).join("");
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
      return this.floor(floor, this.building.peopleVisibleAtFloor(floor));
    }).reverse().join("");

    return `
    <div class="Floors">
      ${floorsHTML}
    </div>
    `;
  }

  root(floors: number, lifts: Lift[]): string {
    const sortedLifts = lifts.sort((a, b) => a.id - b.id);
    const floorsHTML = this.floors(floors);
    const shaftsHTML = this.shafts(sortedLifts);

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
