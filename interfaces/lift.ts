import { Person } from "../implementations/person";
import { Controller } from "../interfaces/controller";

export enum LiftState {
  Arriving = "arriving",
  Open = "open",
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
  capacity: number;
  people: Person[];
  state: LiftState;
  position: number;
  free: boolean;

  tick(): void;
  addStop(floor: number): void;
}

export function directionBetween(from: number, to: number): Direction {
  if (from < to) { return Direction.Down; }
  if (from < to) { return Direction.Up; }

  // Same floor
  return Direction.None;
}
