import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { Navbar, NavbarContent, NavbarItem, NavbarBrand, Button } from "@nextui-org/react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Health Annotator",
  description: "Software Construction Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar>
            <NavbarBrand>
              <img src="/icon.png" alt="Mannota" className="h-8 w-auto" />
            </NavbarBrand>
            <NavbarContent justify="end">
              <SignedOut>
                <NavbarItem>
                  <div className="flex items-center justify-center min-h-screen">
                    <Button className="text-center justify-center bg-[#5AA676] text-white px-4 py-2 text-sm font-medium rounded-xl text-lg">
                      <SignInButton />
                    </Button>
                  </div>
                </NavbarItem>
              </SignedOut>
              <SignedIn>
                <NavbarItem>
                  <UserButton />
                </NavbarItem>
              </SignedIn>
            </NavbarContent>
          </Navbar>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
