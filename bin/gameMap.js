var PF = require('pathfinding');

function GameMap(width, height){
	var me = this;
	me.width = width;
	me.height = height;

	allBlocks = [];

	me.addBlock = function(coordinate){

	}

	me.removeBlock = function(coordinate){
		
	}

	function findObjectsInArray(array, param, value){
		var reaz = [];
		for(var i=0; i<array.length; i++)
			if(array[i][param]==value)
				reaz.push(array[i]);
		return reaz;
	}

	function findObjectInArray(array, param, value){
		for(var i=0; i<array.length; i++)
			if(array[i][param]==value)
				return array[i][param];
	}

	me.checkToFreePath = function(coordinate, all_obj){
		var coordinate = coordinate;
		var spawnObjects = all_obj.filter(function (obj) { return !!obj.spawnInterval });

		return spawnObjects.every(function (obj) {
			var from = obj;
			return spawnObjects.every(function (obj) {
				var to = obj;
				if(from.playerId !== to.playerId) {
					var path = me.findPathToCoordinate(from.coord, to.coord, all_obj, coordinate);
					return !!(path.length);
				} else
					return true;
			})
		})
	},

	me.findPathToCoordinate = function(from, to, all_obj, testCoordinate){

		var grid = new PF.Grid(me.width, me.height); 
		var finder = new PF.AStarFinder();

		var objects = findObjectsInArray(all_obj, 'block', true);
		objects.forEach(function(obj){
			try {
				if ((obj && obj.coord != to ) && (obj.hp != "del"))
					grid.setWalkableAt(obj.coord[0], obj.coord[1], false);
			} catch(e){
				console.error(e.message);
			}
		});
		if(testCoordinate!==undefined)grid.setWalkableAt(testCoordinate[0], testCoordinate[1], false);

		return finder.findPath(from[0], from[1], to[0], to[1], grid);
	}

	me.findFreeSpace = function(longAwayCoordinate){
		//TODO - need for find CASTLE long away coordinate
	}

	me.searchPlace=function(i,j,player_id,all){
		for (var k=0; k<all.length; k++){
			if ((all[k].type=="PLACE") && (all[k].coord[0]==i)&&(all[k].coord[1]==j)&&(all[k].playerId==player_id))
				return true;
		}
		return false;
	}

	me.checkPlaceToBuy = function(coord, all_obj, player_id){
		//Проверка что клетка не занята
		if(all_obj.some(function(o){ return (o.coord[0] == coord[0] && o.coord[1] == coord[1]) && o.type == 'PLACE' }))
			return false;

		//Проверка что новая территория прилегает к общей территории
		var i = coord[0], j = coord[1];
		if( ( (j>0) && me.searchPlace(i,j-1,player_id,all_obj) ) ||
			( (i>0) && me.searchPlace(i-1,j,player_id,all_obj) ) ||
			( (j<height-1) && me.searchPlace(i,j+1,player_id,all_obj) ) ||
			( (i<width-1) && me.searchPlace(i+1,j,player_id,all_obj) ) )
				return true;

		return false;
	}

	me.checkPointToCraft = function(coord, all_obj, playerId){
		var objInPoint = all_obj.filter(function(o){
			return (o.playerId == playerId) && (o.coord[0] == coord[0] && o.coord[1] == coord[1])
			});
		// Ни одного здания в этом месте и хотя бы один свой PLACE
		var r = objInPoint.every(function(o){return !o.block}) && objInPoint.some(function(o){return o.type == 'PLACE'});
		delete objInPoint;
		return r;
	}	
		
}

module.exports.GameMap = GameMap;