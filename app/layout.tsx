import "./globals.css";
import { Poppins } from "next/font/google";
import { Provider } from "./providers";
import { metadata } from "./metadata";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`antialiased overflow-x-hidden`}>
        <Provider>
          <main className="min-h-screen w-screen relative">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
