import { serializeJsonLd } from "@/lib/seo/json-ld";

/** Structured data for search engines and AI assistants. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
  );
}
