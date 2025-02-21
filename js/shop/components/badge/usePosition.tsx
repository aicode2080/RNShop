import { useMemo } from 'react';

interface PositionProps {
  absolute?: string;
  offset?: number[];
  isDot?: boolean;
  width: number;
}

export default function usePosition({
  absolute = '',
  offset = [0, 0],
  isDot,
  width,
}: PositionProps) {
  return useMemo(() => {
    if (!absolute) return {};
    let w = width / 2,
      h = 10;
    if (isDot) {
      w = 5;
      h = 5;
    }
    const x = `${-w + offset[0]}px`;
    const y = `${-h + offset[1]}px`;

    const whiteList = {
      rightTop: {
        right: x,
        top: y,
      },
      rightBottom: {
        right: x,
        bottom: y,
      },
      leftBottom: {
        left: x,
        bottom: y,
      },
      leftTop: {
        left: x,
        top: y,
      },
    };
    const match = whiteList[absolute];
    return match ? match : whiteList['rightTop'];
  }, [absolute, offset, isDot, width]);
}
