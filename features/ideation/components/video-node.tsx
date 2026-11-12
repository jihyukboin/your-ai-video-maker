import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';
import { IDEA_KIND_META } from '@/features/ideation/components/idea-kind-meta';
import { NodeStatusIndicator } from '@/features/ideation/components/node-status-indicator';
import type { IdeaKind } from '@/features/ideation/shared/mock-ideas';

export type VideoNodeType = Node<
  {
    title: string;
    kind: IdeaKind;
    cutCount: number;
    durationSeconds: number;
    status: 'merging' | 'ready';
  },
  'video'
>;

export function VideoNode({ data }: NodeProps<VideoNodeType>) {
  const { thumbnailClass } = IDEA_KIND_META[data.kind];
  const isReady = data.status === 'ready';

  return (
    <div className="w-[300px]">
      <NodeStatusIndicator
        status={isReady ? 'initial' : 'loading'}
        radiusClassName="rounded-2xl"
      >
        <article className="relative flex gap-3.5 rounded-2xl bg-[#1c1c1e] p-3 ring-1 ring-white/[0.08] transition-[opacity,translate] duration-300 ease-out starting:translate-x-2 starting:opacity-0">
          <div
            className={`relative flex h-[112px] w-[63px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-linear-to-b ${thumbnailClass}`}
          >
            <span
              className={`flex size-7 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-[opacity,scale] duration-300 ${
                isReady ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}
            >
              <Play className="ml-0.5 size-3.5 fill-current" />
            </span>
          </div>

          <div className="flex min-w-0 flex-col py-1">
            <p className="text-xs font-medium text-white/50">최종 영상</p>
            <h3 className="mt-1.5 line-clamp-2 text-[14px] leading-snug font-semibold break-keep text-white">
              {data.title}
            </h3>
            <p
              className="mt-auto text-xs text-white/45 tabular-nums"
              aria-live="polite"
            >
              {isReady
                ? `${data.durationSeconds}초 · 컷 ${data.cutCount}개 · 9:16`
                : `컷 ${data.cutCount}개를 합치는 중…`}
            </p>
          </div>
        </article>
      </NodeStatusIndicator>
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
