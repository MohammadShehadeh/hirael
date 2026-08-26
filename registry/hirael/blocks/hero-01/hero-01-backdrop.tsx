"use client";

import { Beam, Shader, Swirl } from "shaders/react";

const Hero01Backdrop = ({
  active = false,
}: {
  active?: boolean;
}) => {
  return (
    <Shader style={{ width: "100%", height: "100%" }}>
      <Swirl speed={active ? 0.5 : 0.16} detail={1.5} />
      <Beam
        startPosition={{ x: 0.32, y: -0.1 }}
        endPosition={{ x: 0.46, y: 1.1 }}
        startThickness={0.01}
        endThickness={0.42}
        startSoftness={5}
        endSoftness={1}
        insideColor="#d9cfba"
        outsideColor="transparent"
      />
      <Beam
        startPosition={{ x: 0.7, y: -0.1 }}
        endPosition={{ x: 0.58, y: 1.1 }}
        startThickness={0.01}
        endThickness={0.28}
        startSoftness={1}
        endSoftness={1}
        insideColor="#d9cfba"
        outsideColor="transparent"
      />
    </Shader>
  );
};

export default Hero01Backdrop;
