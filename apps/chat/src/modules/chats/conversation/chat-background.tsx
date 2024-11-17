import { MessagesSquare } from 'lucide-react';
import { memo } from 'react';

function getIconStyle(col: number, row: number) {
  return {
    size: Math.floor(Math.random() * (80 - 32) + 32),
    rotate: Math.floor(Math.random() * 60 - 30),
    left: `${(col * 16)}%`,
    top: `${(row * 20) + (col % 2 ? 10 : 0)}%`,
  };
}

function ChatBackgroundComponent() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const style = getIconStyle(col, row);
        return (
          <MessagesSquare
            key={i}
            size={style.size}
            className="absolute opacity-20 text-gray-300 transition-transform"
            style={{
              transform: `rotate(${style.rotate}deg)`,
              left: style.left,
              top: style.top,
            }}
          />
        );
      })}
    </div>
  );
}

export const ChatBackground = memo(ChatBackgroundComponent);
