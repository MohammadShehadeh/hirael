"use client"

import { Dither, Shader, Swirl } from "shaders/react"

export default function Cta03Backdrop({ active = false }: { active?: boolean }) {
  return (
    <Shader style={{ width: "100%", height: "100%" }}>
      <Swirl
        colorA="#ffffff"
        colorB="#6b6b6b"
        speed={active ? 0.6 : 0.2}
        detail={1.6}
      />
      <Dither
        colorMode="custom"
        colorA="transparent"
        colorB="#808080"
        pattern="bayer4"
        pixelSize={3}
      />
    </Shader>
  )
}
