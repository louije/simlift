import { Lift, LiftState, Direction } from "../interfaces/lift";
import { Person } from "../interfaces/person";

export class BasicLift implements Lift {
  private liftPosition: number = 0;

  capacity = 1000;
  people: Person[];
  state: LiftState.Open;

  get topFloor(): number {
    return this.floorCount - 1;
  }
  get position(): number {
    return this.liftPosition;
  }
  set position(newValue: number) {
    this.liftPosition = Math.max(Math.min(this.topFloor, newValue), 0);
  }

  constructor(public id: number, public floorCount: number) {}

  tick(): void {}
  addStop(floor: number): void {}
}
