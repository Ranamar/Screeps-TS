//RoomPosition.prototype.isEdge = function (): boolean {
//    return this.x == 0 || this.y == 0 || this.x >= 49 || this.y >= 49
//}

export function createScalingCreep(spawn: Spawn, settings: CreepMemory) {
    let energy: number = spawn.room.energyAvailable;
    // var block = [WORK, CARRY, MOVE];
    // var blockCost = 200;
    // var totalCost = 0;
    let largest: BodyPartConstant[] = [];
    // while(totalCost + blockCost <= energy) {
    //     largest = largest.concat(block);
    //     totalCost += blockCost;
    // }
    if(energy >= 200) {
        largest = largest.concat([WORK, CARRY, MOVE]);
    }
    if(energy >= 400) {
        largest = largest.concat([WORK, CARRY, MOVE]);
    }
    if(energy >= 600) {
        largest = largest.concat([WORK, CARRY, MOVE]);
    }
    if(energy >= 850) {
        largest = largest.concat([WORK, WORK, MOVE]);
    }
    //If we truly have a ton of energy, double-stack it.
    if(energy >= 1700) {
        largest = largest.concat([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]);
    }
    spawn.createCreep(largest, null, settings);
}

export function creepGC() {
    for (let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            //Clean up any tracking lists it was on
            //for(var room in Memory.rooms) {
                //cleanEnergyTracking(room, name);
                //cleanUpgradeTracking(room, name);
            //}
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}
