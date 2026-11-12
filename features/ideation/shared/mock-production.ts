import type { Idea, IdeaKind } from '@/features/ideation/shared/mock-ideas';

export const CUT_SECONDS = 10;

export const PLATFORMS = ['tiktok', 'youtube', 'instagram'] as const;

export type Platform = (typeof PLATFORMS)[number];

/** One lyric line per cut, so the 30-second video maps to three lines. */
export type Lyrics = {
  title: string;
  genre: string;
  lines: [string, string, string];
};

export type Cut = {
  index: number;
  startSecond: number;
  endSecond: number;
  scene: string;
  lyric: string;
};

const LYRICS_BY_KIND: Record<IdeaKind, Lyrics> = {
  story: {
    title: '처음의 온도',
    genre: '어쿠스틱 팝 · 84 BPM',
    lines: [
      '아무렇지 않던 하루 끝에',
      '작은 용기가 문을 열고',
      '우린 다시 시작을 노래해'
    ]
  },
  education: {
    title: '한 걸음씩',
    genre: 'Lo-fi 힙합 · 90 BPM',
    lines: [
      '어렵던 건 잠깐이야',
      '하나 둘 셋 정리해 보면',
      '이제 너도 알 수 있어'
    ]
  },
  trend: {
    title: '리믹스 나우',
    genre: '일렉트로 팝 · 124 BPM',
    lines: ['지금 이 순간 플레이', '박자 위에 몸을 맡겨', '모두 따라 해 챌린지']
  },
  emotion: {
    title: '오래 남는 마음',
    genre: '시네마틱 피아노 · 72 BPM',
    lines: ['조용히 스며든 빛처럼', '네 곁에 머물던 순간', '마음은 오래 남아']
  }
};

const CUT_SCENES = [
  '오프닝 · 시선을 끄는 훅',
  '전개 · 핵심 메시지',
  '엔딩 · 여운과 마무리'
];

export function createMockLyrics(idea: Idea): Lyrics {
  return LYRICS_BY_KIND[idea.kind];
}

export function createCuts(lyrics: Lyrics): Cut[] {
  return lyrics.lines.map((lyric, index) => ({
    index,
    startSecond: index * CUT_SECONDS,
    endSecond: (index + 1) * CUT_SECONDS,
    scene: CUT_SCENES[index] ?? '',
    lyric
  }));
}
