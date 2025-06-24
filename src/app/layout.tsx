import type { Metadata } from "next";
import { Inter, Poppins, Fredoka } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import ReduxProvider from "../Components/ReduxProvider/ReduxProvider";
import ProtectedRoute from "@/Components/ProtectedRoute/ProtectedRoute";
import { FaExclamationTriangle } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { IoPawSharp } from "react-icons/io5";
import ZapierChatbot from "@/Components/ZapierChatbot/ZapierChatbot";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Bitary",
  description: "All-in-one digital pet solution",
  applicationName: 'Bitary',
  keywords: ['pets', 'veterinary', 'pet care', 'animal health'],

};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={` ${inter.variable} ${poppins.variable} ${fredoka.variable} antialiased`}
      >
        <Toaster
          position="top-center"
          gutter={16}
          toastOptions={{
            duration: 2500,
            className: "global-toast",
            style: {
              padding: "18px 24px",
              borderRadius: "14px",
              fontWeight: "500",
              fontFamily:
                "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: "16px",
              maxWidth: "480px",
              width: "40vw",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            },
            success: {
              icon: (
                <IoPawSharp className="text-2xl text-white animate-bounce" />
              ),
              style: {
                background:
                  "linear-gradient(135deg, rgba(56, 161, 105, 0.95), rgba(72, 187, 120, 0.95))",
                color: "#fff",
                animation:
                  "gentle-float 0.8s ease, soft-fade 0.5s ease-out 4s forwards",
              },
            },
            error: {
              icon: (
                <FaExclamationTriangle className="text-2xl text-white pulse" />
              ),
              style: {
                background:
                  "linear-gradient(135deg, rgba(229, 62, 62, 0.95), rgba(245, 101, 101, 0.95))",
                color: "#fff",
                animation:
                  "attention-shake 0.8s ease, soft-fade 0.5s ease-out 4s forwards",
              },
            },
            loading: {
              icon: (
                <ImSpinner8 className="text-2xl text-white animate-spin-fast" />
              ),
              style: {
                background:
                  "linear-gradient(135deg, rgba(49, 130, 206, 0.95), rgba(66, 153, 225, 0.95))",
                color: "#fff",
              },
            },
          }}
        />
        
        <ReduxProvider>
          <ProtectedRoute>
            <ZapierChatbot />
            <Navbar />
            <main className="pt-18">{children}</main>
            <Footer />
          </ProtectedRoute>
        </ReduxProvider>
      </body>
    </html>
  );
}
