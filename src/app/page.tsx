'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MainPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Use a slight delay to ensure the loading state is shown
    // This helps prevent the brief error flash
    const timer = setTimeout(() => {
      // Check if user is logged in by looking for token in localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        // User is logged in, redirect to home page
        router.push('/home');
      } else {
        // User is not logged in, redirect to welcome page
        router.push('/welcome');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  // Return a simple loading state while redirecting
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="text-7xl mb-6"
      >
        🐾
      </motion.div>
      <h2 className="text-2xl font-bold text-green-700 mb-2">Bitary</h2>
      <p className="text-gray-600">Redirecting you...</p>
    </div>
  );
}
