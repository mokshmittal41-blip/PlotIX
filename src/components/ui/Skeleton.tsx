interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '16px', borderRadius, className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <Skeleton height="180px" borderRadius="0" />
      <div style={{ padding: '14px 16px 16px' }}>
        <Skeleton height="12px" width="60%" />
        <div style={{ marginTop: '6px' }} />
        <Skeleton height="16px" width="80%" />
        <div style={{ marginTop: '4px' }} />
        <Skeleton height="12px" width="50%" />
        <div style={{ marginTop: '16px' }} />
        <Skeleton height="22px" width="50%" />
        <div style={{ marginTop: '4px' }} />
        <Skeleton height="12px" width="40%" />
      </div>
    </div>
  );
}
