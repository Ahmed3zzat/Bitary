"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  RiUser3Line,
  RiShoppingBagLine,
  RiMenu3Line,
  RiCloseLine,
  RiHeartLine,
  RiHeartFill,
} from "react-icons/ri";
import Image from "next/image";
import BitaryText from "@/assets/BitaryText.svg";
import { useAppDispatch, useAppSelector } from "@/hooks/store.hook";
import { useRouter } from "next/navigation";
import { logout, setToken } from "@/store/Features/user.slice";
import { fetchUserData } from "@/store/Features/profile.slice";
import { motion, AnimatePresence } from "framer-motion";

const DESIGN_CONSTANTS = {
  colors: {
    primary: "#4FAE4B",
    primaryDark: "#3A8D36",
    accent: "#5ABC58",
    textLight: "#FFFFFF",
    textDark: "#2D3748",
    hoverLight: "rgba(255, 255, 255, 0.1)",
    hoverDark: "rgba(0, 0, 0, 0.05)",
    backdrop: "rgba(0, 0, 0, 0.5)",
  },
  transitions: {
    fast: "0.2s",
    medium: "0.3s",
    slow: "0.5s",
  },
  shadows: {
    small: "0 2px 8px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 12px rgba(0, 0, 0, 0.15)",
    large: "0 8px 24px rgba(0, 0, 0, 0.2)",
  },
  borderRadius: {
    small: "8px",
    medium: "12px",
    large: "16px",
    xlarge: "24px",
  },
};

// Common links for all users
const commonNavLinks = [
  { name: "Home", href: "/home" },
  { name: "Clinics", href: "/clinics/view" },
  { name: "Shop", href: "/shop" },
];

export default function Navbar() {
  const { items } = useAppSelector((store) => store.userCartSlice);
  const { WishListData } = useAppSelector((store) => store.userWishlisttSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector((state) => state.userSlice.token);
  const { user } = useAppSelector((state) => state.profileSlice);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [navLinks, setNavLinks] = useState([...commonNavLinks]);
  const profileRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole") || "";
      setUserRole(role);
      // console.log("Current user role:", role);
    }
  }, [token]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (navbarRef.current) {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          navbarRef.current.style.transform = "translateY(-100%)";
        } else {
          navbarRef.current.style.transform = "translateY(0)";
        }
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      dispatch(setToken(storedToken));

      // Make sure userRole is set whenever token exists
      const storedRole = localStorage.getItem("userRole");
      if (storedRole) {
        setUserRole(storedRole);
        console.log(
          "Set userRole from localStorage during token check:",
          storedRole
        );
      } else {
        console.log(
          "Warning: Token exists but no userRole found in localStorage"
        );
      }
    }
  }, [dispatch]);

  useEffect(() => {
    // Check localStorage for userRole when user changes
    if (user) {
      if (typeof window !== "undefined") {
        const storedRole = localStorage.getItem("userRole") || "";
        if (storedRole) {
          setUserRole(storedRole);
          console.log(
            "User profile loaded, current userRole from localStorage:",
            storedRole
          );
        }
      }
    }
  }, [user]);

  useEffect(() => {
    const updatedLinks = [...commonNavLinks];

    if (userRole === "0") {
      updatedLinks.push({ name: "Pet ID Card", href: "/pets" });
    }

    if (userRole === "1") {
      updatedLinks.push({ name: "Doctor Dashboard", href: "/dashboard" });
      updatedLinks.unshift();

    }
    if (userRole === "2") {
      updatedLinks.shift();
    }



    setNavLinks(updatedLinks);
  }, [userRole]);

  function logoutFunc() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("basketId");
      localStorage.removeItem("email");
      localStorage.removeItem("userRole");
    }
    router.push("/welcome");
    dispatch(logout());
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  if (!mounted) {
    return null;
  }

  const homeUrl = token ? "/home" : "/welcome";
  const wishlistCount = WishListData?.items?.length || 0;

  return (
    <motion.nav
      ref={navbarRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gradient-to-r from-[#5ABC58] to-[#4FAE4B] text-white shadow-lg font-[Poppins] transition-transform duration-300"
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo */}
        <Link href={homeUrl} className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: DESIGN_CONSTANTS.transitions.fast }}
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
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        {token && (
          <nav className="hidden lg:block">
            <ul className="flex gap-8 text-base font-medium">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 * index,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    className="relative px-2 py-1 group inline-block"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-white"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      style={{ originX: 0 }}
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {token && (
            <>
              {/* Wishlist Icon */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 hover:text-gray-100 transition-colors"
                >
                  {wishlistCount > 0 ? (
                    <RiHeartFill
                      className="text-green-100  hover:text-gray-100"
                      size={22}
                    />
                  ) : (
                    <RiHeartLine size={22} />
                  )}
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                  <span className="text-md hidden sm:block font-medium">
                    Wishlist
                  </span>
                </Link>
              </motion.div>

              {/* Cart Icon */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  href="/cart"
                  className="flex items-center gap-2  hover:text-gray-100 transition-colors"
                >
                  <RiShoppingBagLine size={22} />
                  {items && items.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-white text-green-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                    >
                      {items.length}
                    </motion.span>
                  )}
                  <span className="text-md hidden sm:block font-medium">
                    Cart
                  </span>
                </Link>
              </motion.div>
            </>
          )}

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors"
            >
              <div className="relative">
                <RiUser3Line size={22} />
                {profileDropdownOpen && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-white/20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </div>
              {token && user?.firstName && (
                <span className="text-md hidden sm:block">
                  Hi, <strong>{user.firstName}</strong>
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-sm text-gray-800 rounded-xl shadow-xl overflow-hidden border border-white/20 z-50"
                >
                  {token ? (
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Orders
                      </Link>
                      {userRole === "0" && (
                        <Link
                          href="/reviews"
                          className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Reviews
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logoutFunc();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-red-500"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Signup
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            className="lg:hidden text-2xl p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? (
              <RiCloseLine size={24} />
            ) : (
              <RiMenu3Line size={24} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="lg:hidden px-6 pb-6 pt-4 bg-gradient-to-br from-[#5ABC58] to-[#4FAE4B] backdrop-blur-md shadow-lg text-white flex flex-col gap-4 z-40"
          >
            {token &&
              navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium border-b border-white/20 pb-2"
                >
                  {link.name}
                </Link>
              ))}

            {/* Mobile Profile & Auth Options */}
            <div className="flex flex-col gap-3 mt-4">
              {token ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base hover:underline"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base hover:underline flex items-center gap-2"
                  >
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base hover:underline"
                  >
                    Orders
                  </Link>
                  {userRole === "0" && (
                    <Link
                      href="/reviews"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base hover:underline"
                    >
                      Reviews
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logoutFunc();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-100 text-base hover:underline text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base hover:underline"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base hover:underline"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
