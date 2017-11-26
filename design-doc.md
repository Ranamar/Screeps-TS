# Creep Control Philosophy

The way I see it, the creeps in screeps make up a distributed system, and distributed
systems are easily managed using state machines.  These have the advantage that each
one is individually simple, but you can still get complex behavior out of them.
Meanwhile, the same set of modules in a creep can be used for different purposes
depending on the needs of the room it is in.  This means that, to a significant extent,
the states and transitions of the state machine are defined by the task which the creep
is assigned, rather than the creep itself.  The tasks are limited by its construction,
but the behavior is a function of its task.

## Creep Controllers and Tasks

Each creep's memory will be defined by a controller class.  This class is responsible
for knowing what tasks the creep can pick up, as well as what task it is currently
executing.  It will also provide a generalized interface to link the run loop to the
creep's task.  It is possible that we can save some memory references by putting this
in the Creep class prototype, but that hides behavior for what seems like a small gain.
There will be a superclass CreepController, but it will be subclassed for most common
roles. (i.e. WorkerController, TransportController, CombatController, etc.)  This will
be assigned at creep spawn, and its first task will be managing spawn initialization.

The main memory field which will be common across all controllers will be a Task.
The Task interface will define a way for controllers to interact with the task their
creep has been assigned.  The Task will manage the current state of the creep and
give orders from tick to tick.  Many tasks will be unidirectional.  For example, it
is tempting but ultimately less than helpful for a harvesting task to include using
the energy it harvested unless all it ever does is use energy in that one way.
Dedicated creeps which do things like harvest into a container or upgrade from a
container will likely have circular tasks: they only ever do one thing.  Even a
creep as simple as a delivery truck, however, as long as it does not have a fixed
circuit, will likely want to have separate missions for getting a load and delivering
that load.