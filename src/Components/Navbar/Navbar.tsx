"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { RiUserLine, RiShoppingBagLine } from "react-icons/ri";
import Image from "next/image";
import BitaryText from "@/assets/BitaryText.svg";
import { useAppDispatch } from "@/hooks/store.hook";
import { useRouter } from "next/navigation";
import { logout } from "@/store/Features/user.slice";

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "Clinics", href: "/clinics" },
  { name: "Pet ID Card", href: "/profile" },
  { name: "Shop", href: "/shop" },
  { name: "Pet Health", href: "/health" },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  const cartTotal = "$57.00";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !(profileRef.current as Node).contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function logoutFunc() {
    localStorage.removeItem("token");
    dispatch(logout());
    router.push("/welcome");
  }
  useEffect(() => {}, [dispatch, token]);

  return (
    <nav className="bg-[#5ABC58] text-white py-4 px-6 shadow-md font-[Poppins] sticky top-0 w-full z-50">
      <div className="max-w-[1400px] mx-auto flex lg:justify-between justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image
            src={BitaryText}
            alt="Bitary Logo"
            width={150}
            height={50}
            priority
            className="brightness-0 invert"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-10 text-lg font-medium">
          {navLinks.map((link) =>
            token ? (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="relative hover:text-gray-100 transition duration-300 after:absolute after:right-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.name}
                </Link>
              </li>
            ) : null
          )}
        </ul>

        {/* Icons Section */}
        <div className="flex items-center space-x-6">
          {/* Profile Dropdown */}
          <div
            className="relative flex items-center justify-center"
            ref={profileRef}
          >
            <button
              className="text-3xl hover:text-gray-100 transition duration-300 flex items-center justify-center cursor-pointer"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              {""}
              <RiUserLine />
            </button>

            {profileDropdownOpen && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-white text-gray-800 rounded-xl shadow-md overflow-hidden animate-fadeIn">
                {token ? (
                  <>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={logoutFunc}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Shopping Cart */}
          {token && (
            <div className="relative flex items-center text-lg">
              <Link
                href="/cart"
                className="text-3xl hover:text-gray-100 transition duration-300"
              >
                <RiShoppingBagLine />
              </Link>
              <div className="ml-4 text-sm leading-tight">
                <span className="block">Shopping cart:</span>
                <span className="font-semibold text-base">{cartTotal}</span>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden text-white text-3xl focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/5 max-w-xs bg-[#4FAE4B] text-white p-6 transform ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }  transition-transform duration-300 ease-in-out lg:hidden shadow-xl z-40 rounded-l-xl`}
      >
        <button
          className="absolute top-4 right-4 text-3xl"
          onClick={() => setMobileMenuOpen(false)}
        >
          ✖
        </button>

        {token && (
          <ul className="mt-16 space-y-6 text-xl font-semibold">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block text-center hover:text-gray-200 transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {/* Logo */}
        <Link
          href="/"
          className="absolute bottom-20 start-1/2 -translate-x-1/2"
        >
          <Image
            src={BitaryText}
            alt="Bitary Logo"
            width={150}
            height={50}
            priority
            className="brightness-0 invert"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden z-30 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}
