import { useState } from 'react';

const VerificationForm = ({ onVerificationComplete }) => {
  const [step, setStep] = useState(1); // 1: initial, 2: verification, 3: success
  const [form, setForm] = useState({ name: "", phone: "", countryCode: "+1" });
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCountryCodeChange = (e) => {
    setForm({ ...form, countryCode: e.target.value });
    setError("");
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendVerificationCode = async () => {
    if (!form.name || !form.phone) {
      setError("Please fill in both fields.");
      return;
    }
    
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15) {
      setError("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new URLSearchParams();
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwyLh7TVsCWNG8cy7gYAZnnXWJ3zv-L7-2GD47LWQNg7OuRKHwxMGwys4L0uFliKNEQ/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'send_code',
          name: form.name.trim(),
          phone: `${form.countryCode} ${form.phone}`.trim()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setStep(2);
        startCountdown();
      } else {
        setError(data.message || 'Failed to send verification code.');
      }
    } catch (err) {
      console.error('Error sending code:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwyLh7TVsCWNG8cy7gYAZnnXWJ3zv-L7-2GD47LWQNg7OuRKHwxMGwys4L0uFliKNEQ/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'verify_code',
          phone: `${form.countryCode} ${form.phone}`.trim(),
          code: verificationCode.trim()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Now submit to waitlist
        await submitToWaitlist();
      } else {
        setError(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitToWaitlist = async () => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwyLh7TVsCWNG8cy7gYAZnnXWJ3zv-L7-2GD47LWQNg7OuRKHwxMGwys4L0uFliKNEQ/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'submit_waitlist',
          name: form.name.trim(),
          phone: `${form.countryCode} ${form.phone}`.trim(),
          timestamp: new Date().toISOString(),
          submission_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        })
      });

      const data = await response.json();
      
      if (data.result === 'success') {
        setStep(3);
        onVerificationComplete();
      } else {
        setError(data.message || 'Failed to join waitlist.');
      }
    } catch (err) {
      console.error('Error submitting to waitlist:', err);
      setError('Network error. Please try again.');
    }
  };

  const resendCode = () => {
    if (countdown > 0) return;
    sendVerificationCode();
  };

  if (step === 3) {
    return (
      <div className="text-center animate-fadein">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-green-600 mb-2">Verified & Added!</h2>
        <p className="text-gray-700">Your phone number is verified and you're on the waitlist! 💌</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {step === 1 ? (
        // Step 1: Initial form
        <>
          <input
            className={`px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-lg bg-white placeholder-gray-400 shadow-sm transition-all duration-300 focus:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
            disabled={isLoading}
          />
          <div className="flex gap-2 items-stretch">
            <select
              className={`flex-shrink-0 w-28 px-2 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-sm bg-white shadow-sm transition-all duration-300 focus:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              name="countryCode"
              value={form.countryCode}
              onChange={handleCountryCodeChange}
              disabled={isLoading}
            >
              {countryCodes.map((code) => (
                <option key={code.code} value={code.code}>
                  {code.flag} {code.code}
                </option>
              ))}
            </select>
            <input
              className={`flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-lg bg-white placeholder-gray-400 shadow-sm transition-all duration-300 focus:scale-105 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              autoComplete="off"
              inputMode="tel"
              pattern="[0-9\-\+\s\(\)]*"
              disabled={isLoading}
            />
          </div>
          <div className="text-xs text-gray-500 mb-1">We'll send a verification code to your phone number.</div>
          {error && <div className="text-red-500 text-sm animate-shake">{error}</div>}
          <button
            type="button"
            onClick={sendVerificationCode}
            disabled={isLoading}
            className={`relative text-white font-extrabold py-4 px-8 rounded-2xl text-xl shadow-xl mt-2 focus:ring-2 focus:ring-pink-400 transition-all duration-300 overflow-hidden group ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-br from-[#ff5a8a] via-[#ff7fa8] to-[#ffb6b6] active:scale-95 hover:scale-105'
            }`}
            style={!isLoading ? {boxShadow: '0 4px 32px 0 #ff5a8a55'} : {}}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Verification Code'
              )}
            </span>
            {!isLoading && (
              <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{background: 'linear-gradient(90deg, #fff6, #fff0 60%)'}}></span>
            )}
          </button>
        </>
      ) : (
        // Step 2: Verification code
        <>
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Verification Code</h3>
            <p className="text-gray-600">We sent a 6-digit code to {form.countryCode} {form.phone}</p>
          </div>
          <input
            className={`px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none text-lg bg-white placeholder-gray-400 shadow-sm transition-all duration-300 focus:scale-105 text-center tracking-widest ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              setError("");
            }}
            autoComplete="off"
            inputMode="numeric"
            maxLength={6}
            disabled={isLoading}
          />
          {error && <div className="text-red-500 text-sm animate-shake">{error}</div>}
          <button
            type="button"
            onClick={verifyCode}
            disabled={isLoading}
            className={`relative text-white font-extrabold py-4 px-8 rounded-2xl text-xl shadow-xl mt-2 focus:ring-2 focus:ring-pink-400 transition-all duration-300 overflow-hidden group ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-br from-[#ff5a8a] via-[#ff7fa8] to-[#ffb6b6] active:scale-95 hover:scale-105'
            }`}
            style={!isLoading ? {boxShadow: '0 4px 32px 0 #ff5a8a55'} : {}}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify & Join Waitlist'
              )}
            </span>
            {!isLoading && (
              <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{background: 'linear-gradient(90deg, #fff6, #fff0 60%)'}}></span>
            )}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={resendCode}
              disabled={countdown > 0}
              className={`text-sm ${countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-pink-600 hover:text-pink-700'}`}
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerificationForm; 