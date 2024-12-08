import { MessagesSquare } from 'lucide-react';
import { memo, useMemo } from 'react';
import * as uuid from 'uuid';

export type ChatBackdropSettings = {
  totalIcons?: number;
};

function getIconStyle(index: number, totalIcons: number) {
  const cols = Math.ceil(Math.sqrt(totalIcons * 1.5));
  const col = index % cols;
  const row = Math.floor(index / cols);

  return {
    id: uuid.v4(),
    size: Math.floor(Math.random() * (80 - 32) + 32),
    rotate: Math.floor(Math.random() * 60 - 30),
    left: `${(col * (100 / cols))}%`,
    top: `${(row * 20) + (col % 2 ? 10 : 0)}%`,
    opacity: Math.max(0.05, 0.2 - row * 0.03),
  };
}

function ChatBackgroundComponent({ totalIcons = 30 }: ChatBackdropSettings) {
  const icons = useMemo(() => {
    return Array
      .from({ length: totalIcons })
      .map((_, i) => getIconStyle(i, totalIcons));
  }, [totalIcons]);

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
