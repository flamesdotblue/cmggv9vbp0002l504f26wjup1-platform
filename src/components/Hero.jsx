import React from 'react';
import { Rocket, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BackgroundParticleNetwork from './BackgroundParticleNetwork';

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <BackgroundParticleNetwork />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur"
       >
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          Introducing AuraThumb AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 text-center text-4xl font-semibold leading-tight tracking-tight md:text-6xl"
        >
          Mind‑blowing AI Thumbnails
          <span className="block bg-gradient-to-r from-indigo-300 via-sky-300 to-amber-300 bg-clip-text text-transparent">that drive clicks</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-5 max-w-2xl text-center text-white/70"
        >
          Generate scroll‑stopping YouTube, TikTok, and Shorts thumbnails in seconds. Smart layouts, bold typography, perfect contrast — all powered by AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href="#create"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
          >
            <Rocket className="h-4 w-4" />
            Create a Thumbnail
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/10"
          >
            View Showcase
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md sm:grid-cols-4"
        >
          {[
            'Auto layout',
            'Font pairing',
            'Color pop',
            'Face cutout',
          ].map((t) => (
            <div key={t} className="rounded-lg bg-white/5 px-3 py-2 text-center text-xs text-white/70">
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
