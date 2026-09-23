import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '', university: '', faculty: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res.error) setError(res.error);
    else navigate('/profile/setup');
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="text-lg font-bold gradient-text block text-center mb-8">SkillSwap</Link>
        <div className="card p-8">
          <h1 className="text-xl font-semibold mb-1">Ro'yxatdan o'tish</h1>
          <p className="text-neutral-500 text-sm mb-6">Bilim almashishni boshlang</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">To'liq ism</label>
              <input required value={form.full_name} onChange={set('full_name')} className="input-field w-full px-3 py-2.5" placeholder="Abdulatif Kimsanaliyev" />
            </div>
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Email</label>
              <input type="email" required value={form.email} onChange={set('email')} className="input-field w-full px-3 py-2.5" placeholder="siz@email.com" />
            </div>
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Parol</label>
              <input type="password" required minLength={6} value={form.password} onChange={set('password')} className="input-field w-full px-3 py-2.5" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Universitet</label>
                <input required value={form.university} onChange={set('university')} className="input-field w-full px-3 py-2.5" placeholder="FSTU" />
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-1 block">Fakultet</label>
                <input required value={form.faculty} onChange={set('faculty')} className="input-field w-full px-3 py-2.5" placeholder="Software Eng." />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Yaratilmoqda...' : "Ro'yxatdan o'tish"}
            </button>
          </form>
          <p className="text-center text-sm text-neutral-500 mt-6">
            Hisobingiz bormi? <Link to="/login" className="text-violet-400 hover:underline">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
