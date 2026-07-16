"use client";

import { Database, Globe, HardDrive, Network, Server } from "lucide-react";

import { useT } from "@/lib/demo-locale";
import {
  NetworkEdge,
  NetworkNode,
  NetworkTopology,
  NetworkTopologyEdges,
} from "@/registry/hirael/components/network-topology";

export default function NetworkTopologyDemo() {
  const t = useT();

  return (
    <div className="w-full max-w-2xl">
      <NetworkTopology className="h-80">
        <NetworkTopologyEdges>
          <NetworkEdge from={[50, 12]} to={[50, 38]} status="active" animated />
          <NetworkEdge from={[50, 38]} to={[22, 66]} status="active" animated />
          <NetworkEdge from={[50, 38]} to={[50, 66]} status="active" animated />
          <NetworkEdge from={[50, 38]} to={[78, 66]} status="down" />
          <NetworkEdge from={[22, 66]} to={[35, 90]} status="active" />
          <NetworkEdge from={[50, 66]} to={[35, 90]} status="active" />
          <NetworkEdge from={[50, 66]} to={[65, 90]} status="active" />
          <NetworkEdge from={[78, 66]} to={[65, 90]} status="idle" />
        </NetworkTopologyEdges>

        <NetworkNode
          x={50}
          y={12}
          variant="hub"
          status="online"
          icon={<Globe />}
          label={t({ en: "Gateway", ar: "البوابة" })}
          sublabel="edge"
        />
        <NetworkNode
          x={50}
          y={38}
          status="online"
          icon={<Network />}
          label={t({ en: "Load balancer", ar: "موازن الحمل" })}
          sublabel="lb-01"
        />
        <NetworkNode
          x={22}
          y={66}
          status="online"
          icon={<Server />}
          label="api-1"
          sublabel="10.0.1.4"
        />
        <NetworkNode
          x={50}
          y={66}
          status="warning"
          icon={<Server />}
          label="api-2"
          sublabel="10.0.1.5"
        />
        <NetworkNode
          x={78}
          y={66}
          status="down"
          icon={<Server />}
          label="api-3"
          sublabel="10.0.1.6"
        />
        <NetworkNode
          x={35}
          y={90}
          status="online"
          icon={<Database />}
          label="db"
          sublabel="primary"
        />
        <NetworkNode
          x={65}
          y={90}
          status="idle"
          icon={<HardDrive />}
          label="cache"
          sublabel="redis"
        />
      </NetworkTopology>
    </div>
  );
}
