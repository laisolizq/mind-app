import {
  db,
  type Recurrence,
  type Thought,
  type Timing,
} from './db';

export async function addThought(text: string, timing: Timing) {
  const thought: Thought = {
    text,
    timing,
    status: 'active',
    createdAt: new Date(),
  };

  return db.thoughts.add(thought);
}

export async function getThoughts() {
  return db.thoughts.toArray();
}

export async function updateThought(
  id: number,
  changes: Partial<Pick<Thought, 'text' | 'timing' | 'status'>>,
) {
  return db.thoughts.update(id, changes);
}

function getMindDay(date: Date) {
  const result = new Date(date);

  // Our day starts at 05:00.
  if (result.getHours() < 5) {
    result.setDate(result.getDate() - 1);
  }

  return `${result.getFullYear()}-${String(
    result.getMonth() + 1,
  ).padStart(2, '0')}-${String(
    result.getDate(),
  ).padStart(2, '0')}`;
}

export async function getRecurrences() {
  return db.recurrences.toArray();
}

export async function addRecurrence(
  name: string,
  days: number[],
) {
  const recurrence: Recurrence = {
    name,
    days,
  };

  return db.recurrences.add(recurrence);
}

export async function deleteRecurrence(id: number) {
  await db.recurrences.delete(id);

  // Remove any task that was generated from this recurrence.
  await db.thoughts
    .where('recurrenceId')
    .equals(id)
    .delete();
}

function getTodayWeekday() {
  const day = new Date().getDay();

  // JavaScript:
  // Sunday = 0
  // Monday = 1
  // ...
  // Saturday = 6

  return day;
}

async function createTodaysRecurrences() {
  const weekday = getTodayWeekday();
  const recurrences = await getRecurrences();

  for (const recurrence of recurrences) {
    if (!recurrence.days.includes(weekday)) {
      continue;
    }

    await db.thoughts.add({
      text: recurrence.name,
      timing: 'today',
      status: 'active',
      createdAt: new Date(),
      recurrenceId: recurrence.id,
    });
  }
}

export async function processNewDay() {
  const now = new Date();
  const currentMindDay = getMindDay(now);

  const lastReset = await db.settings.get('lastDailyReset');

  // First time using the app.
  // Remember the current day and create today's recurrences.
  if (!lastReset) {
    await db.settings.put({
      key: 'lastDailyReset',
      value: currentMindDay,
    });

    await createTodaysRecurrences();

    return;
  }

  // Nothing to do if this mind day was already processed.
  if (lastReset.value === currentMindDay) {
    return;
  }

  const thoughts = await db.thoughts.toArray();

  for (const thought of thoughts) {
    // Recurrence tasks simply disappear when their day ends.
    if (thought.recurrenceId !== undefined) {
      await db.thoughts.delete(thought.id!);
      continue;
    }

    if (thought.timing !== 'today') {
      continue;
    }

    if (thought.status === 'active') {
      await db.thoughts.update(thought.id!, {
        status: 'pending',
      });
    }
  }

  await db.settings.put({
    key: 'lastDailyReset',
    value: currentMindDay,
  });

  // Now create the recurrence tasks for the new day.
  await createTodaysRecurrences();
}

export async function deleteThought(id: number) {
  await db.thoughts.delete(id);
}