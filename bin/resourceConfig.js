
module.exports = [
    {
        "type": "CASTLE",
        "hp": 100000,
        "price": 0,
        "moveTargets": false,
        "attackTargets": ["ORK", "HUNTER", "TROLL", "TOWER", "ST", "WALLKILLER", "WALL","KAMIKADZE","HEALMAN", "KTULHU"],
        "damage": 300,
        "moveSpeed": 0,
        "attackSpeed": 1,
        "attackRadius": 4,
        "block": true,
        "spawnInterval": 30,
        "spawnType":"ORK",
        "passiveGold":[{type:"gold",amount:0.1}],
        "lvlInfo":[{"lvl": 1,"upgrade": "damage","step": 50,"maxLvl": 3,"price": 300},{"lvl": 1,"upgrade": "hp","step": 1000,"maxLvl": 5,"price": 300}]
    },
];