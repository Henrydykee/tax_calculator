import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { TaxResult, formatCurrency, generateInsight } from '../utils/taxCalculator';
import { TaxChart } from './TaxChart';
import { generatePDF } from '../utils/pdfGenerator';

interface TaxResultsProps {
  result: TaxResult;
  onBack: () => void;
}

export const TaxResults = ({ result, onBack }: TaxResultsProps) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const insight = generateInsight(result);

  const handleDownloadPDF = () => {
    generatePDF(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <motion.button
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-8 flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors font-semibold"
      >
        <ArrowLeft size={20} />
        Calculate Again
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mb-6 border-4 border-primary-200 dark:border-primary-800"
      >
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary-600 via-accent-600 to-success-600 bg-clip-text text-transparent">Your Tax Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            label="Annual Income"
            value={formatCurrency(result.annualIncome)}
            delay={0.3}
          />
          <StatCard
            label="Total Annual Tax"
            value={formatCurrency(result.totalTax)}
            delay={0.4}
            highlight
          />
          <StatCard
            label="Monthly Tax"
            value={formatCurrency(result.monthlyTax)}
            delay={0.5}
            highlight
          />
          <StatCard
            label="Monthly Take-Home"
            value={formatCurrency(result.takeHomePay)}
            delay={0.6}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-primary-600 dark:text-primary-400 mb-1 font-semibold">
            Effective Tax Rate
          </p>
          <p className="text-4xl font-bold bg-gradient-to-r from-accent-600 to-success-600 bg-clip-text text-transparent">
            {result.effectiveRate.toFixed(1)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-primary-100 via-accent-100 to-success-100 dark:from-primary-900/40 dark:via-accent-900/40 dark:to-success-900/40 rounded-xl p-6 mb-6 border-2 border-primary-200 dark:border-primary-700"
        >
          <p className="text-lg text-center font-semibold text-gray-800 dark:text-gray-100">{insight}</p>
        </motion.div>

        <div className="mb-6">
          <TaxChart breakdown={result.breakdown} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors py-3 border-t-2 border-primary-200 dark:border-primary-700 font-semibold"
          >
            {showBreakdown ? 'Hide' : 'See'} How It's Calculated
            {showBreakdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 space-y-3">
                  {result.breakdown.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-primary-50 via-accent-50 to-success-50 dark:from-primary-900/20 dark:via-accent-900/20 dark:to-success-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
                    >
                      <div>
                        <p className="font-semibold">{item.bracket}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {formatCurrency(item.taxableAmount)} × {(item.rate * 100).toFixed(0)}%
                        </p>
                      </div>
                      <p className="font-bold text-lg">{formatCurrency(item.tax)}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          onClick={handleDownloadPDF}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="w-full mt-6 bg-gradient-to-r from-primary-500 via-accent-500 to-success-500 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-primary-600 hover:via-accent-600 hover:to-success-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          <Download size={24} />
          Download PDF Summary
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  delay: number;
  highlight?: boolean;
}

const StatCard = ({ label, value, delay, highlight }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={`p-6 rounded-xl ${
        highlight
          ? 'bg-gradient-to-br from-primary-500 via-accent-500 to-success-500 text-white shadow-lg'
          : 'bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 border-2 border-primary-200 dark:border-primary-700'
      }`}
    >
      <p className={`text-sm mb-2 font-semibold ${highlight ? 'text-white/90' : 'text-primary-700 dark:text-primary-300'}`}>
        {label}
      </p>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
};
