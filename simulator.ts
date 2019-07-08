import { Building } from "./interfaces/building";
import { BuildingRenderer } from "./interfaces/building_renderer";
import { Lift } from "./interfaces/lift";

export class Simulator {

  constructor(public building: Building,
              public destination: HTMLElement,
              public renderer: BuildingRenderer) {
    this.renderer.building = this.building;
    this.loop();
  }

  loop() {
    this.building.tick();
    window.requestAnimationFrame(this.render.bind(this));
    window.setTimeout(this.loop.bind(this), 1000);
  }

  render() {
    this.renderer.render(this.destination);
  }
}
