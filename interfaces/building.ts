import { Lift } from "./lift";
import { Person } from "./person";
import { Controller } from "./controller";

export interface Building {
  controller: Controller;
  floors: number;
  lifts:  Lift[];

  // private
  // activePeople: Person[];
  // disembarkedPeople: Person[];

  // World event
  tick(): void;
  addPerson(person: Person): void;

  // Communication with controller
  embarkPeopleAt(floor: number): void;
  disembarkPeople(people: Person[]): void;

  // Stats
  averageTrip():   number;
  averageWait():   number;
  averageInLift(): number;
  totalPeople():   number;
}
