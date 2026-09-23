import { Link } from 'react-router-dom';

const features = [
  { title: 'Muammo', body: "Talabalar ko'plab ko'nikmalarni bilishadi, lekin ularni ulashish uchun platforma yo'q." },
  { title: 'Yechim', body: "SkillSwap talabalarni bir-biriga bog'laydi — har biri o'qituvchi va o'quvchi bo'la oladi." },
  { title: 'Qanday ishlaydi?', body: "Ko'nikmalaringizni belgilang, mos talabani toping, bog'laning va bilim almashing." },
  { title: 'SkillCoin', body: "O'qitib SkillCoin toping, o'rganish uchun sarflang. Adolatli almashuv tizimi." },
  { title: 'Why SkillSwap?', body: "Bepul, tez va universitet muhitiga moslashgan — har bir talaba uchun." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-mesh">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 max-w-6xl mx-auto">
        <span className="text-xl font-bold gradient-text">SkillSwap</span>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary px-4 py-2 text-sm">Kirish</Link>
          <Link to="/register" className="btn-primary px-4 py-2 text-sm">Boshlash</Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          <span className="gradient-text">Bilimingizni ulashing.</span>
          <br />
          Yangi narsa o'rganing.
        </h1>
        <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
          Universitetdagi bilimni talabalar o'rtasida imkoniyatga aylantiring.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link to="/register" className="btn-primary px-7 py-3">Boshlash</Link>
          <a href="#how" className="btn-secondary px-7 py-3">Qanday ishlaydi?</a>
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-6 text-sm md:text-base font-medium">
          <span className="card px-5 py-3">O'rgataman</span>
          <span className="text-violet-400">→</span>
          <span className="card px-5 py-3">Match</span>
          <span className="text-violet-400">→</span>
          <span className="card px-5 py-3">O'rganaman</span>
        </div>
      </section>

      <section id="how" className="max-w-5xl mx-auto px-6 pb-24 grid gap-4 md:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="card p-6">
            <h3 className="font-semibold mb-2 text-violet-300">{f.title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">{f.body}</p>
          </div>
        ))}
      </section>

      <footer className="text-center text-neutral-600 text-sm pb-10">
        © {new Date().getFullYear()} SkillSwap — universitet startap tanlovi uchun MVP
      </footer>
    </div>
  );
}
