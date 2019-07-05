import { Building } from "../interfaces/building";
import { Lift } from "../interfaces/lift";
import { Person } from "../interfaces/person";

export class BasicBuilding implements Building {
  people: Person[];
  disembarkedPeople: Person[];

  constructor(public floors: number, public lifts: Lift[]) {}

  tick() {}
  peopleAt(floor: number): Person[] {
    return this.people.filter(p => p.currentFloor && p.currentFloor === floor);
  }
}
