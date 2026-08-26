import { GradientText } from "./primitives";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_115655_b4d9cd77-feed-43cd-a198-af78ebdf1f7a.mp4";

export const Hero = () => {
  return (
    <section
      id="home"
      data-slot="hero"
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-4"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, #000201)",
        }}
      />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6 text-center">
        <GradientText className="text-lg font-medium">
          Infrastructure Built to Last
        </GradientText>

        <h1
          className="font-medium leading-tight text-white md:whitespace-nowrap"
          style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
        >
          Engineer and scale with clarity.
        </h1>

        <p
          className="text-[var(--nexa-lavender)]"
          style={{ fontSize: "clamp(15px, 1.2vw, 20px)" }}
        >
          NexaCore helps infrastructure owner, operator and supplier teams
          enforce global build standards for mission-critical systems. Align
          teams, regions and programs without the heavy lifting.
        </p>
      </div>
    </section>
  );
};
