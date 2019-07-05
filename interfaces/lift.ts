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
  id:       number;
  capacity: number;
  people: Person[];
  state: LiftState;
  position: number;

  calledTo(floor: number, direction?: Direction, destination?: number): void;
  goingTo(): number; // is it necessary in the interface? lift is responsible for its own goal.
}
