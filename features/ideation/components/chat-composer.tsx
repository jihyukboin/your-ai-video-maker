import { ArrowUp, LoaderCircle } from 'lucide-react';
import { useId, useState, type KeyboardEvent } from 'react';

type ChatComposerProps = {
  busy: boolean;
  onSubmit: (prompt: string) => void;
};

export function ChatComposer({ busy, onSubmit }: ChatComposerProps) {
  const inputId = useId();
  const [value, setValue] = useState('');
  const prompt = value.trim();
  const canSubmit = prompt.length > 0 && !busy;

  function submit() {
    if (!canSubmit) return;
    onSubmit(prompt);
    setValue('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    // Ignore Enter while a Korean IME composition is still in progress.
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="flex items-end gap-2 rounded-[28px] bg-[#1e2127] p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.06]"
    >
      <label htmlFor={inputId} className="sr-only">
        영상 주제
      </label>
      <textarea
        id={inputId}
        rows={1}
        value={value}
        placeholder="만들고 싶은 영상의 주제를 입력하세요"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        className="max-h-52 min-h-9 flex-1 resize-none bg-transparent px-3 py-1.5 text-base leading-6 text-slate-100 outline-none field-sizing-content placeholder:text-slate-500"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        aria-label="아이디어 발굴하기"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e2127] focus-visible:outline-none disabled:opacity-25"
      >
        {busy ? (
          <LoaderCircle className="size-4.5 animate-spin" />
        ) : (
          <ArrowUp className="size-4.5" strokeWidth={2.5} />
        )}
      </button>
    </form>
  );
}
