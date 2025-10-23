import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { IncomeInput } from './components/IncomeInput';
import { TaxResults } from './components/TaxResults';
import { calculateTax, TaxResult } from './utils/taxCalculator';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [result, setResult] = useState<TaxResult | null>(null);

  const handleCalculate = (monthlyIncome: number) => {
    const taxResult = calculateTax(monthlyIncome);
    setResult(taxResult);
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D] transition-colors duration-500">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0D0D0D]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-2xl"
            >
              ₦
            </motion.div>
            <h1 className="text-2xl font-bold">TaxWise NG</h1>
          </motion.div>

          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={24} className="text-gray-700" />
            ) : (
              <Sun size={24} className="text-gray-300" />
            )}
          </motion.button>
        </div>
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!result ? (
              <IncomeInput key="input" onCalculate={handleCalculate} />
            ) : (
              <TaxResults key="results" result={result} onBack={handleBack} />
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0D0D0D]/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Built with dedication in Lagos by TaxWise NG | v1.0.0
          </motion.p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
