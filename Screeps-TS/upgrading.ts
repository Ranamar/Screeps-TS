enum UpgradeState {
    START = 0,
    TRAVEL_EMPTY = 1,
    GET_ENERGY = 2,
    TRAVEL_FULL = 3,
    UPGRADE = 4
}

abstract class UpgradeTask implements Task {
    state: UpgradeState;
    targetId: string;
    targetPos: RoomPosition;

    constructor(target: StructureController) {
        this.targetId = target.id;
        this.targetPos = target.pos;
        this.state = UpgradeState.START;
    }

    doUpgrade(creep: Creep) {
        let target = Game.getObjectById<StructureController>(this.targetId);
        creep.upgradeController(target);
    }

    abstract runTick(creep: Creep): boolean;
}

class OneshotUpgradeTask extends UpgradeTask {
    runTick(creep: Creep): boolean {
        if (this.state === UpgradeState.UPGRADE) {
            if (creep.carry.energy === 0) {
                //We're out of energy to upgrade; find something new to do.
                return true;
            }
        }
        else if (this.state === UpgradeState.TRAVEL_FULL) {
            if (creep.pos.getRangeTo(this.targetPos) <= 3) {
                this.state = UpgradeState.UPGRADE;
            }
        }
        else if (this.state === UpgradeState.START) {
            //This task assumes we have already gotten energy.  If we don't, abort.
            if (creep.spawning || creep.carry.energy === 0) {
                return true;
            }
            this.state = UpgradeState.TRAVEL_FULL;
        }

        if (this.state === UpgradeState.UPGRADE) {
            this.doUpgrade(creep);
        }
        else if (this.state === UpgradeState.TRAVEL_FULL) {
            creep.moveTo(this.targetPos);
        }
        //It is impossible to get to UpgradeState.START here, so there's no entry.

        return false;
    }

}

class DedicatedUpgradeTask extends UpgradeTask {
    containerId: string;
    containerPos: RoomPosition

    constructor(target: StructureController, container: Structure) {
        super(target);
        this.containerId = container.id;
        this.containerPos = container.pos;
    }

    runTick(creep: Creep): boolean {
        if (this.state === UpgradeState.UPGRADE) {
            //If we were going to stop and do something else when full, we'd do it here.
        }
        else if (this.state === UpgradeState.TRAVEL_FULL) {
            if (creep.pos.getRangeTo(this.targetPos) <= 3) {
                this.state = UpgradeState.UPGRADE;
            }
        }
        else if (this.state === UpgradeState.TRAVEL_EMPTY) {
            if (creep.pos.getRangeTo(this.containerPos) === 1) {
                this.state = UpgradeState.GET_ENERGY;
            }
        }
        else if (this.state === UpgradeState.GET_ENERGY) {
            if (creep.carry.energy > 0) {
                this.state = UpgradeState.TRAVEL_FULL;
            }
        }
        else if (this.state === UpgradeState.START) {
            if (!creep.spawning) {
                this.state = UpgradeState.TRAVEL_EMPTY;
            }
        }

        //Actually do state
        if (this.state === UpgradeState.UPGRADE) {
            //If we were going to stop and do something else when full, we'd do it here.
        }
        else if (this.state === UpgradeState.TRAVEL_FULL) {
            if (creep.pos.getRangeTo(this.targetPos) <= 3) {
                
            }
        }
        else if (this.state === UpgradeState.TRAVEL_EMPTY) {
            if (creep.pos.getRangeTo(this.containerPos) === 1) {
                
            }
        }
        else if (this.state === UpgradeState.GET_ENERGY) {
            if (creep.carry.energy > 0) {
                
            }
        }
        else if (this.state === UpgradeState.START) {
            //This exists for when we are spawning; nothing happens.
        }

        return false;
    }
}

class UpgraderController extends CreepController {
    getTask(creep: Creep) {
        //We don't really do much here, but we need to do something to block warnings.
        return creep;
    }
}