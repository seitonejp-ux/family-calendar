import { motion } from 'framer-motion';

function MeshBackground() {
  return (
    <>
      <style>{`
        @keyframes blobDrift1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(5%,8%) scale(1.05); }
          66%      { transform: translate(-3%,3%) scale(0.97); }
        }
        @keyframes blobDrift2 {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(-7%,-5%) scale(1.07); }
          75%      { transform: translate(4%,-8%) scale(0.96); }
        }
        @keyframes blobDrift3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(6%,-4%) scale(1.05); }
        }
      `}</style>
      <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: '#F2F2F7' }}>
        <div style={{
          position: 'absolute', top: '-15%', left: '-10%',
          width: '75vw', height: '75vw', borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(0,113,227,0.13) 0%, transparent 65%)',
          filter: 'blur(72px)',
          animation: 'blobDrift1 24s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '-15%',
          width: '65vw', height: '65vw', borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(191,90,242,0.10) 0%, transparent 65%)',
          filter: 'blur(80px)',
          animation: 'blobDrift2 30s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '38%', left: '25%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(80,210,180,0.07) 0%, transparent 65%)',
          filter: 'blur(90px)',
          animation: 'blobDrift3 20s ease-in-out infinite',
        }} />
      </div>
    </>
  );
}

interface ToolCardProps {
  accent: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  comingSoon?: boolean;
}

function ToolCard({ accent, icon, eyebrow, title, subtitle, href, comingSoon }: ToolCardProps) {
  const card = (
    <motion.div
      whileHover={comingSoon ? {} : { y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`relative rounded-3xl overflow-hidden h-full ${comingSoon ? 'opacity-45 cursor-default select-none' : 'cursor-pointer'}`}
    >
      {/* Glass */}
      <div className="absolute inset-0 bg-white/68 backdrop-blur-2xl border border-white/55 shadow-[0_8px_48px_rgba(0,0,0,0.09)]" />
      {/* Accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl" style={{ background: accent }} />
      {/* Content */}
      <div className="relative px-8 pt-10 pb-10 flex flex-col gap-6">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${accent}18` }}>
          {icon}
        </div>
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2.5" style={{ color: accent }}>
            {comingSoon ? 'Coming Soon' : eyebrow}
          </p>
          <h2 className="text-lg font-bold tracking-tight text-[#1D1D1F] mb-2 leading-snug">{title}</h2>
          <p className="text-[13px] text-[#6E6E73] leading-relaxed">{subtitle}</p>
        </div>
        {!comingSoon && (
          <p className="text-[12px] font-semibold tracking-[0.08em]" style={{ color: accent }}>
            Open →
          </p>
        )}
      </div>
    </motion.div>
  );

  if (comingSoon) return card;
  return (
    <a href={href} className="block h-full no-underline">
      {card}
    </a>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────

function IconPerson({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconLaptop({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="13" rx="2" stroke={color} strokeWidth="2"/>
      <path d="M1 20h22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 20l1.5-3h3L15 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconCalendar({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="2"/>
      <path d="M3 10h18" stroke={color} strokeWidth="2"/>
      <path d="M8 3v4M16 3v4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <rect x="7" y="13" width="3" height="3" rx="0.5" fill={color}/>
      <rect x="14" y="13" width="3" height="3" rx="0.5" fill={color}/>
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HomeApp() {
  return (
    <>
      <MeshBackground />
      <div className="min-h-screen font-sans text-[#1D1D1F] antialiased">

        {/* Hero */}
        <section className="text-center px-6 pt-28 pb-20">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#AEAEB2] uppercase mb-5">
            seitonejp
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight leading-[1.06] text-[#1D1D1F] mb-5">
            Your tools.
          </h1>
          <p className="text-lg md:text-xl text-[#6E6E73] max-w-sm mx-auto leading-relaxed">
            A personal collection of utilities.
          </p>
        </section>

        {/* Cards */}
        <div className="max-w-3xl mx-auto px-5 md:px-8 pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
            <ToolCard
              accent="#00BFA5"
              icon={<IconPerson color="#00BFA5" />}
              eyebrow="Personality"
              title="MBTI Test"
              subtitle="Japanese questionnaire to discover your personality type."
              href="./mbti.html"
            />
            <ToolCard
              accent="#0071E3"
              icon={<IconLaptop color="#0071E3" />}
              eyebrow="Performance"
              title="Mac Upgrade Simulator"
              subtitle="Compare chips across generations. See the performance leap."
              href="./macbook.html"
            />
            <ToolCard
              accent="#34C759"
              icon={<IconCalendar color="#34C759" />}
              eyebrow="Family"
              title="Family Calendar"
              subtitle="Shared scheduling for the whole family."
              href="#"
              comingSoon
            />
          </div>
        </div>

      </div>
    </>
  );
}
