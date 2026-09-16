import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";
import { routeMetaFor } from "@/lib/site";

const meta = routeMetaFor("/server");

export const alt = meta.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage(meta);
}
