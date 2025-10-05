// src/context/ThemeContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';

// ১. Context তৈরি করুন
const ThemeContext = createContext();

// ২. Provider কম্পোনেন্ট তৈরি করুন
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // localStorage থেকে থিম লোড করুন, না থাকলে 'light' ডিফল্ট
    return localStorage.getItem('theme') || 'light';
  });

  // থিম পরিবর্তন করার ফাংশন
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // localStorage এ সেভ করুন
  };

  // থিম অনুযায়ী <html> ট্যাগে ক্লাস যোগ/অপসারণ করুন
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ৩. Context ব্যবহার করার জন্য একটি Custom Hook তৈরি করুন
export const useTheme = () => {
  return useContext(ThemeContext);
};

/* 
// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'; // <-- ইমপোর্ট করুন

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> {/* <-- App কে Wrap করুন */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
*/

/* 
// src/components/ThemeToggle.jsx

import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi'; // react-icons থেকে আইকন ইমপোর্ট

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <FiMoon className="w-5 h-5" />
      ) : (
        <FiSun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle; */

/* 
// src/App.jsx

import ThemeToggle from './components/ThemeToggle'; // টগল বাটন ইমপোর্ট করুন

function App() {
  return (
    // মূল কন্টেইনারে light এবং dark মোডের জন্য ব্যাকগ্রাউন্ড এবং টেক্সট কালার দিন
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold">MM Fashion World</h1>
        <ThemeToggle />
      </header>

      <main className="p-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">ডার্ক মোড ডেমো</h2>
          <p>
            উপরের বাটনে ক্লিক করে লাইট এবং ডার্ক থিমের মধ্যে সুইচ করুন।
            আপনার পছন্দটি সেভ করা হবে এবং পরবর্তীতে যখন আপনি সাইটে আসবেন তখনও তা প্রয়োগ করা থাকবে।
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
*/