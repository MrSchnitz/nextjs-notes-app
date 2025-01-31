import React, { useState, useEffect, ReactNode, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface MasonryItem {
  id: string;
  content: ReactNode;
}

interface MasonryLayoutProps {
  items: MasonryItem[];
  onReorder?: (items: MasonryItem[]) => void;
  minColumnWidth?: number;
  gap?: number;
  isLoading?: boolean;
}

const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
      className="break-inside-avoid mb-4"
    >
      {children}
    </div>
  );
};

const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  items,
  onReorder,
  minColumnWidth = 250,
  gap = 16,
  isLoading = false,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(1);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const count = Math.max(1, Math.floor(containerWidth / minColumnWidth));
        setColumnCount(count);
      }
    };

    const resizeObserver = new ResizeObserver(updateColumns);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [minColumnWidth]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder?.(newItems);
    }

    setActiveId(null);
  };

  if (isLoading) {
    return (
      <div ref={containerRef} className="w-full">
        <div style={{ columnCount, columnGap: `${gap * 16}px` }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="break-inside-avoid mb-4">
              <div className="bg-gray-200 rounded-lg animate-pulse h-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div ref={containerRef} className="w-full">
        <div
          style={{
            columnCount,
            columnGap: `${gap * 4}px`, // Multiply by 4 since Tailwind's gap-4 = 16px
          }}
        >
          <SortableContext items={items.map((item) => item.id)}>
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                {item.content}
              </SortableItem>
            ))}
          </SortableContext>
        </div>
      </div>
    </DndContext>
  );
};

export default MasonryLayout;
