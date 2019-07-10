import Settings from "../settings.json";
import { Person } from "./person";
import { Controller } from "./controller";

export enum LiftState {
  Arriving = "arriving",
  Open = "open",
  Boarding = "boarding",
  Departing = "departing",
  MovingUp = "movingUp",
  MovingDown = "movingDown",
}

export enum Direction {
  None = "open",
  Up = "movingUp",
  Down = "movingDown" ,
}

export interface Lift {
  id: number;
  controller: Controller;
  floorCount: number;

  readonly people: Person[];
  readonly peopleVisible: Person[];
  readonly leavingQueue:  Person[];
  readonly enteringQueue: Person[];

  capacity: number;
  state: LiftState;
  position: number;
  free: boolean;

  tick(): void;
  addStop(floor: number): void;
  peopleLeaving(people: Person[]);
  peopleEntering(people: Person[]);
}

export function directionBetween(from: number, to: number): Direction {
  if (from < to) { return Direction.Down; }
  if (from < to) { return Direction.Up; }

  // Same floor
  return Direction.None;
}

export class BasicLift implements Lift {
  capacity = Settings.lifts.capacity;
  state: LiftState = LiftState.Open;

  private queues: { leaving: Person[], entering: Person[] } = { leaving: [], entering: [] };
  private liftPosition: number = 0;
  private stops: number[] = [];
  private peopleInside:  Person[] = [];
  private boardingTimer;

  get position(): number         { return this.liftPosition; }
  set position(newValue: number) { this.liftPosition = Math.max(Math.min(this.topFloor, newValue), 0); }
  get nextStop(): number         { return this.stops[0]; }

  get topFloor(): number         { return this.floorCount - 1; }
  get free(): boolean            { return this.stops.length === 0 && this.state === LiftState.Open; }
  get people(): Person[]         { return this.peopleInside; }
  get queueing(): boolean        { return !!(this.enteringQueue.length + this.leavingQueue.length); }
  get peopleVisible(): Person[]  { return this.people.filter(p => this.enteringQueue.indexOf(p) === -1).concat(this.leavingQueue); }

  get leavingQueue(): Person[]   { return this.queues.leaving; }
  get enteringQueue(): Person[]  { return this.queues.entering; }

  constructor(public id: number,
              public controller: Controller,
              public floorCount: number) {}

  tick(): void {
    switch (this.state) {
      case LiftState.Arriving: // Just a tick. Could be used as a hook for animations.
        this.state = LiftState.Open;
        break;

      case LiftState.Open: // Landed at floor. Controller in charge of deboarding and boarding.
        this.stops = this.stops.filter(s => s !== this.position);
        this.controller.arrived(this);
        if (this.queueing) {
          this.state = LiftState.Boarding;
        } else if (this.nextStop !== undefined) {
          this.state = LiftState.Departing;
        }
        break;

      case LiftState.Boarding: // Timeout to prevent instantaneous boarding and deboarding.
        if (!this.queueing) {
          // Leave this state is the queues are empty.
          window.clearTimeout(this.boardingTimer);
          this.boardingTimer = undefined;
          this.state = this.nextStop ? LiftState.Departing : LiftState.Open;
        }
        if (this.boardingTimer) {
          // Skip this tick if we're waiting on the timeout.
          break;
        }
        // First people leave.
        while (this.leavingQueue.length) {
          this.boardingTimer = window.setTimeout(() => {
            this.queues.leaving.pop();
            this.boardingTimer = undefined;
          }, Settings.people.time_to_leave);
          break;
        }
        // Then people enter.
        while (this.enteringQueue.length) {
          this.boardingTimer = window.setTimeout(() => {
            this.queues.entering.pop();
            this.boardingTimer = undefined;
          }, Settings.people.time_to_enter);
          break;
        }
        break;

      case LiftState.Departing: // Just a tick. Could be used as a hook for animations.
        this.state = this.directionFor(this.nextStop);
        break;

      case LiftState.MovingUp: // Increase position. Normalize it to floor level if we're *really* close.
        this.position += Settings.lifts.speed;
        if (this.atLevel(this.nextStop, Direction.Up)) {
          this.position = this.nextStop;
          this.state = LiftState.Arriving;
          break;
        }
        break;

      case LiftState.MovingDown:  // Decrease position. Normalize it to floor level if we're *really* close.
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
    this.queues.leaving = leavingPeople;
    this.peopleInside = this.people.filter(p => leavingPeople.indexOf(p) === -1);
  }

  peopleEntering(enteringPeople: Person[]) {
    this.queues.entering = enteringPeople;
    this.peopleInside = this.people.concat(enteringPeople);
    enteringPeople.forEach(p => this.addStop(p.desiredFloor));
  }

  addStop(floor: number): void {
    if (this.stops.indexOf(floor) === -1) {
      this.stops.push(floor);

      // TODO: This should be called at a more deterministic interval.
      this.stops = this.controller.sortStopsForLift(this, this.stops);
    }
  }

  // Returns a LiftState depending on whether `floor` argument
  // is above or beneath the lift.
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

  // Returns undefined if lift between floors.
  // Otherwise returns current floor.
  // Since lift sometimes moves at irregular increments,
  // will check wether the lift is *just* about to arrive
  // and then return the floor.
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
    return this.currentLevel(direction) === goal;
  }
}
