import { useState } from 'react';
import { SKILL_SUGGESTIONS } from '../data/seed';

interface Props {
  selected: string[];
  onChange: (skills: string[]) => void;
  accent?: 'violet' | 'indigo';
}

export default function SkillPicker({ selected, onChange, accent = 'violet' }: Props) {
  const [custom, setCustom] = useState('');

  const toggle = (skill: string) => {
    if (selected.includes(skill)) onChange(selected.filter((s) => s !== skill));
    else onChange([...selected, skill]);
  };

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustom('');
  };

  const activeClasses = accent === 'violet'
    ? 'bg-violet-500/20 border-violet-500 text-violet-300'
    : 'bg-indigo-500/20 border-indigo-500 text-indigo-300';

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {SKILL_SUGGESTIONS.map((skill) => (
          <button
            type="button"
            key={skill}
            onClick={() => toggle(skill)}
            className={`pill border transition ${
              selected.includes(skill) ? activeClasses : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Boshqa ko'nikma qo'shish..."
          className="input-field flex-1 px-3 py-2 text-sm"
        />
        <button type="button" onClick={addCustom} className="btn-secondary px-4 text-sm">
          + Qo'shish
        </button>
      </div>
      {selected.filter((s) => !SKILL_SUGGESTIONS.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.filter((s) => !SKILL_SUGGESTIONS.includes(s)).map((skill) => (
            <button
              type="button"
              key={skill}
              onClick={() => toggle(skill)}
              className={`pill border ${activeClasses}`}
            >
              {skill} ✕
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
