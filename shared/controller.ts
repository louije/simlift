import { Building } from "./building";
import { Lift } from "./lift";
import { Person } from "./person";

export interface Controller {
  building: Building;
  lifts: Lift[];

  called(from, to): void;
  arrived(lift: Lift);
  sortStopsForLift(lift: Lift, stops: number[]): number[];
  tick(): void;
}
