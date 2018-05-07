require("lqip")
  .base64(process.argv[2])
  .then(x => console.log(x));
