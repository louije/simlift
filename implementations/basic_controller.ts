import { arraySample } from "../util/array_utils";
import { Controller } from "../interfaces/controller";
import { Lift, LiftState, Direction, directionBetween } from "../interfaces/lift";
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
    // In this implementation, let's assume people press an "up" or "down" button.
    const direction = directionBetween(from, to);

    this.bestLift(from, direction).addStop(from);
  }
  arrived(lift: Lift) {
    const peopleToDisembark = lift.people.filter(p => p.desiredFloor === lift.position);
    this.building.disembarkPeople(peopleToDisembark);
    lift.peopleLeaving(peopleToDisembark);

    const liftCapacity = lift.capacity - lift.people.length;
    const embarkedPeople = this.building.embarkPeopleAt(lift.position, liftCapacity);
    lift.peopleEntering(embarkedPeople);
  }

  private bestLift(forFloor: number, direction: Direction): Lift {
    // TODO: decouple lift direction from state. It can be open and still going down.

    const headedRightWay = this.lifts.filter((l) => {
      return (l.state === LiftState.MovingUp && l.position < forFloor) ||
             (l.state === LiftState.MovingDown && l.position > forFloor) ||
             l.free;
    });

    if (headedRightWay.length) {
      return this.closestLift(forFloor, headedRightWay);
    }

    return this.closestLift(forFloor, this.lifts);
    // return arraySample(this.lifts);
  }

  private closestLift(closestTo: number, lifts: Lift[]): Lift | undefined {
    return lifts.sort((a: Lift, b: Lift) => this.sortLifts(closestTo, a, b))[0];
  }

  private sortLifts(closestTo: number, a: Lift, b: Lift) {
    const aDist = Math.abs(a.position - closestTo);
    const bDist = Math.abs(b.position - closestTo);
    if (aDist < bDist) {
      // console.log(`Lift id ${a.id} is closer to floor ${closestTo} than lift ${b.id}`);
      return -1;
    }
    if (aDist > bDist) {
      // console.log(`Lift id ${b.id} is closer to floor ${closestTo} than lift ${a.id}`);
      return 1;
    }
    return 0;
  }
}
