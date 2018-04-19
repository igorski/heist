/**
 * keywords that will fetch locations from the FourSquare API
 * the actual values are selected keyword fragments to provide the most
 * results (e.g. "Polit" to match "Politie" rather than "Police" as
 * FourSquare venues aren't localized. Well that makes sense. Luckily
 * Dutch and English aren't that far apart.
 *
 * This is however very error prone (for instance: "Banket bakker" (Bakery)
 * that matches the word "Bank"). Need to match with FourSquare category id's
 *
 * @enum {string}
 */
const Locations = {
    POLICE: "polit",
    BANK  : "bank",
    GAS: "tank"
};

/**
 * Categories are a way to filter resulting venues from the FourSquare API
 * by their actual purpose. Sadly we must search for venue by NAME instead of
 * retrieving them by category, GAH!
 *
 * @enum {string}
 */
const Categories = {
    BANK: "4bf58dd8d48988d10a951735"
};

export { Locations, Categories };
