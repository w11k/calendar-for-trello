export function times(amount: number, fn: Function) {

  // console.log('calling times fn!');

  const res = [];
  for (let i = 0; i < amount; i++) {
    // console.log(`inside the for loop in times function for the ${i} time`);
    res.push(fn(i));
  }

  // console.log('res is: ', res);

  return res;
}

