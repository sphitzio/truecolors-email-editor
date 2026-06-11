import { useState, useEffect, FormEvent, ReactNode } from 'react';
import { Lock } from 'lucide-react';

// Casual-deterrent password gate. The site is a static GitHub Pages bundle, so
// this is NOT cryptographically secure — the hash ships in the bundle. It only
// keeps casual visitors out. The expected SHA-256 hash is baked at build time
// via VITE_GATE_HASH (set as a repo Actions secret / .env.local).
const EXPECTED_HASH = (import.meta.env.VITE_GATE_HASH as string | undefined) || '';
const STORAGE_KEY = 'tc-editor-unlocked';

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // No hash configured → don't gate (e.g. local dev without the env var).
    if (!EXPECTED_HASH) {
      setUnlocked(true);
      return;
    }
    if (sessionStorage.getItem(STORAGE_KEY) === '1') setUnlocked(true);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const hash = await sha256Hex(pw);
    if (hash === EXPECTED_HASH) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setPw('');
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-indigo-400" />
          <h1 className="font-bold text-lg">TrueColors Notification Editor</h1>
        </div>
        <p className="text-xs text-slate-400 mb-5">Enter the access password to continue.</p>
        <input
          type="password"
          autoFocus
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Password"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 mb-3"
        />
        {error && <p className="text-xs text-red-400 mb-3">Incorrect password.</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-2.5 rounded-xl transition cursor-pointer"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
