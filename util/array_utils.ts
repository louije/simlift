export function arrayTo(to: number, from: number = 0): number[] {
  const ar = [];
  for (let i = from; i <= to; i += 1) {
    ar.push(i);
  }
  return ar;
}
