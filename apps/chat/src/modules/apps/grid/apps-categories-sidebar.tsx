import clsx from 'clsx';
import { ChevronDownIcon, FolderIcon, HashIcon, LayersIcon, MessagesSquareIcon, WrenchIcon } from 'lucide-react';
import { useState } from 'react';

type Category = {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  children?: Category[];
};

const categories: Category[] = [
  {
    id: 'all',
    name: 'All Apps',
    count: 156,
    icon: <LayersIcon size={16} />,
  },
  {
    id: 'chat',
    name: 'Chat Assistants',
    count: 45,
    icon: <MessagesSquareIcon size={16} />,
    children: [
      { id: 'chat-customer', name: 'Customer Service', count: 12, icon: <MessagesSquareIcon size={16} /> },
      { id: 'chat-sales', name: 'Sales', count: 15, icon: <MessagesSquareIcon size={16} /> },
      { id: 'chat-support', name: 'Tech Support', count: 18, icon: <MessagesSquareIcon size={16} /> },
    ],
  },
  {
    id: 'tools',
    name: 'Tools',
    count: 38,
    icon: <WrenchIcon size={16} />,
    children: [
      { id: 'tools-dev', name: 'Development', count: 20, icon: <WrenchIcon size={16} /> },
      { id: 'tools-analysis', name: 'Analysis', count: 18, icon: <WrenchIcon size={16} /> },
    ],
  },
  { id: 'productivity', name: 'Productivity', count: 32, icon: <FolderIcon size={16} /> },
  { id: 'other', name: 'Other', count: 41, icon: <HashIcon size={16} /> },
];

type Props = {
  selected?: string;
  onSelect?: (id: string) => void;
};

type CategoryItemProps = {
  category: Category;
  selected?: string;
  onSelect?: (id: string) => void;
  depth?: number;
};

function CategoryItem({ category, selected, onSelect, depth = 0 }: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onSelect?.(category.id);
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
        }}
        className={clsx(
          'flex justify-between items-center px-3 py-2 rounded-md w-full text-sm transition-colors',
          selected === category.id
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-muted text-muted-foreground hover:text-foreground',
          depth > 0 && 'ml-4',
        )}
      >
        <span className="flex items-center gap-2">
          {hasChildren && (
            <ChevronDownIcon
              size={14}
              className={clsx(
                'transition-transform',
                isExpanded ? 'transform rotate-0' : '-rotate-90',
              )}
            />
          )}
          {category.icon}
          {category.name}
        </span>
        <span className="text-xs">{category.count}</span>
      </button>

      {hasChildren && isExpanded && (
        <div className="space-y-1 mt-1 ml-2">
          {category.children!.map(child => (
            <CategoryItem
              key={child.id}
              category={child}
              selected={selected}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function AppsCategoriesSidebar({ selected = 'all', onSelect }: Props) {
  return (
    <div className="pr-6 border-r border-border w-64">
      <h3 className="mb-4 font-medium">Categories</h3>
      <ul className="space-y-1">
        {categories.map(category => (
          <li key={category.id}>
            <CategoryItem
              category={category}
              selected={selected}
              onSelect={onSelect}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
