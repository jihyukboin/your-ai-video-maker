import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { NodeStatusIndicator } from '@/features/ideation/components/node-status-indicator';

export type DiscoveryNodeType = Node<
  { status: 'loading' | 'initial' },
  'discovery'
>;

export function DiscoveryNode({ data }: NodeProps<DiscoveryNodeType>) {
  return (
    <div>
      <NodeStatusIndicator
        status={data.status}
        variant="border"
        radiusClassName="rounded-2xl"
      >
        <div className="relative rounded-2xl bg-[#1c1c1e] px-6 py-4 text-[15px] font-semibold whitespace-nowrap text-white ring-1 ring-white/[0.08] transition-opacity duration-300 starting:opacity-0">
          주제 선정
        </div>
      </NodeStatusIndicator>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="opacity-0"
      />
    </div>
  );
}
