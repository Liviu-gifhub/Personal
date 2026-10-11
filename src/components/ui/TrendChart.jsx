import { useMemo } from 'react';
import './WeightChart.css';

/*
  Grafico a linea/barre generico in SVG per andamenti (completamento, volume, acqua).
  points: [{ label, value }], value in unità reali.
*/
export default function TrendChart({
  points = [],
  height = 140,
  color = 'var(--accent)',
  formatValue = v => String(v),
  emptyText = 'Non ci sono ancora abbastanza dati.',
  mode = 'line',
  ariaLabel = 'Andamento'
}) {
  const data = useMemo(() => points.filter(p => p && Number.isFinite(p.value)), [points]);

  if (data.length < 2) {
    return (
      <div className="chart chart--empty" style={{ height }}>
        <span className="footnote">{emptyText}</span>
      </div>
    );
  }

  const W = 600;
  const H = height;
  const padX = 14;
  const padTop = 16;
  const padBottom = 26;
  const values = data.map(d => d.value);
  const minV = Math.min(0, Math.min(...values));
  const maxRaw = Math.max(...values);
  const maxV = maxRaw === minV ? minV + 1 : maxRaw;
  const span = maxV - minV || 1;

  const x = i => padX + (data.length === 1 ? (W - padX * 2) / 2 : (i / (data.length - 1)) * (W - padX * 2));
  const y = v => padTop + (1 - (v - minV) / span) * (H - padTop - padBottom);
  const barW = Math.max(4, (W - padX * 2) / data.length - 6);

  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = `${path} L${x(data.length - 1).toFixed(1)},${(H - padBottom).toFixed(1)} L${x(0).toFixed(1)},${(H - padBottom).toFixed(1)} Z`;
  const gradId = `trend-${color.replace(/[^a-z0-9]/gi, '')}-${mode}`;

  return (
    <div className="chart" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={padX} x2={W - padX} y1={y(0)} y2={y(0)} className="chart__grid" />
        {mode === 'bar'
          ? data.map((d, i) => (
              <rect
                key={`${d.label}-${i}`}
                x={x(i) - barW / 2}
                y={y(d.value)}
                width={barW}
                height={Math.max(1, H - padBottom - y(d.value))}
                rx="3"
                fill={color}
                opacity={0.75}
              />
            ))
          : (
            <>
              <path d={area} fill={`url(#${gradId})`} />
              <path d={path} className="chart__line" style={{ stroke: color }} />
              {data.map((d, i) => (
                <circle
                  key={`${d.label}-${i}`}
                  cx={x(i)}
                  cy={y(d.value)}
                  r={i === data.length - 1 ? 4.5 : 3}
                  className={`chart__dot${i === data.length - 1 ? ' chart__dot--last' : ''}`}
                  style={{ fill: color }}
                />
              ))}
            </>
          )}
        <text x={padX} y={H - 8} className="chart__label">
          {data[0].label}
        </text>
        <text x={W - padX} y={H - 8} className="chart__label" textAnchor="end">
          {formatValue(data[data.length - 1].value)} · {data[data.length - 1].label}
        </text>
      </svg>
    </div>
  );
}
