import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { computeMatches } from '../lib/matching';

export default function Matches() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const others = store.getProfiles();
  const matches = useMemo(() => (profile ? computeMatches(profile, others) : []), [profile]);
  const [sessionStarted, setSessionStarted] = useState<string | null>(null);

  if (!profile) return null;

  const startChat = (otherId: string) => {
    store.startConversation(profile.id, otherId);
    navigate('/chat');
  };

  const proposeSession = (otherId: string, skill: string) => {
    store.createSession({
      id: crypto.randomUUID(),
      teacher_id: otherId,
      learner_id: profile.id,
      skill,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    setSessionStarted(otherId);
  };

  const top = matches[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-24">
      <h1 className="text-2xl font-semibold mb-1">Smart Matching</h1>
      <p className="text-neutral-500 mb-8">Ko'nikmalaringizga mos talabalar</p>

      {top && (
        <div className="card p-6 mb-8 border-violet-500/40 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/20 blur-3xl rounded-full" />
          <p className="text-sm text-violet-300 mb-2 relative">🔥 Perfect Match</p>
          <h2 className="text-lg font-semibold mb-4 relative">
            Siz va {top.matched_user.full_name.split(' ')[0]} bir-biringizga mos keldingiz.
          </h2>
          <div className="flex items-center gap-3 relative">
            <span className="pill bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              Match: {top.compatibility_score}%
            </span>
            <button onClick={() => startChat(top.matched_user.id)} className="btn-primary px-5 py-2 text-sm">Bog'lanish</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {matches.map((m) => (
          <div key={m.matched_user.id} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-semibold">
                  {m.matched_user.full_name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{m.matched_user.full_name}</div>
                  <div className="text-xs text-neutral-500">🎓 {m.matched_user.university} · ⭐ {m.matched_user.rating || 'yangi'}</div>
                </div>
              </div>
              <span className="pill bg-green-500/10 border border-green-500/30 text-green-400 text-xs">{m.compatibility_score}%</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-xs text-neutral-500 mb-1">U o'rgata oladi</p>
                <p>{m.they_teach_you_want.join(', ') || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">U o'rganmoqchi</p>
                <p>{m.you_teach_they_want.join(', ') || '—'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => startChat(m.matched_user.id)} className="btn-secondary flex-1 py-2 text-sm">Bog'lanish</button>
              {m.they_teach_you_want[0] && (
                <button
                  onClick={() => proposeSession(m.matched_user.id, m.they_teach_you_want[0])}
                  className="btn-primary flex-1 py-2 text-sm"
                >
                  {sessionStarted === m.matched_user.id ? 'Yuborildi ✓' : 'Dars so\'rash'}
                </button>
              )}
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <p className="text-neutral-500 text-sm">Hozircha moslik yo'q — profilingizga ko'proq ko'nikma qo'shing.</p>
        )}
      </div>
    </div>
  );
}
