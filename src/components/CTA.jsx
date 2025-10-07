import React from 'react';
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section id="create" className="relative mx-auto max-w-7xl px-6 pb-28">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.03] p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h3 className="text-2xl font-semibold md:text-3xl">Create your first AI thumbnail now</h3>
          <p className="mt-2 text-white/70">Start free with 10 credits. No credit card needed.</p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@channel.com"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur focus:border-white/30"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-fuchsia-500/20 transition-transform duration-200 hover:scale-[1.02] sm:w-auto"
            >
              Get started free
            </button>
          </form>

          <div className="mt-4 text-xs text-white/60">By continuing you agree to our Terms and Privacy.</div>
        </motion.div>

        <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <footer className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row">
        <div>© {new Date().getFullYear()} AuraThumb AI</div>
        <div className="flex items-center gap-4">
          <a className="hover:text-white" href="#features">Features</a>
          <a className="hover:text-white" href="#showcase">Showcase</a>
          <a className="hover:text-white" href="#create">Get Started</a>
        </div>
      </footer>
    </section>
  );
}
