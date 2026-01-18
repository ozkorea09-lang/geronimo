import React, { useRef } from 'react';
import { Image as ImageIcon, Link as LinkIcon, Upload, HardDrive } from 'lucide-react';
import { transformGoogleDriveUrl } from '../utils/imageHelper';
import { openGoogleDrivePicker } from '../utils/googleDrivePicker';

interface AdminImageInputProps {
  label?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AdminImageInput: React.FC<AdminImageInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "이미지 URL 또는 구글 드라이브 링크",
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (value) {
      const transformed = transformGoogleDriveUrl(value);
      if (transformed !== value) {
        onChange(transformed);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("이미지 크기는 1MB 이하여야 저장이 원활합니다.\n용량이 큰 이미지는 저장이 안 될 수 있습니다.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleDrivePick = () => {
    openGoogleDrivePicker((url) => {
      const transformed = transformGoogleDriveUrl(url);
      onChange(transformed);
    });
  };

  return (
    <div className={`col-span-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-brand-wood mb-1">{label}</label>}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Preview Area */}
        <div className="w-20 h-20 bg-brand-wood/10 rounded overflow-hidden flex-shrink-0 border border-brand-wood/20 relative group">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={20} className="text-brand-wood/40" />
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="flex-grow space-y-2">
          {/* URL Input */}
          <div className="flex items-center gap-2">
            <LinkIcon size={16} className="text-brand-wood flex-shrink-0" />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              className="w-full p-2 border border-brand-wood/30 rounded bg-white text-sm focus:border-brand-coffee outline-none transition-colors"
              placeholder={placeholder}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-wood/10 hover:bg-brand-wood/20 text-brand-muted text-xs py-2 px-3 rounded transition-colors"
            >
              <Upload size={14} />
              <span>파일 업로드</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Google Drive Button */}
            <button
              type="button"
              onClick={handleGoogleDrivePick}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs py-2 px-3 rounded transition-colors border border-blue-200"
            >
              <HardDrive size={14} />
              <span>구글 드라이브</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
