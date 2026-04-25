const { State, City } = require("country-state-city");

const states = State.getStatesOfCountry("BD");
console.log("States:", states.length);
const dhaka = states.find((s) => s.name === "Dhaka Division");

if (!dhaka) {
  console.error('State "Dhaka Division" was not found in the Bangladesh dataset.');
  process.exitCode = 1;
} else {
  console.log("Dhaka iso:", dhaka.isoCode);
  console.log(
    "Cities in Dhaka:",
    City.getCitiesOfState("BD", dhaka.isoCode).length,
  );
}
