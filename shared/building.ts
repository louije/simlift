import { Lift } from "./lift";
import { Controller } from "./controller";
import { Person } from "./person";

export interface Buildingish {
  controller: Controller;
  floors: number;
  lifts:  Lift[];

  // World event
  tick(): void;
  addPerson(person: Person): void;

  // Communication with controller
  embarkPeopleAt(floor: number, capacity: number): Person[];
  disembarkPeople(people: Person[]): void;
  peopleAtFloor(floor: number): Person[];

  // Stats
  averageTrip():       number;
  averageWait():       number;
  averageInLift():     number;
  totalPeopleTransported(): number;

  // For renderer
  peopleVisibleAtFloor(floor: number): Person[];
}

export class Building implements Buildingish {
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

  get waitingPeople(): Person[] {
    return this.activePeople.filter(p => !p.tsEmbarked);
  }
  peopleAtFloor(floor: number): Person[] {
    return this.waitingPeople.filter(p => p.currentFloor === floor);
  }

  // Stats
  averageTrip(): number {
    return this.disembarkedPeople.reduce((sum: number, p: Person): number => {
      return sum + (p.tsDisembarked - p.tsArrived);
    }, 0) / this.totalPeopleTransported();
  }
  averageWait(): number {
    return this.disembarkedPeople.reduce((sum: number, p: Person): number => {
      return sum + (p.tsEmbarked - p.tsArrived);
    }, 0) / this.totalPeopleTransported();
  }
  averageInLift(): number {
    return this.disembarkedPeople.reduce((sum: number, p: Person): number => {
      return sum + (p.tsDisembarked - p.tsEmbarked);
    }, 0) / this.totalPeopleTransported();
  }
  totalPeopleTransported(): number {
    return this.disembarkedPeople.length;
  }

  // For the rendering.
  peopleVisibleAtFloor(floor: number): Person[] {
    const liftsAtFloor = this.lifts.filter(l => l.position === floor);
    const peopleQueueing = liftsAtFloor.map(l => l.enteringQueue).flat();
    return this.peopleAtFloor(floor).concat(peopleQueueing);
  }
}
