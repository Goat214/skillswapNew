import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import { computeMatches } from '../lib/matching';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const others = store.getProfiles();
  const matches = useMemo(() => (profile ? computeMatches(profile, others).slice(0, 3) : []), [profile]);

  if (!profile) return null;

  const startChat = (otherId: string) => {
    store.startConversation(profile.id, otherId);
    navigate('/chat');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-24">
      <h1 className="text-2xl font-semibold mb-1">Salom, {profile.full_name.split(' ')[0]} 👋</h1>
      <p className="text-neutral-500 mb-8">Bugun kimga yordam berasiz yoki nimani o'rganasiz?</p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6 md:col-span-1">
          <div className="text-3xl mb-1">🪙</div>
          <div className="text-2xl font-bold">{profile.skillcoin_balance} SkillCoin</div>
          <p className="text-neutral-500 text-sm mt-1">Bilim ulashing va SkillCoin toping.</p>
        </div>

        <div className="card p-6">
          <h3 className="text-sm text-neutral-400 mb-3">O'rgata olaman</h3>
          <div className="flex flex-wrap gap-2">
            {profile.teaching_skills.length ? profile.teaching_skills.map((s) => (
              <span key={s} className="pill bg-violet-500/10 border border-violet-500/30 text-violet-300">{s}</span>
            )) : <span className="text-neutral-600 text-sm">Hali qo'shilmagan</span>}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm text-neutral-400 mb-3">O'rganmoqchiman</h3>
          <div className="flex flex-wrap gap-2">
            {profile.learning_skills.length ? profile.learning_skills.map((s) => (
              <span key={s} className="pill bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">{s}</span>
            )) : <span className="text-neutral-600 text-sm">Hali qo'shilmagan</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tavsiya etilgan mosliklar</h2>
        <Link to="/matches" className="text-sm text-violet-400 hover:underline">Barchasini ko'rish</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {matches.length === 0 && (
          <p className="text-neutral-500 text-sm col-span-3">
            Hozircha moslik topilmadi. Ko'proq ko'nikma qo'shib ko'ring.
          </p>
        )}
        {matches.map((m) => (
          <div key={m.matched_user.id} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-semibold">
                {m.matched_user.full_name.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{m.matched_user.full_name}</div>
                <div className="text-xs text-neutral-500">🎓 {m.matched_user.university}</div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mb-1">U o'rgata oladi:</p>
            <p className="text-sm mb-2">{m.they_teach_you_want.join(', ') || '—'}</p>
            <p className="text-xs text-neutral-500 mb-1">U o'rganmoqchi:</p>
            <p className="text-sm mb-3">{m.you_teach_they_want.join(', ') || '—'}</p>
            <div className="flex items-center justify-between">
              <span className="pill bg-green-500/10 border border-green-500/30 text-green-400">Match: {m.compatibility_score}%</span>
              <button onClick={() => startChat(m.matched_user.id)} className="btn-primary px-4 py-1.5 text-sm">Bog'lanish</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
