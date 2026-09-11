export interface JsonLdProps {
  id: string;
  data: object | object[];
}

// A plain <script>, not next/script: the JSON-LD must be in the statically exported HTML for crawlers that run no JavaScript.
export const JsonLd = ({ id, data }: JsonLdProps) => {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Payload comes from registry metadata, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
