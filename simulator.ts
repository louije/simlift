import Settings from "./settings.json";
import { Building } from "./interfaces/building";
import { BuildingRenderer } from "./interfaces/building_renderer";
import { Lift } from "./interfaces/lift";
import { personDataFactory } from "./implementations/person_data_factory";

export class Simulator {

  constructor(public building: Building,
              public destination: HTMLElement,
              public renderer: BuildingRenderer) {
    this.renderer.building = this.building;
    this.loop();
  }

  loop() {
    this.randomEvents();
    this.building.tick();
    window.requestAnimationFrame(() => {
      this.render();
      this.loop();
    });
  }

  render() {
    this.renderer.render(this.destination);
  }

  private randomEvents() {
    if (Math.random() * 100 < Settings.events_probability.new_person) {
      this.createPerson();
    }
  }

  private createPerson() {
    const person = personDataFactory(this.building);
    this.building.addPerson(person);
  }
}
