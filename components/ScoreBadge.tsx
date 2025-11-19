import React from 'react';

interface ScoreBadgeProps {
  score: number;
  tier: string;
  colorClass: string;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, tier, colorClass }) => {
  // Extract the base color for the ring (approximated from the class string for inline styles if needed, but we use Tailwind classes)
  // We'll use SVG for a partial circle progress bar effect
  const radius = 30;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Map color class to hex for the stroke (simplified mapping)
  let strokeColor = '#ef4444'; // red
  if (score >= 80) strokeColor = '#34d399'; // emerald
  else if (score >= 60) strokeColor = '#60a5fa'; // blue
  else if (score >= 40) strokeColor = '#facc15'; // yellow

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-2">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="#334155"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute text-lg font-bold text-white">{score}</span>
      </div>
      <span className={`px-2 py-1 text-xs font-bold border rounded rounded-md uppercase tracking-wider ${colorClass}`}>
        {tier}
      </span>
    </div>
  );
};