const { State, City } = require("country-state-city");

const states = State.getStatesOfCountry("BD");
const cities = City.getCitiesOfCountry("BD");
console.log("Total states:", states.length);
console.log("Total cities:", cities.length);
if (cities.length > 0) {
  console.log("First city's stateCode:", cities[0].stateCode);
  console.log("State with that code:", states.find(s => s.isoCode === cities[0].stateCode)?.name);
}
