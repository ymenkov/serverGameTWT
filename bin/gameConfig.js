
module.exports = [{
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
	"passiveRes":[{type:"gold",amount:0.1}],
	"lvlInfo":[{"lvl": 1,"upgrade": "damage","step": 50,"maxLvl": 3,"price": 300},{"lvl": 1,"upgrade": "hp","step": 1000,"maxLvl": 5,"price": 300}]
}, {
	"type": "BANK",
	"hp": 40000,
	"price": 1500,
	"moveTargets": false,
	"attackTargets": [],
	"damage": 0,
	"moveSpeed": 0,
	"attackSpeed": 0,
	"attackRadius": 0,
	"block": true,
	"passiveRes":[{type:"gold",amount:0.5}],
},{
	"type": "ORK",
	"hp": 1000,
	"price": 200,
	"moveTargets": ["CASTLE", "HUNTER","ORK", "TROLL","HEALMAN"],
	"attackTargets": ["CASTLE", "HUNTER","ORK", "TROLL","HEALMAN"],
	"damage": 50,
	"moveSpeed": 1,
	"attackSpeed": 1,
	"attackRadius": 2,
	"block": false,
}, {
	"type": "TOWER",
	"hp": 4000,
	"price": 500,
	"moveTargets": false,
	"attackTargets": ["ORK","HUNTER","TROLL","CASTLE","KAMIKADZE","TOWER", "KTULHU", "ST"],
	"damage": 250,
	"moveSpeed": 1,
	"attackSpeed": 1,
	"attackRadius": 3,
	"block": true,
	"lvlInfo":[{"lvl": 1,"upgrade": "damage","step": 50,"maxLvl": 3,"price": 100}, {"lvl": 1,"upgrade": "hp","step": 1000,"maxLvl": 7,"price": 100}]
},{
	"type": "ST",
	"hp": 8000,
	"price": 1000,
	"moveTargets": false,
	"attackTargets": ["ORK","HUNTER","TROLL", "WALLKILLER","KAMIKADZE","TOWER", "ST", "KTULHU", "WALL"],
	"damage": 300,
	"moveSpeed": 1,
	"attackSpeed": 1,
	"attackRadius": 4,
	"block": true,
	"lvlInfo":[{"lvl": 1,"upgrade": "damage","step": 50,"maxLvl": 3,"price": 100}, {"lvl": 1,"upgrade": "hp","step": 1000,"maxLvl": 7,"price": 100}]
}, {
	"type": "PLACE",
	"hp": 1,
	"price": 200,
	"moveTargets": false,
	"attackTargets": [],
	"damage": 0,
	"moveSpeed": 0,
	"attackSpeed": 0,
	"attackRadius": 0,
	"block": false
},{
	"type": "WALL",
	"hp": 5000,
	"price": 200,
	"moveTargets": false,
	"attackTargets": [],
	"damage": 0,
	"moveSpeed": 0,
	"attackSpeed": 0,
	"attackRadius": 0,
	"block": true
},{
	"type": "SW",
	"hp": 5000,
	"price": 400,
	"moveTargets": false,
	"attackTargets": [],
	"damage": 0,
	"moveSpeed": 0,
	"attackSpeed": 0,
	"attackRadius": 0,
	"block": true
},{
	"type": "HUNTER",
	"hp": 1000,
	"price": 250,
	"moveTargets": ["ORK", "TROLL", "HUNTER", "WALLKILLER","KAMIKADZE"],
	"attackTargets": ["ORK", "TROLL", "HUNTER", "WALLKILLER","KAMIKADZE"],
	"damage": 500,
	"moveSpeed": 2,
	"attackSpeed": 2,
	"attackRadius": 2,
	"block": false
},{
	"type": "KTULHU",
	"hp": 50000,
	"price": 5000,
	"moveTargets": ["TROLL", "ORK", "HUNTER", "WALLKILLER","KAMIKADZE"],
	"attackTargets": ["ORK", "TROLL", "HUNTER", "WALLKILLER","KAMIKADZE"],
	"damage": 1100,
	"moveSpeed": 1,
	"attackSpeed": 2,
	"attackRadius": 2,
	"block": false
},

	{
		"type": "ROCK",
		"hp": 100000,
		"block": true
	},
	{
		"type": "LAKE",
		"hp": 100000,
		"block": true
	},
	{
		"type": "FOREST",
		"hp": 100000,
		"block": true
	},
	{
		"type": "GOLD",
		"hp": 100000,
		"block": false
	},
	{
		"type": "STONE",
		"hp": 100000,
		"block": false
	},


	{
	"type": "TROLL",
	"hp": 10000,
	"price": 500,
	"moveTargets": ["TOWER","WALL","ST","BANK","CASTLE","spawnerOrks","spawnerTroll","spawnerHunter"],
	"attackTargets": ["TOWER","WALL","ST","BANK", "CASTLE","spawnerOrks","spawnerTroll","spawnerHunter"],
	"damage": 200,
	"moveSpeed": 1,
	"attackSpeed": 2,
	"attackRadius": 2,
	"block": false
},{
	"type": "WALLKILLER",
	"hp": 3000,
	"price": 200,
	"moveTargets": ["WALL"],
	"attackTargets": ["WALL"],
	"damage": 75,
	"moveSpeed": 1,
	"attackSpeed": 2,
	"attackRadius": 2,
	"block": false,
},{
	"type": "KAMIKADZE",
	"hp": 500,
	"price": 500,
	"moveTargets": ["TOWER", "ST", "BANK", "spawnerOrks","spawnerTroll","spawnerHunter", "WALL"],
	"attackTargets": ["TOWER", "ST", "BANK", "spawnerOrks","spawnerTroll","spawnerHunter", "WALL"],
	"damage": 1000,
	"moveSpeed": 10,
	"attackSpeed": 2,
	"attackRadius": 1,
	"block": false,
},{
	"type": "HEALMAN",
	"hp": 500,
	"price": 500,
	"moveTargets": ["TOWER","ST","BANK", "spawnerOrks","spawnerTroll","spawnerHunter", "WALL"],
	"attackTargets": ["TOWER","ST","BANK", "spawnerOrks","spawnerTroll","spawnerHunter", "WALL"],
	"damage": -300,
	"moveSpeed": 2,
	"attackSpeed": 2,
	"attackRadius": 2,
	"block": false,
	"attackOrHeal": true
},{
	"type": "spawnerHunter",
	"hp": 50000,
	"price": 10000,
	"moveTargets": false,
	"attackTargets": [],
	"damage": 0,
	"moveSpeed": 0,
	"attackSpeed": 0,
	"attackRadius": 0,
	"block": true,
	"spawnInterval": 30,
	"spawnType":"HUNTER"
},{
	"type": "spawnerOrks",
	"hp": 50000,
	"price": 5000,
	"moveTargets": false,
	"attackTargets": [],
	"damage": 0,
	"moveSpeed": 0,
	"attackSpeed": 0,
	"attackRadius": 0,
	"block": true,
	"spawnInterval": 30,
	"spawnType":"ORK"
},
{
	"type": "spawnerTroll",
	"hp": 50000,
	"price": 20000,
	"moveTargets": false,
	"attackTargets": [],
	"damage": 0,
	"moveSpeed": 0,
	"attackSpeed": 0,
	"attackRadius": 0,
	"block": true,
	"spawnInterval": 30,
	"spawnType":"TROLL"
}
];