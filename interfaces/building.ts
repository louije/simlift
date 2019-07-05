import { Lift } from "./lift";
import { Person } from "./person";

export interface Building {
  floors: number;
  lifts:  Lift[];
  people: Person[];
  disembarkedPeople: Person[];

  tick(): void;
  peopleAt(floor: number): Person[];
}
