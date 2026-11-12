import type { Edge } from '@xyflow/react';
import type { CSSProperties } from 'react';
import type { CutNodeType } from '@/features/ideation/components/cut-node';
import type { DiscoveryNodeType } from '@/features/ideation/components/discovery-node';
import { IDEA_KIND_META } from '@/features/ideation/components/idea-kind-meta';
import type { IdeaNodeType } from '@/features/ideation/components/idea-node';
import type { LyricsNodeType } from '@/features/ideation/components/lyrics-node';
import type { PlatformNodeType } from '@/features/ideation/components/platform-node';
import type { VideoNodeType } from '@/features/ideation/components/video-node';
import {
  createMockIdeas,
  type Idea,
  type IdeaKind
} from '@/features/ideation/shared/mock-ideas';
import {
  CUT_SECONDS,
  createCuts,
  createMockLyrics,
  PLATFORMS,
  type Lyrics,
  type Platform
} from '@/features/ideation/shared/mock-production';

export type Production =
  | { stage: 'writing' }
  | { stage: 'lyrics-ready'; lyrics: Lyrics }
  | { stage: 'rendering'; lyrics: Lyrics; renderedCuts: number }
  | { stage: 'merging'; lyrics: Lyrics }
  | { stage: 'publishing'; lyrics: Lyrics; published: Platform[] };

export type Session =
  | { phase: 'idle' }
  | { phase: 'discovering'; prompt: string }
  | {
      phase: 'ideas';
      prompt: string;
      ideas: Idea[];
      selected: { idea: Idea; production: Production } | null;
    };

export type FlowNode =
  | DiscoveryNodeType
  | IdeaNodeType
  | LyricsNodeType
  | CutNodeType
  | VideoNodeType
  | PlatformNodeType;

type FlowActions = {
  selectIdea: (idea: Idea) => void;
  confirmLyrics: () => void;
};

export const DISCOVERY_MS = 2000;
export const LYRICS_MS = 2000;
export const CUT_RENDER_MS = 1500;
export const MERGE_MS = 1200;
export const PLATFORM_UPLOAD_MS: Record<Platform, number> = {
  tiktok: 1400,
  youtube: 2600,
  instagram: 2000
};

// Platforms finish in order of their mock upload time.
const UPLOAD_ORDER = [...PLATFORMS].sort(
  (a, b) => PLATFORM_UPLOAD_MS[a] - PLATFORM_UPLOAD_MS[b]
);

const COLUMN_X = {
  discovery: 0,
  idea: 260,
  lyrics: 660,
  cut: 1060,
  video: 1392,
  platform: 1792
};
const IDEA_ROW_GAP = 216;
const CUT_ROW_GAP = 212;
const PLATFORM_ROW_GAP = 112;

const DISCOVERY_ID = 'discovery';
const LYRICS_ID = 'lyrics';
const VIDEO_ID = 'video';
const ideaId = (kind: IdeaKind) => `idea-${kind}`;
const cutId = (index: number) => `cut-${index}`;
const platformId = (platform: Platform) => `platform-${platform}`;

const PENDING_STROKE = 'rgba(235, 235, 245, 0.18)';

// Nodes are neither selectable nor draggable, so React Flow sets
// `pointer-events: none` on them; nodes with buttons must opt back in.
const INTERACTIVE_NODE_STYLE = { pointerEvents: 'all' } satisfies CSSProperties;

function rowY(order: number, count: number, gap: number, anchor = 0) {
  return anchor + (order - (count - 1) / 2) * gap;
}

function createEdge(
  source: string,
  target: string,
  state: 'active' | 'done' | 'pending' | 'muted',
  color: string
): Edge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    selectable: false,
    // React Flow's built-in dash animation marks the step currently running.
    animated: state === 'active',
    style: {
      stroke: state === 'pending' || state === 'muted' ? PENDING_STROKE : color,
      strokeWidth: 1.5,
      strokeDasharray: state === 'pending' ? '4 6' : undefined,
      opacity: state === 'muted' ? 0.5 : 1,
      transition: 'stroke 300ms, opacity 300ms'
    }
  };
}

function cutStatus(
  production: Production,
  index: number
): CutNodeType['data']['status'] {
  if (production.stage !== 'rendering') return 'done';
  if (index < production.renderedCuts) return 'done';
  return index === production.renderedCuts ? 'rendering' : 'queued';
}

export function buildFlow(
  session: Session,
  actions: FlowActions
): { nodes: FlowNode[]; edges: Edge[] } {
  if (session.phase === 'idle') return { nodes: [], edges: [] };

  const nodes: FlowNode[] = [
    {
      id: DISCOVERY_ID,
      type: 'discovery',
      position: { x: COLUMN_X.discovery, y: 0 },
      data: { status: session.phase === 'discovering' ? 'loading' : 'initial' }
    }
  ];
  const edges: Edge[] = [];

  if (session.phase === 'discovering') return { nodes, edges };

  const { ideas, selected } = session;

  ideas.forEach((idea, order) => {
    const isSelected = selected?.idea.kind === idea.kind;
    nodes.push({
      id: ideaId(idea.kind),
      type: 'idea',
      style: INTERACTIVE_NODE_STYLE,
      position: {
        x: COLUMN_X.idea,
        y: rowY(order, ideas.length, IDEA_ROW_GAP)
      },
      data: {
        idea,
        order,
        selection: !selected ? 'none' : isSelected ? 'selected' : 'dimmed',
        onSelect: () => actions.selectIdea(idea)
      }
    });
    edges.push(
      createEdge(
        DISCOVERY_ID,
        ideaId(idea.kind),
        !selected ? 'active' : isSelected ? 'done' : 'muted',
        IDEA_KIND_META[idea.kind].stroke
      )
    );
  });

  if (!selected) return { nodes, edges };

  const { idea, production } = selected;
  const color = IDEA_KIND_META[idea.kind].stroke;
  const anchorY = rowY(
    ideas.findIndex((candidate) => candidate.kind === idea.kind),
    ideas.length,
    IDEA_ROW_GAP
  );
  const hasConfirmedLyrics =
    production.stage !== 'writing' && production.stage !== 'lyrics-ready';

  nodes.push({
    id: LYRICS_ID,
    type: 'lyrics',
    style: INTERACTIVE_NODE_STYLE,
    position: { x: COLUMN_X.lyrics, y: anchorY },
    data:
      production.stage === 'writing'
        ? { status: 'writing' }
        : production.stage === 'lyrics-ready'
          ? {
              status: 'ready',
              lyrics: production.lyrics,
              onConfirm: actions.confirmLyrics
            }
          : { status: 'confirmed', lyrics: production.lyrics }
  });
  edges.push(
    createEdge(
      ideaId(idea.kind),
      LYRICS_ID,
      hasConfirmedLyrics ? 'done' : 'active',
      color
    )
  );

  if (production.stage === 'writing' || production.stage === 'lyrics-ready') {
    return { nodes, edges };
  }

  const cuts = createCuts(production.lyrics);
  cuts.forEach((cut) => {
    const status = cutStatus(production, cut.index);
    nodes.push({
      id: cutId(cut.index),
      type: 'cut',
      position: {
        x: COLUMN_X.cut,
        y: rowY(cut.index, cuts.length, CUT_ROW_GAP, anchorY)
      },
      data: { cut, kind: idea.kind, status, renderMs: CUT_RENDER_MS }
    });
    edges.push(
      createEdge(
        LYRICS_ID,
        cutId(cut.index),
        status === 'queued'
          ? 'pending'
          : status === 'rendering'
            ? 'active'
            : 'done',
        color
      )
    );
  });

  if (production.stage === 'rendering') return { nodes, edges };

  nodes.push({
    id: VIDEO_ID,
    type: 'video',
    position: { x: COLUMN_X.video, y: anchorY },
    data: {
      title: idea.title,
      kind: idea.kind,
      cutCount: cuts.length,
      durationSeconds: cuts.length * CUT_SECONDS,
      status: production.stage === 'merging' ? 'merging' : 'ready'
    }
  });
  cuts.forEach((cut) => {
    edges.push(
      createEdge(
        cutId(cut.index),
        VIDEO_ID,
        production.stage === 'merging' ? 'active' : 'done',
        color
      )
    );
  });

  if (production.stage === 'merging') return { nodes, edges };

  PLATFORMS.forEach((platform, order) => {
    const isPublished = production.published.includes(platform);
    nodes.push({
      id: platformId(platform),
      type: 'platform',
      position: {
        x: COLUMN_X.platform,
        y: rowY(order, PLATFORMS.length, PLATFORM_ROW_GAP, anchorY)
      },
      data: {
        platform,
        status: isPublished ? 'published' : 'uploading',
        uploadMs: PLATFORM_UPLOAD_MS[platform]
      }
    });
    edges.push(
      createEdge(
        VIDEO_ID,
        platformId(platform),
        isPublished ? 'done' : 'active',
        color
      )
    );
  });

  return { nodes, edges };
}

export function isFullyPublished(session: Session): boolean {
  return (
    session.phase === 'ideas' &&
    session.selected?.production.stage === 'publishing' &&
    session.selected.production.published.length === PLATFORMS.length
  );
}

/**
 * Node ids the camera should frame. The camera follows the running step and
 * pulls back to the whole journey once every platform is published.
 */
export function getCameraFocus(session: Session): string[] | 'all' | null {
  if (session.phase === 'idle') return null;
  if (session.phase === 'discovering') return [DISCOVERY_ID];

  const { ideas, selected } = session;
  if (!selected) {
    return [DISCOVERY_ID, ...ideas.map((idea) => ideaId(idea.kind))];
  }

  const { production } = selected;
  switch (production.stage) {
    case 'writing':
    case 'lyrics-ready':
      return [ideaId(selected.idea.kind), LYRICS_ID];
    case 'rendering':
      return [
        LYRICS_ID,
        ...createCuts(production.lyrics).map(({ index }) => cutId(index))
      ];
    case 'merging':
      return [
        ...createCuts(production.lyrics).map(({ index }) => cutId(index)),
        VIDEO_ID
      ];
    case 'publishing':
      return isFullyPublished(session)
        ? 'all'
        : [VIDEO_ID, ...PLATFORMS.map(platformId)];
  }
}

function nextProduction(
  idea: Idea,
  production: Production
): { after: number; production: Production } | null {
  switch (production.stage) {
    case 'writing':
      return {
        after: LYRICS_MS,
        production: { stage: 'lyrics-ready', lyrics: createMockLyrics(idea) }
      };
    case 'lyrics-ready':
      // Waits for the user to confirm the lyrics.
      return null;
    case 'rendering': {
      const { lyrics, renderedCuts } = production;
      const isLastCut = renderedCuts + 1 >= lyrics.lines.length;
      return {
        after: CUT_RENDER_MS,
        production: isLastCut
          ? { stage: 'merging', lyrics }
          : { stage: 'rendering', lyrics, renderedCuts: renderedCuts + 1 }
      };
    }
    case 'merging':
      return {
        after: MERGE_MS,
        production: {
          stage: 'publishing',
          lyrics: production.lyrics,
          published: []
        }
      };
    case 'publishing': {
      const { lyrics, published } = production;
      const platform = UPLOAD_ORDER[published.length];
      if (!platform) return null;
      const previous = UPLOAD_ORDER[published.length - 1];
      return {
        after:
          PLATFORM_UPLOAD_MS[platform] -
          (previous ? PLATFORM_UPLOAD_MS[previous] : 0),
        production: {
          stage: 'publishing',
          lyrics,
          published: [...published, platform]
        }
      };
    }
  }
}

/** The mock pipeline's next automatic transition, or null when it must wait. */
export function getNextStep(
  session: Session
): { after: number; session: Session } | null {
  if (session.phase === 'idle') return null;
  if (session.phase === 'discovering') {
    return {
      after: DISCOVERY_MS,
      session: {
        phase: 'ideas',
        prompt: session.prompt,
        ideas: createMockIdeas(session.prompt),
        selected: null
      }
    };
  }
  if (!session.selected) return null;

  const { idea } = session.selected;
  const step = nextProduction(idea, session.selected.production);
  if (!step) return null;

  return {
    after: step.after,
    session: { ...session, selected: { idea, production: step.production } }
  };
}
