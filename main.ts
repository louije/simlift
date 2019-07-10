import Settings from "./settings.json";

import { arrayTo } from "./util/array_utils";

import { Simulator } from "./simulator";

import { Lift } from "./shared/lift";
import { Controller } from "./shared/controller";
import { Building } from "./shared/building";
import { BuildingHTMLRenderer } from "./shared/building_renderer";

import { BasicLift } from "./implementations/basic_lift";
import { NaiveController } from "./implementations/naive_controller";

declare global {
  interface Window {
    SL: Simulator;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const building = createBasicWorld();
  window.SL = new Simulator(building, document.querySelector(".World"), new BuildingHTMLRenderer());
});

function createBasicWorld(): Building {
  const floors = Settings.floors;
  const controller: Controller = new NaiveController();
  const lifts: Lift[] = arrayTo(Settings.lifts.count - 1)
                               .map(idx => new BasicLift(idx, controller, floors));

  const building: Building = new Building(floors, lifts, controller);
  controller.building = building;

  return building;
}
