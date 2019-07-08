import { Person } from "../implementations/person";
import { Controller } from "../interfaces/controller";

export enum LiftState {
  Arriving,
  Open,
  Departing,
  MovingUp,
  MovingDown,
}

export enum Direction {
  None,
  Up,
  Down,
}

export interface Lift {
  id: number;
  controller: Controller;
  floorCount: number;
  capacity: number;
  people: Person[];
  state: LiftState;
  position: number;

  tick(): void;
  addStop(floor: number): void;
}
