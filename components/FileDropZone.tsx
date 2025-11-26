
import React, { useRef, useState } from 'react';
import { styles } from '../constants';

interface FileDropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({ onFilesAdded }) => {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      style={{
        ...styles.dropZone,
        ...(isHovering ? styles.dropZoneHover : {})
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        multiple
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileInput}
      />
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>📂</div>
      <div style={{ fontWeight: 600, color: '#374151' }}>
        Kliknij lub przeciągnij pliki tutaj
      </div>
      <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '5px' }}>
        Zdjęcia witryn, gotowe projekty, pliki pomocnicze
      </div>
    </div>
  );
};
