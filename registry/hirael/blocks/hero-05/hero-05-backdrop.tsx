"use client"

import { Aurora, FilmGrain, Shader } from "shaders/react"

export default function Hero05Backdrop({ active = false }: { active?: boolean }) {
  return (
    <Shader style={{ width: "100%", height: "100%" }}>
      <Aurora
        colorA="#5a5a5a"
        colorB="#9a9a9a"
        colorC="#dedede"
        balance={0.5}
        intensity={1.1}
        curtainCount={4}
        speed={active ? 0.7 : 0.3}
        waviness={0.7}
        height={0.9}
      />
      <FilmGrain strength={0.05} animated />
    </Shader>
  )
}
