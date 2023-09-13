interface ProgressBarProps {
  start: Date;
  end: Date;
}

export function ProgressBar({ start, end }: ProgressBarProps) {
  const progress = Math.max(
    0,
    Math.min(
      ((Date.now() - start.valueOf()) * 100) /
        (end.valueOf() - start.valueOf()),
      100,
    ),
  ).toFixed(1);

  return (
    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className="h-full rounded-full bg-primary"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
