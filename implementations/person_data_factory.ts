import { Building } from "../interfaces/building";
import { Person } from "../implementations/person";

export function personDataFactory(building: Building): Person {
  const from = Math.floor(Math.random() * building.floors);
  let to = from;

  while (to === from || to === from + 1 || to === from - 1) {
    to = Math.floor(Math.random() * building.floors);
  }
  return new Person(undefined, from, to);
}
