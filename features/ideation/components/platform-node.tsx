import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Check } from 'lucide-react';
import { NodeStatusIndicator } from '@/features/ideation/components/node-status-indicator';
import { PLATFORM_ICON_PATHS } from '@/features/ideation/components/platform-icon-paths';
import type { Platform } from '@/features/ideation/shared/mock-production';

export type PlatformNodeType = Node<
  {
    platform: Platform;
    status: 'uploading' | 'published';
    uploadMs: number;
  },
  'platform'
>;

// Class names stay as complete literals so Tailwind can detect them.
const PLATFORM_META: Record<
  Platform,
  { name: string; format: string; tileClass: string }
> = {
  tiktok: {
    name: 'TikTok',
    format: '숏폼 동영상',
    tileClass: 'bg-black ring-1 ring-inset ring-white/15'
  },
  youtube: {
    name: 'YouTube',
    format: 'Shorts',
    tileClass: 'bg-[#ff0000]'
  },
  instagram: {
    name: 'Instagram',
    format: 'Reels',
    tileClass: 'bg-linear-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5]'
  }
};

export function PlatformNode({ data }: NodeProps<PlatformNodeType>) {
  const { name, format, tileClass } = PLATFORM_META[data.platform];
  const isPublished = data.status === 'published';

  return (
    <div className="w-[248px]">
      <NodeStatusIndicator
        status={isPublished ? 'success' : 'loading'}
        radiusClassName="rounded-2xl"
      >
        <article className="relative rounded-2xl bg-[#1c1c1e] p-3 ring-1 ring-white/[0.08] transition-[opacity,translate] duration-300 ease-out starting:translate-x-2 starting:opacity-0">
          <div className="flex items-center gap-3">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-[11px] ${tileClass}`}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-5 fill-white"
              >
                <path d={PLATFORM_ICON_PATHS[data.platform]} />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-white">{name}</p>
              <p
                className="mt-0.5 flex items-center gap-1 text-xs text-white/50"
                aria-live="polite"
              >
                {isPublished ? (
                  <>
                    <Check className="size-3 text-[#30d158]" strokeWidth={3} />
                    <span className="text-[#30d158]">게시 완료</span>
                    <span>· {format}</span>
                  </>
                ) : (
                  <>업로드 중… · {format}</>
                )}
              </p>
            </div>
          </div>
          {!isPublished && (
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full origin-left rounded-full bg-[#0a84ff] transition-transform ease-out starting:scale-x-0"
                style={{ transitionDuration: `${data.uploadMs}ms` }}
              />
            </div>
          )}
        </article>
      </NodeStatusIndicator>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="opacity-0"
      />
    </div>
  );
}
