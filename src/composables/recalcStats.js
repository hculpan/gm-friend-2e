const recalcAc = (text) => {
  if (text == undefined) return "";

  let result = text;
  let matches = text.match(/-?(\d+)/g);
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      let num = 20 - matches[i];
      result = result.replace(matches[i], num);
    }
  }
  return result;
};

const recalcThac0 = (text) => {
  if (text == undefined) return "";

  let result = text;
  let matches = text.match(/(\d+)/g);
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      let num = 20 - matches[i];
      result = result.replace(matches[i], num > -1 ? "+" + num : num);
    }
  }
  return result;
};

const getFirstNumber = (dac) => {
  return parseInt(dac.match(/^[^\d]*(\d+)/)[0]);
};

export { recalcAc, recalcThac0, getFirstNumber };

/*
function test() {
  console.log("2 (underside 4) => ", recalcAc("2 (underside 4)"));
  console.log("20 to 13 => ", recalcThac0("20 to 13"));
}

test();
*/
