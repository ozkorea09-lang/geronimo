import React, { useRef } from 'react';
import { Image as ImageIcon, Link as LinkIcon, Upload, HardDrive, AlertTriangle } from 'lucide-react';
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
  placeholder = "이미지 직링크(Direct Link) URL 입력",
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // 자동 변환 없이 선택된 URL 그대로 입력창에 반영
      onChange(url);
    });
  };

  return (
    <div className={`col-span-2 ${className}`}>
      {label && <label className="block text-xs font-bold text-brand-wood mb-1">{label}</label>}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Preview Area */}
        <div className="w-24 h-24 bg-brand-wood/10 rounded overflow-hidden flex-shrink-0 border border-brand-wood/20 relative group bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')]">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={24} className="text-brand-wood/40" />
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
              <span>로컬 파일 업로드</span>
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
              className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs py-2 px-3 rounded transition-colors"
            >
              <HardDrive size={14} />
              <span>구글 드라이브 선택</span>
            </button>
          </div>

          {/* Helper Text */}
          <div className="text-[10px] text-brand-muted/70 flex items-start gap-1">
            <AlertTriangle size={10} className="mt-0.5 text-brand-gold"/>
            <span>
              구글 드라이브 이미지가 보이지 않는다면, <strong>'링크가 있는 모든 사용자에게 공개'</strong> 권한인지 확인해주세요.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};