import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Music, Music2, Pause, Play, Sparkles, Gift, GalleryHorizontalEnd, MessageCircle, Calendar, ChevronDown, Camera, Copy, Check, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * 🎁 Birthday Gift Website (Single-File React Component)
 * Modern • Aesthetic • Responsive • Personalizable
 *
 * HOW TO CUSTOMIZE (no extra files needed):
 * 1) Edit the CONFIG below (name, date, heroText, photos, songUrl).
 * 2) Export & host anywhere (Vite/Next.js). Tailwind + shadcn recommended.
 * 3) Optional: Replace image URLs with your own photos.
 */

const CONFIG = {
  recipientName: "My Love",
  yourName: "From Me",
  ageTurning: 19,
  // 🎂 Set the birthday date/time (local browser time). Format: YYYY-MM-DDTHH:mm:ss
  birthdayAt: "2025-09-12T00:00:00",
  heroText: "Happy 19th Birthday!",
  subText: "May your day be filled with little sparks of joy.",
  theme: {
    // Tailwind color tokens
    bg: "bg-gradient-to-b from-pink-50 via-rose-50 to-white dark:from-zinc-900 dark:via-zinc-900 dark:to-black",
    primary: "from-rose-500 to-pink-500",
    accent: "from-fuchsia-500 to-violet-500",
  },
  // Replace these with your actual image links
  photos: [
    "https://images.unsplash.com/photo-1504198266285-165a16f0c76e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484244233201-29892afe6a2c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478144898667-94c4d0bb26d2?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504197885-609741792ce7?q=80&w=1600&auto=format&fit=crop",
  ],
  // Optional background music (ensure CORS allowed). Put a direct mp3 URL you own.
  songUrl: "",
};

function useCountdown(targetISO) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = useMemo(() => new Date(targetISO), [targetISO]);
  const diff = Math.max(0, target - now);
  const s = Math.floor(diff / 1000);
  const days = Math.floor(s / (3600 * 24));
  const hours = Math.floor((s % (3600 * 24)) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function ConfettiCanvas({ run }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!run) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = 320);
    const colors = ["#f472b6", "#fb7185", "#c084fc", "#60a5fa", "#34d399"];
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * -h,
      r: 3 + Math.random() * 6,
      s: 1 + Math.random() * 2,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * Math.PI,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pieces.forEach(p => {
        p.y += p.s;
        p.x += Math.sin(p.a += 0.02);
        if (p.y > h) { p.y = -10; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [run]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-x-0 top-0 h-[320px] w-full pointer-events-none mix-blend-multiply opacity-80"
      aria-hidden
    />
  );
}

function SectionHeader({ icon: Icon, title, subtitle, id }) {
  return (
    <div id={id} className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-2xl bg-gradient-to-tr from-rose-200 to-pink-200 dark:from-zinc-800 dark:to-zinc-700">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
    </div>
  );
}

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

export default function BirthdayGiftSite() {
  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [openLetter, setOpenLetter] = useState(false);
  const [name, setName] = useLocalStorage("bday:name", CONFIG.recipientName);
  const [yourName, setYourName] = useLocalStorage("bday:from", CONFIG.yourName);
  const [target, setTarget] = useLocalStorage("bday:date", CONFIG.birthdayAt);
  const [notes, setNotes] = useLocalStorage("bday:notes", [
    { by: yourName, text: "Thank you for being you. I’m so proud of you!", at: Date.now() },
  ]);
  const audioRef = useRef(null);

  const countdown = useCountdown(target);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = muted;
    if (playing) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [playing, muted]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const addNote = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = String(data.get("note") || "").trim();
    const by = String(data.get("by") || "").trim() || yourName;
    if (!text) return;
    setNotes([{ by, text, at: Date.now() }, ...notes]);
    e.currentTarget.reset();
  };

  const daysDone = countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0;

  return (
    <div className={`min-h-screen ${CONFIG.theme.bg} text-zinc-900 dark:text-zinc-100`}> 
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 grid place-items-center text-white"><Gift size={16}/></div>
            <span className="font-medium">for {name}</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#home" className="hover:opacity-70">Home</a>
            <a href="#countdown" className="hover:opacity-70">Countdown</a>
            <a href="#gallery" className="hover:opacity-70">Gallery</a>
            <a href="#letter" className="hover:opacity-70">Open Letter</a>
            <a href="#guestbook" className="hover:opacity-70">Guestbook</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setMuted(m => !m)} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX className="w-5 h-5"/> : <Volume2 className="w-5 h-5"/>}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setPlaying(p => !p)} aria-label={playing ? "Pause music" : "Play music"}>
              {playing ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5"/>}
            </Button>
            <Button variant="secondary" size="sm" onClick={copyLink} className="hidden sm:inline-flex">
              {copied ? <Check className="w-4 h-4 mr-2"/> : <Copy className="w-4 h-4 mr-2"/>} Share
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
          <div>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {CONFIG.heroText} <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-600">{name}</span>
            </motion.h1>
            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0, delay:.1}} className="mt-4 text-zinc-600 dark:text-zinc-300">
              {CONFIG.subText}
            </motion.p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#countdown"><Button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">See Countdown</Button></a>
              <a href="#gallery"><Button variant="outline">Memories</Button></a>
              <Button variant="ghost" onClick={() => setOpenLetter(true)}><Sparkles className="w-4 h-4 mr-2"/>Open Letter</Button>
            </div>

            <div className="mt-8">
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-zinc-900/60 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><Calendar className="w-4 h-4"/> Personalize</CardTitle>
                  <CardDescription>Make it truly yours — saved to your device only.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-3 gap-3">
                  <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Recipient name"/>
                  <Input value={yourName} onChange={(e)=>setYourName(e.target.value)} placeholder="Your name"/>
                  <Input value={target} onChange={(e)=>setTarget(e.target.value)} placeholder="YYYY-MM-DDTHH:mm:ss"/>
                </CardContent>
                <CardFooter className="text-xs text-zinc-500">Tip: Use local time. Example: 2025-09-12T00:00:00</CardFooter>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-200/60 dark:ring-zinc-800">
              <img alt="birthday" src={CONFIG.photos[0]} className="w-full h-full object-cover"/>
            </div>
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:.2}} className="absolute -bottom-6 -left-6 hidden md:block">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur shadow-lg flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-500"/>
                <div className="text-sm">
                  <div className="font-medium">Turning {CONFIG.ageTurning}</div>
                  <div className="text-zinc-500 text-xs">Forever my favorite person</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <ConfettiCanvas run/>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <ChevronDown className="w-6 h-6 animate-bounce opacity-60"/>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section id="countdown" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeader icon={Calendar} title="Countdown" subtitle={`Counting down to ${new Date(target).toLocaleString()}`}/>

        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map((it, i) => (
              <div key={i} className="p-6 md:p-10 text-center bg-white/80 dark:bg-zinc-900/60">
                <div className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">{String(it.value).padStart(2,'0')}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-zinc-500">{it.label}</div>
              </div>
            ))}
          </div>
          <CardFooter className="flex items-center justify-center gap-2 py-6">
            <AnimatePresence>
              {daysDone && (
                <motion.div initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.9,opacity:0}} className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium shadow-lg">
                  It’s your day, {name}! 🎉
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
        </Card>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="mx-auto max-w-6xl px-4 py-16">
        <SectionHeader icon={GalleryHorizontalEnd} title="Memories Gallery" subtitle="A little scrapbook of our moments"/>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {CONFIG.photos.map((src, idx) => (
            <motion.div key={idx} whileHover={{scale:1.02}} className="relative rounded-2xl overflow-hidden group ring-1 ring-zinc-200/60 dark:ring-zinc-800">
              <img src={src} alt={`photo-${idx}`} className="w-full h-48 md:h-56 object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
              <div className="absolute bottom-2 left-2 text-white text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={14}/> #{idx+1}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LETTER */}
      <section id="letter" className="mx-auto max-w-3xl px-4 py-16">
        <SectionHeader icon={MessageCircle} title="Open Letter" subtitle="A small note from my heart"/>
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-zinc-900/60">
          <CardContent className="pt-6 leading-relaxed text-zinc-700 dark:text-zinc-200">
            Dear <span className="font-semibold">{name}</span>, on your {CONFIG.ageTurning}th birthday, I hope you feel as cherished as you truly are. Thank you for the laughter, the comfort, and the gentle courage you carry. I’m cheering for you today and always. — <span className="font-semibold">{yourName}</span>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button onClick={() => setOpenLetter(true)} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0"><Sparkles className="w-4 h-4 mr-2"/>Read Full Letter</Button>
            <a href="#guestbook"><Button variant="outline">Write a Wish</Button></a>
          </CardFooter>
        </Card>
      </section>

      {/* GUESTBOOK */}
      <section id="guestbook" className="mx-auto max-w-4xl px-4 py-16">
        <SectionHeader icon={Heart} title="Wish Board" subtitle="Leave a little message"/>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-1 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base">Add your wish</CardTitle>
              <CardDescription>Your note stays in this browser.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addNote} className="grid gap-3">
                <Input name="by" placeholder="Your name" defaultValue={yourName}/>
                <Textarea name="note" placeholder={`Write something for ${name}…`} className="min-h-[120px]"/>
                <Button type="submit" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">Send</Button>
              </form>
            </CardContent>
          </Card>

          <div className="md:col-span-2 grid gap-3">
            {notes.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-zinc-500">No wishes yet — be the first! ✨</CardContent>
              </Card>
            )}
            {notes.map((n, i) => (
              <Card key={i} className="border-0 shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{n.by}</div>
                    <div className="text-xs text-zinc-500">{new Date(n.at).toLocaleString()}</div>
                  </div>
                  <p className="mt-2 text-zinc-700 dark:text-zinc-200 whitespace-pre-wrap">{n.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/60 dark:border-zinc-800 mt-10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-zinc-500">Made with <span className="text-pink-500">♥</span> for {name}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</Button>
            <Button variant="secondary" size="sm" onClick={copyLink}>{copied ? "Copied!" : "Share"}</Button>
          </div>
        </div>
      </footer>

      {/* AUDIO */}
      {CONFIG.songUrl && (
        <audio ref={audioRef} src={CONFIG.songUrl} loop autoPlay={false} />
      )}

      {/* LETTER MODAL */}
      <AnimatePresence>
        {openLetter && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}} className="w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
                <div className="font-semibold">A Letter to {name}</div>
                <Button variant="ghost" onClick={()=>setOpenLetter(false)}>Close</Button>
              </div>
              <div className="p-6 leading-relaxed text-zinc-700 dark:text-zinc-200 space-y-4">
                <p>Hi {name},</p>
                <p>I’m endlessly grateful for your light — the way you make ordinary days feel like soft sunsets and warm tea. On your {CONFIG.ageTurning}th birthday, I wish you ease in your steps, courage for your dreams, and a hundred little reasons to smile.</p>
                <p>Thank you for the patience, the laughter, and the way you understand even my quiet. I’ll keep cheering for you in every season.</p>
                <p>With love,<br/>{yourName}</p>
              </div>
              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/60 text-xs text-zinc-500">This message lives only in your browser.</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
