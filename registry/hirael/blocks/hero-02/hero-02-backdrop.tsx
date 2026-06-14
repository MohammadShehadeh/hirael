"use client"

import { Shader, Stripes, Vignette } from "shaders/react"

export default function Hero02Backdrop({ active = false }: { active?: boolean }) {
  return (
    <Shader style={{ width: "100%", height: "100%" }}>
      <Stripes
        colorA="#0a0a0a"
        colorB="#9a9a9a"
        angle={90}
        density={9}
        balance={0.42}
        softness={1}
        speed={active ? 0.5 : 0.16}
      />
      <Vignette color="#000000" intensity={0.9} radius={1.05} falloff={0.7} />
    </Shader>
  )
}
