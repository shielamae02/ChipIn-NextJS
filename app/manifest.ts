import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChipIn - Expense Splitter",
    short_name: "ChipIn",
    description:
      "Effortlessly split expenses with friends and groups. Real-time collaboration, automatic settlements, and transparent reports.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a262c",
    theme_color: "#ffffff",
    orientation: "portrait",
    icons: [
      {
        src: "./icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    scope: "/",
    lang: "en-US",
  };
}
