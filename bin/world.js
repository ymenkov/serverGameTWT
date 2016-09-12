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


        rez.push(player);

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
            gold:60000,
        };

        me.players.push(new_player);
        me.createObject('CASTLE', new_player.id, thrones[new_player.id]);
        this.buildCastle(thrones[new_player.id],new_player.id);
    };

    this.buildCastle=function(coord,player_id){ //TODO: need refactoring
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

    me.buyObject = function(type, playerId, coord, parentId){
        var coordinate=coord;
        var config = findObjectInArray(me.gameConfig, 'type', type);
        var player = findObjectInArray(me.players, 'id', playerId);

        if( config.need && !all_obj.some(function(o){ return (o.playerId == playerId) && (o.type == config.need) }) )
            return 'Необходимо построить ' + config.need; //проверка на наличие необходимого обьекта

        if (config.block === true) {

            //Здание
            if (config && player && me.gameMap.checkPointToCraft(coordinate, all_obj, playerId, config.placeType))
                if (me.gameMap.checkToFreePath(coordinate, all_obj)) {
                    return buyObj();
                }
            return 'Неправильно выбрано место';

        } else {
            if( config.type == "PLACE" ){

                //Территория
                if(me.gameMap.checkPlaceToBuy(coordinate, all_obj, playerId))
                    return buyObj();
                else
                    return 'Неправильно выбрано место';

            } else {

                //Юнит
                coordinate = thrones[playerId];
                return buyObj();

            }
        }

        function buyObj(){
            if( typeof config.price == 'object' ){
                for(var res in config.price) if(player[res] < config.price[res]) return 'Недостаточно ресурсов';
                for(var res in config.price) player[res] -= config.price[res];
                return me.createObject(type, playerId, coordinate, config);
            } else {
                if (player.gold >= config.price) {
                    player.gold -= config.price;
                    return me.createObject(type, playerId, coordinate, config);
                } else
                    return 'Недостаточно ресурсов';
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
            var new_obj = new gameObject(++id, type, playerId, coordinate, config);
            all_obj.push(new_obj);
            return new_obj;
        }
        return 'Ошибка создания обьекта';
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


    function randomBlocks(num, type, xx, yy, all_types){
        var all_blocks = findObjectsInArray(all_obj, 'type', all_types );
        var i = 0;
        while (i<num) {
            xx[0] = parseInt(xx[0]);
            xx[1] = parseInt(xx[1]);
            var x = parseInt( 1*xx[0] + (Math.random()*xx[1]) ).toFixed(0);
            var y = parseInt( 1*yy[0] + (Math.random()*yy[1]) ).toFixed(0);
            if( !all_blocks.some(function (cc){ return (cc.coord[0]==y && cc.coord[1]==x) }) ) {
                var obj = me.createObject(type, 999, [y, x]);
                if(obj) {
                    all_blocks.push(obj);
                    i++;
                }
            } console.log('repeat');
        }
    }

    me.startWorld = function(){
        if(!me.worldStart) {
            var all_types = ['CASTLE', 'PLACE', 'GOLD', 'STONE', 'ROCK', 'LAKE', 'FOREST'];
            var half_x = (height-1)/2;
            var half_y = (width-1)/2;
            var fourth_1 = [ [0, half_x], [0, half_y] ],
                fourth_2 = [ [half_x+1, half_x], [0, half_y] ],
                fourth_3 = [ [0, half_x], [half_y+1, half_y] ],
                fourth_4 = [ [half_x+1, half_x], [half_y+1, half_y] ];

            randomBlocks(10, 'ROCK', [0, height-1], [0, width-1], all_types);
            randomBlocks(10, 'FOREST', [0, height-1], [0, width-1], all_types);
            randomBlocks(10, 'LAKE', [0, height-1], [0, width-1], all_types);

            function evenly(type, num) {
                randomBlocks(num, type, fourth_1[0], fourth_1[1], all_types);
                randomBlocks(num, type, fourth_2[0], fourth_2[1], all_types);
                randomBlocks(num, type, fourth_3[0], fourth_3[1], all_types);
                randomBlocks(num, type, fourth_4[0], fourth_4[1], all_types);
            }

            evenly('GOLD', 2);
            evenly('STONE', 2);
        }

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

            if (mes.upgrade=="hp"){object["maxHp"]=object["maxHp"]+number.step;} //TODO: need refactoring

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

    function findObjectsInArray(array, param, values){
        var reaz = [];
        values = values.push ? values: [values];
        for(var i=0; i<array.length; i++)
            if( ~values.indexOf(array[i][param]) )
                reaz.push(array[i]);
        return reaz;
    }
}

module.exports.World = World;