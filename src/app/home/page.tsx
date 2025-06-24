'use client';

import Link from "next/link";
import { FiCalendar, FiShoppingCart, FiShield, FiUser, FiPackage, FiClipboard } from "react-icons/fi";
import { FaPaw, FaDog, FaCat, FaClinicMedical } from "react-icons/fa";
import Image from "next/image";
import HomePhoto from "@/assets/Home.webp";
import HomePhoto2 from "@/assets/Home2.jpg";
import { motion } from "framer-motion";
import { getWishList } from "@/store/Features/wishlist";
import { fetchUserData } from "@/store/Features/profile.slice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/store.hook";
import Loading from "@/Components/Loading/loading";

// Animation variants
const fadeIn = (direction: 'up' | 'down' | 'left' | 'right', delay: number = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
    x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.8,
      delay,
      ease: 'easeOut',
    },
  },
});

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};


const PetOwnerHome = () => (
   <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Gradient Background */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 md:order-1"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={staggerContainer}
            >
              <motion.div 
                variants={fadeIn('right', 0.1)}
                className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6"
              >
                <FaPaw className="text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Trusted by pet owners worldwide</span>
              </motion.div>
              <motion.h1 
                variants={fadeIn('right', 0.2)}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              >
                Complete <span className="text-emerald-600">Pet Wellness</span> in One Platform
              </motion.h1>
              <motion.p 
                variants={fadeIn('right', 0.3)}
                className="text-lg text-gray-700 mb-8 max-w-lg"
              >
                Your all-in-one solution for pet health records, vet appointments, and premium supplies. 
                Designed by veterinarians, loved by pets.
              </motion.p>
              <motion.div 
                variants={fadeIn('right', 0.4)}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/pets/health"
                  className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <FiShield className="text-xl" /> 
                  <span>Create Pet Profile</span>
                </Link>
                <Link
                  href="/clinics/view"
                  className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <FiCalendar className="text-xl" />
                  <span>Find a Vet</span>
                </Link>
              </motion.div>
              
              <motion.div 
                variants={fadeIn('right', 0.5)}
                className="mt-10 flex items-center gap-4"
              >
                <div className="flex -space-x-2">
                  {[
                    "https://randomuser.me/api/portraits/women/32.jpg",
                    "https://randomuser.me/api/portraits/men/54.jpg",
                    "https://randomuser.me/api/portraits/women/67.jpg",
                    "https://randomuser.me/api/portraits/men/28.jpg"
                  ].map((image, index) => (
                    <div key={index} className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-emerald-100 shadow-sm">
                      <Image 
                        src={image}
                        alt={`Pet owner ${index + 1}`}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">4.9/5 from 10,000+ pet owners</p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="order-1 md:order-2 relative h-80 md:h-[32rem] rounded-2xl overflow-hidden shadow-2xl border-8 border-white"
            >
              <Image
                src={HomePhoto}
                alt="Happy pet with veterinarian"
                fill
                className="object-cover"
                priority
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FaClinicMedical className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Available now</p>
                    <p className="font-medium text-gray-900">500+ Certified Vets</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerContainer}
          >
            {[
              { icon: <FaDog className="text-3xl mx-auto text-emerald-600" />, text: "Dog Specialists" },
              { icon: <FaCat className="text-3xl mx-auto text-emerald-600" />, text: "Cat Specialists" },
              { icon: <FiClipboard className="text-3xl mx-auto text-emerald-600" />, text: "Medical Records" },
              { icon: <FiPackage className="text-3xl mx-auto text-emerald-600" />, text: "Fast Delivery" },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn('up', index * 0.1)}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <p className="mt-2 font-medium text-gray-700">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Core Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Pet Needs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From health care to premium products, we&apos;ve got you covered
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerContainer}
          >
            {/* Pet ID Card */}
            <motion.div 
              variants={fadeIn('up', 0.1)}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-300 transition-all shadow-sm hover:shadow-lg group"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-all">
                <FiShield className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Digital Pet ID
              </h3>
              <p className="text-gray-600 mb-6">
                Create a secure digital profile with complete medical history, vaccination records, and emergency contacts.
              </p>
              <Link
                href="/pets"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-all group-hover:gap-3"
              >
                <span>Get Started</span>
                <svg className="w-4 h-4 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Vet Appointments */}
            <motion.div 
              variants={fadeIn('up', 0.2)}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-300 transition-all shadow-sm hover:shadow-lg group"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-all">
                <FiCalendar className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Vet Appointments
              </h3>
              <p className="text-gray-600 mb-6">
                Book consultations with certified veterinarians for check-ups, emergencies, or specialized care.
              </p>
              <Link
                href="/clinics/view"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-all group-hover:gap-3"
              >
                <span>Find Clinics</span>
                <svg className="w-4 h-4 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>

            {/* E-commerce */}
            <motion.div 
              variants={fadeIn('up', 0.3)}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-emerald-300 transition-all shadow-sm hover:shadow-lg group"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-100 transition-all">
                <FiShoppingCart className="text-emerald-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Premium Supplies
              </h3>
              <p className="text-gray-600 mb-6">
                Vet-approved food, medications, toys, and accessories delivered to your doorstep.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-all group-hover:gap-3"
              >
                <span>Browse Shop</span>
                <svg className="w-4 h-4 transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Unified Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-80 md:h-[28rem] rounded-2xl overflow-hidden shadow-xl border-8 border-white"
            >
              <Image
                src={HomePhoto2}
                alt="Happy pet owner"
                fill
                className="object-cover"
              />
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                viewport={{ once: true }}
                className="absolute -bottom-0 -right-0 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg"
              >
                <p className="font-bold">Emergency Support</p>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={fadeIn('left', 0.1)}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
              >
                The Most Complete Pet Care Platform
              </motion.h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <FiUser className="text-emerald-600 text-xl" />,
                    title: "Personalized Care Plans",
                    description: "Custom health plans tailored to your pet's breed, age, and medical history."
                  },
                  {
                    icon: <FiClipboard className="text-emerald-600 text-xl" />,
                    title: "Centralized Health Records",
                    description: "All medical documents in one secure place, accessible anytime."
                  },
                  {
                    icon: <FiCalendar className="text-emerald-600 text-xl" />,
                    title: "Smart Reminders",
                    description: "Never miss a vaccination, medication, or vet appointment again."
                  },
                  {
                    icon: <FiPackage className="text-emerald-600 text-xl" />,
                    title: "Auto-Replenishment",
                    description: "Automatic delivery of food and medications based on your pet's needs."
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    variants={fadeIn('left', 0.1 + index * 0.1)}
                    className="flex gap-4"
                    whileHover={{ x: 10 }}
                  >
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center"
                    >
                      {feature.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Pet Owners Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Trusted by pet lovers around the world
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerContainer}
          >
            {[
              {
                quote: "Managing my three dogs' health has never been easier. The vaccination reminders alone are worth it!",
                name: "Sarah J.",
                role: "Dog Mom",
                image: "https://randomuser.me/api/portraits/women/23.jpg"
              },
              {
                quote: "The vet booking saved us during an emergency. We got an appointment within 30 minutes!",
                name: "Michael T.",
                role: "Cat Owner",
                image: "https://randomuser.me/api/portraits/men/42.jpg"
              },
              {
                quote: "Premium products at great prices with auto-delivery. My parrot has never been healthier!",
                name: "Emma L.",
                role: "Bird Enthusiast",
                image: "https://randomuser.me/api/portraits/women/56.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn('up', index * 0.1)}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image 
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Give Your Pet the Best Care?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg mb-10 max-w-2xl mx-auto"
          >
            Join thousands of pet owners who trust us with their furry family members.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/clinics/view"
                className="flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaClinicMedical /> 
                <span>Find a Vet Near You</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
);

const DoctorHome = () => (
  <div className="min-h-screen bg-white overflow-x-hidden">
    {/* Hero Section */}
    <section className="bg-gradient-to-r from-green-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <FaClinicMedical className="text-green-600" />
              <span className="text-sm font-medium text-gray-700">Professional Veterinary Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Welcome, <span className="text-green-600">Doctor</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Manage your clinic, appointments, and provide the best care for your patients.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                <FiCalendar className="text-xl" /> 
                <span>Appointments</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
              >
                <FiUser className="text-xl" />
                <span>My Profile</span>
              </Link>
            </div>
          </div>
          <div className="relative h-80 md:h-[32rem] rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <Image
              src={HomePhoto}
              alt="Veterinary doctor"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>

    {/* Quick Actions Section */}
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/clinics/view"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-center"
          >
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FaClinicMedical className="text-green-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-900">Clinics</h3>
            <p className="text-sm text-gray-500 mt-1">View clinics</p>
          </Link>

          <Link 
            href="/dashboard"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-center"
          >
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiUser className="text-green-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-900">Profile</h3>
            <p className="text-sm text-gray-500 mt-1">Manage profile</p>
          </Link>

          <Link 
            href="/shop"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-center"
          >
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiShoppingCart className="text-green-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-900">Shop</h3>
            <p className="text-sm text-gray-500 mt-1">Medical supplies</p>
          </Link>

          <Link 
            href="/orders"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-center"
          >
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-green-600 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-900">Orders</h3>
            <p className="text-sm text-gray-500 mt-1">View orders</p>
          </Link>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Doctor Dashboard Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-300 transition-all shadow-sm hover:shadow-lg">
            <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mb-6">
              <FiCalendar className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Appointments
            </h3>
            <p className="text-gray-600 mb-6">
              Manage your schedule and upcoming appointments with pet owners.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700"
            >
              <span>View Appointments</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-300 transition-all shadow-sm hover:shadow-lg">
            <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mb-6">
              <FiClipboard className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Medical Records
            </h3>
            <p className="text-gray-600 mb-6">
              Access and update patient medical records and treatment history.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700"
            >
              <span>View Records</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-300 transition-all shadow-sm hover:shadow-lg">
            <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mb-6">
              <FaClinicMedical className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              My Clinic
            </h3>
            <p className="text-gray-600 mb-6">
              Manage your clinic profile, services, and working hours.
            </p>
            <Link
              href="/clinics/view/myclinic"
              className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700"
            >
              <span>Clinic Settings</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default function Home() {
  const dispatch = useAppDispatch();
  const [isClient, setIsClient] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    dispatch(getWishList());
    dispatch(fetchUserData());
  }, [dispatch]);

  if (!isClient) {
    return <Loading />;
  }

  return (
    <>
      {userRole === "0" ? (
        <PetOwnerHome />
      ) : userRole === "1" ? (
        <DoctorHome />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p>Unauthorized access</p>
        </div>
      )}
    </>
  );
}