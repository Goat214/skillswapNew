import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/matches', label: 'Matches' },
  { to: '/chat', label: 'Chat' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 glass sticky top-0 z-40">
        <div className="flex items-center gap-10">
          <span className="text-lg font-bold gradient-text">SkillSwap</span>
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="pill glass flex items-center gap-1.5">
            <span>🪙</span>
            <span className="font-semibold">{profile.skillcoin_balance}</span>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-sm font-semibold"
          >
            {profile.full_name.charAt(0)}
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-neutral-500 hover:text-white transition">
            Chiqish
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass flex items-center justify-around py-3">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `text-xs flex flex-col items-center gap-1 ${isActive ? 'text-violet-400' : 'text-neutral-500'}`}
          >
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
