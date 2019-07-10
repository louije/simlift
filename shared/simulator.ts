import Settings from "../settings.json";
import { arrayTo } from "../util/array_utils";
import { Building } from "./building";
import { BuildingRenderer } from "./building_renderer";
import { Lift } from "./lift";
import { Person } from "./person";
import { personDataFactory, peopleDataDactory } from "./person_data_factory";

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
    window.setTimeout(this.loop.bind(this), Settings.simulation_timeout);
    window.requestAnimationFrame(this.render.bind(this));
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
