export interface JsonLdProps {
  id: string;
  data: object | object[];
}

// A plain script, so the data is in the exported HTML for crawlers that do not run JavaScript.
export const JsonLd = ({ id, data }: JsonLdProps) => {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Registry data only, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
