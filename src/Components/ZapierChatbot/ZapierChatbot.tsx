"use client";

import { useState, useEffect } from "react";
import { PawPrint, X } from "lucide-react";
import { useAppSelector } from "@/hooks/store.hook";

export default function ZapierChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const { token } = useAppSelector((state) => state.userSlice);

  useEffect(() => {
    setIsMounted(true);
    setIsRTL(document?.documentElement?.getAttribute("dir") === "rtl");

    const script = document.createElement("script");
    script.src = "https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js";
    script.type = "module";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  if (!isMounted || !token) {
    return null;
  }

  return (
    <div className="fixed z-[9999] flex flex-col items-end font-sans right-4 bottom-6 md:bottom-8">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 flex items-center justify-center bg-gradient-to-tr from-green-500 to-emerald-600 hover:scale-105 transition-transform text-white rounded-full shadow-2xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] focus:outline-none focus:ring-4 focus:ring-green-300 relative"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <PawPrint className="w-6 h-6" />
            <span className="absolute top-[-4px] right-[-4px] w-3 h-3 bg-pink-500 rounded-full border-2 border-white animate-ping" />
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed md:absolute backdrop-blur-xl bg-white/90 dark:bg-black/80 border border-white/30 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all duration-300 ease-in-out rounded-xl overflow-hidden right-0 bottom-0 md:bottom-[calc(100%+1rem)] w-full sm:w-[350px] md:w-[400px] lg:w-[450px] xl:w-[500px] h-[60vh] sm:h-[70vh] md:h-[600px]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-t-xl">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-2 bg-white/20 rounded-lg">
                <PawPrint className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {isRTL ? "مساعد الدعم البيطري" : "Veterinary Support"}
                </h3>
                <p className="text-xs opacity-80">
                  {isRTL ? "متاح الآن للمساعدة" : "Available to help"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Chatbot Embed */}
          <div className="h-[calc(100%-64px)] w-full">
            <div
              className="h-full w-full"
              dangerouslySetInnerHTML={{
                __html: `
                  <zapier-interfaces-chatbot-embed
                    is-popup="false"
                    chatbot-id="cmbg9u8ej0008k1dwicekn28b"
                    style="width: 100%; height: 100%; display: block;"
                  ></zapier-interfaces-chatbot-embed>
                `,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
