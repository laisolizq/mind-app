'use client';

import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();

      setInstallPrompt(
        event as BeforeInstallPromptEvent,
      );
    }

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt,
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();

    setInstallPrompt(null);
  }

  if (!installPrompt) {
    return (
        <div className="px-3 py-2.5 text-xs leading-relaxed text-[#aaa29a]">
        Install option not available yet
        </div>
    );
 }

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#5f5953] transition hover:bg-[#f5f1ec]"
    >
      ↓ Install app
    </button>
  );
}