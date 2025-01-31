import "./globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import dbConnect from "../lib/mongodb";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quiz Master",
  description: "Test your knowledge in various tech domains",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();

  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
      >
        <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:opacity-[0.075]" />
        {children}
      </body>
    </html>
  );
}
