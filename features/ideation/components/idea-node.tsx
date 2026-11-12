import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Check } from 'lucide-react';
import { IDEA_KIND_META } from '@/features/ideation/components/idea-kind-meta';
import type { Idea } from '@/features/ideation/shared/mock-ideas';

export type IdeaNodeType = Node<
  {
    idea: Idea;
    order: number;
    selection: 'none' | 'selected' | 'dimmed';
    onSelect: () => void;
  },
  'idea'
>;

export function IdeaNode({ data }: NodeProps<IdeaNodeType>) {
  const { idea, order, selection, onSelect } = data;
  const { label, Icon, chipClass, selectedClass } = IDEA_KIND_META[idea.kind];
  const isSelected = selection === 'selected';

  return (
    <div className="w-[300px]">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={`relative block w-full rounded-2xl bg-[#1c1c1e] p-4 text-left ring-1 transition-[opacity,translate,box-shadow] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] active:scale-[0.99] starting:translate-x-2 starting:opacity-0 ${
          isSelected ? selectedClass : 'ring-white/[0.08] hover:ring-white/20'
        } ${selection === 'dimmed' ? 'opacity-40 hover:opacity-80' : ''}`}
        style={{
          transitionDelay: selection === 'none' ? `${order * 60}ms` : '0ms'
        }}
      >
        <span className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${chipClass}`}
          >
            <Icon className="size-3" />
            {label}
          </span>
          {isSelected && (
            <span className="flex size-5 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 starting:scale-50">
              <Check className="size-3" strokeWidth={3} />
            </span>
          )}
        </span>
        <span className="mt-3 block text-[15px] leading-snug font-semibold break-keep text-white">
          {idea.title}
        </span>
        <span className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed break-keep text-white/55">
          {idea.hook}
        </span>
      </button>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="opacity-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="opacity-0"
      />
    </div>
  );
}
