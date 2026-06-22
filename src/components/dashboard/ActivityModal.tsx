"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Wind, Play, Pause, RotateCcw, Check, Sparkles, BookHeart, CheckCircle, ChevronRight, ChevronLeft, MapPin } from "lucide-react";
import { AppTheme } from "@/lib/types/theme";
import { toast } from "sonner";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  activeTheme?: AppTheme;
}

const themeStyles = {
  calm_blue: {
    text: "text-teal-800",
    bg: "bg-teal-50",
    border: "border-teal-200/60",
    button: "bg-teal-800 hover:bg-teal-700 text-white",
    hoverBg: "hover:bg-teal-50",
    accentText: "text-teal-600",
    progress: "bg-teal-600",
  },
  warm_yellow: {
    text: "text-amber-900",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    button: "bg-amber-800 hover:bg-amber-700 text-white",
    hoverBg: "hover:bg-amber-50",
    accentText: "text-amber-700",
    progress: "bg-amber-700",
  },
  alert_orange: {
    text: "text-orange-950",
    bg: "bg-orange-50",
    border: "border-orange-200/60",
    button: "bg-orange-800 hover:bg-orange-700 text-white",
    hoverBg: "hover:bg-orange-50",
    accentText: "text-orange-700",
    progress: "bg-orange-700",
  },
  deep_purple: {
    text: "text-indigo-950",
    bg: "bg-indigo-50",
    border: "border-indigo-200/60",
    button: "bg-indigo-800 hover:bg-indigo-700 text-white",
    hoverBg: "hover:bg-indigo-50",
    accentText: "text-indigo-700",
    progress: "bg-indigo-700",
  },
};

// 1. BREATHING EXERCISE (4-7-8)
function BreathingExercise({ styles }: { styles: any }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (phase === "inhale") {
              setPhase("hold");
              return 7;
            } else if (phase === "hold") {
              setPhase("exhale");
              return 8;
            } else {
              setPhase("inhale");
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(4);
  };

  // Determine scaling circle class based on breathing phase
  let circleScale = "scale-75 bg-slate-100";
  let phaseText = "Tarik Napas";
  let phaseInstructions = "Tarik napas secara perlahan lewat hidung...";

  if (isActive) {
    if (phase === "inhale") {
      circleScale = "scale-100 bg-teal-100/60 transition-transform duration-[4000ms] ease-out";
      phaseText = "Tarik Napas";
      phaseInstructions = "Tarik napas lewat hidung Anda...";
    } else if (phase === "hold") {
      circleScale = "scale-100 bg-amber-100/60";
      phaseText = "Tahan Napas";
      phaseInstructions = "Tahan napas Anda dan rileks...";
    } else {
      circleScale = "scale-75 bg-rose-100/60 transition-transform duration-[8000ms] ease-in";
      phaseText = "Hembuskan";
      phaseInstructions = "Hembuskan napas panjang secara perlahan lewat mulut...";
    }
  }

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="relative mb-12 flex h-60 w-60 items-center justify-center">
        {/* Pulsing Outer circle guide */}
        <div className={`absolute inset-0 rounded-full border border-dashed border-slate-200 scale-100`} />
        
        {/* Breathing animated circle */}
        <div className={`h-48 w-48 rounded-full flex flex-col items-center justify-center shadow-inner transition-all ${circleScale}`}>
          <p className="text-2xl font-black text-slate-800">{timeLeft}s</p>
          <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mt-1">{phaseText}</p>
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-700 max-w-sm h-12 leading-relaxed mb-6">
        {phaseInstructions}
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleToggle}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${styles.button}`}
        >
          {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isActive ? "Jeda" : "Mulai"}
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

// 2. PROGRESSIVE MUSCLE RELAXATION
function MuscleRelaxation() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const instructions = [
    {
      title: "1. Lengan & Kepalan Tangan",
      guide: "Kepalkan kedua tangan Anda dengan kuat. Rasakan ketegangan di kepalan tangan dan lengan bawah Anda selama 5 detik, lalu rilekskan tangan sepenuhnya. Rasakan bedanya saat otot rileks.",
    },
    {
      title: "2. Bahu & Leher",
      guide: "Angkat kedua bahu Anda setinggi-tingginya ke arah telinga. Tarik leher Anda sedikit ke bawah. Tahan ketegangan pundak ini selama 5 detik, lalu lepaskan secara mendadak. Biarkan pundak Anda jatuh lemas.",
    },
    {
      title: "3. Perut & Paha",
      guide: "Tarik otot perut Anda ke dalam dengan kencang, dan secara bersamaan kencangkan paha Anda. Tahan ketegangan otot tubuh bagian tengah ini selama 5 detik, lalu hembuskan napas dan rilekskan tubuh Anda.",
    },
    {
      title: "4. Wajah & Rahang",
      guide: "Kerutkan kening Anda, pejamkan mata Anda rapat-rapat, dan katupkan rahang Anda dengan kuat. Tahan ketegangan wajah ini selama 5 detik, kemudian rilekskan seluruh otot wajah Anda secara perlahan.",
    },
  ];

  return (
    <div className="py-4">
      <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-100 p-6">
        <h4 className="font-bold text-slate-800 text-sm mb-2">{instructions[step - 1].title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {instructions[step - 1].guide}
        </p>
      </div>

      <div className="flex items-center justify-between mt-8">
        <span className="text-xs text-slate-400 font-semibold">
          Langkah {step} dari {totalSteps}
        </span>
        <div className="flex gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </button>
          )}
          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-[#004349] hover:bg-[#0d5c63] text-xs font-bold text-white rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              Lanjut
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
              <Check className="h-4 w-4" />
              Selesai Dilatih
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. FOCUS MEDITATION
function FocusMeditation({ styles }: { styles: any }) {
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 menit
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(600);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="relative mb-10 flex h-52 w-52 items-center justify-center rounded-full bg-slate-50 border border-slate-100 shadow-inner">
        {/* Pulsing ring during meditation */}
        {isActive && (
          <div className="absolute inset-2 rounded-full border-4 border-dashed border-teal-500/20 animate-spin duration-[10000ms]" />
        )}
        <div className="flex flex-col items-center">
          <p className="text-3xl font-black text-slate-800">{formatTime(secondsLeft)}</p>
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">
            {isActive ? "Meditasi..." : "Fokus Meditasi"}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-8">
        Pejamkan mata Anda, atur napas secara alami, dan arahkan seluruh fokus pikiran Anda pada tarikan dan hembusan napas.
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleToggle}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${styles.button}`}
        >
          {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isActive ? "Jeda" : "Mulai Meditasi"}
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}

// 4. WALKING TRACKER
function WalkingTracker() {
  const [steps, setSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTrack = () => {
    setIsTracking(true);
    setFinished(false);
    setSteps(0);

    intervalRef.current = setInterval(() => {
      setSteps((prev) => {
        if (prev >= 2000) {
          setIsTracking(false);
          setFinished(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 2000;
        }
        return prev + 100;
      });
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="py-4 text-center">
      <div className="mb-8 rounded-2xl bg-slate-50 border border-slate-100 p-6 flex flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700 border border-teal-100">
          <MapPin className="h-6 w-6" />
        </div>
        
        {isTracking ? (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Menghitung Langkah...</p>
            <p className="text-3xl font-black text-slate-800">{steps} Langkah</p>
            <div className="w-48 bg-slate-200 h-2 rounded-full overflow-hidden mx-auto">
              <div className="bg-teal-600 h-full transition-all duration-300 origin-left animate-progress" style={{ width: `${(steps / 2000) * 100}%` }} />
            </div>
          </div>
        ) : finished ? (
          <div className="space-y-2">
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
              <CheckCircle className="h-4 w-4" /> Selesai!
            </p>
            <p className="text-xl font-bold text-slate-800">1.5 Kilometer Tercapai</p>
            <p className="text-xs text-slate-400">
              Kerja bagus! Aktivitas fisik ringan seperti berjalan membantu menurunkan kadar kortisol (stres) di tubuh Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-700">Mulai Jalan Santai Hari ini</p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Jalan santai selama 15 menit membantu melancarkan peredaran darah dan menyegarkan pikiran Anda.
            </p>
          </div>
        )}
      </div>

      {!isTracking && !finished && (
        <button
          onClick={startTrack}
          className="px-6 py-3 bg-[#004349] hover:bg-[#0d5c63] text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Mulai Jalan Sekarang
        </button>
      )}

      {finished && (
        <button
          onClick={startTrack}
          className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
        >
          Ulangi Pelacakan
        </button>
      )}
    </div>
  );
}

// 5. GRATITUDE JOURNAL (localStorage)
function GratitudeJournal({ styles }: { styles: any }) {
  const [inputs, setInputs] = useState({ one: "", two: "", three: "" });
  const [history, setHistory] = useState<{ id: string; one: string; two: string; three: string; date: string }[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("gratitude-journal-entries");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    }
  }, []);

  const handleInputChange = (field: "one" | "two" | "three", val: string) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.one.trim() || !inputs.two.trim() || !inputs.three.trim()) {
      toast.error("Silakan isi ketiga hal baik hari ini.");
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      one: inputs.one,
      two: inputs.two,
      three: inputs.three,
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("gratitude-journal-entries", JSON.stringify(updatedHistory));
    setInputs({ one: "", two: "", three: "" });
    setSaved(true);
    toast.success("Jurnal rasa syukur berhasil disimpan!");

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="py-2 space-y-6">
      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          Jurnal syukur berhasil disimpan hari ini!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <p className="text-xs text-slate-400 font-semibold leading-relaxed">
          Tuliskan 3 hal baik, pencapaian kecil, atau hal yang membuat Anda bersyukur hari ini:
        </p>

        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${styles.bg} ${styles.accentText}`}>1</span>
            <input
              type="text"
              value={inputs.one}
              onChange={(e) => handleInputChange("one", e.target.value)}
              placeholder="Hal baik pertama..."
              className="flex-1 text-xs border border-slate-200 rounded-xl p-3 bg-white focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div className="flex gap-3 items-center">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${styles.bg} ${styles.accentText}`}>2</span>
            <input
              type="text"
              value={inputs.two}
              onChange={(e) => handleInputChange("two", e.target.value)}
              placeholder="Hal baik kedua..."
              className="flex-1 text-xs border border-slate-200 rounded-xl p-3 bg-white focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div className="flex gap-3 items-center">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${styles.bg} ${styles.accentText}`}>3</span>
            <input
              type="text"
              value={inputs.three}
              onChange={(e) => handleInputChange("three", e.target.value)}
              placeholder="Hal baik ketiga..."
              className="flex-1 text-xs border border-slate-200 rounded-xl p-3 bg-white focus:outline-none focus:border-teal-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 cursor-pointer ${styles.button}`}
        >
          <BookHeart className="h-4 w-4" />
          Simpan ke Jurnal Syukur
        </button>
      </form>

      {/* History section */}
      {history.length > 0 && (
        <div className="border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-700 mb-3">Catatan Jurnal Sebelumnya</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {history.map((entry) => (
              <div key={entry.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                <p className="text-[10px] text-slate-400 font-semibold">{entry.date}</p>
                <ul className="list-decimal pl-4 text-xs text-slate-600 space-y-0.5 leading-relaxed font-medium">
                  <li>{entry.one}</li>
                  <li>{entry.two}</li>
                  <li>{entry.three}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 6. POSITIVE AFFIRMATIONS
function PositiveAffirmations() {
  const [index, setIndex] = useState(0);

  const affirmations = [
    {
      text: "Saya berharga dan berhak mendapatkan ketenangan pikiran hari ini.",
      author: "Kedamaian Batin",
    },
    {
      text: "Stres adalah respon sementara, saya memiliki kendali penuh atas bagaimana saya berespon.",
      author: "Kontrol Diri",
    },
    {
      text: "Tiap embusan napas melepaskan beban pikiran saya. Saya aman dan didukung.",
      author: "Pelepasan",
    },
    {
      text: "Saya berjalan selangkah demi selangkah. Tidak perlu terburu-buru menuju pemulihan.",
      author: "Kesabaran",
    },
    {
      text: "Kemampuan saya mengatasi tantangan lebih besar dibanding tantangan itu sendiri.",
      author: "Kekuatan Diri",
    },
  ];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % affirmations.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
  };

  return (
    <div className="py-4 text-center">
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-pink-50/30 border border-slate-100 p-8 min-h-36 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
        {/* Decorative sparkles */}
        <Sparkles className="absolute top-4 right-4 h-5 w-5 text-indigo-300 opacity-60 animate-pulse" />
        
        <p className="text-sm font-serif italic text-slate-700 leading-relaxed max-w-md">
          \"{affirmations[index].text}\"
        </p>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-4">
          Fokus: {affirmations[index].author}
        </span>
      </div>

      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handlePrev}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <span className="text-xs text-slate-400 font-semibold">
          Affirmation {index + 1} / {affirmations.length}
        </span>
        <button
          onClick={handleNext}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </button>
      </div>
    </div>
  );
}

export default function ActivityModal({
  isOpen,
  onClose,
  title,
  description,
  activeTheme = "calm_blue",
}: ActivityModalProps) {
  const styles = themeStyles[activeTheme] || themeStyles.calm_blue;

  const isBreathing = title.includes("Pernapasan") || title.includes("4-7-8");
  const isMuscle = title.includes("Otot") || title.includes("Rileksasi");
  const isMeditation = title.includes("Meditasi");
  const isWalking = title.includes("Jalan") || title.includes("Santai");
  const isJournal = title.includes("Journal") || title.includes("Syukur");
  const isAffirmation = title.includes("Afirmasi") || title.includes("Positif");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-slate-100 bg-white p-6 max-w-sm sm:max-w-md rounded-2xl shadow-2xl">
        <DialogHeader className="text-left">
          <div className="flex gap-2.5 items-center mb-1">
            {isBreathing && <Wind className={`h-5 w-5 ${styles.accentText}`} />}
            {isJournal && <BookHeart className={`h-5 w-5 ${styles.accentText}`} />}
            {isMeditation && <Wind className={`h-5 w-5 ${styles.accentText}`} />}
            {isAffirmation && <Sparkles className={`h-5 w-5 ${styles.accentText}`} />}
            
            <DialogTitle className={`font-serif text-lg font-bold leading-tight ${styles.text}`}>
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-400 leading-normal">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 animate-scale-in duration-300">
          {isBreathing && <BreathingExercise styles={styles} />}
          {isMuscle && <MuscleRelaxation />}
          {isMeditation && <FocusMeditation styles={styles} />}
          {isWalking && <WalkingTracker />}
          {isJournal && <GratitudeJournal styles={styles} />}
          {isAffirmation && <PositiveAffirmations />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
