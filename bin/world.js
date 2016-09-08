var MAP= require('./gameMap');

var gameConfig = require('./gameConfig');
var gameObject = require('./gameObject');

function World(width, height){

    this.setAllObj=function(){
        return all_obj;
    }

    this.setPlayers=function(){
        return me.players;
    }

    var me = this;
    var event = [];
    var all_obj = [];
    me.players = [];
   // var playerId = 0;
    var timerId = null;
    var id = 0;
    var thrones=[[1,1],[width-2,height-2],[1,height-2],[width-2,1]]

    me.gameConfig = gameConfig;
    me.gameMap = new MAP.GameMap(width, height);

    me.getAll = function(playerid){
        var player= findObjectInArray(me.players, 'id', playerid);
        var rez= all_obj.filter(function(obj){ return obj.hp != 'del' }).map(function(obj){
            return {
                type: obj.type,
                id: obj.id,
                coord: obj.coord,
                player_id: obj.playerId,
                hp: obj.hp,
                attackTarget: obj.attackTarget,
                moveAnimation: obj.moveAnimation,
                lvlInfo: obj.lvlInfo
            }
        })

        rez.push({
            type: 'PLAYER',
            gold: player.gold,
            player_name: player.name,
            player_id: player.id
        });

        return rez;
    }

    me.getPlayers = function(){ return me.players }

    me.createPlayer = function(name, player_id){
        var new_player = {
            type: "PLAYER",
            die: false,
            id: player_id,
            name: name,
            coord:thrones[player_id],
            tow:2,
            place:2,
            wall:3,
            gold:6000,
        };

        me.players.push(new_player);
        me.createObject('CASTLE', new_player.id, thrones[new_player.id]);
        this.buildCastle(thrones[new_player.id],new_player.id);
    };

    this.buildCastle=function(coord,player_id){
        for (var i=0;i<width;i++){
            for(var j=0;j<height;j++){
                if ((Math.abs((i-coord[0]))<3)&&(Math.abs((j-coord[1])))<3){
                    if ((i==coord[0])&&(j==coord[1])){}else{
                        var config = findObjectInArray(me.gameConfig, 'type', "PLACE");
                        me.createObject("PLACE", player_id, [i,j], config);						}

                }
            }
        }
    }

    me.buyObject = function(type, playerId, coord){
        var coordinate=coord;
        var config = findObjectInArray(me.gameConfig, 'type', type);
        var player = findObjectInArray(me.players, 'id', playerId);
        if ((config.block==false)&&(config.type!="PLACE")){
           coordinate = thrones[playerId];
        }
        if( config && player && me.gameMap.checkPointToFree(coordinate,all_obj,config.block,type,playerId)){
            if(!config.block || me.gameMap.checkToFreePath(coordinate,all_obj)) {
                if (player.gold >= config.price) {
                    player.gold -= config.price;
                    me.createObject(type, playerId, coordinate, config);
                }
            }
        }
    };

    me.sellObject = function(id, playerId){
        var sellObject = findObjectInArray(all_obj, 'id', id);
        if(sellObject.playerId == playerId){
            var player = findObjectInArray(me.players, 'id', playerId);
            var hpBonus = sellObject.hp/sellObject.maxHp;
            player.gold += sellObject.price * 0.8 * hpBonus;
            all_obj.splice(all_obj.indexOf(sellObject),1);
        }
    };

    me.createObject = function(type, playerId, coordinate, conf){
        var config = conf || findObjectInArray(me.gameConfig, 'type', type);
        if(config){
            var new_obj = all_obj.push(new gameObject(++id, type, playerId, coordinate, config));
            return new_obj;
        }
        return false;
    };

    function worldInterval(){
        all_obj.forEach(function(game_Object){
            if(game_Object.hp!='del') {
                game_Object.move.call(game_Object, all_obj, me.gameMap, me);
                game_Object.attack.call(game_Object, all_obj, me.gameMap, me);
                game_Object.spawnObjects.call(game_Object, all_obj, me.gameMap, me);
                game_Object.craft.call(game_Object, all_obj, me.gameMap, me);
            }
        });
    }
    me.delObjectsById = function(player_id){
        for (var i=0;i<=all_obj.length-1;i++){
            if (all_obj[i].playerId==player_id){
                all_obj[i].hp="del";
            }
        }
    }


    function randomBlocks(num){
        var all_castle = findObjectsInArray(all_obj, 'type', 'CASTLE');
        var all_place = findObjectsInArray(all_obj, 'type', 'PLACE');
        var block_array = [];
        var i = 0,
            wL = height- 1,
            hL = width-1;
        while (i<num) {
            var x = (Math.random()*wL).toFixed(0);
            var y = (Math.random()*hL).toFixed(0);

            if(all_castle.every(function (cc){ return cc.coord[0]!==y && cc.coord[1]!=x }))
                if(all_place.every(function (cc){ return cc.coord[0]!==y && cc.coord[1]!=x })) {
                    if(~!block_array.indexOf(''+x+''+y)) {
                        block_array.push('' + x + '' + y);
                        me.createObject("BLOCK", 999, [y, x]);
                        i++;
                    } else console.log('repeat');
                }
        }
    }

    me.startWorld = function(){
        if(!me.worldStart) randomBlocks(30);

        timerId = setInterval( worldInterval.bind(me), 100 );
        me.worldStart = true;
    }

    me.pauseWorld = function(){
        clearInterval(timerId);
    }

    me.upLvl=function(mes){
        var player = findObjectInArray(me.players, 'id', mes.player_id);
        var object = findObjectInArray(all_obj, 'id', mes.id);
        if (mes.player_id!=object.playerId){return;}
        var number = findObjectInArray(object.lvlInfo, "upgrade", mes.upgrade);
        if (!object.lvlInfo){return;}
        if ((number.lvl<number.maxLvl) && (player.gold >= number.price)){
            player.gold-=number.price;
            number.lvl=number.lvl+1;

            if (mes.upgrade=="hp"){object["maxHp"]=object["maxHp"]+number.step;} //говноКод

            object[mes.upgrade]=object[mes.upgrade]+number.step;
            console.log(object.id)
        }

    }

    /////////////////////////
    // other functions

    function findObjectInArray(array, param, value){
        for(var i=0; i<array.length; i++)
            if(array[i][param]==value)
                return array[i];
        return false;
    }

    function findObjectsInArray(array, param, value){
        var reaz = [];
        for(var i=0; i<array.length; i++)
            if(array[i][param]==value)
                reaz.push(array[i]);
        return reaz;
    }
}

module.exports.World = World;