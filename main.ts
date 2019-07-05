import { Simulator } from "./simulator";
import { BasicLift } from "./implementations/basic_lift";
import { Lift } from "./interfaces/lift";
import { BuildingHTMLRenderer } from "./implementations/building_html_renderer";

document.addEventListener("DOMContentLoaded", () => {
  const lifts: Lift[] = [0, 1, 2].map(idx => new BasicLift(idx));
  window.SL = new Simulator(9, lifts, document.querySelector(".World"), new BuildingHTMLRenderer());
});
