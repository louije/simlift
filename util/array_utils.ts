/* tslint:disable:prefer-array-literal */

export function arrayTo(to: number, from: number = 0): number[] {
  const ar = [];
  for (let i = from; i <= to; i += 1) {
    ar.push(i);
  }
  return ar;
}

export function arraySample<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}
