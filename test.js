const dayjs = require("dayjs");
const now = 1356969600000;
console.log(dayjs(now).format());
console.log(dayjs(now).format("YYYY-MM-DD HH:ss"));
