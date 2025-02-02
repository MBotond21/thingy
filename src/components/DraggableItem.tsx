import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = 'SECTION';

interface DraggableItemProps {
  id: number;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
  className: string;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({ id, index, moveItem, children, className }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem: { id: number; index: number }) => {
      if (!ref.current) return;

      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <section className={className}>
      <div
        ref={ref}
        className='bg-white p-1 cursor-move w-full h-p5 rounded-t-lg opacity-0 hover:opacity-40 transition-all' >
      </div>
      {children}
    </section>
  );
};