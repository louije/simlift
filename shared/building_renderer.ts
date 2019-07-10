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
  render(element: HTMLElement): void {
    element.innerHTML = this.root(this.building.floors, this.building.lifts);
  }

  private shaft(lift: Lift): string {
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
  private shafts(lifts: Lift[]): string {
    const shaftsHTML = lifts.map(lift => this.shaft(lift)).join("");
    return `
      <div class="Shafts">
        ${shaftsHTML}
      </div>
    `;
  }

  private people(ppl: Person[], className: string): string {
    return ppl.map((p) => {
      return `<div class="Person Person--${className}">${p.desiredFloor}</div>`;
    }).join("");
  }

  private floor(level: number, people: Person[] = []): string {
    const peopleHTML = this.people(people, "waiting");
    return `<div class="Floor" data-floor-number="${level}">
      <div class="WaitingArea">
        ${peopleHTML}
      </div>
    </div>`;
  }
  private floors(floors: number): string {
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

  private stats(): string {
    return `
      <div class="Stats">
        <div class="StatBox">
          <div class="StatHead">People transported</div>
          <div class="StatVal">${this.building.totalPeopleTransported()}</div>
        </div>

        <div class="StatBox">
          <div class="StatHead">Average time from call to disembarkment</div>
          <div class="StatVal">${this.time(this.building.averageTrip())}</div>
        </div>

        <div class="StatBox">
          <div class="StatHead">Average time waiting for lift to arrive</div>
          <div class="StatVal">${this.time(this.building.averageWait())}</div>
        </div>

        <div class="StatBox">
          <div class="StatHead">Average time spent in lift</div>
          <div class="StatVal">${this.time(this.building.averageInLift())}</div>
        </div>
      </div>
    `;
  }

  private root(floors: number, lifts: Lift[]): string {
    const sortedLifts = lifts.sort((a, b) => a.id - b.id);
    const floorsHTML = this.floors(floors);
    const shaftsHTML = this.shafts(sortedLifts);
    const statsHTML  = this.stats();

    return `
      <div class="Building" style="--floors: ${floors}; --lifts: ${lifts.length}">
        ${floorsHTML}
        ${shaftsHTML}
      </div>

      <div class="Stats">
        ${statsHTML}
      </div>
    `;
  }

  private time(ms: number): string {
    if (isNaN(ms)) {
      return "";
    }
    const inSeconds = ms / 1000.0;
    const seconds = Math.floor(inSeconds);
    const frac = String(inSeconds).split(".")[1].slice(0, 2);
    // const frac = Math.floor((ms / 1000.0 - Math.floor(ms / 1000.0)) * 100);

    return `
    <span class="Time">
      <span class="Time__seconds">${seconds}</span><span class="Time__frac">.${frac}</span>
    </span>`;
  }
}
