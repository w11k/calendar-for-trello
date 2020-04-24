export function times(amount: number, fn: Function) {
  const res = [];
  for (let i = 0; i < amount; i++) {
    res.push(fn(i));
  }
  return res;
}

