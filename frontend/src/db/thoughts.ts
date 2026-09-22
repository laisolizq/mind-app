import {
  db,
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
  ).padStart(2, '0')}-${String(result.getDate()).padStart(2, '0')}`;
}

export async function processNewDay() {
  const now = new Date();
  const currentMindDay = getMindDay(now);

  const lastReset = await db.settings.get('lastDailyReset');

  // First time using the app:
  // just remember the current mind day.
  if (!lastReset) {
    await db.settings.put({
      key: 'lastDailyReset',
      value: currentMindDay,
    });

    return;
  }

  // Nothing to do if we already processed this mind day.
  if (lastReset.value === currentMindDay) {
    return;
  }

  const thoughts = await db.thoughts.toArray();

  for (const thought of thoughts) {
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
}