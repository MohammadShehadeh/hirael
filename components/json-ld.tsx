/**
 * Renders schema.org JSON-LD. A plain `<script>` rather than `next/script`:
 * structured data has to be in the statically exported HTML for a crawler
 * that never runs JavaScript, and `type="application/ld+json"` is inert to
 * the browser, so there is nothing to defer.
 */
export const JsonLd = ({ id, data }: { id: string; data: object | object[] }) => {
  return (
    <script
      id={id}
      type="application/ld+json"
      // The payload is built from registry metadata, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
