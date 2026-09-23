import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkillPicker from '../components/SkillPicker';

export default function ProfileSetup() {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [teaching, setTeaching] = useState<string[]>(profile?.teaching_skills ?? []);
  const [learning, setLearning] = useState<string[]>(profile?.learning_skills ?? []);
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [step, setStep] = useState(1);

  if (!profile) return null;

  const finish = () => {
    updateProfile({ teaching_skills: teaching, learning_skills: learning, bio });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl card p-8">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-violet-500' : 'bg-neutral-800'}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-1">Men o'rgata olaman</h2>
            <p className="text-neutral-500 text-sm mb-5">Boshqalarga o'rgatishingiz mumkin bo'lgan ko'nikmalarni tanlang</p>
            <SkillPicker selected={teaching} onChange={setTeaching} accent="violet" />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-1">Men o'rganmoqchiman</h2>
            <p className="text-neutral-500 text-sm mb-5">O'rganishni istagan ko'nikmalaringizni tanlang</p>
            <SkillPicker selected={learning} onChange={setLearning} accent="indigo" />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-1">O'zingiz haqingizda</h2>
            <p className="text-neutral-500 text-sm mb-5">Qisqacha bio yozing</p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="input-field w-full px-3 py-2.5"
              placeholder="Men React o'rganaman va Python bo'yicha yordam bera olaman..."
            />
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            className="btn-secondary px-5 py-2 text-sm disabled:opacity-30"
            disabled={step === 1}
            onClick={() => setStep((s) => s - 1)}
          >
            Orqaga
          </button>
          {step < 3 ? (
            <button
              className="btn-primary px-6 py-2 text-sm"
              disabled={step === 1 ? teaching.length === 0 : learning.length === 0}
              onClick={() => setStep((s) => s + 1)}
            >
              Keyingisi
            </button>
          ) : (
            <button className="btn-primary px-6 py-2 text-sm" onClick={finish}>
              Yakunlash
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
