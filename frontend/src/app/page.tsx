'use client';

import { useEffect, useState } from 'react';
import {
  addThought,
  getThoughts,
  updateThought,
} from '../db/thoughts';
import type { Thought, Timing } from '../db/db';

const sections: { timing: Timing; title: string }[] = [
  { timing: 'today', title: 'Today' },
  { timing: 'soon', title: 'Soon' },
  { timing: 'later', title: 'Later' },
];

export default function Home() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [text, setText] = useState('');
  const [timing, setTiming] = useState<Timing>('today');
  const [showInbox, setShowInbox] = useState(false);

  async function loadThoughts() {
    const savedThoughts = await getThoughts();
    setThoughts(savedThoughts);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    await addThought(text.trim(), timing);

    setText('');
    await loadThoughts();
  }

  async function moveThought(id: number, newTiming: Timing) {
    await updateThought(id, {
      timing: newTiming,
      status: 'active',
    });

    await loadThoughts();
  }

  async function toggleThought(id: number, completed: boolean) {
    await updateThought(id, {
      status: completed ? 'completed' : 'active',
    });

    await loadThoughts();
  }

  async function completePending(id: number) {
    await updateThought(id, {
      status: 'completed',
    });

    await loadThoughts();
  }

  useEffect(() => {
    loadThoughts();
  }, []);

  const pendingThoughts = thoughts.filter(
    (thought) => thought.status === 'pending',
  );

  if (showInbox) {
    return (
      <main className="min-h-screen bg-[#f8f6f2] px-5 py-8 text-[#3d3a36]">
        <div className="mx-auto w-full max-w-lg">
          <header className="mb-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowInbox(false)}
              className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-[#817a73] transition hover:bg-[#eeeae4]"
            >
              <span className="text-lg">←</span>
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-[#35322f]">
                Inbox
              </h1>

              {pendingThoughts.length > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#e8e1d9] px-1.5 text-xs text-[#777069]">
                  {pendingThoughts.length}
                </span>
              )}
            </div>

            <div className="w-16" />
          </header>

          <div className="mb-8 text-center">
            <p className="text-sm leading-relaxed text-[#8b857f]">
              Things from previous days
              <br />
              that still need your attention.
            </p>
          </div>

          {pendingThoughts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#ded8d1] px-5 py-10 text-center">
              <div className="mb-3 text-2xl text-[#b5aea7]">♡</div>

              <p className="text-sm text-[#9f9891]">
                Your inbox is empty.
              </p>

              <p className="mt-1 text-xs text-[#b5aea7]">
                Nothing needs your attention right now.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingThoughts.map((thought) => (
                <div
                  key={thought.id}
                  className="rounded-2xl border border-[#ebe6df] bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#d8d1c9]" />

                    <p className="min-w-0 flex-1 break-words text-[15px] leading-relaxed text-[#4c4844]">
                      {thought.text}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2 pl-9">
                    <button
                      type="button"
                      onClick={() =>
                        moveThought(thought.id!, 'today')
                      }
                      className="rounded-lg bg-[#f4f0eb] px-3 py-2 text-xs text-[#716a63] transition hover:bg-[#ebe5de]"
                    >
                      Today
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        moveThought(thought.id!, 'soon')
                      }
                      className="rounded-lg bg-[#f4f0eb] px-3 py-2 text-xs text-[#716a63] transition hover:bg-[#ebe5de]"
                    >
                      Soon
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        moveThought(thought.id!, 'later')
                      }
                      className="rounded-lg bg-[#f4f0eb] px-3 py-2 text-xs text-[#716a63] transition hover:bg-[#ebe5de]"
                    >
                      Later
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        completePending(thought.id!)
                      }
                      className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#e5eee5] text-sm text-[#7c927c] transition hover:bg-[#dbe8db]"
                      aria-label={`Complete ${thought.text}`}
                    >
                      ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <footer className="mt-14 pb-4 text-center">
            <p className="text-xs text-[#b5aea7]">
              One thing at a time ♡
            </p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] px-5 py-8 text-[#3d3a36]">
      <div className="mx-auto w-full max-w-lg">
        <header className="mb-10">
          <div className="text-center">
            <div className="mb-3 text-2xl text-[#9b8c82]">✦</div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#35322f]">
              mind
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-[#8b857f]">
              Get it out of your head.
              <br />
              Decide when to care about it.
            </p>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl border border-[#e8e2da] bg-white/80 p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="What's on your mind?"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base text-[#3d3a36] outline-none placeholder:text-[#b5aea7]"
            />

            <button
              type="button"
              onClick={() => setShowInbox(true)}
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#aaa29a] transition hover:bg-[#f5f1ec] hover:text-[#716a63]"
              aria-label="Open inbox"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v11A1.5 1.5 0 0 1 18.5 18h-13A1.5 1.5 0 0 1 4 16.5v-11Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 13h4l1.5 2h5L16 13h4"
                />
              </svg>

              {pendingThoughts.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b8a99b] px-1 text-[9px] font-medium text-white">
                  {pendingThoughts.length}
                </span>
              )}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <select
              value={timing}
              onChange={(event) =>
                setTiming(event.target.value as Timing)
              }
              className="min-w-0 flex-1 rounded-xl border border-[#e8e2da] bg-[#faf8f5] px-3 py-2.5 text-sm text-[#6f6963] outline-none"
            >
              <option value="today">Today</option>
              <option value="soon">Soon</option>
              <option value="later">Later</option>
            </select>

            <button
              type="submit"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5f5953] text-xl text-white shadow-sm transition active:scale-95"
              aria-label="Add thought"
            >
              +
            </button>
          </div>
        </form>

        <div className="space-y-9">
          {sections.map((section) => {
            const sectionThoughts = thoughts.filter(
              (thought) =>
                thought.timing === section.timing &&
                thought.status !== 'pending',
            );

            return (
              <section key={section.timing}>
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d857e]">
                    {section.title}
                  </h2>

                  {sectionThoughts.length > 0 && (
                    <span className="text-xs text-[#b0a9a2]">
                      {sectionThoughts.length}
                    </span>
                  )}
                </div>

                {sectionThoughts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#ded8d1] px-5 py-6 text-center">
                    <p className="text-sm text-[#b0a9a2]">
                      Nothing here yet
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {sectionThoughts.map((thought) => {
                      const completed =
                        thought.status === 'completed';

                      return (
                        <li
                          key={thought.id}
                          className="group flex items-center gap-3 rounded-2xl border border-[#ebe6df] bg-white px-4 py-4 shadow-sm transition"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              toggleThought(
                                thought.id!,
                                !completed,
                              )
                            }
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                              completed
                                ? 'border-[#8fa58f] bg-[#8fa58f] text-white'
                                : 'border-[#d8d1c9] text-transparent hover:border-[#aaa198]'
                            }`}
                            aria-label={
                              completed
                                ? `Mark ${thought.text} as incomplete`
                                : `Complete ${thought.text}`
                            }
                          >
                            ✓
                          </button>

                          <span
                            className={`min-w-0 flex-1 break-words text-[15px] leading-relaxed ${
                              completed
                                ? 'text-[#aaa29a] line-through'
                                : 'text-[#4c4844]'
                            }`}
                          >
                            {thought.text}
                          </span>

                          <button
                            type="button"
                            className="shrink-0 rounded-lg px-2 py-1 text-xs text-[#aaa29a] transition hover:bg-[#f5f1ec] hover:text-[#716a63]"
                            onClick={() => {
                              if (section.timing === 'today') {
                                moveThought(
                                  thought.id!,
                                  'soon',
                                );
                              } else if (
                                section.timing === 'soon'
                              ) {
                                moveThought(
                                  thought.id!,
                                  'later',
                                );
                              } else {
                                moveThought(
                                  thought.id!,
                                  'today',
                                );
                              }
                            }}
                          >
                            move
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>

        <footer className="mt-14 pb-4 text-center">
          <p className="text-xs text-[#b5aea7]">
            One thing at a time ♡
          </p>
        </footer>
      </div>
    </main>
  );
}