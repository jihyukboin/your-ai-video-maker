export const IDEA_KINDS = ['story', 'education', 'trend', 'emotion'] as const;

export type IdeaKind = (typeof IDEA_KINDS)[number];

export type Idea = {
  kind: IdeaKind;
  title: string;
  hook: string;
};

const TOPIC_MAX_LENGTH = 24;

function toTopic(prompt: string): string {
  const normalized = prompt.replace(/\s+/g, ' ').trim();

  return normalized.length > TOPIC_MAX_LENGTH
    ? `${normalized.slice(0, TOPIC_MAX_LENGTH)}…`
    : normalized;
}

export function createMockIdeas(prompt: string): Idea[] {
  const topic = toTopic(prompt);

  return [
    {
      kind: 'story',
      title: `${topic}, 그 시작의 순간`,
      hook: '평범한 하루에서 출발해 전환점을 맞는 3막 구성으로 끝까지 몰입하게 만듭니다.'
    },
    {
      kind: 'education',
      title: `1분 만에 이해하는 ${topic}`,
      hook: '핵심을 세 단계로 나누고 모션 그래픽으로 시각화해 저장과 공유를 이끌어냅니다.'
    },
    {
      kind: 'trend',
      title: `${topic} 챌린지 리믹스`,
      hook: '첫 2초 훅, 빠른 컷 전환, 트렌딩 사운드로 추천 피드 노출을 노립니다.'
    },
    {
      kind: 'emotion',
      title: `마음을 움직이는 ${topic}`,
      hook: '따뜻한 색감과 잔잔한 BGM, 인터뷰 컷을 엮어 브랜드에 대한 공감을 쌓습니다.'
    }
  ];
}
