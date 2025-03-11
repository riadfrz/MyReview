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

        {/* Potential Clients Section */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-6 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Trusted by Leading Platforms
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Join these major platforms in revolutionizing the restaurant
                review ecosystem with verified, authentic feedback.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center mb-16 max-w-4xl mx-auto">
              {[
                {
                  name: 'Amazon',
                  useImage: true,
                  imageUrl:
                    'https://companieslogo.com/img/orig/AMZN-e9f942e4.png?t=1740113564',
                  icon: '',
                },
                {
                  name: 'Google',
                  useImage: false,
                  imageUrl: '',
                  icon: 'M12.3 10v4h5.6c-.2 1.4-1.6 4.2-5.6 4.2-3.4 0-6.1-2.8-6.1-6.2s2.7-6.2 6.1-6.2c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17.1 2.7 14.9 2 12.3 2c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12.3V10z',
                },
                {
                  name: 'Restaurants',
                  useImage: false,
                  imageUrl: '',
                  icon: 'M16 6c-1.7 0-3 1.3-3 3 0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.7-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM8 6c-1.7 0-3 1.3-3 3 0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.7-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM12 12c-2.2 0-4 1.8-4 4v2h8v-2c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2z',
                },
              ].map((client, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="w-full flex flex-col items-center justify-center">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg w-full h-32 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 p-6">
                    {client.useImage ? (
                      <img
                        src={client.imageUrl}
                        alt={`${client.name} logo`}
                        className="h-16 w-auto mb-3 object-contain"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-12 h-12 mb-3 text-blue-600 dark:text-blue-400 fill-current">
                        <path d={client.icon} />
                      </svg>
                    )}
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      {client.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    stat: '98%',
                    label: 'Customer Trust Increase',
                    description:
                      'Restaurants report increased customer trust in their online presence',
                  },
                  {
                    stat: '2.4x',
                    label: 'More Engagement',
                    description:
                      'Higher engagement with verified reviews compared to traditional platforms',
                  },
                  {
                    stat: '5,000+',
                    label: 'Restaurants',
                    description:
                      'Potential restaurant partners ready to adopt verified reviews',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-sm">
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {item.stat}
                    </p>
                    <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
                      {item.label}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
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
