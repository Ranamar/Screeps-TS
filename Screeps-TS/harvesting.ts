enum HarvestState {
    SPAWN = 0,
    TRAVEL_EMPTY = 1,
    HARVEST = 2
}

abstract class EnergyHarvestTask implements Task {
    state: HarvestState;
    targetId: string;
    targetPos: RoomPosition;

    constructor(target: Source) {
        this.targetId = target.id;
        this.targetPos = target.pos;
        this.state = HarvestState.SPAWN;
    }

    doHarvest(creep: Creep) {
        let target = Game.getObjectById<Source>(this.targetId);
        creep.harvest(target);
        //TODO: check errors?
    }

    abstract runTick(creep: Creep): boolean;
}

class OneshotEnergyHarvestTask extends EnergyHarvestTask {
    runTick(creep: Creep): boolean {
        if (this.state === HarvestState.HARVEST) {
            if (creep.carry.energy === creep.carryCapacity) {
                //We're done here.
                return true;
            }
        }
        else if (this.state === HarvestState.TRAVEL_EMPTY) {
            if (creep.pos.getRangeTo(this.targetPos) <= 1) {
                this.state = HarvestState.HARVEST;
            }
        }
        else if (this.state === HarvestState.SPAWN) {
            if (!creep.spawning) {
                this.state = HarvestState.TRAVEL_EMPTY;
            }
        }
        return false;
    }
}

class DedicatedEnergyHarvestTask extends EnergyHarvestTask {
    containerId: string;

    constructor(target: Source, container: Structure) {
        super(target);
        this.containerId = container.id;
    }

    runTick(creep: Creep): boolean {
        if (this.state === HarvestState.HARVEST) {
            //If we were going to stop and do something else when full, we'd do it here.
        }
        else if (this.state === HarvestState.TRAVEL_EMPTY) {
            if (creep.pos.getRangeTo(this.targetPos) <= 1) {
                this.state = HarvestState.HARVEST;
            }
        }
        else if (this.state === HarvestState.SPAWN) {
            if (!creep.spawning) {
                this.state = HarvestState.TRAVEL_EMPTY;
            }
        }

        if (this.state === HarvestState.HARVEST) {
            this.doHarvest(creep);

            //Put energy somewhere
            let container: Structure = Game.getObjectById <Structure>(this.containerId);
            creep.transfer(container, RESOURCE_ENERGY);
            //TODO: handle bad container?
            //TODO: handle container not next to creep
        }
        else if (this.state === HarvestState.TRAVEL_EMPTY) {
            //Move to source
            creep.moveTo(this.targetPos);
            //TODO: check errors?
        }
        else if (this.state === HarvestState.SPAWN) {
            //Sit and wait for us to finish spawning
        }


        return false;
    }
}

class HarvesterController extends CreepController {
    getTask(creep: Creep) {
        //We don't really do much here, but we need to do something to block warnings.
        return creep;
    }
}