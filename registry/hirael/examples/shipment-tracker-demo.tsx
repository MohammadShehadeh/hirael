"use client";

import { Home, Package } from "lucide-react";

import {
  ShipmentEvent,
  ShipmentEvents,
  ShipmentStage,
  ShipmentStages,
  ShipmentTracker,
} from "@/registry/hirael/ui/shipment-tracker";

export default function ShipmentTrackerDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-8">
      <ShipmentTracker orientation="horizontal">
        <ShipmentStages>
          <ShipmentStage
            status="complete"
            label="Ordered"
            time="Jun 14"
            icon={<Package />}
          />
          <ShipmentStage status="complete" label="Packed" time="Jun 15" />
          <ShipmentStage status="complete" label="Shipped" time="Jun 16" />
          <ShipmentStage
            status="current"
            label="Out for delivery"
            time="Today, 8:02 AM"
          />
          <ShipmentStage status="upcoming" label="Delivered" />
        </ShipmentStages>

        <ShipmentEvents>
          <ShipmentEvent
            time="8:02 AM"
            location="Local depot, Brooklyn"
            description="Out for delivery on route 12."
          />
          <ShipmentEvent
            time="Jun 16, 6:41 PM"
            location="Sort facility, Newark"
            description="Departed the regional hub."
          />
          <ShipmentEvent
            time="Jun 16, 9:10 AM"
            location="Sort facility, Newark"
            description="Arrived and scanned."
          />
          <ShipmentEvent
            time="Jun 15, 4:30 PM"
            location="Warehouse, Edison"
            description="Package handed to the carrier."
          />
        </ShipmentEvents>
      </ShipmentTracker>

      <ShipmentTracker orientation="vertical">
        <ShipmentStages>
          <ShipmentStage
            status="complete"
            label="Ordered"
            time="Jun 9, 11:20 AM"
            icon={<Package />}
          />
          <ShipmentStage
            status="complete"
            label="Shipped"
            time="Jun 10, 2:15 PM"
          />
          <ShipmentStage
            status="complete"
            label="Out for delivery"
            time="Jun 12, 7:48 AM"
          />
          <ShipmentStage
            status="complete"
            label="Delivered"
            time="Jun 12, 1:06 PM"
            icon={<Home />}
          />
        </ShipmentStages>

        <ShipmentEvents>
          <ShipmentEvent
            time="Jun 12, 1:06 PM"
            location="Front door, Queens"
            description="Left in a safe spot. Signed by R. Haddad."
          />
          <ShipmentEvent
            time="Jun 12, 7:48 AM"
            location="Local depot, Queens"
            description="Out for delivery."
          />
          <ShipmentEvent
            time="Jun 10, 2:15 PM"
            location="Warehouse, Columbus"
            description="Shipped from the fulfillment center."
          />
        </ShipmentEvents>
      </ShipmentTracker>
    </div>
  );
}
