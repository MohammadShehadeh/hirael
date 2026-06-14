import { HlsVideo } from "./hls-video"

const STATEMENT_HLS =
  "https://stream.mux.com/9njY8qDfS02Uvbll018C8CK39p5EksK7mn02DDC1zYvppI.m3u8"

const STATS = [
  { value: "OTA", label: "Over-the-air updates" },
  { value: "360°", label: "System visibility" },
  { value: "AI", label: "Adaptive routines" },
  { value: "24/7", label: "Remote monitoring" },
]

export function Statement() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6">
      <HlsVideo src={STATEMENT_HLS} />

      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground sm:text-sm">
          Intelligent Companion
        </p>

        <h2 className="text-4xl leading-[1.05] tracking-[-1.5px] text-foreground [font-family:var(--font-velorah-serif)] sm:text-6xl md:text-7xl">
          Adventure inspired.
          <br />
          App driven.
        </h2>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          One app to control climate, lighting, navigation, and energy. Monitor
          every system in real time, automate your routines, and let Velorah
          learn how you live on the road.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-light text-foreground [font-family:var(--font-velorah-serif)] sm:text-4xl">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="liquid-glass mt-12 rounded-full px-10 py-4 text-sm text-foreground transition-transform hover:scale-[1.03]"
        >
          Discover the App
        </button>
      </div>
    </section>
  )
}
