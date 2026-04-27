import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/themeProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { dark } from '@clerk/themes'
import OnboardingWrapper from "@/components/onboarding-wrapper";
import { Toaster } from "sonner";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexus | Discover & Create Events",
  description: "Experience everything with Nexus. Join the community to host and attend unforgettable events.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en" suppressHydrationWarning>
      <body className={`bg-[#0A0A0A] text-white ${bebasNeue.variable} ${inter.variable} font-sans`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              theme: dark,
            }}
          >
            <ConvexClientProvider>
              <Header />

              <main className="relative min-h-screen container mx-auto px-4 md:px-6 lg:px-8 pt-28 md:pt-32">
                {/* Background glow effects (behind everything) */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-[100px]" />
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF4500]/10 rounded-full blur-[100px]" />
                </div>

                {/* Page content (above glow) */}
                <div className="relative z-10">{children}</div>

                <Footer />
                <Toaster richColors/>
                <OnboardingWrapper />
              </main>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
