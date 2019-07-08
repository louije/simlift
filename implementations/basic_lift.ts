import { Lift, LiftState, Direction } from "../interfaces/lift";
import { Controller } from "../interfaces/controller";
import { Person } from "../implementations/person";

export class BasicLift implements Lift {
  private liftPosition: number = 0;
  private stops: number[] = [];

  capacity = 1000;
  people: Person[] = [];
  state: LiftState = LiftState.Open;

  get topFloor(): number {
    return this.floorCount - 1;
  }
  get position(): number {
    return this.liftPosition;
  }
  set position(newValue: number) {
    this.liftPosition = Math.max(Math.min(this.topFloor, newValue), 0);
  }

  constructor(public id: number,
              public controller: Controller,
              public floorCount: number) {}

  tick(): void {
    switch (this.state) {
      case LiftState.Arriving:
        this.state = LiftState.Open;
        break;
      case LiftState.Open:
        this.stops = this.stops.filter(s => s !== this.position);
        this.controller.arrived(this);
        if (this.nextStop() !== undefined) {
          this.state = LiftState.Departing;
        }
        break;
      case LiftState.Departing:
        this.state = this.directionFor(this.nextStop());
        break;
      case LiftState.MovingUp:
        this.position += 0.25;
        if (this.atLevel(this.position, this.nextStop())) {
          this.state = LiftState.Arriving;
          break;
        }
        break;
      case LiftState.MovingDown:
        this.position -= 0.25;
        if (this.atLevel(this.position, this.nextStop())) {
          this.state = LiftState.Arriving;
          break;
        }
        break;
    }
  }
  addStop(floor: number): void {
    // stupid implementation for now. don't prioritize.
    if (this.stops.indexOf(floor) === -1) {
      this.stops.push(floor);
    }
  }
  nextStop(): number {
    return this.stops[0];
  }
  directionFor(floor: number): LiftState {
    if (floor < this.position) {
      return LiftState.MovingDown;
    }
    if (floor > this.position) {
      return LiftState.MovingUp;
    }

    console.warn("directionFor called when for current floor", floor, this);
    return LiftState.Open;
  }
  atLevel(position: number, goal: number = undefined): boolean {
    if (goal) {
      return position === goal;
    }
    return Math.floor(position) === position;
  }

}
