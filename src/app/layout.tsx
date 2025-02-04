import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import robot from '../assets/robot.gif';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextAI",
  description: "Generated AI by Google Gemini Api",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <section className="grid grid-cols-7">
          <div className="w-full border-r-gray-600 border-r-2 rounded-r-3xl h-screen flex flex-col justify-between py-14  col-span-1">
            <p className="text-center font-semibold" >Biass AI</p>
            <Image src={robot} alt="astronaut" className="h-96 w-44 object-cover animate-ping " />
            <p className="text-center italic " >powered by gemini api</p>
          </div>
          {children}
        </section>
      </body>
    </html>
  );
}
