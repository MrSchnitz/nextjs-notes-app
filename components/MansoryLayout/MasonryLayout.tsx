"use client"
import React, { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";

export interface Item {
  id: string;
  content: React.ReactNode;
}

interface Position {
  x: number;
  y: number;
}

export interface SavedLayout {
  positions: { [key: string]: Position };
  order: string[];
}

interface LayoutDimensions {
  columnWidth: number;
  containerHeight: number;
}

interface DraggableMasonryLayoutProps {
  items: Item[];
  minColumnWidth?: number;
  gap?: number;
  className?: string;
  onLayoutChange?: (layout: SavedLayout) => void;
  initialLayout?: SavedLayout;
}

const MasonryLayout: React.FC<DraggableMasonryLayoutProps> = ({
  items,
  minColumnWidth = 250,
  gap = 20,
  className,
  onLayoutChange,
  initialLayout,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [itemOrder, setItemOrder] = useState<string[]>(
    () => initialLayout?.order || items.map((item) => item.id),
  );
  const [positions, setPositions] = useState<{ [key: string]: Position }>(
    () => initialLayout?.positions || {},
  );
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [layoutDimensions, setLayoutDimensions] = useState<LayoutDimensions>({
    columnWidth: minColumnWidth,
    containerHeight: 0,
  });
  const [draggedPosition, setDraggedPosition] = useState<Position | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<{ [key: string]: HTMLDivElement }>({});

  useEffect(() => {
    setItemOrder(initialLayout?.order || items.map((item) => item.id));
  }, [initialLayout]);

  const calculatePositions = useCallback(
    (
      currentOrder: string[],
      draggedId: string | null = null,
      draggedPosition?: Position | null,
    ) => {
      if (!containerWidth) return null;

      const columns = Math.max(
        1,
        Math.floor((containerWidth + gap) / (minColumnWidth + gap)),
      );
      const columnWidth = (containerWidth - (columns - 1) * gap) / columns;
      const columnsHeight = new Array(columns).fill(0);
      const newPositions: { [key: string]: Position } = {};

      currentOrder.forEach((itemId) => {
        if (itemId === draggedId && draggedPosition) {
          newPositions[itemId] = draggedPosition;
          const column = Math.floor(draggedPosition.x / (columnWidth + gap));
          const validColumn = Math.min(Math.max(0, column), columns - 1);
          columnsHeight[validColumn] +=
            (itemsRef.current[itemId]?.offsetHeight || 0) + gap;
          return;
        }

        const element = itemsRef.current[itemId];
        if (!element) return;

        const height = element.offsetHeight;
        const shortestColumn = columnsHeight.indexOf(
          Math.min(...columnsHeight),
        );
        const x = shortestColumn * (columnWidth + gap);
        const y = columnsHeight[shortestColumn];

        newPositions[itemId] = { x, y };
        columnsHeight[shortestColumn] += height + gap;
      });

      return {
        positions: newPositions,
        columnWidth,
        containerHeight: Math.max(...columnsHeight),
      };
    },
    [containerWidth, gap, minColumnWidth],
  );

  const updateLayout = useCallback(() => {
    const result = calculatePositions(itemOrder, draggedItem, draggedPosition);
    if (!result) return;

    const { positions: newPositions, columnWidth, containerHeight } = result;

    setPositions(newPositions);
    setLayoutDimensions({ columnWidth, containerHeight });

    if (!draggedItem) {
      onLayoutChange?.({ positions: newPositions, order: itemOrder });
    }
  }, [
    calculatePositions,
    itemOrder,
    draggedItem,
    draggedPosition,
    onLayoutChange,
  ]);

  const handleDragStart = useCallback((e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    const item = itemsRef.current[itemId];
    if (!item) return;

    const rect = item.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setDraggedItem(itemId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleDragMove = useCallback(
    (e: MouseEvent) => {
      if (!draggedItem || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - containerRect.left - dragOffset.x;
      const y = e.clientY - containerRect.top - dragOffset.y;

      // Snap to columns
      const columnWidth = layoutDimensions.columnWidth + gap;
      const nearestColumn = Math.round(x / columnWidth);
      const snappedX = nearestColumn * columnWidth;

      const newDraggedPosition = { x: snappedX, y };
      setDraggedPosition(newDraggedPosition);

      // Update order
      const draggedRect = itemsRef.current[draggedItem].getBoundingClientRect();
      const draggedCenter = draggedRect.top + draggedRect.height / 2;

      const itemPositions = itemOrder
        .filter((id) => id !== draggedItem)
        .map((id) => {
          const rect = itemsRef.current[id]?.getBoundingClientRect();
          return {
            id,
            top: rect?.top || 0,
            height: rect?.height || 0,
          };
        })
        .sort((a, b) => a.top - b.top);

      let insertIndex = itemPositions.findIndex(
        (item) => draggedCenter < item.top + item.height / 2,
      );

      if (insertIndex === -1) {
        insertIndex = itemPositions.length;
      }

      const newOrder = [
        ...itemPositions.slice(0, insertIndex).map((item) => item.id),
        draggedItem,
        ...itemPositions.slice(insertIndex).map((item) => item.id),
      ];

      if (JSON.stringify(newOrder) !== JSON.stringify(itemOrder)) {
        setItemOrder(newOrder);
      }
    },
    [draggedItem, dragOffset, itemOrder, layoutDimensions.columnWidth, gap],
  );

  const handleDragEnd = useCallback(() => {
    if (draggedItem) {
      setDraggedItem(null);
      setDraggedPosition(null);
      updateLayout();
    }
  }, [draggedItem, updateLayout]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    updateLayout();
  }, [updateLayout]);

  useEffect(() => {
    if (draggedItem) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [draggedItem, handleDragMove, handleDragEnd]);

  const Placeholder = useCallback(
    ({
      position,
      width,
      height,
    }: {
      position: Position;
      width: number;
      height: number;
    }) => (
      <div
        className="absolute border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-lg pointer-events-none"
        style={{
          top: position.y,
          left: position.x,
          width,
          height,
          transition: "all 0.2s ease",
        }}
      />
    ),
    [],
  );

  return (
    <div
      ref={containerRef}
      className={clsx("relative w-full", className)}
      style={{
        height: `${layoutDimensions.containerHeight}px`,
      }}
    >
      {draggedItem && draggedPosition && (
        <Placeholder
          position={draggedPosition}
          width={layoutDimensions.columnWidth}
          height={itemsRef.current[draggedItem]?.offsetHeight || 0}
        />
      )}
      {itemOrder.map((itemId) => {
        const item = items.find((i) => i.id === itemId);
        if (!item) return null;

        const isDragging = itemId === draggedItem;
        const position = positions[itemId] || { x: 0, y: 0 };

        return (
          <div
            key={itemId}
            ref={(el) => {
              if (el) {
                itemsRef.current[itemId] = el;
              }
            }}
            className={clsx(
              "absolute select-none rounded-xl",
              !isDragging && "transition-all duration-300 ease-out",
              isDragging
                ? ["cursor-grabbing", "z-50", "shadow-xl"]
                : ["cursor-grab", "z-10", "hover:ring-1 hover:ring-[#e0e0e0]"],
            )}
            style={{
              top: position.y,
              left: position.x,
              // width: layoutDimensions.columnWidth,
              opacity: isDragging ? 0.9 : 1,
              transform: isDragging ? "scale(1.05)" : undefined,
            }}
            onMouseDown={(e) => handleDragStart(e, itemId)}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
};

export default MasonryLayout;
