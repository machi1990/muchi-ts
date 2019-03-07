export default target => {
  return `${target.constructor}`
    .replace(/[fF]unction\s*/g, "")
    .split(/\(/)
    .shift()
    .trim();
};
