const flatten = array => {
  let res = [];
  array.forEach(element => {
    if (Array.isArray(element)) {
      res = res.concat(flatten(element));
    } else {
      res.push(element);
    }
  });
  return res;
};

module.exports = flatten;
