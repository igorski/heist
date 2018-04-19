const Copy = {
    INTRO: {
        title: "Welcome to \"Heist\"!",
        message: "In this game, you are a thief. In order to succeed in your career, you need to" +
        "gather as much money as you can (by robbing banks) without ever getting caught by the " +
        "police (each robbery leads to a chase, so be aware of the distance you can cover and the " +
        "distance from the bank to the nearest police station!). Disregard your morals and happy heistin'!"
    },
    MARKERS: {
        title: "Info",
        player: "This is you. Find banks to rob in your neighbourhood but be sure that you can" +
        "cover enough distance without police catching you!"
    },
    GAME: {
        INTERACTION: {
            bank: "Would you like to rob this bank at {A}, it has {$} Euros available and is at {D} meters from your position.",
            police: "This is the police station at {A}. It is at {D} meters from your position",
            gas: "Would you like to purchase {G} liters of gasoline at {A} for the price of {$} ?"
        },
        STATE: {
            funds: "Not enough money!",
            visited: "There is nothing left for you to do here."
        },
        OVER: {
            title: "GAME OVER",
            message: "You got caught. Your final amount of money was {0} euro(s). You can restart " +
            "and try again by pressing 'OK'. But remember: crime doesn't pay."
        }
    }
};

export { Copy };
