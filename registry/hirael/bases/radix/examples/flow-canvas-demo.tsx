'use client';

import { addEdge, useEdgesState, useNodesState, type Connection, type Edge } from '@xyflow/react';
import { Bot, GitBranch, Mail, MessageSquare, Ticket, Webhook } from 'lucide-react';

import { useT } from '@/lib/demo-locale';
import { FlowCanvas, type FlowCardNode } from '@/registry/hirael/bases/radix/components/flow-canvas';

const FlowCanvasDemo = () => {
  const t = useT();

  const initialNodes: FlowCardNode[] = [
    {
      id: 'trigger',
      type: 'card',
      position: { x: 160, y: 0 },
      data: {
        title: t({ en: 'New support email', ar: 'بريد دعم جديد' }),
        description: t({ en: 'Runs when a message reaches support@', ar: 'يعمل عند وصول رسالة إلى support@' }),
        icon: <Webhook />,
        status: 'done',
        noInput: true,
      },
    },
    {
      id: 'classify',
      type: 'card',
      position: { x: 160, y: 130 },
      data: {
        title: t({ en: 'Classify with Claude', ar: 'التصنيف باستخدام Claude' }),
        description: t({ en: 'Billing, bug or question', ar: 'فوترة أو خلل أو سؤال' }),
        icon: <Bot />,
        status: 'running',
      },
    },
    {
      id: 'route',
      type: 'card',
      position: { x: 160, y: 260 },
      data: { title: t({ en: 'Route by type', ar: 'التوجيه حسب النوع' }), icon: <GitBranch />, status: 'idle' },
    },
    {
      id: 'reply',
      type: 'card',
      position: { x: 0, y: 380 },
      data: {
        title: t({ en: 'Draft a reply', ar: 'صياغة رد' }),
        description: t({ en: 'Questions get an answer from the docs', ar: 'تحصل الأسئلة على إجابة من الوثائق' }),
        icon: <Mail />,
        status: 'idle',
        noOutput: true,
      },
    },
    {
      id: 'ticket',
      type: 'card',
      position: { x: 320, y: 380 },
      data: {
        title: t({ en: 'Open a ticket', ar: 'فتح تذكرة' }),
        description: t({ en: 'Bugs go to the issue tracker', ar: 'تذهب الأخطاء إلى متتبع المشكلات' }),
        icon: <Ticket />,
        status: 'idle',
      },
    },
    {
      id: 'notify',
      type: 'card',
      position: { x: 320, y: 510 },
      data: {
        title: t({ en: 'Post to #support', ar: 'النشر في #support' }),
        icon: <MessageSquare />,
        status: 'error',
        noOutput: true,
      },
    },
  ];
  const initialEdges: Edge[] = [
    { id: 'e1', source: 'trigger', target: 'classify', animated: true },
    { id: 'e2', source: 'classify', target: 'route' },
    { id: 'e3', source: 'route', target: 'reply', label: t({ en: 'question', ar: 'سؤال' }) },
    { id: 'e4', source: 'route', target: 'ticket', label: t({ en: 'bug', ar: 'خلل' }) },
    { id: 'e5', source: 'ticket', target: 'notify' },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (connection: Connection) => setEdges((list) => addEdge(connection, list));

  return (
    <div className="grid w-full max-w-3xl gap-3">
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}

        className="h-[32rem]"
      />
      <p className="text-xs text-muted-foreground">
        {t({
          en: 'Drag nodes around, connect a bottom handle to a top one, or select an edge and press Backspace to remove it.',
          ar: 'اسحب العقد، أو صِل مقبضًا سفليًا بمقبض علوي، أو حدد وصلة واضغط Backspace لإزالتها.',
        })}
      </p>
    </div>
  );
};

export default FlowCanvasDemo;
