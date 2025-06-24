"use client";
import { motion, useIsPresent } from "framer-motion";
import Link from "next/link";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import Image from "next/image";
import BitaryLogo from "@/assets/BitaryText.svg";
import { useEffect, useState } from "react";

const EmptyWishlist = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isPresent = useIsPresent();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const generateInitialPositions = () => {
    const positions = [];
    for (let i = 0; i < 12; i++) {
      positions.push({
        left: 5 + Math.random() * 90,
        top: Math.random() * 100
      });
    }
    return positions;
  };

  const [initialPositions] = useState(generateInitialPositions());

  const heartVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        ease: "backOut"
      }
    })
  };

  const floatingHeartVariants = {
    animate: (i: number) => ({
      y: [0, -80 - i * 10],
      x: [0, Math.random() * 40 - 20],
      opacity: [0.3, 0],
      rotate: [0, 180 + i * 30],
      transition: {
        duration: 12 + Math.random() * 10,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear"
      }
    })
  };


  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-gradient-to-br from-gray-50 via-white to-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Bitary Branding */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8"
      >
        <Image 
          src={BitaryLogo} 
          alt="Bitary Logo" 
          width={180} 
          height={60}
          className="h-12 w-auto"
          priority
        />
      </motion.div>

      {/* Animated Heart */}
      <motion.div
        className="relative mb-10"
        variants={heartVariants}
        animate={["pulse", "float"]}
      >
        <motion.div
          className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <FaHeart className="text-8xl text-green-500 relative z-10" />
      </motion.div>

      {/* Animated Title */}
      <motion.h1 
        className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 mb-6 text-center"
        initial="hidden"
        animate="visible"
      >
        {"Your Bitary Wishlist".split("").map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            custom={index}
            variants={textVariants}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Description */}
      <motion.p 
        className="text-lg text-gray-600 max-w-md text-center mb-10 px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Your collection of favorites is empty. Discover Bitary{"'"}s exceptional products!
      </motion.p>

      {/* Shopping Button */}
      <Link href="/shop" passHref>
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 8px 20px -6px rgba(79, 174, 75, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 text-lg font-semibold shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <FaShoppingBag className="text-xl" />
          Explore Bitary Shop
        </motion.button>
      </Link>

      {/* Floating Hearts Background */}
      {isMounted && isPresent && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {initialPositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute text-gray-200 text-3xl md:text-4xl"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              custom={i}
              variants={floatingHeartVariants}
              animate="animate"
            >
              <FaHeart />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyWishlist;