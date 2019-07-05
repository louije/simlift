import { Lift } from "./lift";

export interface Person {
  id:            number;

  currentFloor?: number;
  desiredFloor:  number;
  insideLift?:   Lift;

  tsArrived:     number;
  tsEmbarked:    number;
  tsDisembarked: number;

  embark():      void;
  disembark():   void;
}
