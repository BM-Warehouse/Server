const app = require('./app');

const PORT = 5000;

app.listen(PORT, () => {
  //console sebaiknya hanya untuk di Dev
  //ketika di push command aja
  console.log(`Server listening on port ${PORT}...`);
});
