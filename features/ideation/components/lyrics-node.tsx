import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { AudioLines, Check } from 'lucide-react';
import { NodeStatusIndicator } from '@/features/ideation/components/node-status-indicator';
import {
  CUT_SECONDS,
  type Lyrics
} from '@/features/ideation/shared/mock-production';

export type LyricsNodeType = Node<
  | { status: 'writing' }
  | { status: 'ready'; lyrics: Lyrics; onConfirm: () => void }
  | { status: 'confirmed'; lyrics: Lyrics },
  'lyrics'
>;

export function LyricsNode({ data }: NodeProps<LyricsNodeType>) {
  return (
    <div className="w-[300px]">
      <NodeStatusIndicator
        status={data.status === 'writing' ? 'loading' : 'initial'}
        radiusClassName="rounded-2xl"
      >
        <section className="relative rounded-2xl bg-[#1c1c1e] p-4 ring-1 ring-white/[0.08] transition-[opacity,translate] duration-300 ease-out starting:translate-x-2 starting:opacity-0">
          <p className="flex items-center gap-1.5 text-xs font-medium text-white/50">
            <AudioLines className="size-3.5" />
            배경 음악 가사
          </p>

          {data.status === 'writing' ? (
            <div className="mt-4 space-y-2.5" aria-live="polite">
              <p className="sr-only">가사를 쓰는 중</p>
              <div className="h-3.5 w-1/2 animate-pulse rounded-full bg-white/[0.08]" />
              <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-white/[0.05]" />
              <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-white/[0.05]" />
              <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-white/[0.05]" />
            </div>
          ) : (
            <div className="transition-opacity duration-300 starting:opacity-0">
              <h3 className="mt-3 text-[15px] font-semibold text-white">
                {data.lyrics.title}
              </h3>
              <p className="mt-0.5 text-xs text-white/45">
                {data.lyrics.genre}
              </p>
              <ol className="mt-3.5 space-y-2 border-l border-white/10 pl-3">
                {data.lyrics.lines.map((line, index) => (
                  <li
                    key={line}
                    className="text-[13px] leading-snug text-white/80"
                  >
                    <span className="mr-2 text-[11px] text-white/35 tabular-nums">
                      0:{String(index * CUT_SECONDS).padStart(2, '0')}
                    </span>
                    {line}
                  </li>
                ))}
              </ol>

              {data.status === 'ready' ? (
                <button
                  type="button"
                  onClick={data.onConfirm}
                  className="mt-4 w-full rounded-full bg-[#0a84ff] px-4 py-2 text-[13px] font-semibold text-white transition-[background-color,scale] hover:bg-[#2b95ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] active:scale-[0.98]"
                >
                  이 가사로 영상 만들기
                </button>
              ) : (
                <p className="mt-4 flex items-center justify-center gap-1.5 py-2 text-[13px] font-medium text-white/50">
                  <Check className="size-3.5" strokeWidth={2.5} />
                  가사 확정
                </p>
              )}
            </div>
          )}
        </section>
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
