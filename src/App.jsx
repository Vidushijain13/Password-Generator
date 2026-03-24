import React, { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  RefreshCcw,
  Trash2,
  ShieldCheck,
} from "lucide-react";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+[]{}|;:,.<>?/~`-=";

const App = () => {
  const [length, setLength] = useState(12);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [number, setNumber] = useState(true);
  const [symbol, setSymbol] = useState(true);

  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  const selectedSets = useMemo(() => {
    const sets = [];
    if (upper) sets.push(UPPERCASE);
    if (lower) sets.push(LOWERCASE);
    if (number) sets.push(NUMBERS);
    if (symbol) sets.push(SYMBOLS);
    return sets;
  }, [upper, lower, number, symbol]);

  const getRandomChar = (chars) => {
    return chars[Math.floor(Math.random() * chars.length)];
  };

  const shuffleString = (str) => {
    const arr = str.split("");
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
  };

  const calculateStrength = (pwd) => {
    let score = 0;

    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Moderate";
    return "Strong";
  };

  const strength = calculateStrength(password);

  const generatePassword = () => {
    if (selectedSets.length === 0) {
      setPassword("");
      return;
    }

    let generated = "";

    // Ensure at least one character from each selected type
    selectedSets.forEach((set) => {
      generated += getRandomChar(set);
    });

    const allChars = selectedSets.join("");

    for (let i = generated.length; i < length; i++) {
      generated += getRandomChar(allChars);
    }

    generated = shuffleString(generated);

    setPassword(generated);
    setHistory((prev) => [generated, ...prev.slice(0, 4)]);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const clearAll = () => {
    setPassword("");
    setHistory([]);
    setCopied(false);
  };

  const strengthColor =
    strength === "Weak"
      ? "text-red-400"
      : strength === "Moderate"
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center px-3 py-8">
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 border border-yellow-400 bg-[#091734]">
        <h1 className="text-center text-3xl md:text-5xl font-bold mb-8 text-yellow-300">
          Password Generator
        </h1>

        <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-xl border border-yellow-300">
          <input
            type={visible ? "text" : "password"}
            readOnly
            value={password}
            placeholder="Generate a password"
            className="flex-1 outline-none bg-transparent text-lg md:text-2xl text-yellow-100 font-semibold"
          />

          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="text-white hover:text-yellow-300 transition"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>

          <button
            type="button"
            onClick={copyToClipboard}
            className="text-white hover:text-yellow-300 transition"
            aria-label="Copy password"
          >
            {copied ? <Check size={22} /> : <Copy size={22} />}
          </button>
        </div>

        {copied && (
          <p className="text-green-400 text-sm mt-2 font-medium">
            Password copied to clipboard
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-yellow-300 text-sm md:text-base font-semibold">
            Strength: <span className={strengthColor}>{strength}</span>
          </p>

          <div className="flex items-center gap-2 text-yellow-300 text-sm">
            <ShieldCheck size={16} />
            <span>{password.length ? `${password.length} chars` : "No password"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-8 text-yellow-100">
          <label className="flex items-center text-lg gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={upper}
              onChange={() => setUpper(!upper)}
            />
            Uppercase
          </label>

          <label className="flex items-center text-lg gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lower}
              onChange={() => setLower(!lower)}
            />
            Lowercase
          </label>

          <label className="flex items-center text-lg gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={number}
              onChange={() => setNumber(!number)}
            />
            Number
          </label>

          <label className="flex items-center text-lg gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={symbol}
              onChange={() => setSymbol(!symbol)}
            />
            Symbol
          </label>
        </div>

        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-yellow-300">Password Length</label>
            <span className="text-yellow-100 font-semibold">{length}</span>
          </div>

          <input
            type="range"
            min={4}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-yellow-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
          <button
            onClick={generatePassword}
            className="md:col-span-2 bg-blue-500 py-3 rounded-xl font-bold text-white shadow-md hover:bg-blue-600 transition text-lg"
          >
            Generate Password
          </button>

          <button
            onClick={generatePassword}
            className="flex items-center justify-center gap-2 bg-indigo-500 py-3 rounded-xl font-bold text-white shadow-md hover:bg-indigo-600 transition text-lg"
          >
            <RefreshCcw size={18} />
            Regenerate
          </button>
        </div>

        <button
          onClick={clearAll}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-red-500 py-3 rounded-xl font-bold text-white shadow-md hover:bg-red-600 transition text-lg"
        >
          <Trash2 size={18} />
          Clear
        </button>

        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-yellow-300 text-lg md:text-xl font-semibold mb-3">
              Recent Passwords
            </h2>

            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-yellow-100 break-all"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
