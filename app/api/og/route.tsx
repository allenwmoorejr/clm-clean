// app/api/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Christ Like Ministries";
  const subtitle =
    searchParams.get("subtitle") ||
    "Preaching the gospel to the world in hopes that many will be saved.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg,#0b1020,#1b1e45)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.85, marginTop: 16 }}>{subtitle}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
