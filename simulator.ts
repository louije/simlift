import Settings from "./settings.json";
import { arrayTo } from "./util/array_utils";
import { Building } from "./interfaces/building";
import { BuildingRenderer } from "./interfaces/building_renderer";
import { Lift } from "./interfaces/lift";
import { Person } from "./implementations/person";
import { personDataFactory, peopleDataDactory } from "./implementations/person_data_factory";

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
    this.occurs(Settings.events.probability.new_person, this.createPerson.bind(this));
    this.occurs(Settings.events.probability.mass_arrival, this.massArrival.bind(this));
    this.occurs(Settings.events.probability.mass_exit, this.massExit.bind(this));
  }

  private createPerson() {
    const person = personDataFactory(this.building);
    this.building.addPerson(person);
  }

  private massArrival() {
    const howMany = Math.floor(Math.random() * Settings.events.mass_arrival_max);
    this.createPeople(howMany, 0, undefined);
  }

  private massExit() {
    const howMany = Math.floor(Math.random() * Settings.events.mass_exit_max);
    this.createPeople(howMany, undefined, 0);
  }

  private createPeople(howMany: number, from: number = undefined, to: number = undefined) {
    const people = peopleDataDactory(this.building, howMany, from, to);
    people.forEach(p => this.building.addPerson(p));
  }

  private occurs(probability: number, callback: Function) {
    if (Math.random() * 100 < probability) {
      callback();
    }
  }
}
