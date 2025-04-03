import { Metadata } from "next";
import DashboardLayout from "./dashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard | ChipIn",
  description:
    "Effortlessly split costs for trips, events, and daily expenses with our easy-to-use web-based tool.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
