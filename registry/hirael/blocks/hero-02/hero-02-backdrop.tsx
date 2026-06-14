"use client"

import { Shader, Stripes } from "shaders/react"

export default function Hero02Backdrop({ active = false }: { active?: boolean }) {
  return (
    <Shader style={{ width: "100%", height: "100%" }}>
      <Stripes
        colorA="transparent"
        colorB="#808080"
        angle={90}
        density={9}
        balance={0.5}
        softness={1}
        speed={active ? 0.5 : 0.16}
      />
    </Shader>
  )
}
