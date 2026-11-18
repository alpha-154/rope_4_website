import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories & News",
  description:
    "Field dispatches, alpine medical safety advice, gear checklists and program updates from Rope4 Outdoor Education guides.",
  alternates: { canonical: "/news" },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
