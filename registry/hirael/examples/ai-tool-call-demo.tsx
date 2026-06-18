"use client";

import {
  AiToolCall,
  AiToolCallArguments,
  AiToolCallContent,
  AiToolCallResult,
  AiToolCallSection,
  AiToolCallTrigger,
} from "@/registry/hirael/ui/ai-tool-call";

export default function AiToolCallDemo() {
  return (
    <div className="grid w-full max-w-xl gap-6">
      <AiToolCall status="success" defaultOpen>
        <AiToolCallTrigger name="search_orders" />
        <AiToolCallContent>
          <AiToolCallSection label="Arguments">
            <AiToolCallArguments
              value={{ customer: "lena.park", status: "shipped", limit: 5 }}
            />
          </AiToolCallSection>
          <AiToolCallSection label="Result">
            <AiToolCallResult
              value={{
                count: 2,
                orders: [
                  { id: "ord_4f21", total: 89.0, eta: "2026-06-21" },
                  { id: "ord_4e07", total: 142.5, eta: "2026-06-23" },
                ],
              }}
            />
          </AiToolCallSection>
        </AiToolCallContent>
      </AiToolCall>

      <AiToolCall status="pending">
        <AiToolCallTrigger name="generate_invoice" />
        <AiToolCallContent>
          <AiToolCallSection label="Arguments">
            <AiToolCallArguments
              value={{ order: "ord_4f21", format: "pdf" }}
            />
          </AiToolCallSection>
        </AiToolCallContent>
      </AiToolCall>

      <AiToolCall status="error">
        <AiToolCallTrigger name="charge_card" />
        <AiToolCallContent>
          <AiToolCallSection label="Arguments">
            <AiToolCallArguments
              value={{ customer: "theo.adams", amount: 142.5 }}
            />
          </AiToolCallSection>
          <AiToolCallSection label="Result">
            <AiToolCallResult
              value={{ error: "card_declined", reason: "insufficient_funds" }}
            />
          </AiToolCallSection>
        </AiToolCallContent>
      </AiToolCall>
    </div>
  );
}
