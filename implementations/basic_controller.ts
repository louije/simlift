import { Controller } from "../interfaces/controller";
import { Lift, LiftState, Direction } from "../interfaces/lift";
import { Building } from "../interfaces/building";

export class BasicController implements Controller {
  building: Building;
  get lifts() {
    return this.building.lifts;
  }

  tick() {}
  called(from: number, to: number) {}
}
