/* room.ts
 * This file has core room management interfaces.
 */

interface RoomMemory {
    taskManager: TaskManager;
    energyManager: EnergyManager;
    spawnManager: SpawnManager;
    layoutManager: LayoutManager;
}

interface TaskManager {
    constructor(room: Room);
    //TODO: Improve on this so we're not just passing the creep in.
    getTask(creep: Creep);
}

interface EnergyManager {
    constructor(room: Room);
    runTick();
}

interface SpawnManager {
    constructor(room: Room);
    isSpawnAvailable(): boolean;
    getEnergyAvailable(): boolean;
    canSpawnNow(spec: BodyPartDefinition): boolean;
    spawnCreep(spec: BodyPartDefinition, name: string, controller: CreepController): ScreepsReturnCode;
    queueCreep(spec: BodyPartDefinition, name: string, controller: CreepController): ScreepsReturnCode;
}

interface LayoutManager {
    constructor(room: Room);

}