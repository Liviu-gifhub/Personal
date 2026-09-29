import { useMemo } from 'react';
import { formatDateShort, parseDateKey } from '../../lib/time.js';
import './WeightChart.css';

/*
  Grafico peso in SVG puro: linea + area, griglia leggera, etichette min/max.
*/
export default function WeightChart({ weights, height = 180 }) {
  const data = useMemo(() => [...weights].sort((a, b) => (a.date < b.date ? -1 : 1)), [weights]);

  if (data.length < 2) {
    return (
      <div className="chart chart--empty" style={{ height }}>
        <span className="footnote">Aggiungi almeno due pesate per vedere l'andamento.</span>
      </div>
    );
  }

  const W = 600;
  const H = height;
  const padX = 12;
  const padTop = 18;
  const padBottom = 28;
  const kgs = data.map(d => d.kg);
  const minKg = Math.floor(Math.min(...kgs) - 0.5);
  const maxKg = Math.ceil(Math.max(...kgs) + 0.5);
  const t0 = parseDateKey(data[0].date).getTime();
  const t1 = parseDateKey(data[data.length - 1].date).getTime();
  const span = Math.max(1, t1 - t0);

  const x = d => padX + ((parseDateKey(d.date).getTime() - t0) / span) * (W - padX * 2);
  const y = kg => padTop + (1 - (kg - minKg) / (maxKg - minKg)) * (H - padTop - padBottom);

  const points = data.map(d => [x(d), y(d.kg)]);
  const path = points.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
  const area = `${path} L${points[points.length - 1][0].toFixed(1)},${(H - padBottom).toFixed(1)} L${points[0][0].toFixed(1)},${(H - padBottom).toFixed(1)} Z`;

  const gridLines = [];
  const step = maxKg - minKg > 6 ? 2 : 1;
  for (let kg = minKg; kg <= maxKg; kg += step) gridLines.push(kg);

  const last = data[data.length - 1];
  const first = data[0];

  return (
    <div className="chart" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={`Andamento peso da ${first.kg} a ${last.kg} kg`}>
        <defs>
          <linearGradient id="weight-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridLines.map(kg => (
          <g key={kg}>
            <line x1={padX} x2={W - padX} y1={y(kg)} y2={y(kg)} className="chart__grid" />
            <text x={W - padX} y={y(kg) - 4} className="chart__label" textAnchor="end">
              {kg} kg
            </text>
          </g>
        ))}
        <path d={area} fill="url(#weight-area)" />
        <path d={path} className="chart__line" />
        {points.map(([px, py], i) => (
          <circle key={data[i].date} cx={px} cy={py} r={i === points.length - 1 ? 5 : 3} className={`chart__dot${i === points.length - 1 ? ' chart__dot--last' : ''}`} />
        ))}
        <text x={padX} y={H - 8} className="chart__label">
          {formatDateShort(parseDateKey(first.date))}
        </text>
        <text x={W - padX} y={H - 8} className="chart__label" textAnchor="end">
          {formatDateShort(parseDateKey(last.date))}
        </text>
      </svg>
    </div>
  );
}
