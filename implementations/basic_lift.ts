import { Lift, LiftState, Direction } from "../interfaces/lift";
import { Person } from "../interfaces/person";

export class BasicLift implements Lift {
  capacity: 1000;
  people: Person[];
  state: LiftState.Open;
  position: 0;

  constructor(public id: number) {}

  calledTo(direction: Direction): void {

  }
  goingTo(): number {
    return 0;
  }
}
