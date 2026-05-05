import { useState } from 'react';
import type { ComponentType, MouseEvent } from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PanoramaFishEyeSharpIcon from '@mui/icons-material/PanoramaFishEyeSharp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBack from '@mui/icons-material/ArrowBack';

/**
 * Predefined icon components from Material-UI.
 * Use these as values for the Icon component's `src` prop.
 */
export const iconType = {
  complete:        CheckCircleIcon,
  completeContain: CheckCircleIcon,
  completeOutline: CheckCircleOutlineIcon,
  uncomplete:      PanoramaFishEyeSharpIcon,
  forwardArrow:    ArrowForwardIosIcon,
  arrow:           ArrowForwardIosIcon,
  arrowForward:    ArrowForwardIosIcon,
  backArrow:       ArrowBack,
  arrowBack:       ArrowBack,
  arrowBackward:   ArrowBack,
  expanded:        ExpandMoreIcon,
  expand:          ExpandMoreIcon,
  accordion:       ExpandMoreIcon,
  add:             AddIcon,
  remove:          RemoveIcon,
} as const;

type IconTypeValue = (typeof iconType)[keyof typeof iconType];
type SizeKey = 'sm' | 'md' | 'lg';
type TextPosition = 'left' | 'right';

const sizeMap: Record<SizeKey, number> = { sm: 16, md: 24, lg: 28 };
const arrowSizeMap: Record<string, number> = { sm: 12, md: 16, lg: 20, xl: 28 };

interface IconProps {
  /** Icon component — use iconType.xxx or any MUI SvgIcon */
  src: IconTypeValue | ComponentType<any>;
  text?: string;
  size?: SizeKey;
  fontSize?: SizeKey;
  /** Initial expanded state for accordion rotation (uncontrolled) */
  expanded?: boolean;
  onClick?: (e: MouseEvent) => void;
  textPosition?: TextPosition;
  className?: string;
  colorIcon?: string;
  color?: string;
  bold?: boolean;
  [key: string]: any;
}

export const Icon = ({
  src,
  text,
  size = 'md',
  fontSize = size,
  expanded = false,
  textPosition = 'right',
  className = 'iconRoot',
  colorIcon,
  color = 'inherit',
  bold,
  ...props
}: IconProps) => {
  const [isExpanded0, setIsExpanded0] = useState(expanded);

  const IconComponent = src as ComponentType<any>;

  if (!src) return null;

  const isExpandIcon = src === iconType.expanded || src === iconType.expand || src === iconType.accordion;

  const getPattern = () => {
    switch (src) {
      case iconType.complete:
      case iconType.completeContain:
      case iconType.completeOutline:
        return { color: 'success.main', background: 'white' };
      case iconType.uncomplete:
        return { color: 'var(--color-border)', borderRadius: '50%' };
      case iconType.expanded:
      case iconType.expand:
      case iconType.accordion:
        return { color: colorIcon || 'primary.main' };
      case iconType.add:
      case iconType.remove:
      case iconType.arrow:
      case iconType.arrowBack:
      case iconType.arrowBackward:
      case iconType.arrowForward:
      case iconType.backArrow:
      case iconType.forwardArrow:
        return { color: colorIcon || 'var(--color-blue-550, #0053c2)' };
      default:
        return {};
    }
  };

  const isArrowIcon = [
    iconType.add,
    iconType.remove,
    iconType.arrow,
    iconType.arrowBack,
    iconType.arrowBackward,
    iconType.arrowForward,
    iconType.backArrow,
    iconType.forwardArrow,
  ].includes(src as any);

  const sx = { color: 'inherit', ...getPattern() };
  const baseSize = sizeMap[fontSize as SizeKey] ?? sizeMap.md;
  const arrowSize = arrowSizeMap[size] ?? arrowSizeMap.md;
  const iconSize = isArrowIcon ? arrowSize : baseSize;

  const handleClick = (e: MouseEvent) => {
    if (isExpandIcon) setIsExpanded0(v => !v);
    props.onClick?.(e);
  };

  const textRender = text && (
    <span style={{
      marginLeft:  textPosition === 'right' ? 12 : 0,
      marginRight: textPosition === 'left'  ? 12 : 0,
      color,
      fontSize: arrowSize,
      fontWeight: bold ? '600' : '400',
    }}>
      {text}
    </span>
  );

  return (
    <span
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        ...((isExpandIcon || props.onClick) && { cursor: 'pointer' }),
        ...sx,
      }}
    >
      {textPosition === 'left' && textRender}
      <IconComponent
        sx={{
          ...sx,
          fontSize: iconSize,
          ...(isExpandIcon && {
            transform: isExpanded0 ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.4s ease-in-out',
          }),
        }}
        className={className}
      />
      {textPosition === 'right' && textRender}
    </span>
  );
};

export default Icon;
