
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import ImageProcessor from '@/components/ImageProcessor';
import MatrixCalculator from '@/components/MatrixCalculator';
import AIChatbot from '@/components/AIChatbot';
import ThemeToggle from '@/components/ThemeToggle';
import { Calculator, Image, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1" />
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 floating-animation">
                Matrix<span className="text-yellow-300">Lab</span>
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Advanced Image Processing & Matrix Computation Platform
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <ThemeToggle />
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 glass-effect">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image Processing
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Matrix Calculator
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-6">
              <ImageProcessor />
            </TabsContent>

            <TabsContent value="calculator" className="space-y-6">
              <MatrixCalculator />
            </TabsContent>
          </Tabs>
        </motion.main>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-effect rounded-lg p-6 text-center">
            <Image className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Image to Matrix</h3>
            <p className="text-white/70 text-sm">
              Convert images to matrix representations and apply transformations
            </p>
          </div>
          
          <div className="glass-effect rounded-lg p-6 text-center">
            <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Matrix Operations</h3>
            <p className="text-white/70 text-sm">
              Perform complex matrix calculations including RREF and determinants
            </p>
          </div>
          
          <div className="glass-effect rounded-lg p-6 text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
            <p className="text-white/70 text-sm">
              Get help with matrix concepts and step-by-step explanations
            </p>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-white/60 text-sm">
            Built with React, Tailwind CSS, and Framer Motion
          </p>
        </motion.footer>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;
