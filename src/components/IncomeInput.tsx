import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

interface IncomeInputProps {
  onCalculate: (monthlyIncome: number) => void;
}

export const IncomeInput = ({ onCalculate }: IncomeInputProps) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const formatInputValue = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';

    return new Intl.NumberFormat('en-NG').format(parseInt(numericValue));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputValue(e.target.value);
    setInput(formatted);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseInt(input.replace(/,/g, ''));

    if (!numericValue || numericValue <= 0) {
      setError('Please enter a valid monthly income');
      return;
    }

    onCalculate(numericValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
        >
          Calculate Your 2026 Nigerian Tax
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-gray-600 dark:text-gray-400"
        >
          Understand your money. Own your future.
        </motion.p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="relative">
          <label
            htmlFor="income"
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            Monthly Income
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-500 dark:text-gray-400">
              ₦
            </span>
            <input
              type="text"
              id="income"
              value={input}
              onChange={handleInputChange}
              placeholder="1,500,000"
              className="w-full pl-12 pr-4 py-4 text-2xl font-semibold bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-black dark:focus:border-white focus:outline-none transition-all duration-300"
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 shadow-lg"
        >
          <Calculator size={24} />
          Calculate Tax
        </motion.button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Based on 2026 Nigeria tax brackets. Results are estimates for educational purposes.
        </p>
      </motion.div>
    </motion.div>
  );
};
