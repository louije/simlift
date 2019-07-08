import { Building } from "../interfaces/building";
import { Lift } from "../interfaces/lift";
import { Person } from "../interfaces/person";
import { Controller } from "../interfaces/controller";

export class BasicBuilding implements Building {
  private activePeople: Person[];
  private disembarkedPeople: Person[];

  constructor(public floors: number,
              public lifts: Lift[],
              public controller: Controller) {}

  // Communication with Simulator
  tick(): void {
    const randomLift = this.lifts[Math.floor(Math.random() * this.lifts.length)];
    randomLift.position += (Math.random() < 0.5) ? 1 : -1;
  }
  addPerson(person: Person): void {}

  // Communication with controller
  embarkPeopleAt(floor: number): void {}
  disembarkPeople(people: Person[]): void {}

  // Stats
  averageTrip():   number { return 0; }
  averageWait():   number { return 0; }
  averageInLift(): number { return 0; }
  totalPeople():   number { return 0; }
}
