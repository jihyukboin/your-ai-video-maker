import {
  Clapperboard,
  GraduationCap,
  HeartHandshake,
  TrendingUp,
  type LucideIcon
} from 'lucide-react';
import type { IdeaKind } from '@/features/ideation/shared/mock-ideas';

type IdeaKindMeta = {
  label: string;
  Icon: LucideIcon;
  stroke: string;
  chipClass: string;
  selectedClass: string;
  /** Gradient used for the mock video thumbnails produced from this idea. */
  thumbnailClass: string;
};

// Class names stay as complete literals so Tailwind can detect them.
export const IDEA_KIND_META: Record<IdeaKind, IdeaKindMeta> = {
  story: {
    label: '스토리텔링',
    Icon: Clapperboard,
    stroke: '#a78bfa',
    chipClass: 'bg-violet-400/10 text-violet-300',
    selectedClass: 'ring-violet-400/70',
    thumbnailClass: 'from-violet-500/70 via-fuchsia-500/30 to-[#1c1c1e]'
  },
  education: {
    label: '정보 · 교육',
    Icon: GraduationCap,
    stroke: '#38bdf8',
    chipClass: 'bg-sky-400/10 text-sky-300',
    selectedClass: 'ring-sky-400/70',
    thumbnailClass: 'from-sky-500/70 via-cyan-400/30 to-[#1c1c1e]'
  },
  trend: {
    label: '트렌드 · 숏폼',
    Icon: TrendingUp,
    stroke: '#fb7185',
    chipClass: 'bg-rose-400/10 text-rose-300',
    selectedClass: 'ring-rose-400/70',
    thumbnailClass: 'from-rose-500/70 via-orange-400/30 to-[#1c1c1e]'
  },
  emotion: {
    label: '감성 · 브랜딩',
    Icon: HeartHandshake,
    stroke: '#fbbf24',
    chipClass: 'bg-amber-400/10 text-amber-300',
    selectedClass: 'ring-amber-400/70',
    thumbnailClass: 'from-amber-400/70 via-orange-300/30 to-[#1c1c1e]'
  }
};
