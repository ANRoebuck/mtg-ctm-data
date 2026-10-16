const MAX_CHARS = 18

interface TickProps {
  x?: number
  y?: number
  payload?: { value: string | number }
}

/** Y-axis tick that stays on one line, truncating with an ellipsis; the full text shows on hover. */
export function TruncatedTick({ x = 0, y = 0, payload }: TickProps) {
  const full = String(payload?.value ?? '')
  const text = full.length > MAX_CHARS ? `${full.slice(0, MAX_CHARS - 1)}…` : full
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={12}>
      <title>{full}</title>
      {text}
    </text>
  )
}
