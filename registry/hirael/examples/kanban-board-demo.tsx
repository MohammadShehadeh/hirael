"use client";

import * as React from "react";

import {
  KanbanAddCard,
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanColumn,
  KanbanColumnHeader,
  type KanbanColumnData,
} from "@/registry/hirael/ui/kanban-board";

const initialBoard: KanbanColumnData[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "b1", title: "Audit empty states" },
      { id: "b2", title: "Sketch onboarding flow" },
      { id: "b3", title: "Collect billing feedback" },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    cards: [
      { id: "p1", title: "Build the registry pipeline" },
      { id: "p2", title: "Wire up the changelog page" },
    ],
  },
  {
    id: "review",
    title: "Review",
    cards: [{ id: "r1", title: "RTL pass on the date picker" }],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      { id: "d1", title: "Ship the color picker" },
      { id: "d2", title: "Add the command palette" },
    ],
  },
];

const initialCompact: KanbanColumnData[] = [
  {
    id: "todo",
    title: "To do",
    cards: [
      { id: "t1", title: "Reply to support" },
      { id: "t2", title: "Update the pricing copy" },
    ],
  },
  {
    id: "shipped",
    title: "Shipped",
    cards: [{ id: "s1", title: "Tag the release" }],
  },
];

export default function KanbanBoardDemo() {
  const [board, setBoard] = React.useState(initialBoard);
  const [compact, setCompact] = React.useState(initialCompact);

  return (
    <div className="grid w-full max-w-3xl gap-8">
      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Sprint board · drag cards or use Prev / Next
        </p>
        <KanbanBoard value={board} onValueChange={setBoard}>
          {board.map((column) => (
            <KanbanColumn key={column.id} value={column.id}>
              <KanbanColumnHeader />
              <KanbanCards>
                {column.cards.map((card, index) => (
                  <KanbanCard key={card.id} value={card.id} index={index} />
                ))}
              </KanbanCards>
              <KanbanAddCard />
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </div>

      <div className="grid gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Compact · two columns, custom card body
        </p>
        <KanbanBoard value={compact} onValueChange={setCompact}>
          {compact.map((column) => (
            <KanbanColumn key={column.id} value={column.id} className="w-60">
              <KanbanColumnHeader />
              <KanbanCards>
                {column.cards.map((card, index) => (
                  <KanbanCard key={card.id} value={card.id} index={index}>
                    <span className="block font-medium">{card.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {card.id.toUpperCase()}
                    </span>
                  </KanbanCard>
                ))}
              </KanbanCards>
              <KanbanAddCard>New task</KanbanAddCard>
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </div>
    </div>
  );
}
