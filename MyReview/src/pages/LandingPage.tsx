'use client';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { motion } from 'framer-motion';
import Header from './comps/Header';
import Footer from './comps/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-slate-900">
      <Header />
      <main className="flex-grow flex flex-col justify-between pt-16">
        <section className="container mx-auto px-6 md:px-8 lg:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Trust in Reviews,
                <span className="text-blue-600 dark:text-blue-400">
                  {' '}
                  Verified by Zero-Knowledge
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Experience a new era of authentic reviews. Our platform uses
                zero-knowledge proofs to ensure every review is from a verified
                customer while maintaining complete privacy.
              </p>
              <div className="flex gap-4">
                <Button size="lg">Get Started</Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative">
              <Card className="p-6 shadow-lg">
                <div className="aspect-video bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg"></div>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="bg-slate-50 dark:bg-slate-800/50 py-16 mt-auto">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Visit & Scan',
                  description:
                    'Visit a restaurant and scan the QR code provided after your meal.',
                },
                {
                  title: 'Generate Proof',
                  description:
                    'Create a zero-knowledge proof of your visit without revealing personal details.',
                },
                {
                  title: 'Share Review',
                  description:
                    'Submit your verified review that others can trust.',
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
