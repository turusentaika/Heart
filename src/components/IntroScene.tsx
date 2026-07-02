import React, { useEffect, useState } from 'react';
import theme from '../theme';

const lines = [
  { prefix: '[system]', text: 'Secure terminal initialized.' },
  { prefix: '[access]', text: 'Please enter password to unlock the next scene.' },
];

const correctPassword = 'hungu';

export default function IntroScene({ onUnlock }: { onUnlock: () => void }) {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setShowInput(true);
      return;
    }

    const fullText = `${lines[currentLineIndex].prefix} ${lines[currentLineIndex].text}`;
    let i = 0;
    setCurrentText('');

    const interval = window.setInterval(() => {
      if (i >= fullText.length) {
        window.clearInterval(interval);
        setCompletedLines(prev => [...prev, fullText]);
        setCurrentLineIndex(prev => prev + 1);
        return;
      }
      setCurrentText(fullText.slice(0, i + 1));
      i += 1;
    }, 30);

    return () => window.clearInterval(interval);
  }, [currentLineIndex]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password.trim().toLowerCase() === correctPassword) {
      setStatus('granted');
      window.setTimeout(onUnlock, 800);
    } else {
      setStatus('denied');
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-4"
      style={{ background: theme.bg }}
    >
      <div className="w-full max-w-2xl p-8 font-mono text-sm md:text-base text-white/80">
        <div className="space-y-2">
          <div className="flex gap-2 text-pink-soft/60">
            <span>[system]</span>
            <span className="font-mono text-green-400">Secure terminal initialized.</span>
          </div>

          <div className="flex gap-2 h-6">
            <span>[access]</span>
            {status === 'granted' ? (
              <span className="text-green-400">READY</span>
            ) : (
              <span className="font-mono">Please authenticate to continue.</span>
            )}
          </div>

          {showInput && (
            <div className="pt-8 flex flex-col items-start gap-6">
              <p className="text-white/40 italic">{">"} Enter password to verify your identity.</p>

              <div className="flex items-center gap-3 w-full">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none placeholder:text-white/25"
                  placeholder="Enter secret code"
                  autoFocus
                />

                <button
                  onClick={(e) => { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent); }}
                  className="group flex items-center gap-3 px-6 py-3 border border-pink-deep/30 bg-pink-deep/5 hover:bg-pink-deep/10 text-pink-soft transition-all duration-300 hover:scale-105 hover:-translate-y-0.2 hover:shadow-lg hover:border-pink-deep/60 cursor-pointer"
                >
                  <span className="font-mono tracking-widest uppercase text-xs">Submit</span>
                  <span className="terminal-cursor" />
                </button>
              </div>

              {status === 'granted' && (
                <div className="text-sm text-green-300">ACCESS GRANTED. Loading next scene...</div>
              )}
              {status === 'denied' && (
                <div className="text-sm text-rose-300">ACCESS DENIED. Try again.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
