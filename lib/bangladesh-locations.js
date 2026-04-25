import { City, State } from "country-state-city";

const COUNTRY_CODE = "BD";
const STATE_SUFFIXES = [" District", " Division"];
const STATE_NAME_ALIASES = {
  Barisal: "Barishal",
  Barishal: "Barishal",
};

function stripStateSuffix(stateName = "") {
  return STATE_SUFFIXES.reduce((name, suffix) => {
    return name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
  }, stateName).trim();
}

function normalizeStateName(stateName = "") {
  const strippedName = stripStateSuffix(stateName);
  return STATE_NAME_ALIASES[strippedName] || strippedName;
}

const bangladeshLocations = State.getStatesOfCountry(COUNTRY_CODE)
  .map((state) => ({
    ...state,
    displayName: normalizeStateName(state.name),
    cities: City.getCitiesOfState(COUNTRY_CODE, state.isoCode),
  }))
  .filter((state) => state.cities.length > 0);

const bangladeshStates = bangladeshLocations.map(({ cities, displayName, isoCode }) => ({
  isoCode,
  name: displayName,
}));

const bangladeshStateMap = new Map();

for (const state of bangladeshLocations) {
  bangladeshStateMap.set(state.name, state);
  bangladeshStateMap.set(state.displayName, state);
  bangladeshStateMap.set(stripStateSuffix(state.name), state);
}

export function getBangladeshStates() {
  return bangladeshStates;
}

export function getBangladeshCities(stateName) {
  if (!stateName) {
    return [];
  }

  return bangladeshStateMap.get(stateName)?.cities || [];
}

export function normalizeBangladeshState(stateName) {
  if (!stateName) {
    return "";
  }

  const matchedState = bangladeshStateMap.get(stateName);
  return matchedState?.displayName || normalizeStateName(stateName);
}
