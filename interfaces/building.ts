import { Lift } from "./lift";
import { Controller } from "./controller";
import { Person } from "../implementations/person";

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
  embarkPeopleAt(floor: number, capacity: number): Person[];
  disembarkPeople(people: Person[]): void;

  // Stats
  averageTrip():   number;
  averageWait():   number;
  averageInLift(): number;
  totalPeople():   number;

  // For renderer
  peopleAtFloor(floor: number): Person[];
}
