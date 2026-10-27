'use client';

import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const displayMode = window.matchMedia('(display-mode: standalone)');
    function updateDisplayMode() {
      setStandalone(displayMode.matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true);
    }
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setMessage('');
    }
    function handleInstalled() {
      setInstallPrompt(null);
      setMessage('mind is installed. Find it in your app library or app list, then add it to your home screen.');
    }

    updateDisplayMode();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('pageshow', updateDisplayMode);
    displayMode.addEventListener('change', updateDisplayMode);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('pageshow', updateDisplayMode);
      displayMode.removeEventListener('change', updateDisplayMode);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) {
      setShowHelp((current) => !current);
      return;
    }
    const prompt = installPrompt;
    setInstallPrompt(null); // Each browser prompt can only be used once.
    setInstalling(true);
    setMessage('');
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'dismissed') {
        setMessage('Installation cancelled. You can try again from your browser menu.');
        setShowHelp(true);
      }
    } catch {
      setMessage('The installation dialog could not open. Try the steps below.');
      setShowHelp(true);
    } finally {
      setInstalling(false);
    }
  }

  if (standalone) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleInstall}
        disabled={installing}
        aria-expanded={showHelp}
        className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-[#5f5953] transition hover:bg-[#f5f1ec] disabled:opacity-50"
      >
        {installing ? 'Opening installation…' : '↓ Install app'}
      </button>
      {message && <p role="status" className="px-3 py-2 text-xs leading-relaxed text-[#5f5953]">{message}</p>}
      {showHelp && (
        <div className="space-y-2 px-3 py-2 text-xs leading-relaxed text-[#5f5953]">
          <p>iPhone or iPad: open this page in Safari, tap Share, then Add to Home Screen.</p>
          <p>Android: open this page in Chrome, tap ⋮, then Install app or Add to Home screen.</p>
          <p>Computer: use the install option in your browser’s address bar or menu.</p>
          <p>If you opened a link inside another app, open it in your browser first.</p>
          <p>Missing the icon? Look for mind in your app library or app list. Removing a home screen icon may leave the app installed. If you uninstalled it, close and reopen this page to try again.</p>
        </div>
      )}
    </div>
  );
}
