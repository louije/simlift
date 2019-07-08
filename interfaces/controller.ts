import { Building } from "./building";
import { Lift } from "./lift";

export interface Controller {
  building: Building;
  lifts: Lift[];

  called(from, to): void;
  arrived(lift: Lift);
  tick(): void;
}
