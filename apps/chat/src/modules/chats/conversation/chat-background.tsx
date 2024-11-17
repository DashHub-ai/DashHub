import { MessagesSquare } from 'lucide-react';
import { memo, useMemo } from 'react';

function getIconStyle(col: number, row: number) {
  return {
    size: Math.floor(Math.random() * (80 - 32) + 32),
    rotate: Math.floor(Math.random() * 60 - 30),
    left: `${(col * 16)}%`,
    top: `${(row * 20) + (col % 2 ? 10 : 0)}%`,
    opacity: Math.max(0.05, 0.2 - row * 0.03),
  };
}

const TOTAL_ICONS = 30;
const COLS = 6;

function ChatBackgroundComponent() {
  const icons = useMemo(() => {
    return Array.from({ length: TOTAL_ICONS }).map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);

      return getIconStyle(col, row);
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map((style, i) => (
        <MessagesSquare
          // eslint-disable-next-line react/no-array-index-key
          key={i}
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
