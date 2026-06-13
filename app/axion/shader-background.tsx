"use client"

import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from "shaders/react"

/**
 * The hero shader stack. Composited bottom-to-top by the root `<Shader>`
 * canvas: a soft swirl, the orange chroma flow, a fluted-glass refraction
 * pass, and a light film grain on top. Loaded client-only (it needs WebGL),
 * so it never runs during the static export.
 */
export function ShaderBackground() {
  return (
    <Shader style={{ width: "100%", height: "100%" }}>
      <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
      <ChromaFlow
        baseColor="#ffffff"
        downColor="#ff5f03"
        leftColor="#ff5f03"
        rightColor="#ff5f03"
        upColor="#ff5f03"
        momentum={13}
        radius={3.5}
      />
      <FlutedGlass
        aberration={0.61}
        angle={31}
        frequency={8}
        highlight={0.12}
        highlightSoftness={0}
        lightAngle={-90}
        refraction={4}
        shape="rounded"
        softness={1}
        speed={0.15}
      />
      <FilmGrain strength={0.05} />
    </Shader>
  )
}
