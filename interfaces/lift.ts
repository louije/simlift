import { Person } from "./person";

export enum LiftState {
  Opening,
  Open,
  Closing,
  MovingUp,
  MovingDown,
}

export enum Direction {
  Up,
  Down,
}

export interface Lift {
  id: number;
  floorCount: number;
  capacity: number;
  people: Person[];
  state: LiftState;
  position: number;

  tick(): void;
  addStop(floor: number): void;
}
