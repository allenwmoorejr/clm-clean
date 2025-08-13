// app/page.tsx
import HomeClient from "@/components/HomeClient";

// keep this to avoid prerender quirks
export const dynamic = "force-dynamic";

export default function Page() {
  return <HomeClient />;
}

