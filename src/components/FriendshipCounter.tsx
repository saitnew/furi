import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, Sparkles, Heart, RefreshCw, Award, Flame, Sun } from 'lucide-react';

export const FriendshipCounter: React.FC = () => {
  const [startDateStr, setStartDateStr] = useState<string>(() => {
    const saved = localStorage.getItem('furry_boys_friendship_start');
    if (saved) return saved;
    const now = new Date().toISOString();
    localStorage.setItem('furry_boys_friendship_start', now);
    return now;
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate Friendship Day based on 7:00 AM cutoff
  // Any moment between start date and next 7 AM is Day 1.
  // Then each subsequent 7:00 AM increments by 1 day.
  const calculateDay = () => {
    const start = new Date(startDateStr);
    const now = currentTime;

    // Adjust by -7 hours so 7:00 AM acts as midnight of the new day
    const startAdjusted = new Date(start.getTime() - 7 * 60 * 60 * 1000);
    const nowAdjusted = new Date(now.getTime() - 7 * 60 * 60 * 1000);

    // Normalize to date-only strings (YYYY-MM-DD)
    const startDateOnly = new Date(
      startAdjusted.getFullYear(),
      startAdjusted.getMonth(),
      startAdjusted.getDate()
    );
    const nowDateOnly = new Date(
      nowAdjusted.getFullYear(),
      nowAdjusted.getMonth(),
      nowAdjusted.getDate()
    );

    const diffDays = Math.floor(
      (nowDateOnly.getTime() - startDateOnly.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.max(1, diffDays + 1);
  };

  const dayNumber = calculateDay();

  // Next 7:00 AM calculation
  const getNext7Am = () => {
    const now = currentTime;
    const next7 = new Date(now);
    if (now.getHours() >= 7) {
      next7.setDate(next7.getDate() + 1);
    }
    next7.setHours(7, 0, 0, 0);
    return next7;
  };

  const next7Am = getNext7Am();
  const diffToNext7Am = Math.max(0, next7Am.getTime() - currentTime.getTime());
  const hoursLeft = Math.floor(diffToNext7Am / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diffToNext7Am % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((diffToNext7Am % (1000 * 60)) / 1000);

  // Total seconds in 24h = 86400
  const progressPercent = Math.min(
    100,
    Math.max(0, ((86400 - diffToNext7Am / 1000) / 86400) * 100)
  );

  const spawnHearts = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: rect.width / 2 + (Math.random() * 80 - 40),
      y: rect.height / 2 + (Math.random() * 40 - 20),
    }));
    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1800);
  };

  const resetToToday = () => {
    const now = new Date().toISOString();
    setStartDateStr(now);
    localStorage.setItem('furry_boys_friendship_start', now);
    setShowDatePicker(false);
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const selected = new Date(val);
      selected.setHours(12, 0, 0, 0);
      const iso = selected.toISOString();
      setStartDateStr(iso);
      localStorage.setItem('furry_boys_friendship_start', iso);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none pb-28 px-2 relative">
      {/* Floating Celebration Hearts */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, scale: 0.6, y: 0, x: h.x }}
            animate={{
              opacity: 0,
              scale: 1.4,
              y: -140 - Math.random() * 60,
              x: h.x + (Math.random() * 60 - 30),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 text-pink-500"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <Heart className="w-6 h-6 fill-pink-400 text-pink-600" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mb-4 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass border border-white/60 mb-1.5 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-pink-500" />
          <span className="text-[11px] font-bold tracking-wider text-pink-800 uppercase">
            живой таймер дружбы
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-800">
          Счетчик дружбы
        </h2>
        <p className="text-xs text-pink-700/80 mt-0.5">
          Каждый новый день начинается ровно в 7:00 утра
        </p>
      </motion.div>

      {/* Main Big Counter Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-sm liquid-glass-card rounded-[32px] p-6 border border-white/80 shadow-[0_25px_55px_-12px_rgba(244,114,182,0.35)] relative overflow-hidden"
      >
        {/* Specular light highlight */}
        <div className="absolute top-0 inset-x-8 h-12 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

        {/* Top Status Tag */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-pink-700">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span>ДРУЖБА АКТИВНА</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="liquid-glass px-2.5 py-1 rounded-full text-[11px] font-semibold text-pink-700 hover:text-pink-900 flex items-center gap-1 border border-white/70 active:scale-95 transition-all cursor-pointer"
          >
            <Calendar className="w-3 h-3" />
            <span>настроить</span>
          </button>
        </div>

        {/* Date adjustment drawer / dropdown */}
        <AnimatePresence>
          {showDatePicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 liquid-glass rounded-2xl border border-pink-200/80 overflow-hidden text-xs"
            >
              <p className="font-semibold text-pink-900 mb-2">
                Дата начала дружбы:
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  defaultValue={startDateStr.split('T')[0]}
                  onChange={handleCustomDateChange}
                  className="bg-white/80 border border-pink-300 rounded-lg px-2.5 py-1 text-xs text-pink-900 font-medium outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  type="button"
                  onClick={resetToToday}
                  className="bg-pink-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow hover:bg-pink-600 active:scale-95 transition-all cursor-pointer"
                >
                  Сброс на сегодня
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Big Barbie Style Day Display */}
        <div className="flex flex-col items-center justify-center my-4 text-center">
          <span className="text-xs font-bold text-pink-600/80 tracking-widest uppercase mb-1">
            МЫ ДРУЖИМ УЖЕ
          </span>

          <div className="relative my-1">
            <h3
              className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#ff2a85] to-[#e0218a] drop-shadow-[0_4px_14px_rgba(255,0,127,0.3)]"
              style={{ fontFamily: "'Pacifico', 'Caveat', cursive" }}
            >
              День {dayNumber}
            </h3>
          </div>

          <div className="liquid-glass px-4 py-1 rounded-full text-xs font-bold text-pink-800 border border-white/80 shadow-xs mt-1">
            {dayNumber === 1 ? '🌟 Сегодня первый день дружбы!' : `✨ Уже ${dayNumber}-й день вместе!`}
          </div>
        </div>

        {/* Live Countdown to 7:00 AM */}
        <div className="liquid-glass p-4 rounded-2xl border border-white/70 shadow-sm mt-5">
          <div className="flex items-center justify-between text-xs font-bold text-pink-900 mb-2">
            <div className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500 fill-amber-300" />
              <span>До 7:00 утра (День {dayNumber + 1}):</span>
            </div>
            <span className="text-[11px] text-pink-600 font-semibold">
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-pink-200/60 overflow-hidden mb-3 p-0.5">
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: 'linear', duration: 1 }}
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 shadow-sm"
            />
          </div>

          {/* Clock Digits */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/70 rounded-xl py-2 border border-pink-100 shadow-xs">
              <span className="text-xl font-black text-slate-800 tabular-nums">
                {String(hoursLeft).padStart(2, '0')}
              </span>
              <span className="block text-[10px] text-pink-600 font-semibold uppercase">
                часов
              </span>
            </div>
            <div className="bg-white/70 rounded-xl py-2 border border-pink-100 shadow-xs">
              <span className="text-xl font-black text-slate-800 tabular-nums">
                {String(minutesLeft).padStart(2, '0')}
              </span>
              <span className="block text-[10px] text-pink-600 font-semibold uppercase">
                минут
              </span>
            </div>
            <div className="bg-white/70 rounded-xl py-2 border border-pink-100 shadow-xs">
              <span className="text-xl font-black text-pink-600 tabular-nums animate-pulse">
                {String(secondsLeft).padStart(2, '0')}
              </span>
              <span className="block text-[10px] text-pink-600 font-semibold uppercase">
                секунд
              </span>
            </div>
          </div>
        </div>

        {/* Celebrate Action Button */}
        <div className="mt-5 flex flex-col items-center">
          <motion.button
            id="btn-celebrate-friendship"
            type="button"
            onClick={spawnHearts}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-bold text-sm tracking-wide shadow-[0_10px_25px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2 cursor-pointer border border-white/40"
          >
            <Heart className="w-5 h-5 fill-white text-white" />
            <span>Отпраздновать день дружбы!</span>
            <Sparkles className="w-4 h-4 fill-white" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
