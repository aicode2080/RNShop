import { useMemo } from 'react';

interface PositionProps {
  text?: string;
}

export default function usePosition({ text = '' }: PositionProps) {
  return useMemo(() => {
    return String(this.text).length * 8 + 12;
  }, [text]);
}
