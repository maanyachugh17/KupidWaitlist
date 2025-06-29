import { useState, useEffect } from "react";

const founderCopy = [
  "Dating hasn't changed in over a decade.",
  "The swipe was the last real innovation — and since then, every app has felt the same.",
  "Isolated. Boring. Low effort.",
  "And if you're in college, half the people you match with don't even go to your school.",
  "We built Kupid Dating because Gen Z deserves better.",
  "Kupid is the first all-in-one dating platform where students can match, watch, and participate — both online and in real life.",
  "The app drops soon. And trust me… it's different."
];

const showcaseImages = [
  {
    src: "/event1.jpg",
    alt: "Kupid Live Event 1"
  },
  {
    src: "/event2.jpg",
    alt: "Kupid Live Event 2"
  },
  {
    src: "/event3.jpg",
    alt: "Kupid Live Event 3"
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    avatar: "/sarah.png",
    rating: 5,
    text: "Finally, a dating app that gets what college students actually want. The video profiles are so much better than photos!",
  },
  {
    name: "Jake R.",
    avatar: "/jake.png",
    rating: 5,
    text: "The campus events feature is genius. Met so many people I never would have matched with online. Can't wait for the full launch!",
  },
  {
    name: "Emma K.",
    avatar: "/emma.png",
    rating: 5,
    text: "Love that it's verified students only. No more wondering if someone actually goes to UT. The whole vibe is just different.",
  },
];

const features = [
  {
    icon: (
      <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10" rx="3"/><circle cx="12" cy="12" r="3"/></svg>
    ),
    title: "Video Swiping",
    desc: "Infinite TikTok-style feed. Swipe up for next video, right to like (with a message), left to dislike, down to skip. Double-tap for Super Like (Premium). Auto-play, captions, and school tags included.",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="5"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>
    ),
    title: "Matching & Messaging",
    desc: "Mutual likes connect instantly. Chat with text, emoji, voice, or video (5-min cap free). Unlock streaks, badges, and local date discounts by staying active.",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
    ),
    title: "Live Events",
    desc: "Join in-app ticketed events, livestreams, and campus games. Vote, play, and match with contestants in real life. IRL matching meets digital connection.",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
    ),
    title: "Verified Campus Network",
    desc: "Connect only with verified students from your university. .edu verification ensures authentic campus connections and builds trust in every match.",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-13c-2.21 0-4 1.79-4 4 0 1.66 1.34 3 3 3s3-1.34 3-3c0-2.21-1.79-4-4-4z"/><path d="M12 17v2"/></svg>
    ),
    title: "Kupid Hearts",
    desc: "Earn hearts for daily logins, profile completion, uploads, referrals, and event activity. Spend on boosts, superlikes, gifts, and date discounts.",
  },
  {
    icon: (
      <svg className="w-16 h-16 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    ),
    title: "Viral Campus Culture",
    desc: "From trending dances to campus memes, discover what's hot at your school. Share viral moments, join campus challenges, and become part of the culture.",
  },
];

export default function App() {
  const [form, setForm] = useState({ name: "", phone: "", countryCode: "+1" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [cardAnim, setCardAnim] = useState(false);
  const [featureIdx, setFeatureIdx] = useState(0);
  const [showcaseIdx, setShowcaseIdx] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  const countryCodes = [
    { code: "+1", country: "US/CA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+86", country: "CN", flag: "🇨🇳" },
    { code: "+81", country: "JP", flag: "🇯🇵" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+52", country: "MX", flag: "🇲🇽" },
    { code: "+55", country: "BR", flag: "🇧🇷" },
    { code: "+7", country: "RU", flag: "🇷🇺" },
    { code: "+34", country: "ES", flag: "🇪🇸" },
    { code: "+39", country: "IT", flag: "🇮🇹" },
    { code: "+31", country: "NL", flag: "🇳🇱" },
    { code: "+46", country: "SE", flag: "🇸🇪" },
    { code: "+47", country: "NO", flag: "🇳🇴" },
    { code: "+45", country: "DK", flag: "🇩🇰" },
    { code: "+358", country: "FI", flag: "🇫🇮" },
    { code: "+41", country: "CH", flag: "🇨🇭" },
    { code: "+43", country: "AT", flag: "🇦🇹" },
    { code: "+32", country: "BE", flag: "🇧🇪" },
    { code: "+351", country: "PT", flag: "🇵🇹" },
    { code: "+48", country: "PL", flag: "🇵🇱" },
    { code: "+420", country: "CZ", flag: "🇨🇿" },
    { code: "+36", country: "HU", flag: "🇭🇺" },
    { code: "+30", country: "GR", flag: "🇬🇷" },
    { code: "+90", country: "TR", flag: "🇹🇷" },
    { code: "+972", country: "IL", flag: "🇮🇱" },
    { code: "+27", country: "ZA", flag: "🇿🇦" },
    { code: "+234", country: "NG", flag: "🇳🇬" },
    { code: "+20", country: "EG", flag: "🇪🇬" },
    { code: "+82", country: "KR", flag: "🇰🇷" },
    { code: "+65", country: "SG", flag: "🇸🇬" },
    { code: "+60", country: "MY", flag: "🇲🇾" },
    { code: "+66", country: "TH", flag: "🇹🇭" },
    { code: "+84", country: "VN", flag: "🇻🇳" },
    { code: "+63", country: "PH", flag: "🇵🇭" },
    { code: "+62", country: "ID", flag: "🇮🇩" },
    { code: "+64", country: "NZ", flag: "🇳🇿" },
    { code: "+54", country: "AR", flag: "🇦🇷" },
    { code: "+56", country: "CL", flag: "🇨🇱" },
    { code: "+57", country: "CO", flag: "🇨🇴" },
    { code: "+51", country: "PE", flag: "🇵🇪" },
    { code: "+58", country: "VE", flag: "🇻🇪" },
    { code: "+92", country: "PK", flag: "🇵🇰" },
    { code: "+880", country: "BD", flag: "🇧🇩" },
    { code: "+94", country: "LK", flag: "🇱🇰" },
    { code: "+98", country: "IR", flag: "🇮🇷" },
    { code: "+964", country: "IQ", flag: "🇮🇶" },
    { code: "+966", country: "SA", flag: "🇸🇦" },
    { code: "+971", country: "AE", flag: "🇦🇪" },
    { code: "+974", country: "QA", flag: "🇶🇦" },
    { code: "+965", country: "KW", flag: "🇰🇼" },
    { code: "+968", country: "OM", flag: "🇴🇲" },
    { code: "+973", country: "BH", flag: "🇧🇭" },
    { code: "+961", country: "LB", flag: "🇱🇧" },
    { code: "+962", country: "JO", flag: "🇯🇴" },
    { code: "+212", country: "MA", flag: "🇲🇦" },
    { code: "+213", country: "DZ", flag: "🇩🇿" },
    { code: "+216", country: "TN", flag: "🇹🇳" },
    { code: "+218", country: "LY", flag: "🇱🇾" },
    { code: "+254", country: "KE", flag: "🇰🇪" },
    { code: "+256", country: "UG", flag: "🇺🇬" },
    { code: "+255", country: "TZ", flag: "🇹🇿" },
    { code: "+233", country: "GH", flag: "🇬🇭" },
    { code: "+225", country: "CI", flag: "🇨🇮" },
    { code: "+221", country: "SN", flag: "🇸🇳" },
  ];

  const showcaseItems = [
    {
      type: "video",
      src: "/video.mov",
      alt: "Kupid App Video Preview",
      title: "See Kupid in Action"
    },
    {
      type: "image", 
      src: "/uipic1.jpg",
      alt: "Kupid App Interface Preview 1",
      title: "Clean Interface Design"
    },
    {
      type: "image",
      src: "/uipic2.jpg", 
      alt: "Kupid App Interface Preview 2",
      title: "TikTok-Style Swiping"
    }
  ];

  useEffect(() => {
    setTimeout(() => setCardAnim(true), 100);
  }, []);

  useEffect(() => {
    // Animate student counter
    let start = 0;
    const end = 23000; // Updated to 23k
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        setStudentCount(end);
        clearInterval(interval);
      } else {
        setStudentCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCountryCodeChange = (e) => {
    setForm({ ...form, countryCode: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError("Please fill in both fields.");
      return;
    }
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) {
      setError("Please enter a valid phone number.");
      return;
    }

    // Prepare URL-encoded form data with full phone number
    const formData = new URLSearchParams();
    formData.append("name", form.name);
    formData.append("phone", `${form.countryCode} ${form.phone}`);

    fetch('https://script.google.com/macros/s/AKfycbzYoO8zW3jfMgp9UogyFsGy9JY-DTEoIv9daM_m1H7fB3O4d_JY8GsiuR_rOd7S_cxv/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setSubmitted(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1800);
        } else {
          setError(data.message || 'Submission failed. Please try again.');
        }
      })
      .catch(err => {
        console.error('Submission error:', err);
        setError('Submission failed. Please try again.');
      });
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-x-hidden">
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm flex items-center px-4 py-3">
        <div className="flex items-center gap-3">
          <img src="/kupid.png" alt="Kupid Logo" width="36" height="36" className="object-contain" />
          <span className="text-2xl font-extrabold bg-gradient-to-br from-[#ff5a8a] to-[#ffb6b6] bg-clip-text text-transparent tracking-tight">Kupid</span>
        </div>
      </header>
      <main className="relative z-10 w-full max-w-2xl mx-auto px-2 py-8 flex flex-col items-center">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl xs:text-6xl font-extrabold mb-3 leading-tight bg-gradient-to-br from-[#ff5a8a] to-[#ffb6b6] bg-clip-text text-transparent drop-shadow-lg">Kupid Dating App</h1>
          <div className="text-xl xs:text-2xl font-semibold text-gray-900 mb-2">TikTok-style Dating for College Students</div>
          <div className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto mb-4 leading-relaxed">
            <p>KUPID is the all-in-one dating platform built for Gen Z.</p>
            <p className="mt-2">We combine real-life energy with digital matchmaking — where students can match, watch, and participate in dating like never before. From viral campus events to an interactive app experience, we're creating the first dating ecosystem that lives both online and in person.</p>
            <p className="mt-2">Born at UT Austin, KUPID is growing into a full-stack platform that blends culture, comedy, and connection — built by Gen Z, for Gen Z.</p>
            <p className="mt-2 font-semibold text-gray-900">Let's be real — Tinder never pulled up to your econ class. We did.</p>
          </div>
        </div>
        {/* Waitlist Form Card */}
        <div className={`w-full max-w-md bg-white rounded-3xl shadow-xl p-6 xs:p-8 flex flex-col items-center border border-gray-100 transition-all duration-700 ${cardAnim ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          {submitted ? (
            <div className="text-center animate-fadein">
              <h2 className="text-2xl font-semibold text-green-600 mb-2">Thank you!</h2>
              <p className="text-gray-700">You're on the list. We'll keep you posted! 💌</p>
            </div>
          ) : (
            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-lg bg-white placeholder-gray-400 shadow-sm transition-all duration-300 focus:scale-105"
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
              />
              <div className="flex gap-2">
                <select
                  className="flex-shrink-0 w-24 px-3 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm bg-white shadow-sm transition-all duration-300 focus:scale-105"
                  name="countryCode"
                  value={form.countryCode}
                  onChange={handleCountryCodeChange}
                >
                  {countryCodes.map((code) => (
                    <option key={code.code} value={code.code}>
                      {code.flag} {code.code}
                    </option>
                  ))}
                </select>
                <input
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-lg bg-white placeholder-gray-400 shadow-sm transition-all duration-300 focus:scale-105"
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="off"
                  inputMode="tel"
                  pattern="[0-9\-\+\s\(\)]*"
                />
              </div>
              <div className="text-xs text-gray-500 mb-1">By joining, you agree to receive a one-time launch text from Kupid Dating.</div>
              {error && <div className="text-red-500 text-sm animate-shake">{error}</div>}
              <button
                type="submit"
                className="relative bg-gradient-to-br from-[#ff5a8a] via-[#ff7fa8] to-[#ffb6b6] text-white font-extrabold py-4 px-8 rounded-2xl text-xl shadow-xl mt-2 focus:ring-2 focus:ring-pink-400 active:scale-95 transition-all duration-300 overflow-hidden group hover:scale-105"
                style={{boxShadow: '0 4px 32px 0 #ff5a8a55'}}
              >
                <span className="relative z-10">Join Waitlist</span>
                <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{background: 'linear-gradient(90deg, #fff6, #fff0 60%)'}}></span>
              </button>
            </form>
          )}
        </div>
        {/* Features Section (carousel/slider, with relevant icons) */}
        <section className="w-full my-32 bg-white">
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold mb-20 text-center drop-shadow-sm">
            <span className="bg-gradient-to-br from-[#ff5a8a] to-[#ffb6b6] bg-clip-text text-transparent">Why</span> <span className="text-black">Kupid?</span>
          </h2>
          <div className="relative max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-full animate-fadein text-center flex flex-col items-center px-2 sm:px-8 py-10 sm:py-14 bg-white rounded-3xl shadow-md border border-gray-100">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-5">
                {features[featureIdx].icon}
              </div>
              <div className="font-extrabold text-xl xs:text-2xl sm:text-3xl mb-2 bg-gradient-to-br from-[#ff5a8a] to-[#ffb6b6] bg-clip-text text-transparent leading-tight max-w-xl mx-auto">
                {features[featureIdx].title}
              </div>
              <div className="text-gray-700 text-base sm:text-lg max-w-lg font-medium leading-relaxed mx-auto mb-2">
                {features[featureIdx].desc}
              </div>
            </div>
            <div className="flex gap-10 mt-10 items-center justify-center">
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-100 text-gray-400 hover:text-pink-500 text-xl shadow transition disabled:opacity-40"
                onClick={() => setFeatureIdx((featureIdx - 1 + features.length) % features.length)}
                aria-label="Previous Feature"
                disabled={features.length <= 1}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div className="flex gap-3">
                {features.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${i === featureIdx ? 'bg-pink-500 scale-125' : 'bg-gray-300'}`}
                    onClick={() => setFeatureIdx(i)}
                    aria-label={`Go to feature ${i + 1}`}
                  />
                ))}
              </div>
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-100 text-gray-400 hover:text-pink-500 text-xl shadow transition disabled:opacity-40"
                onClick={() => setFeatureIdx((featureIdx + 1) % features.length)}
                aria-label="Next Feature"
                disabled={features.length <= 1}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className="w-full mt-8 mb-4">
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold mb-8 mt-8 text-center drop-shadow-sm">
            <span className="bg-gradient-to-br from-[#ff5a8a] to-[#ffb6b6] bg-clip-text text-transparent">Loved</span> <span className="text-black">by students like you</span>
          </h2>
          <div className="flex flex-col gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-pink-200 overflow-hidden flex-shrink-0">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{t.name}</span>
                    <span className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, j) => (
                        <svg key={j} className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                      ))}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm">{t.text}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Sneak Peek Section (Swipeable Carousel) */}
        <section className="w-full flex flex-col items-center my-24 animate-fadein relative overflow-visible">
          {/* Animated background blob */}
          <div className="absolute -z-10 left-1/2 top-0 -translate-x-1/2 w-[420px] h-[320px] bg-gradient-to-br from-[#ffb6b6] via-[#ff5a8a] to-[#fff0f6] opacity-20 blur-3xl rounded-full" />
          <h2 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold mb-8 text-center drop-shadow-sm">
            <span className="bg-gradient-to-br from-[#ff5a8a] to-[#ffb6b6] bg-clip-text text-transparent">Sneak Peek</span> <span className="text-black">at Kupid</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto text-center">Get a preview of the app that's about to change college dating</p>
          
          <div className="relative max-w-xs mx-auto flex flex-col items-center">
            <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 transition-transform duration-300 hover:scale-105 cursor-pointer overflow-hidden">
              {showcaseItems[showcaseIdx].type === "video" ? (
                <video 
                  src={showcaseItems[showcaseIdx].src}
                  className="w-full h-auto object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img 
                  src={showcaseItems[showcaseIdx].src} 
                  alt={showcaseItems[showcaseIdx].alt} 
                  className="w-full h-auto object-contain" 
                />
              )}
            </div>
            
            <div className="text-center mt-4 mb-6">
              <h3 className="font-bold text-lg text-gray-900">{showcaseItems[showcaseIdx].title}</h3>
            </div>

            <div className="flex gap-10 items-center justify-center">
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-100 text-gray-400 hover:text-pink-500 text-xl shadow transition disabled:opacity-40"
                onClick={() => setShowcaseIdx((showcaseIdx - 1 + showcaseItems.length) % showcaseItems.length)}
                aria-label="Previous Preview"
                disabled={showcaseItems.length <= 1}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div className="flex gap-3">
                {showcaseItems.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${i === showcaseIdx ? 'bg-pink-500 scale-125' : 'bg-gray-300'}`}
                    onClick={() => setShowcaseIdx(i)}
                    aria-label={`Go to preview ${i + 1}`}
                  />
                ))}
              </div>
              <button
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-100 text-gray-400 hover:text-pink-500 text-xl shadow transition disabled:opacity-40"
                onClick={() => setShowcaseIdx((showcaseIdx + 1) % showcaseItems.length)}
                aria-label="Next Preview"
                disabled={showcaseItems.length <= 1}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </section>
        {/* Loved by X students animated counter bar */}
        <div className="w-full flex justify-center items-center py-8 animate-fadein">
          <div className="bg-white rounded-2xl shadow px-8 py-4 flex items-center gap-4 border border-gray-100">
            <img src="/kupid.png" alt="Kupid Logo" className="w-7 h-7 object-contain" />
            <span className="text-xl font-bold text-gray-900">Loved by</span>
            <span className="text-2xl font-extrabold bg-gradient-to-br from-[#ff5a8a] to-[#ffb6b6] bg-clip-text text-transparent tabular-nums">{studentCount.toLocaleString()}</span>
            <span className="text-xl font-bold text-gray-900">students</span>
          </div>
        </div>
        {/* Animated background blob between features and showcase */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[420px] h-[320px] bg-gradient-to-br from-[#ffb6b6] via-[#ff5a8a] to-[#fff0f6] opacity-15 blur-3xl rounded-full top-0" style={{zIndex: -1}} />
      </main>
      <footer className="relative z-10 mt-16 text-gray-400 text-xs xs:text-sm text-center pb-6 border-t border-gray-100 pt-6 bg-white/80 overflow-visible">
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 animate-float-heart pointer-events-none">
          <img src="/kupid.png" alt="Kupid Logo" className="w-12 h-12 object-contain" />
        </div>
        <div className="mb-2">&copy; {new Date().getFullYear()} Kupid Dating. All rights reserved.</div>
        <div className="flex justify-center gap-6 text-gray-500 text-sm mb-2">
          <a href="#" className="hover:text-pink-500 transition">Privacy</a>
          <a href="#" className="hover:text-pink-500 transition">Terms</a>
          <a href="https://instagram.com/kupiddating" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">Instagram</a>
          <a href="https://tiktok.com/@kupiddating" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">TikTok</a>
          <a href="https://linkedin.com/company/kupiddating" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">LinkedIn</a>
          <a href="https://youtube.com/@kupiddating" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">YouTube</a>
          <a href="https://linktr.ee/kupiddating" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition">Linktree</a>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://instagram.com/kupiddating" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-500 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.7"/><path d="M16.5 7.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/></svg>
          </a>
          <a href="https://linkedin.com/company/kupiddating" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-pink-500 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.7"/><path d="M7 10v4M7 7v.01M11 10v4m0-4v-1a2 2 0 1 1 4 0v1m0 0v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </a>
          <a href="https://tiktok.com/@kupiddating" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-pink-500 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M16.5 3v2.5A4.5 4.5 0 0 0 21 10v4.5A4.5 4.5 0 0 1 16.5 19H7.5A4.5 4.5 0 0 1 3 14.5V10A4.5 4.5 0 0 1 7.5 5.5H9V3" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7"/></svg>
          </a>
          <a href="https://youtube.com/@kupiddating" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-pink-500 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.7"/><path d="M9.5 9.5l5 2.5-5 2.5v-5z" stroke="currentColor" strokeWidth="1.7"/></svg>
          </a>
          <a href="https://linktr.ee/kupiddating" target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="hover:text-pink-500 transition">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </a>
        </div>
      </footer>
      {/* Confetti/heart animation on form submit */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {/* Simple floating hearts animation */}
          <div className="absolute w-full h-full overflow-hidden">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="absolute animate-heart-float" style={{left: `${Math.random()*100}%`, animationDelay: `${Math.random()*1.2}s`}}>
                <img src="/kupid.png" alt="Kupid Logo" className="w-8 h-8 object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Custom Animations */}
      <style>{`
        @media (max-width: 640px) {
          .xs\\:text-4xl { font-size: 2.25rem; }
          .xs\\:text-5xl { font-size: 3rem; }
          .xs\\:p-8 { padding: 2rem; }
          .xs\\:max-w-sm { max-width: 20rem; }
          .xs\\:text-lg { font-size: 1.125rem; }
          .xs\\:text-sm { font-size: 0.875rem; }
        }
        .animate-fadein { animation: fadein 1.1s cubic-bezier(.4,0,.2,1); }
        @keyframes fadein { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: translateY(0);} }
        .animate-shake { animation: shake 0.3s; }
        @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
        .animate-slideup { animation: slideup 1.1s cubic-bezier(.4,0,.2,1); }
        @keyframes slideup { from { opacity: 0; transform: translateY(60px);} to { opacity: 1; transform: translateY(0);} }
        .animate-heart-float { animation: heartfloat 1.5s cubic-bezier(.4,0,.2,1) forwards; }
        @keyframes heartfloat { 0% { opacity: 0; transform: translateY(0) scale(1);} 10% { opacity: 1;} 100% { opacity: 0; transform: translateY(-180px) scale(1.5);} }
        .animate-float-heart { animation: floatheart 3.5s infinite alternate cubic-bezier(.4,0,.2,1); }
        @keyframes floatheart { from { transform: translateY(0) scale(1);} to { transform: translateY(-24px) scale(1.12);} }
      `}</style>
    </div>
  );
}
