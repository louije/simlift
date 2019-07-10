/* tslint:disable:align */

import { arrayTo } from "../util/array_utils";
import { Building } from "./building";
import { Person } from "./person";

export function personDataFactory(building: Building): Person {
  const from = Math.floor(Math.random() * building.floors);
  let to = from;

  // Ensure people don't take the lift for just one floor.
  // while (to === from || to === from + 1 || to === from - 1) {

  // Ensure people don't take the lift for same floor
  while (to === from) {
    to = Math.floor(Math.random() * building.floors);
  }
  return new Person(undefined, from, to);
}

export function peopleDataDactory(building: Building,
                                   howMany: number,
                                      from: number = undefined,
                                        to: number = undefined) {
  const people = arrayTo(howMany).map((i) => {
    let fromFloor = from !== undefined ? from : Math.floor(Math.random() * building.floors);
    let toFloor   = to   !== undefined ? to   : Math.floor(Math.random() * building.floors);

    while (toFloor === fromFloor) {
      if (to) {
        fromFloor = Math.floor(Math.random() * building.floors);
      } else {
        toFloor = Math.floor(Math.random() * building.floors);
      }
    }

    return new Person(undefined, fromFloor, toFloor);
  });
  return people;
}
