import React, { ChangeEvent, useCallback } from "react";
import clsx from "clsx";

async function convertFileToBase64(file: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const base64Image = reader.result; // Remove the prefix part

      if (typeof base64Image === "string") {
        resolve(base64Image);
      }

      reject();
    };
    reader.onerror = async (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

const MAX_BYTES_SIZE = 5 * 1024 * 1024; // 5 MB

// Allowed MIME types
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export type ImageType = {
  name: string;
  data: string;
};

type Props = {
  className?: string;
  onFile: (base64: string) => void;
};

export const ImageInput = ({ className, onFile }: Props) => {
  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (files && files.length > 0) {
        const file = files[0];

        if (file.size > MAX_BYTES_SIZE) {
          alert("Nope, obrazek je příliš velký. Maximum je 5 MB.");
          return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          alert("Nope, musi byt obrazek - .jpg, .jpeg, .png");
          return;
        }

        const base64Image = await convertFileToBase64(file);

        onFile(base64Image);
      }
    },
    [onFile],
  );

  return (
    <div className={clsx("[&>input]:hidden", className)}>
      <label
        htmlFor="file-input"
        className="btn btn-sm btn-ghost btn-circle cursor-pointer"
        title="Vlozit obrazek"
      >
        <span className="material-icons-outlined">image</span>
      </label>
      <input
        id="file-input"
        type="file"
        accept=".jpg, .jpeg, .png"
        onChange={handleChange}
      />
    </div>
  );
};
