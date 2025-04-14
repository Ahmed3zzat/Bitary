import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#5ABC58] text-white py-10 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-bold text-xl">Profile</h4>
          <ul className="mt-3 space-y-2">
            {["Your Information", "Pet Profile", "Medical History"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-gray-300 transition duration-300"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-xl">Store</h4>
          <ul className="mt-3 space-y-2">
            {["Recommendations", "Best Seller", "Food", "Veterinary"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href={item.toLocaleLowerCase()}
                    className="hover:text-gray-300 transition duration-300"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>


        <div>
          <h4 className="font-bold text-xl">Company</h4>
          <ul className="mt-3 space-y-2">
            {["About Us", "Careers", "FAQs", "Terms", "Contact Us"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-gray-300 transition duration-300"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-10 flex flex-col md:flex-row items-center justify-between">
        <div className="flex space-x-5 text-2xl">
          {[FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn].map(
            (Icon, index) => (
              <Link
                key={index}
                href="#"
                className="hover:text-gray-300 transition duration-300"
              >
                <Icon />
              </Link>
            )
          )}
        </div>

        <div className="mt-6 md:mt-0 flex space-x-6 text-sm">
          {["Privacy Policy", "Terms of Use", "Legal", "Site Map"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                className="hover:text-gray-300 transition duration-300"
              >
                {item}
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
