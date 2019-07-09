import Settings from "./settings.json";

import { arrayTo } from "./util/array_utils";

import { Simulator } from "./simulator";

import { Lift } from "./interfaces/lift";
import { Controller } from "./interfaces/controller";
import { Building } from "./interfaces/building";

import { BasicBuilding } from "./implementations/basic_building";
import { BasicLift } from "./implementations/basic_lift";
import { BasicController } from "./implementations/basic_controller";
import { BuildingHTMLRenderer } from "./implementations/building_html_renderer";

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
  const controller: Controller = new BasicController();
  const lifts: Lift[] = arrayTo(Settings.lifts.count - 1)
                               .map(idx => new BasicLift(idx, controller, floors));

  const building: Building = new BasicBuilding(floors, lifts, controller);
  controller.building = building;

  return building;
}
