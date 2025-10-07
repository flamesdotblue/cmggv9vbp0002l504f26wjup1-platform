import React from 'react';
import { motion } from 'framer-motion';

const thumbs = [
  {
    title: '10 Editing Hacks',
    colors: 'from-fuchsia-500 to-rose-500',
    tag: 'YouTube 1280x720',
  },
  {
    title: 'Travel on $300',
    colors: 'from-amber-400 to-orange-600',
    tag: 'Shorts 1080x1920',
  },
  {
    title: 'AI in 5 Minutes',
    colors: 'from-sky-500 to-indigo-600',
    tag: 'YouTube 1280x720',
  },
  {
    title: 'Meal Prep Fast',
    colors: 'from-emerald-400 to-teal-600',
    tag: 'TikTok 1080x1920',
  },
  {
    title: 'Beat the Algorithm',
    colors: 'from-violet-500 to-indigo-700',
    tag: 'YouTube 1280x720',
  },
  {
    title: 'Studio Setup 2025',
    colors: 'from-blue-500 to-cyan-500',
    tag: 'YouTube 1280x720',
  },
];

function ThumbCard({ title, colors, tag }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colors}`} />
      <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_70%_30%,rgba(255,255,255,0.35)_0%,transparent_60%)] opacity-70 transition-opacity group-hover:opacity-90" />
      <div className="absolute inset-0 flex items-end p-4">
        <div className="w-full rounded-lg bg-black/35 p-3 backdrop-blur">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold tracking-tight md:text-base">{title}</h4>
            <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] text-white/80">{tag}</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded bg-white/20">
            <div className="h-full w-2/3 bg-white" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute right-3 top-3 rounded-md bg-white/20 px-2 py-1 text-[10px] backdrop-blur">AI Variation</div>
      </div>
    </motion.div>
  );
}

export default function Showcase() {
  return (
    <section id="showcase" className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        >
          See what AuraThumb creates
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-white/70"
        >
          Variations tailored to your title, audience, and niche — rendered crisp for every platform.
        </motion.p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {thumbs.map((t) => (
          <ThumbCard key={t.title} {...t} />
        ))}
      </div>
    </section>
  );
}
