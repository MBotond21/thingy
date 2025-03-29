import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSectionCount, useSetSectionCount } from '../contexts/SectionContext';

const ITEM_TYPE = 'SECTION';

interface DraggableItemProps {
  id: number;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
  className: string;
  condition: boolean;
}

export const DraggableItemv2: React.FC<DraggableItemProps> = ({ id, index, moveItem, children, className, condition }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const sectionCount = useSectionCount();
  const setSectionCount = useSetSectionCount();

  const [alone, setAlone] = useState<boolean>(false);

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

  useEffect(() => {
    console.log(`${id}, ${condition}`);
  }, [condition]);

  useEffect(() => {
    if (condition && setSectionCount) {
      setSectionCount((prev) => prev + 1);
    }

    return () => {
      if (condition && setSectionCount) {
        setSectionCount((prev) => Math.max(0, prev - 1));
      }
    };
  }, [condition, setSectionCount]);

  useEffect(() => {
    setAlone(sectionCount === 1);
  }, [sectionCount]);

  return <>
    {
      condition && <section className={className.concat(" relative h-full overflow-hidden")}>
        {!alone && <div ref={ref} className='bg-white p-1 cursor-move w-full h-p5 rounded-t-lg opacity-0 hover:opacity-40 transition-all absolute top-0 left-0' ></div>}
        {children}
      </section>
    }
  </>
};