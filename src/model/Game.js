const Player = {

    // defaults to Dam Square, Amsterdam

    latitude: 52.373068,
    longitude: 4.892639,

    // radius in meters
    radius: 1000,

    // the Players cash-flow in euros
    money: 50
};

const World = {

    // list of all robbed banks and used gas stations (FourSquare venue IDs)

    visited: []
};

export { Player, World };
