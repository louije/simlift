import { Controller } from "../interfaces/controller";
import { Lift, LiftState, Direction } from "../interfaces/lift";
import { Building } from "../interfaces/building";

export class BasicController implements Controller {
  building: Building;
  get lifts() {
    return this.building.lifts;
  }

  tick() {
    this.lifts.forEach(l => l.tick());
  }
  called(from: number, to: number) {
    this.lifts[0].addStop(from);
  }
  arrived(lift: Lift) {
    const peopleToDisembark = lift.people.filter(p => p.desiredFloor === lift.position);

    this.building.disembarkPeople(peopleToDisembark);
    const embarkedPeople = this.building.embarkPeopleAt(lift.position);

    lift.people = lift.people.filter(p => p.desiredFloor !== lift.position);
    lift.people = lift.people.concat(embarkedPeople);
    embarkedPeople.forEach(p => lift.addStop(p.desiredFloor));
  }
}
