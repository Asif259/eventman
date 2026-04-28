import { State, City } from "country-state-city";

/**
 * Parse and validate Bangladesh location slug
 * Format: city--division
 * Example: "dhaka--dhaka"
 * Example: "coxs-bazar--chattogram"
 */
export function parseLocationSlug(slug) {
  if (!slug || typeof slug !== "string") {
    return { city: null, state: null, country: null, isValid: false };
  }

  const parts = slug.split("--");

  // Must contain city + division
  if (parts.length < 2) {
    return { city: null, state: null, country: null, isValid: false };
  }

  const capitalizeWords = (str) =>
    str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Strip common suffixes the library appends (e.g. "Chittagong Division" → "Chittagong")
  const STATE_SUFFIXES = [" Division", " District"];
  const stripStateSuffix = (name) =>
    STATE_SUFFIXES.reduce(
      (n, suffix) => (n.endsWith(suffix) ? n.slice(0, -suffix.length) : n),
      name
    ).trim();

  const cityName = capitalizeWords(parts[0]);
  const divisionName = capitalizeWords(parts[1]);

  // Bangladesh country code = BD
  const bangladeshStates = State.getStatesOfCountry("BD");

  // Match by stripping suffixes from both sides so "Chittagong" matches "Chittagong Division"
  const division = bangladeshStates.find(
    (s) =>
      stripStateSuffix(s.name).toLowerCase() === divisionName.toLowerCase() ||
      s.name.toLowerCase() === divisionName.toLowerCase()
  );

  if (!division) {
    return { city: null, state: null, country: null, isValid: false };
  }

  // Validate city exists inside division
  const cities = City.getCitiesOfState("BD", division.isoCode);

  const cityExists = cities.some(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  );

  if (!cityExists) {
    // Accept the location even if the city isn't in the library — user's saved city is the source of truth
    return {
      city: cityName,
      state: stripStateSuffix(division.name),
      country: "Bangladesh",
      isValid: true,
    };
  }

  return {
    city: cityName,
    state: stripStateSuffix(division.name),
    country: "Bangladesh",
    isValid: true,
  };
}

/**
 * Create Bangladesh location slug
 * Example:
 * createLocationSlug("Cox's Bazar", "Chattogram")
 * => "coxs-bazar--chattogram"
 */
export function createLocationSlug(city, state) {
  if (!city || !state) return "";

  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/'/g, "") // remove apostrophes
      .replace(/\s+/g, "-");

  const citySlug = slugify(city);
  const stateSlug = slugify(state);

  return `${citySlug}--${stateSlug}`;
}