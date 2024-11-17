import { MessagesSquare } from 'lucide-react';
import { memo, useMemo } from 'react';
import * as uuid from 'uuid';

type Props = {
  totalIcons?: number;
  cols?: number;
};

function getIconStyle(col: number, row: number) {
  return {
    id: uuid.v4(),
    size: Math.floor(Math.random() * (80 - 32) + 32),
    rotate: Math.floor(Math.random() * 60 - 30),
    left: `${(col * 16)}%`,
    top: `${(row * 20) + (col % 2 ? 10 : 0)}%`,
    opacity: Math.max(0.05, 0.2 - row * 0.03),
  };
}

function ChatBackgroundComponent(
  {
    totalIcons = 30,
    cols = 6,
  }: Props,
) {
  const icons = useMemo(() => {
    return Array
      .from({ length: totalIcons })
      .map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);

        return getIconStyle(col, row);
      });
  }, [totalIcons, cols]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map(style => (
        <MessagesSquare
          key={style.id}
          size={style.size}
          className="absolute text-gray-300 transition-transform"
          style={{
            transform: `rotate(${style.rotate}deg)`,
            left: style.left,
            top: style.top,
            opacity: style.opacity,
          }}
        />
      ))}
    </div>
  );
}

export const ChatBackground = memo(ChatBackgroundComponent);
