import type { Metadata } from "next";
import { Inter, Poppins, Fredoka } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import ReduxProvider from "../Components/ReduxProvider/ReduxProvider";
import ProtectedRoute from "@/Components/ProtectedRoute/ProtectedRoute";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Bitary",
  description: "All-in-one digital pet solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${inter.variable} ${poppins.variable} ${fredoka.variable} antialiased`}
      >
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: "linear-gradient(to right, #56ab2f, #a8e063)",
                padding: "3px 4px",
                color: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
              },
            },
            error: {
              style: {
                background: "linear-gradient(to right, #e53935, #e35d5b)",
                padding: "3px 4px",
                color: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                fontFamily: "Arial, sans-serif ",
                fontWeight: "bold",
              },
            },
          }}
        />
        <ReduxProvider>
          <ProtectedRoute>
            <Navbar />
            {children}
            <Footer />
          </ProtectedRoute>
        </ReduxProvider>
      </body>
    </html>
  );
}
