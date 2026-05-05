interface ColSizeProps{
  size?: number | string;
  xs?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
}

const isGridSizeValue=(value:unknown):boolean=> {
  if (typeof value === 'number') return true;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return (
      trimmed==='auto' || (trimmed!== '' && !isNaN(Number(trimmed)))
    )
  }
  return typeof value === 'object' && value !== null && 'size' in value && isGridSizeValue(value.size);
} 

export const colProps = ({ size, xs,sm,md,lg,xl }: ColSizeProps): Record<string, any> => {
  if (isGridSizeValue(size)) return { size };

  const ret: Record<string, any> = {};
  if (isGridSizeValue(xs)) ret.xs = xs;
  if (isGridSizeValue(sm)) ret.sm = sm;
  if (isGridSizeValue(md)) ret.md = md;
  if (isGridSizeValue(lg)) ret.lg = lg;
  if (isGridSizeValue(xl)) ret.xl = xl;
  return ret;
};