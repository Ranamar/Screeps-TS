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

# Room control

The primary things which need to be managed at a room level are energy management,
creep building, structure layout, combat coordination, and assigning tasks to creeps.
Eventually, it will also need to manage minerals, chemistry, and boosts, but that is
an advanced topic which will not be tackled until after basic functionality has been
completed.  These are all complex questions which are open areas of development across
the screeps userbase, so they need to be able to be easily swaped as new ideas are
developed.  At the same time, they are also deeply interconnected.  This means they
need solid interfaces which allow enough flexibility to replace parts while also
allowing them to work together as the separate controllers change.  The room doesn't
need to dynamically swap these around frequently, however, so these are going directly
in the room's memory object, since that will save us an extra layer of curly braces.

## Task Assignment

A task dispatcher sounds straightforward, but it has a surprising amount of challenges
under the hood.  The very most a creep controller could provide is the number of parts
it has, and that is an expensive version of simply getting a list of things the creep
can do well.  Additionally, sometimes it will have tasks which need new creeps, so it
will need to interact with the spawn manager to get the creeps it needs to do the tasks
that need to be done, as well.  On top of that, the vast majority of tasks are going
to be related to energy management, which is simple to do in a naive way but has huge
potential for gains if it has a clever implementation.

It seems like it should be sufficient for a creep controller to provide the location
of the creep, some sort of normalized land speed, and what it can do to the dispatcher,
but this is subject to change.  It is quite possible that the interactions between
carrying capacity and speed will become significant when determining what tasks can
be done effectively by any given creep and which tasks are underserved by the current
cohort of creeps.  This will interact enormously with the spawn manager as well as
the energy manager which was mentioned above.

## Energy Management

The two most important factors for efficiency in a screeps empire are energy and cpu
usage.  The latter has to do with not executing a large number of commands and is a
challenge across the entire code base, but the former can be managed on a per-room
basis.  Since creeps have a maximum lifetime, everything, even simply moving energy
around in CARRY body parts, has an energy cost.  At low room levels, this will need
to be done entirely through tasks to be provided to creeps, but that can be short-
circuited at higher levels using link structures.

The energy manager will need to manage the room's energy budget.  It will have the
best visibility into source usage, distribution of each source's energy, how fast
the room can be upgraded, and what it can scavenge from under-occupied nearby rooms.
While the layout manager will draw up a blueprint for the room and prioritize which
buildings will be built first, it will be the energy manager which determines how
quickly they will be built.

## Creep Spawn Management

The spawn manager needs to track which creeps need to be produced and prioritize their
construction.  It will likely be working closely with the energy manager, since most
of the energy during quiet times is devoted to upgrading, with creeps being overhead
that takes energy away from upgrading controllers faster.

## Combat Direction

TBD

## Room Layout Management

TBD