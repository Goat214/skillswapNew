import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isLiveMode } from '../lib/supabase';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.error) setError(res.error);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="text-lg font-bold gradient-text block text-center mb-8">SkillSwap</Link>
        <div className="card p-8">
          <h1 className="text-xl font-semibold mb-1">Xush kelibsiz</h1>
          <p className="text-neutral-500 text-sm mb-6">Hisobingizga kiring</p>

          {!isLiveMode && (
            <div className="pill bg-violet-500/10 border border-violet-500/30 text-violet-300 mb-6 block w-fit">
              Demo rejim — vali@fstu.uz, parol: har qanday
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full px-3 py-2.5" placeholder="siz@email.com" />
            </div>
            <div>
              <label className="text-sm text-neutral-400 mb-1 block">Parol</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full px-3 py-2.5" placeholder="••••••••" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>
          <p className="text-center text-sm text-neutral-500 mt-6">
            Hisobingiz yo'qmi? <Link to="/register" className="text-violet-400 hover:underline">Ro'yxatdan o'tish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
