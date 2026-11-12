'use client';

import '@xyflow/react/dist/style.css';

import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Dimensions,
  type FitViewOptions,
  type NodeChange,
  type NodeTypes
} from '@xyflow/react';
import { CircleCheck, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ChatComposer } from '@/features/ideation/components/chat-composer';
import { CutNode } from '@/features/ideation/components/cut-node';
import { DiscoveryNode } from '@/features/ideation/components/discovery-node';
import { IdeaNode } from '@/features/ideation/components/idea-node';
import { LyricsNode } from '@/features/ideation/components/lyrics-node';
import { PlatformNode } from '@/features/ideation/components/platform-node';
import {
  buildFlow,
  getCameraFocus,
  getNextStep,
  isFullyPublished,
  type FlowNode,
  type Session
} from '@/features/ideation/components/production-flow';
import { VideoNode } from '@/features/ideation/components/video-node';
import type { Idea } from '@/features/ideation/shared/mock-ideas';

const nodeTypes = {
  discovery: DiscoveryNode,
  idea: IdeaNode,
  lyrics: LyricsNode,
  cut: CutNode,
  video: VideoNode,
  platform: PlatformNode
} satisfies NodeTypes;

const FIT_VIEW_OPTIONS = {
  // The extra bottom padding keeps the docked composer clear of the nodes.
  padding: { x: '48px', top: '72px', bottom: '140px' },
  maxZoom: 1,
  duration: 600
} satisfies FitViewOptions;

function IdeationCanvas() {
  const { fitView } = useReactFlow<FlowNode>();
  const [session, setSession] = useState<Session>({ phase: 'idle' });
  const [measured, setMeasured] = useState<Record<string, Dimensions>>({});

  // Advance the mock pipeline. Any session change (a new prompt, another
  // idea, a reset) clears the pending timer, so stale steps never land.
  useEffect(() => {
    const step = getNextStep(session);
    if (!step) return;
    const timer = window.setTimeout(() => setSession(step.session), step.after);
    return () => window.clearTimeout(timer);
  }, [session]);

  function discover(prompt: string) {
    setSession({ phase: 'discovering', prompt });
  }

  function selectIdea(idea: Idea) {
    if (session.phase !== 'ideas') return;
    if (session.selected?.idea.kind === idea.kind) return;
    setSession({
      ...session,
      selected: { idea, production: { stage: 'writing' } }
    });
  }

  function confirmLyrics() {
    if (session.phase !== 'ideas') return;
    const { selected } = session;
    if (selected?.production.stage !== 'lyrics-ready') return;
    setSession({
      ...session,
      selected: {
        idea: selected.idea,
        production: {
          stage: 'rendering',
          lyrics: selected.production.lyrics,
          renderedCuts: 0
        }
      }
    });
  }

  function reset() {
    setSession({ phase: 'idle' });
  }

  // Nodes are derived from the session, so keep React Flow's measurements
  // here; otherwise every rebuilt node object would be measured again.
  function handleNodesChange(changes: NodeChange<FlowNode>[]) {
    const sizes: Record<string, Dimensions> = {};
    for (const change of changes) {
      if (change.type === 'dimensions' && change.dimensions) {
        sizes[change.id] = change.dimensions;
      }
    }
    if (Object.keys(sizes).length > 0) {
      setMeasured((current) => ({ ...current, ...sizes }));
    }
  }

  const flow = buildFlow(session, { selectIdea, confirmLyrics });
  const nodes = flow.nodes.map((node): FlowNode => {
    const size = measured[node.id];
    return size ? { ...node, measured: size } : node;
  });

  const focus = getCameraFocus(session);
  const focusKey = Array.isArray(focus) ? focus.join(',') : (focus ?? '');

  useEffect(() => {
    if (!focusKey) return;
    void fitView({
      ...FIT_VIEW_OPTIONS,
      nodes:
        focusKey === 'all'
          ? undefined
          : focusKey.split(',').map((id) => ({ id }))
    });
  }, [focusKey, fitView]);

  const isIdle = session.phase === 'idle';
  const hint =
    session.phase === 'ideas' && !session.selected
      ? '마음에 드는 아이디어를 선택하세요'
      : null;

  return (
    <div className="absolute inset-0">
      <ReactFlow
        aria-label="영상 제작 보드"
        colorMode="dark"
        style={{ backgroundColor: 'transparent' }}
        nodes={nodes}
        edges={flow.edges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        nodeOrigin={[0, 0.5]}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        deleteKeyCode={null}
        minZoom={0.3}
        maxZoom={1.5}
      >
        {!isIdle && (
          <Background
            variant={BackgroundVariant.Dots}
            bgColor="transparent"
            gap={24}
            size={1}
            color="rgba(148, 163, 184, 0.14)"
          />
        )}
      </ReactFlow>

      {isIdle ? (
        <section className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pb-[12vh]">
          <h1 className="mb-8 text-[28px] font-medium tracking-tight break-keep text-slate-100">
            어떤 영상을 만들고 싶나요?
          </h1>
          <div className="pointer-events-auto w-full max-w-3xl">
            <ChatComposer busy={false} onSubmit={discover} />
          </div>
        </section>
      ) : (
        <>
          {(hint || isFullyPublished(session)) && (
            <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex justify-center px-16">
              <output
                key={hint ?? 'published'}
                className="flex items-center gap-2 rounded-full bg-[#2c2c2e]/80 px-4 py-2 text-[13px] font-medium text-white/85 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.08] backdrop-blur-xl transition-[opacity,translate] duration-500 ease-out starting:-translate-y-2 starting:opacity-0"
              >
                {hint ?? (
                  <>
                    <CircleCheck className="size-4 text-[#30d158]" />
                    TikTok · YouTube · Instagram에 게시했어요
                  </>
                )}
              </output>
            </div>
          )}

          <button
            type="button"
            onClick={reset}
            aria-label="새로 시작"
            title="새로 시작"
            className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            <SquarePen className="size-4.5" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-6">
            <div className="pointer-events-auto w-full max-w-3xl">
              <ChatComposer
                busy={session.phase === 'discovering'}
                onSubmit={discover}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function IdeationWorkspace() {
  return (
    <ReactFlowProvider>
      <IdeationCanvas />
    </ReactFlowProvider>
  );
}
