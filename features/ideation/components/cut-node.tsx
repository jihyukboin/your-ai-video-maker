import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Check } from 'lucide-react';
import { IDEA_KIND_META } from '@/features/ideation/components/idea-kind-meta';
import { NodeStatusIndicator } from '@/features/ideation/components/node-status-indicator';
import type { IdeaKind } from '@/features/ideation/shared/mock-ideas';
import type { Cut } from '@/features/ideation/shared/mock-production';

export type CutNodeType = Node<
  {
    cut: Cut;
    kind: IdeaKind;
    status: 'queued' | 'rendering' | 'done';
    renderMs: number;
  },
  'cut'
>;

function formatSecond(second: number): string {
  return `0:${String(second).padStart(2, '0')}`;
}

export function CutNode({ data }: NodeProps<CutNodeType>) {
  const { cut, status, renderMs } = data;
  const { thumbnailClass } = IDEA_KIND_META[data.kind];

  return (
    <div className="w-[232px]">
      <NodeStatusIndicator
        status={status === 'rendering' ? 'loading' : 'initial'}
        radiusClassName="rounded-2xl"
      >
        <article className="relative rounded-2xl bg-[#1c1c1e] p-2.5 ring-1 ring-white/[0.08] transition-[opacity,translate] duration-300 ease-out starting:translate-x-2 starting:opacity-0">
          <div
            className={`relative aspect-video overflow-hidden rounded-[10px] bg-linear-to-br transition-opacity duration-500 ${thumbnailClass} ${
              status === 'queued' ? 'opacity-25' : 'opacity-100'
            }`}
          >
            {status === 'rendering' && (
              <div className="absolute inset-0 animate-pulse bg-black/30" />
            )}
            <p
              className={`absolute inset-x-2.5 bottom-2 line-clamp-2 text-[12px] leading-snug font-medium text-white drop-shadow transition-opacity duration-500 ${
                status === 'done' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {cut.lyric}
            </p>
            {status === 'done' && (
              <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-transform duration-300 starting:scale-50">
                <Check className="size-3" strokeWidth={3} />
              </span>
            )}
            {status === 'rendering' && (
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/15">
                <div
                  className="h-full origin-left bg-white transition-transform ease-linear starting:scale-x-0"
                  style={{ transitionDuration: `${renderMs}ms` }}
                />
              </div>
            )}
          </div>

          <div className="px-1 pt-2.5 pb-0.5">
            <p className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold text-white">
                컷 {cut.index + 1}
              </span>
              <span className="text-[11px] text-white/40 tabular-nums">
                {formatSecond(cut.startSecond)} – {formatSecond(cut.endSecond)}
              </span>
            </p>
            <p className="mt-0.5 text-xs text-white/50" aria-live="polite">
              {status === 'queued'
                ? '대기 중'
                : status === 'rendering'
                  ? '렌더링 중…'
                  : cut.scene}
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
