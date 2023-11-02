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
    <progress
      className="progress progress-primary"
      value={progress}
      max={100}
    />
  );
}
