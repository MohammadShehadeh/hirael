"use client"

import { Beam, Shader, Swirl, Vignette } from "shaders/react"

export default function Hero01Backdrop({ active = false }: { active?: boolean }) {
  return (
    <Shader style={{ width: "100%", height: "100%" }}>
      <Swirl
        colorA="#050505"
        colorB="#363636"
        speed={active ? 0.5 : 0.16}
        detail={1.4}
      />
      <Beam
        startPosition={{ x: 0.32, y: -0.1 }}
        endPosition={{ x: 0.46, y: 1.1 }}
        startThickness={0.01}
        endThickness={0.42}
        startSoftness={1}
        endSoftness={1}
        insideColor="#ffffff"
        outsideColor="#000000"
      />
      <Beam
        startPosition={{ x: 0.7, y: -0.1 }}
        endPosition={{ x: 0.58, y: 1.1 }}
        startThickness={0.01}
        endThickness={0.28}
        startSoftness={1}
        endSoftness={1}
        insideColor="#d4d4d4"
        outsideColor="#000000"
      />
      <Vignette color="#000000" intensity={1.1} radius={0.92} falloff={0.65} />
    </Shader>
  )
}
