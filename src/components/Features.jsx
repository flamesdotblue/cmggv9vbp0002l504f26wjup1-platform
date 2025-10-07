import React from 'react';
import { Wand2, Zap, Shield, Image } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Wand2,
    title: 'One‑click Magic',
    desc: 'Upload a frame or paste a link — our AI designs multiple high‑performing variations instantly.',
  },
  {
    icon: Zap,
    title: 'CTR‑Optimized',
    desc: 'Trained on millions of thumbnails to maximize contrast, composition, and subject impact.',
  },
  {
    icon: Image,
    title: 'Brand‑Ready Styles',
    desc: 'Custom palettes, fonts, and templates that match your channel identity out of the box.',
  },
  {
    icon: Shield,
    title: 'Safe & Private',
    desc: 'Your uploads stay yours. Enterprise‑grade encryption and secure processing by default.',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="absolute inset-x-0 top-0 -z-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Designed for speed, tuned for clicks
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-white/70"
        >
          Everything you need to create striking, brand‑consistent thumbnails that stand out in any feed.
        </motion.p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">{f.title}</h3>
            <p className="mt-1.5 text-sm text-white/70">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
