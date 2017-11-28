//TODO: stub file

class WorkerController extends CreepController {

    getTask(creep: Creep) {
        //TODO: Improve on this so we're not just passing the creep in.
        creep.room.memory.taskManager.getTask(creep);
    }

}