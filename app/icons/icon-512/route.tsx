import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05070c",
        }}
      >
        <div
          style={{
            width: 288,
            height: 288,
            borderRadius: "50%",
            border: "36px solid #35d6e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#35d6e0" }} />
        </div>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
