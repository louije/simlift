import Settings from "../settings.json";
import { Lift, LiftState, Direction } from "../interfaces/lift";
import { Controller } from "../interfaces/controller";
import { Person } from "../implementations/person";

export class BasicLift implements Lift {
  private liftPosition: number = 0;
  private stops: number[] = [];
  private peopleInside:  Person[] = [];
  private leavingQueue:  Person[] = [];
  private enteringQueue: Person[] = [];
  private boardingTimer;

  capacity = Settings.lifts.capacity;
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
  get free(): boolean {
    return this.stops.length === 0 && this.state === LiftState.Open;
  }
  get people(): Person[] {
    return this.peopleInside;
  }
  get queueing(): boolean {
    return !!(this.enteringQueue.length + this.leavingQueue.length);
  }
  get peopleVisible(): Person[] {
    return this.people.filter(p => this.enteringQueue.indexOf(p) === -1).concat(this.leavingQueue);
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
        if (this.queueing) {
          this.state = LiftState.Boarding;
        } else if (this.nextStop !== undefined) {
          this.state = LiftState.Departing;
        }
        break;
      case LiftState.Boarding:
        if (!this.queueing) {
          // debugger;
          window.clearTimeout(this.boardingTimer);
          this.boardingTimer = undefined;
          this.state = this.nextStop ? LiftState.Departing : LiftState.Open;
        }
        if (this.boardingTimer) {
          break;
        }
        while (this.leavingQueue.length) {
          this.boardingTimer = window.setTimeout(
            () => {
              this.leavingQueue.pop();
              this.boardingTimer = undefined;
            },
            Settings.people.time_to_leave,
          );
          break;
        }
        while (this.enteringQueue.length) {
          this.boardingTimer = window.setTimeout(
            () => {
              this.enteringQueue.pop();
              this.boardingTimer = undefined;
            },
            Settings.people.time_to_enter,
          );
          break;
        }
        break;
      case LiftState.Departing:
        this.state = this.directionFor(this.nextStop);
        break;
      case LiftState.MovingUp:
        this.position += Settings.lifts.speed;
        if (this.atLevel(this.nextStop, Direction.Up)) {
          this.position = this.nextStop;
          this.state = LiftState.Arriving;
          break;
        }
        break;
      case LiftState.MovingDown:
        this.position -= Settings.lifts.speed;
        if (this.atLevel(this.nextStop, Direction.Down)) {
          this.position = this.nextStop;
          this.state = LiftState.Arriving;
          break;
        }
        break;
    }
  }

  peopleLeaving(leavingPeople: Person[]) {
    this.leavingQueue = leavingPeople;
    this.peopleInside = this.people.filter(p => leavingPeople.indexOf(p) === -1);
  }

  peopleEntering(enteringPeople: Person[]) {
    this.enteringQueue = enteringPeople;
    this.peopleInside = this.people.concat(enteringPeople);
    enteringPeople.forEach(p => this.addStop(p.desiredFloor));
  }

  addStop(floor: number): void {
    if (this.stops.indexOf(floor) === -1) {
      this.stops.push(floor);
      this.sortStops();
    }
  }

  get nextStop(): number {
    return this.stops[0];
  }

  sortStops() {
    const pos = this.position;
    let sortedStops: number[];

    const stopsBelow = this.stops.filter(s => s < pos);
    const stopsAbove = this.stops.filter(s => s >= pos);

    if (this.state === LiftState.MovingDown) {
      sortedStops = stopsBelow.sort((a, b) => a - b).concat(stopsAbove.sort());
    } else if (this.state === LiftState.MovingUp) {
      sortedStops = stopsAbove.sort().concat(stopsBelow.sort((a, b) => a - b));
    } else {
      // Sort by proximity? really?
      sortedStops = this.stops.sort((a, b) => Math.abs(a - pos) - Math.abs(b - pos));
    }

    this.stops = sortedStops;
  }

  directionFor(floor: number): LiftState {
    if (floor < this.position) {
      return LiftState.MovingDown;
    }
    if (floor > this.position) {
      return LiftState.MovingUp;
    }

    // Called for current floor
    return LiftState.Open;
  }

  currentLevel(direction: Direction): number | undefined {
    const position = this.position;
    if (Math.ceil(position) === position) {
      return position;
    }
    switch (direction) {
      case Direction.Up:
        if (Math.floor(position) !== Math.floor(position + Settings.lifts.speed)) {
          return Math.floor(position + Settings.lifts.speed);
        }
        break;
      case Direction.Down:
        if (Math.floor(position) !== Math.floor(position - Settings.lifts.speed)) {
          return Math.floor(position);
        }
        break;
    }
    return undefined;
  }
  atLevel(goal: number, direction: Direction): boolean {
    const position = this.position;
    return this.currentLevel(direction) === goal;
  }
}
