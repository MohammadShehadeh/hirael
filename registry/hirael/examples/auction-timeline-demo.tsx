"use client";

import * as React from "react";

import {
  AuctionBid,
  AuctionBidRow,
  AuctionCountdown,
  AuctionHeader,
  AuctionHistory,
  AuctionStatus,
  AuctionTimeline,
  AuctionWinner,
} from "@/registry/hirael/ui/auction-timeline";

export default function AuctionTimelineDemo() {
  const [endsAt] = React.useState(() => Date.now() + (7 * 60 + 42) * 1000);

  return (
    <div className="grid w-full max-w-md gap-8">
      <AuctionTimeline endsAt={endsAt}>
        <AuctionHeader>
          <AuctionBid amount="$2,450" bids={14} />
          <AuctionStatus state="closing" />
        </AuctionHeader>
        <AuctionCountdown />
        <AuctionHistory>
          <AuctionBidRow
            bidder="Mara Okafor"
            amount="$2,450"
            time="just now"
            leading
          />
          <AuctionBidRow bidder="Leo Tanaka" amount="$2,300" time="2 min ago" />
          <AuctionBidRow bidder="Priya Nair" amount="$2,100" time="9 min ago" />
          <AuctionBidRow
            bidder="Sam Reyes"
            amount="$1,900"
            time="21 min ago"
          />
        </AuctionHistory>
      </AuctionTimeline>

      <AuctionTimeline>
        <AuctionHeader>
          <AuctionBid amount="$5,800" bids={31} label="Sold for" />
          <AuctionStatus state="closed" />
        </AuctionHeader>
        <AuctionWinner winner="Devon Hale" amount="$5,800" />
        <AuctionHistory>
          <AuctionBidRow
            bidder="Devon Hale"
            amount="$5,800"
            time="Mar 4, 6:01 PM"
            leading
          />
          <AuctionBidRow
            bidder="Ana Costa"
            amount="$5,650"
            time="Mar 4, 5:58 PM"
          />
          <AuctionBidRow
            bidder="Yuki Sato"
            amount="$5,400"
            time="Mar 4, 5:44 PM"
          />
        </AuctionHistory>
      </AuctionTimeline>
    </div>
  );
}
