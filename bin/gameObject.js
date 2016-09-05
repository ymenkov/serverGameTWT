module.exports = function (id, type, playerId, coordinate, config){
    this.id=id;
    this.type=type; // тип объекта
    this.coord=coordinate; // координаты объекта
    this.playerId = playerId;
    this.attackTarget = false;

    cloneObject(this, [config]);

    if (!this.attackOrHeal){this.attackOrHeal=false;}
    this.maxHp=this.hp;


    this.attackCoolDown = (1000/this.attackSpeed).toFixed(0);
    this.moveCoolDown = (1000/this.moveSpeed).toFixed(0);


    this.move = function(all_obj, gameMap, world){
        if(!this.moveTargets) return;
        var gameObj = this;
        this.moveCoolDown -= 100;
        if(!this.moveCoolDown){
            this.moveCoolDown = (1000/this.moveSpeed).toFixed(0);

            var targets = this.getMoveTargets(all_obj);
            if(targets.length){
                targets = targets.map(function(t){
                    var k = gameMap.findPathToCoordinate(gameObj.coord, t.coord,all_obj);
                    if (k.length==0){}else {
                        return {coord: t.coord, path: k}
                    }
                });

                targets.sort(function(a,b){
                    return a.path.length > b.path.length
                });
                //    console.log(targets.length);
                // for (var i=0;i<targets.length;i++){
                //     if ((targets[i]) && (targets[0].path.length>targets[i].path.length)){
                //         targets[0].path=targets[i].path;
                //     }
                // }
                //
                // if (!targets.length){return;}

                if((targets[0])&&(targets[0].path.length>2)) { //TODO - надо подумать как сделать красивее
                    var newCoordinate = targets[0].path[1];
                }
                else
                    var newCoordinate = this.coord;


                this.moveAnimation = [ this.coord, newCoordinate ];
                this.coord = newCoordinate;
                delete targets;
            }
        }
    }


    this.getMoveTargets = function(all_obj){
        var targets = [];
        if(!this.moveTargets)return [];
        for(var i =0; i<all_obj.length; i++) {
            if (~this.moveTargets.indexOf(all_obj[i].type) && ((this.playerId != all_obj[i].playerId) != this.attackOrHeal)) {
                if ((this.attackOrHeal==true)&&(all_obj[i].hp>=all_obj[i].maxHp)){}else{
                    targets.push({coord: all_obj[i].coord, hp: all_obj[i].hp});
                }
            }

        }
        return targets.filter(function(target){
            return target.hp!="del";
        });

    }

    this.attack = function(all_obj, gameMap, world){
        var gameObj = this;
        this.attackCoolDown -= 100;
        if(!this.attackCoolDown){
            this.attackCoolDown = (1000/this.attackSpeed).toFixed(0);
            var attackTargets=gameObj.getAttackTarget(all_obj,gameObj.attackTargets,gameObj.attackRadius,1,gameObj.coord);

            attackTargets.forEach(function(target){

                //heal


                if ((target.hp>=target.maxHp) && (this.attackOrHeal)){
                    target.hp=target.maxHp;
                    gameObj.attackTarget=false;
                    return;
                }else if(target.hp=="del"){
                    gameObj.attackTarget=false;
                    return;
                }
                gameObj.attackTarget = target.id;
                target.hp-=gameObj.damage;


                //heal end


                if ((target.hp<=0)&&(this.attackOrHeal==false)){
                    //if (target.type=="CASTLE") {dieAllObject(target.player_id);}
                    target.hp="del";
                    var kar=0;
                    for (var i=0;i<=all_obj.length-1;i++){
                        if ((all_obj.type=="CASTLE")&&(all_obj[i].playerId==target.playerId) && (target.hp!="del")){
                            kar=1;
                        }
                    }

                    if ((target.type=="CASTLE") && (kar!=1)){
                        world.delObjectsById(target.playerId);
                        // event.push({event:"die",type:"CASTLE",player:target.name});
                        world.createObject('CASTLE', this.playerId, target.coord);
                    }

                    var player = findObjectInArray(world.players, 'id', gameObj.playerId);
                    if (player) player.gold += target.price/4;

                    all_obj.splice(all_obj.indexOf(target),1);
                }


            }.bind(this));
            delete attackTargets;
        }
    }

    this.spawn=this.spawnInterval;
    this.spawnObjects=function(all_obj, gameMap, world){
        var that=this;
        if (!this.spawnInterval){return;}
        if (this.spawn==this.spawnInterval) {
            this.spawn=0;
            var spawnObjects = all_obj.filter(function (obj) {
                return (obj.type == that.spawnType) && (obj.playerId == that.playerId);
            });
            var building = all_obj.filter(function (obj) {
                return (obj.spawnType == that.spawnType) && (obj.playerId == that.playerId);
            });
            if(spawnObjects.length < (this.max_objects*building.length || 20 * building.length))
                world.createObject(this.spawnType, this.playerId, this.coord);

            delete objects;
            return;
        }
        this.spawn++;
    }

    this.craft=function(all_obj, gameMap, world){
        if (!this.passiveGold){return;}
        for (var i=0;i<this.passiveGold.length;i++) {
            var player = findObjectInArray(world.players, 'id', this.playerId);
            player[this.passiveGold[i].type] = player[this.passiveGold[i].type] + this.passiveGold[i].amount;
        }
    }



    this.getAttackTarget = function(all_obj,attackTypes,radius,targetNumb,coord){
        var gameObj = this;

        if(!attackTypes.indexOf)return [];

        targets = all_obj.filter(function(target){
            return ~attackTypes.indexOf(target.type);
        })
        targets = targets.filter(function(target){
            if (((Math.abs(target.coord[0]-coord[0]))<radius)&&((Math.abs(target.coord[1]-coord[1]))<radius)){
                return true;
            }
            return false;
        })
        targets = targets.filter(function(target){
            if ((gameObj.attackOrHeal==true)&&(gameObj.hp>=gameObj.maxHp)){
                return [];
            }
            return (target.hp!="del" && ((target.playerId!=gameObj.playerId)!=gameObj.attackOrHeal));
        })
        return targets.slice(0,targetNumb);
    }
}

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

function cloneObject(me, arr){
    for(var i=0; i<arr.length; i++){
        var clone = arr[i];
        for(param in clone){
            if(clone.hasOwnProperty(param)) {
                if( (typeof clone[param]) == 'object') {
                    me[param] = clone[param].length? []: {};
                    cloneObject(me[param], [clone[param]]);
                } else {
                    if (me[param] == undefined)
                        me[param] = clone[param];
                }
            }
        }
    }
}