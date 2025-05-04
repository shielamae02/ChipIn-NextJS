import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Provider } from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ChipIn | Simplify Shared Expenses",
  description:
    "Effortlessly split costs for trips, events, and daily expenses with our easy-to-use web-based tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={poppins.variable}>
      <body className={`antialiased overflow-x-hidden`}>
        <Provider>
          <main className='min-h-screen w-screen relative'>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
