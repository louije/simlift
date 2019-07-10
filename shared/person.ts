export class Person {
  tsArrived:     number;
  tsEmbarked:    number;
  tsDisembarked: number;

  constructor(public id: number,
              public currentFloor: number,
              public desiredFloor: number) {
    this.tsArrived = Date.now();
  }

  embark() {
    this.tsEmbarked = Date.now();
  }

  disembark() {
    this.tsDisembarked = Date.now();
  }
}
