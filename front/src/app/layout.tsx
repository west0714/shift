"use client"
import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/Context";
import ContentUser from "@/context/setuser";


export default function RootLayout({ children,}: Readonly<{ children: React.ReactNode;}>) {

  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ContentUser>
            {children}
          </ContentUser>
        </UserProvider>
      </body>
    </html>
  );
}