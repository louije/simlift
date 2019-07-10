import { Building } from "../interfaces/building";
import { Lift } from "../interfaces/lift";
import { Controller } from "../interfaces/controller";
import { Person } from "../implementations/person";

export class BasicBuilding implements Building {
  private activePeople: Person[] = [];
  private disembarkedPeople: Person[] = [];
  private get nextPersonID(): number {
    return this.activePeople.length + this.disembarkedPeople.length;
  }

  constructor(public floors: number,
              public lifts: Lift[],
              public controller: Controller) {}

  // Messages from Simulator
  tick(): void {
    this.controller.tick();
  }
  addPerson(person: Person): void {
    person.id = this.nextPersonID;
    this.activePeople.push(person);

    this.controller.called(person.currentFloor, person.desiredFloor);
  }

  // Messages from controller
  embarkPeopleAt(floor: number, capacity: number): Person[] {
    const people = this.peopleAtFloor(floor).slice(0, capacity);
    people.forEach(p => p.tsEmbarked = Date.now());
    return people;
  }
  disembarkPeople(people: Person[]): void {
    people.forEach((p) => {
      p.tsDisembarked = Date.now();
      this.disembarkedPeople.push(p);
    });
    this.activePeople = this.activePeople.filter(p => people.indexOf(p) === -1);
  }

  // Stats
  averageTrip():   number { return 0; }
  averageWait():   number { return 0; }
  averageInLift(): number { return 0; }
  totalPeople():   number { return 0; }

  get waitingPeople(): Person[] {
    return this.activePeople.filter(p => !p.tsEmbarked);
  }
  peopleAtFloor(floor: number): Person[] {
    return this.waitingPeople.filter(p => p.currentFloor === floor);
  }

  // For the rendering.
  peopleVisibleAtFloor(floor: number): Person[] {
    const liftsAtFloor = this.lifts.filter(l => l.position === floor);
    const peopleQueueing = liftsAtFloor.map(l => l.enteringQueue).flat();
    return this.peopleAtFloor(floor).concat(peopleQueueing);
  }
}
