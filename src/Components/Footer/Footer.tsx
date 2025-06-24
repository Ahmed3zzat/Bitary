"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { useAppSelector } from "@/hooks/store.hook";

export default function Footer() {
  const token = useAppSelector((state) => state.userSlice.token);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole");
      setUserRole(role);
    }
  }, [token]);

  // Don't render footer for non-logged-in users
  if (!token || !mounted) {
    return null;
  }

  // Role-specific links
  const getPetOwnerLinks = () => ({
    account: [
      { name: "Profile", href: "/profile" },
      { name: "My Pets", href: "/pets" },
      { name: "My Orders", href: "/orders" },
      { name: "My Reviews", href: "/reviews" },
    ],
    shop: [
      { name: "Browse Products", href: "/shop" },
      { name: "Shopping Cart", href: "/cart" },
      { name: "Wishlist", href: "/wishlist" },
    ],
    services: [
      { name: "Find Clinics", href: "/clinics/view" },
      { name: "Pet Care", href: "/pets" },
      { name: "Home", href: "/home" },
    ],
  });

  const getDoctorLinks = () => ({
    professional: [
      { name: "Doctor Dashboard", href: "/dashboard" },
      { name: "My Clinics", href: "/clinics/view/myclinic" },
      { name: "Add Clinic", href: "/clinics/add" },
      { name: "Profile", href: "/profile" },
    ],
    services: [
      { name: "Find Clinics", href: "/clinics/view" },
      { name: "Browse Products", href: "/shop" },
      { name: "Home", href: "/home" },
    ],
    account: [
      { name: "My Orders", href: "/orders" },
      { name: "My Reviews", href: "/reviews" },
      { name: "Shopping Cart", href: "/cart" },
      { name: "Wishlist", href: "/wishlist" },
    ],
  });

  const links = userRole === "1" ? getDoctorLinks() : getPetOwnerLinks();

  // Get section titles and links based on user role
  const getSectionData = () => {
    if (userRole === "1") {
      // Doctor layout
      const doctorLinks = links as ReturnType<typeof getDoctorLinks>;
      return [
        { title: "Professional", links: doctorLinks.professional },
        { title: "Services", links: doctorLinks.services },
        { title: "Account", links: doctorLinks.account },
      ];
    } else {
      // Pet Owner layout
      const petOwnerLinks = links as ReturnType<typeof getPetOwnerLinks>;
      return [
        { title: "Account", links: petOwnerLinks.account },
        { title: "Shop", links: petOwnerLinks.shop },
        { title: "Services", links: petOwnerLinks.services },
      ];
    }
  };

  const sections = getSectionData();

  return (
    <footer className="bg-[#5ABC58] text-white py-10 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="font-bold text-xl">{section.title}</h4>
            <ul className="mt-3 space-y-2">
              {section.links.map((link: { name: string; href: string }) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-gray-300 transition duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 flex flex-col md:flex-row items-center justify-between">
        <div className="flex space-x-5 text-2xl">
          {[FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn].map(
            (Icon, index) => (
              <Link
                key={index}
                href="#"
                className="hover:text-gray-300 transition duration-300"
                aria-label={`Social media link ${index + 1}`}
              >
                <Icon />
              </Link>
            )
          )}
        </div>

        <div className="mt-6 md:mt-0 flex space-x-6 text-sm">
          <Link
            href="#"
            className="hover:text-gray-300 transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
