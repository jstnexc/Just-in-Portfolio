"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Clock, 
  Zap, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Smartphone
} from "lucide-react";

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in">
      <div className="relative w-full max-w-lg p-7 sm:p-8 rounded-3xl border border-violet-400/30 bg-[#0d0822] shadow-[0_0_80px_rgba(139,92,246,0.3)] text-white space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-violet-300">
          <span>TIMEGUARD ONBOARDING</span>
          <span>STEP {step} OF 3</span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold font-display text-white">
              Reclaim Your Focus &amp; Dopamine
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              TimeGuard is an automated screen time manager and digital addiction control system engineered to stop mindless infinite scrolling before it drains your day.
            </p>
            <div className="space-y-2 pt-2 text-xs font-mono text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Per-app custom limits in minutes or hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant lockouts when allowances expire</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Deep Work Focus Mode with distraction shields</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold font-display text-white">
              How Automatic Restrictions Work
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              When an app reaches 75% and 90% of its allowance, TimeGuard sends progressive smart warnings. At 100%, the digital shield locks the app with an inspirational break screen until local midnight.
            </p>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white/70 leading-relaxed">
              <span className="font-bold text-amber-300">Responsible Emergency Override:</span> Need urgent access for work or family? You can request a 5 or 15-minute extension with a declared reason that is recorded in your local audit trail.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
              <Smartphone className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold font-display text-white">
              Zero Surveillance · 100% Private
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              All usage records, limit configurations, and journals reside exclusively on your local device storage. No tracking servers, no cloud profiling, and no battery-draining telemetry.
            </p>
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200">
              You are ready to customize your limits and take back your time.
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-semibold text-white/60 hover:text-white"
            >
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2 cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-7 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              Enter TimeGuard
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
