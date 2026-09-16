import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/**
 * Mirrors the dark palette in globals.css. The values are inlined rather than
 * read from CSS because Satori resolves no custom properties or Tailwind.
 */
const COLOR = {
  background: "#0a0a0a",
  foreground: "#ededed",
  muted: "#9aa0a6",
  accent: "#a5b4fc",
  border: "#26262b",
} as const;

type OgImageProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
};

/**
 * One renderer behind every opengraph-image route, so a card design change
 * lands on all of them at once.
 */
export function renderOgImage({ eyebrow, title, description }: OgImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: COLOR.background,
          color: COLOR.foreground,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: COLOR.accent,
            }}
          >
            {eyebrow}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 68,
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 900,
              fontSize: 28,
              lineHeight: 1.45,
              color: COLOR.muted,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${COLOR.border}`,
            paddingTop: 28,
            fontSize: 24,
            color: COLOR.muted,
          }}
        >
          <div style={{ display: "flex", color: COLOR.foreground }}>{SITE.name}</div>
          <div style={{ display: "flex" }}>Next.js · Backend for Frontend</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
