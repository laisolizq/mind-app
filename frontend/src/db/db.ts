import Dexie, { type Table } from 'dexie';

export type Timing = 'today' | 'soon' | 'later';
export type ThoughtStatus = 'active' | 'completed' | 'pending';

export interface Thought {
  id?: number;
  text: string;
  timing: Timing;
  status: ThoughtStatus;
  createdAt: Date;
}

export interface AppSetting {
  key: string;
  value: string;
}

export class MindDatabase extends Dexie {
  thoughts!: Table<Thought, number>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super('mind-app');

    this.version(1).stores({
      thoughts: '++id, timing, completed, createdAt',
    });

    this.version(2)
      .stores({
        thoughts: '++id, timing, status, createdAt',
        settings: 'key',
      })
      .upgrade(async (transaction) => {
        await transaction
          .table('thoughts')
          .toCollection()
          .modify((thought) => {
            thought.status = thought.completed
              ? 'completed'
              : 'active';

            delete thought.completed;
          });
      });
  }
}

export const db = new MindDatabase();