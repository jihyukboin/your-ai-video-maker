// Adapted from the React Flow UI registry component:
// https://reactflow.dev/ui/components/node-status-indicator
// Changes: no shadcn `cn` helper, a configurable corner radius, and a
// uniquely named keyframe so it does not override Tailwind's `spin`.
import { type ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';

export type NodeStatus = 'loading' | 'success' | 'error' | 'initial';

export type NodeStatusVariant = 'overlay' | 'border';

export type NodeStatusIndicatorProps = {
  status?: NodeStatus;
  variant?: NodeStatusVariant;
  /** Tailwind radius class matching the wrapped node, e.g. `rounded-[32px]`. */
  radiusClassName?: string;
  children: ReactNode;
};

type IndicatorProps = { radiusClassName: string; children: ReactNode };

export const SpinnerLoadingIndicator = ({
  radiusClassName,
  children
}: IndicatorProps) => {
  return (
    <div className="relative">
      <StatusBorder
        radiusClassName={radiusClassName}
        className="border-blue-700/40"
      >
        {children}
      </StatusBorder>

      <div
        className={`absolute inset-0 z-50 bg-background/50 backdrop-blur-xs ${radiusClassName}`}
      />
      <div className="absolute inset-0 z-50">
        <span className="absolute top-[calc(50%-1.25rem)] left-[calc(50%-1.25rem)] inline-block h-10 w-10 animate-ping rounded-full bg-blue-700/20" />

        <LoaderCircle className="absolute top-[calc(50%-0.75rem)] left-[calc(50%-0.75rem)] size-6 animate-spin text-blue-700" />
      </div>
    </div>
  );
};

export const BorderLoadingIndicator = ({
  radiusClassName,
  children
}: IndicatorProps) => {
  return (
    <>
      <div className="absolute -top-px -left-px h-[calc(100%+2px)] w-[calc(100%+2px)]">
        <style>
          {`
        @keyframes node-status-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .node-status-spinner {
          animation: node-status-spin 2s linear infinite;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 140%;
          aspect-ratio: 1;
          transform-origin: center;
        }
      `}
        </style>
        <div className={`absolute inset-0 overflow-hidden ${radiusClassName}`}>
          <div className="node-status-spinner rounded-full bg-[conic-gradient(from_0deg_at_50%_50%,rgb(42,67,233)_0deg,rgba(42,138,246,0)_360deg)]" />
        </div>
      </div>
      {children}
    </>
  );
};

const StatusBorder = ({
  radiusClassName,
  className,
  children
}: IndicatorProps & { className: string }) => {
  return (
    <>
      <div
        className={`absolute -top-px -left-px h-[calc(100%+2px)] w-[calc(100%+2px)] border-2 ${radiusClassName} ${className}`}
      />
      {children}
    </>
  );
};

export const NodeStatusIndicator = ({
  status,
  variant = 'border',
  radiusClassName = 'rounded-[9px]',
  children
}: NodeStatusIndicatorProps) => {
  switch (status) {
    case 'loading':
      switch (variant) {
        case 'overlay':
          return (
            <SpinnerLoadingIndicator radiusClassName={radiusClassName}>
              {children}
            </SpinnerLoadingIndicator>
          );
        case 'border':
          return (
            <BorderLoadingIndicator radiusClassName={radiusClassName}>
              {children}
            </BorderLoadingIndicator>
          );
        default:
          return <>{children}</>;
      }
    case 'success':
      return (
        <StatusBorder
          radiusClassName={radiusClassName}
          className="border-emerald-600"
        >
          {children}
        </StatusBorder>
      );
    case 'error':
      return (
        <StatusBorder
          radiusClassName={radiusClassName}
          className="border-red-400"
        >
          {children}
        </StatusBorder>
      );
    default:
      return <>{children}</>;
  }
};
