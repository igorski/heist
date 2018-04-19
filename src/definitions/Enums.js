/**
 * keywords that will fetch locations from the FourSquare API
 * the actual values are selected keyword fragments to provide the most
 * results (e.g. "Polit" to match "Politie" rather than "Police" as
 * FourSquare venues aren't localized. Well that make sense. Luckily
 * Dutch and English aren't that far apart.
 *
 * @enum {string}
 */
const Locations = {
    POLICE: "polit",
    BANK  : "bank"
};

export { Locations };
