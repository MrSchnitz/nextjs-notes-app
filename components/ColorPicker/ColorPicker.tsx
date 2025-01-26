import React, { useState } from "react";
import { CirclePicker } from "react-color";
import clsx from "clsx";

export interface ColorPickerProps {
  onChooseColor: (color: string) => void;
  edit?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onChooseColor,
  edit,
}: ColorPickerProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const renderPicker = (
    <div
      className={clsx(
        "absolute top-10 z-20 p-4 rounded-xl bg-white border",
        edit ? "right-0" : "left-0",
      )}
      onMouseLeave={() => onChooseColor("#fff")}
    >
      <CirclePicker
        colors={[
          "#ffffff",
          "#faafa8",
          "#f39f76",
          "#fff8b8",
          "#e2f6d3",
          "#b4ddd3",
          "#d4e4ed",
          "#aeccdc",
          "#d3bfdb",
          "#f6e2dd",
          "#e9e3d4",
          "#efeff1",
        ]}
        onSwatchHover={(color) => onChooseColor(color.hex)}
        onChangeComplete={(color) => {
          onChooseColor(color.hex);
          setPickerOpen(false);
        }}
      />
    </div>
  );

  return (
    <div className="relative">
      {pickerOpen && renderPicker}
      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={() => setPickerOpen(!pickerOpen)}
      >
        <span className="material-icons-outlined">palette</span>
      </button>
    </div>
  );
};

export default ColorPicker;
