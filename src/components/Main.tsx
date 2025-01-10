import React, { useEffect, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import InfoSect from "./InfoSect";
import MainPlayer from "./MainPlayer";
import PlaylistSect from "./PlaylistSect";

const ITEM_TYPE = 'SECTION';

interface Section {
  id: number;
  type: string;
}

const componentMap: Record<string, React.ReactNode> = {
  playlist: <PlaylistSect />,
  mainPlayer: <MainPlayer />,
  info: <InfoSect />,
};

interface DraggableItemProps {
  id: number;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, index, moveItem, children }) => {
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
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        flex: '1',
        display: 'flex',
        height: '85%',
        color: 'white',
        backgroundColor: '#222',
        borderRadius: '8px',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
};

export default function Main(){
  const [sections, setSections] = useState<Section[]>(() => {
    const storedSections = localStorage.getItem("sections");
    return storedSections
      ? JSON.parse(storedSections)
      : [
          { id: 1, type: "playlist" },
          { id: 2, type: "mainPlayer" },
          { id: 3, type: "info" },
        ];
  });

  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [sections]);

  const moveItem = (fromIndex: number, toIndex: number): void => {
    const updatedSections = [...sections];
    const [movedItem] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedItem);
    setSections(updatedSections);
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'row', gap: '1rem', height: '100%' }}>
      {sections.map((section, index) => (
        <DraggableItem
          key={section.id}
          id={section.id}
          index={index}
          moveItem={moveItem}
        >
          {componentMap[section.type]}
        </DraggableItem>
      ))}
    </main>
  );
};