import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { store } from '../lib/store';
import SkillPicker from '../components/SkillPicker';

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [teaching, setTeaching] = useState<string[]>(profile?.teaching_skills ?? []);
  const [learning, setLearning] = useState<string[]>(profile?.learning_skills ?? []);
  const [bio, setBio] = useState(profile?.bio ?? '');

  if (!profile) return null;

  const transactions = store.getTransactions(profile.id);
  const sessions = store.getSessions(profile.id);
  const pendingSessions = sessions.filter((s) => s.status === 'pending');

  const save = () => {
    updateProfile({ teaching_skills: teaching, learning_skills: learning, bio });
    setEditing(false);
  };

  const complete = (id: string) => {
    store.completeSession(id);
    updateProfile({}); // trigger refresh with latest balance
    location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-24">
      <div className="card p-6 mb-6 flex flex-col md:flex-row md:items-center gap-5 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xl font-semibold">
            {profile.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{profile.full_name}</h1>
            <p className="text-neutral-500 text-sm">{profile.faculty} · {profile.university}</p>
            <p className="text-neutral-400 text-sm mt-1">{profile.bio || 'Bio kiritilmagan'}</p>
          </div>
        </div>
        <div className="flex gap-4 text-center">
          <div>
            <div className="text-lg font-bold">{profile.skillcoin_balance}</div>
            <div className="text-xs text-neutral-500">SkillCoin</div>
          </div>
          <div>
            <div className="text-lg font-bold">{profile.rating || '—'} ⭐</div>
            <div className="text-xs text-neutral-500">{profile.sessions_completed} session</div>
          </div>
          <div>
            <div className="text-lg font-bold">{profile.students_helped}</div>
            <div className="text-xs text-neutral-500">talabaga yordam</div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Ko'nikmalar</h2>
          <button onClick={() => setEditing((v) => !v)} className="text-sm text-violet-400 hover:underline">
            {editing ? 'Bekor qilish' : 'Tahrirlash'}
          </button>
        </div>

        {editing ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-neutral-400 mb-2">O'rgataman</p>
              <SkillPicker selected={teaching} onChange={setTeaching} accent="violet" />
            </div>
            <div>
              <p className="text-sm text-neutral-400 mb-2">O'rganmoqchiman</p>
              <SkillPicker selected={learning} onChange={setLearning} accent="indigo" />
            </div>
            <div>
              <p className="text-sm text-neutral-400 mb-2">Bio</p>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input-field w-full px-3 py-2 text-sm" />
            </div>
            <button onClick={save} className="btn-primary px-5 py-2 text-sm">Saqlash</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-neutral-400 mb-2">O'rgataman</p>
              <div className="flex flex-wrap gap-2">
                {profile.teaching_skills.map((s) => (
                  <span key={s} className="pill bg-violet-500/10 border border-violet-500/30 text-violet-300">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-neutral-400 mb-2">O'rganmoqchiman</p>
              <div className="flex flex-wrap gap-2">
                {profile.learning_skills.map((s) => (
                  <span key={s} className="pill bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {pendingSessions.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">Kutilayotgan sessiyalar</h2>
          <div className="space-y-2">
            {pendingSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span>{s.skill} — {s.teacher_id === profile.id ? "siz o'qitasiz" : "siz o'rganasiz"}</span>
                <button onClick={() => complete(s.id)} className="btn-secondary px-3 py-1 text-xs">Tugatilgan deb belgilash</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-6">
        <h2 className="font-semibold mb-4">SkillCoin tarixi</h2>
        {transactions.length === 0 && <p className="text-neutral-600 text-sm">Hali tranzaksiyalar yo'q.</p>}
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between text-sm border-b border-neutral-900 py-2 last:border-0">
              <span className="text-neutral-400">{t.description}</span>
              <span className={t.amount > 0 ? 'text-green-400' : 'text-red-400'}>
                {t.amount > 0 ? '+' : ''}{t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
