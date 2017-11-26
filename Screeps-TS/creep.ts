/* creep.ts
 * Core classes and definitions for creep control
 * Includes Task interface and CreepController class
 */

interface CreepMemory {
    controller: CreepController
}

interface Task {
    /*
     * Runs a task for a tick
     * returns true if the task is complete and should be deleted.
     */
    runTick(creep: Creep): boolean;
}

abstract class CreepController {
    task: Task;

    constructor(task: Task) {
        this.task = task;
    }

    runTick(creep: Creep) {
        let task = this.task;
        if (task != null) {
            let completed = task.runTick(creep);
            if (completed) {
                this.task = null;
            }
        }
        else {
            this.getTask(creep);
        }
    }

    abstract getTask(creep: Creep);
}
