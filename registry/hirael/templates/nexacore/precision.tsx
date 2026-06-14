import { BrandMark, GradientText } from "./primitives";

const PRECISION_BG =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260418_125638_553b96dc-a1fd-4b2b-81a9-ed7daa80006e.png&w=1280&q=85";

type Pillar = {
  label: string;
  start: number;
  bottom: number;
  items: string[];
};

const PILLARS: Pillar[] = [
  {
    label: "Scopes",
    start: 2.8,
    bottom: 7,
    items: ["conditions", "capacity", "specs", "timelines"],
  },
  {
    label: "Integrates",
    start: 22.4,
    bottom: 9.08,
    items: ["civil", "mechanical", "electrical", "controls"],
  },
  {
    label: "Certifies",
    start: 41.2,
    bottom: 11.16,
    items: ["redundancy", "testing", "compliance", "sign-offs"],
  },
  {
    label: "Activates",
    start: 61.1,
    bottom: 13.24,
    items: ["cutover", "runbooks", "handoff", "SLAs"],
  },
];

function DeliveryGlyph() {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 17 16"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="8.5" cy="8" r="7" stroke="#c86fff" strokeWidth="1.2" />
      <rect x="8" y="0" width="1" height="3" fill="rgb(200, 111, 255)" />
      <rect x="8" y="13" width="1" height="3" fill="rgb(200, 111, 255)" />
      <rect x="0" y="7.5" width="3" height="1" fill="rgb(200, 111, 255)" />
      <rect x="14" y="7.5" width="3" height="1" fill="rgb(200, 111, 255)" />
    </svg>
  );
}

function PillarChip({ label, small }: { label: string; small?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 font-medium text-[var(--nexa-navy)]"
      style={{
        background:
          "linear-gradient(135deg, rgb(255, 255, 255), rgba(255, 255, 255, 0.6))",
        borderRadius: 20,
        fontSize: small ? 15 : 18,
        padding: small ? "10px 18px" : "0.972vw 1.736vw",
      }}
    >
      <BrandMark
        style={
          small
            ? { width: 16, height: 16 }
            : {
                width: "1.111vw",
                height: "1.111vw",
                minWidth: 16,
                minHeight: 16,
              }
        }
      />
      {label}
    </span>
  );
}

function DesktopStaircase() {
  return (
    <div
      className="relative hidden sm:block"
      style={{ width: "82.292vw", height: "31.94vw" }}
    >
      {PILLARS.map((pillar) => (
        <div
          key={pillar.label}
          className="absolute flex flex-col items-center"
          style={{
            insetInlineStart: `${pillar.start}vw`,
            bottom: `${pillar.bottom}vw`,
          }}
        >
          <PillarChip label={pillar.label} />
          <div className="relative" style={{ marginTop: 8 }}>
            <div
              className="nexa-grad-line-bg"
              style={{ width: 1, height: "14.24vw" }}
            />
            <div
              className="flex flex-col text-[var(--nexa-navy)]"
              style={{
                position: "absolute",
                top: "0.56vw",
                insetInlineStart: "1.94vw",
                gap: 4,
              }}
            >
              {pillar.items.map((item) => (
                <span
                  key={item}
                  style={{
                    fontSize: 16,
                    padding: "0.69vw 1.04vw",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileStack() {
  return (
    <div className="flex w-full flex-col gap-10 sm:hidden">
      {PILLARS.map((pillar, i) => {
        const end = i % 2 === 1;
        return (
          <div
            key={pillar.label}
            className={
              end ? "flex flex-col items-end" : "flex flex-col items-start"
            }
          >
            <PillarChip label={pillar.label} small />
            <div
              className="mt-4 flex gap-4"
              style={{ flexDirection: end ? "row-reverse" : "row" }}
            >
              <div
                className="nexa-grad-line-bg shrink-0"
                style={{ width: 1, minHeight: 120 }}
              />
              <div
                className="flex flex-col"
                style={{ alignItems: end ? "flex-end" : "flex-start" }}
              >
                {pillar.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 14,
                      color: "rgb(100, 80, 160)",
                      padding: "8px 0",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Precision() {
  return (
    <section
      id="thinking"
      data-slot="precision"
      className="flex flex-col items-center text-center"
      style={{
        backgroundImage: `url(${PRECISION_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding:
          "clamp(48px, 8vw, 120px) clamp(16px, 4vw, 60px) clamp(48px, 5.56vw, 80px)",
        gap: "clamp(32px, 4vw, 56px)",
      }}
    >
      <div className="flex flex-col items-center">
        <span
          className="inline-flex items-center gap-2 font-medium text-[var(--nexa-navy)]"
          style={{
            background: "rgb(249, 249, 249)",
            borderRadius: 36,
            padding: "clamp(8px, 0.9vw, 14px) clamp(12px, 1.25vw, 20px)",
            fontSize: "clamp(14px, 1.1vw, 18px)",
          }}
        >
          <DeliveryGlyph />
          Structured Delivery
        </span>

        <h2
          className="font-medium text-[var(--nexa-navy)]"
          style={{
            maxWidth: "clamp(700px, 60vw, 900px)",
            marginTop: 22,
            fontSize: "clamp(28px, 4vw, 56px)",
            lineHeight: 1.15,
          }}
        >
          <span className="block sm:whitespace-nowrap">
            One integrated, end-to-end system.
          </span>
          <GradientText className="block" style={{ paddingBottom: "0.3vw" }}>
            Compounding operational value.
          </GradientText>
        </h2>

        <p
          className="mt-6 text-[var(--nexa-lavender)]"
          style={{ fontSize: "clamp(15px, 1.2vw, 20px)" }}
        >
          NexaCore teams capture, align, validate and deliver exactly what keeps
          your programs on track.
        </p>
      </div>

      <div className="w-full" style={{ maxWidth: "82.292vw" }}>
        <DesktopStaircase />
        <MobileStack />
      </div>
    </section>
  );
}
