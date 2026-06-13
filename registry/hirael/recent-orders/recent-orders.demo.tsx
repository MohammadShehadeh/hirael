"use client"

import {
  RecentOrderAmount,
  RecentOrderCustomer,
  RecentOrderId,
  RecentOrderStatus,
  RecentOrders,
  RecentOrdersHeader,
  RecentOrdersItem,
  RecentOrdersList,
  RecentOrdersTitle,
} from "@/registry/hirael/ui/recent-orders"

const ORDERS = [
  { id: "#3812", customer: "Acme Inc.", amount: "$240.00", status: "Paid", tone: "success" as const },
  { id: "#3811", customer: "Mara Singh", amount: "$59.00", status: "Pending", tone: "warning" as const },
  { id: "#3810", customer: "Globex", amount: "$1,200.00", status: "Paid", tone: "success" as const },
  { id: "#3809", customer: "Theo Adams", amount: "$18.00", status: "Refunded", tone: "default" as const },
  { id: "#3808", customer: "Initech", amount: "$430.00", status: "Failed", tone: "danger" as const },
]

export default function RecentOrdersDemo() {
  return (
    <RecentOrders className="w-full max-w-lg">
      <RecentOrdersHeader>
        <RecentOrdersTitle>Recent orders</RecentOrdersTitle>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
        </a>
      </RecentOrdersHeader>
      <RecentOrdersList>
        {ORDERS.map((order) => (
          <RecentOrdersItem key={order.id}>
            <RecentOrderId>{order.id}</RecentOrderId>
            <RecentOrderCustomer>{order.customer}</RecentOrderCustomer>
            <RecentOrderAmount>{order.amount}</RecentOrderAmount>
            <RecentOrderStatus tone={order.tone}>{order.status}</RecentOrderStatus>
          </RecentOrdersItem>
        ))}
      </RecentOrdersList>
    </RecentOrders>
  )
}
