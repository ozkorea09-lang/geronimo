/**
 * Google Drive 공유 링크를 이미지 태그(img src)에서 사용할 수 있는 직접 링크로 변환합니다.
 * 
 * 지원하는 형식:
 * 1. https://drive.google.com/file/d/FILE_ID/view...
 * 2. https://drive.google.com/open?id=FILE_ID
 * 3. https://drive.google.com/uc?id=FILE_ID
 * 
 * 변환 후:
 * https://drive.google.com/uc?export=view&id=FILE_ID
 */
export const transformGoogleDriveUrl = (url: string | undefined | null): string => {
  if (!url || typeof url !== 'string') return '';
  
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '';

  // 이미 올바른 형식이거나 구글 드라이브가 아닌 경우 원본 반환 (단, 구글 드라이브 일반 링크는 변환 시도)
  if (!trimmedUrl.includes('drive.google.com')) {
    return trimmedUrl;
  }

  // 이미 변환된 형식(uc?export=view)이고 ID가 포함되어 있다면 그대로 반환
  if (trimmedUrl.includes('uc?') && trimmedUrl.includes('export=view') && trimmedUrl.includes('id=')) {
    return trimmedUrl;
  }

  let id = '';

  // 1. /file/d/ID 패턴
  const fileIdMatch = trimmedUrl.match(/\/d\/([-a-zA-Z0-9_]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    id = fileIdMatch[1];
  } else {
    // 2. id=ID 쿼리 파라미터 패턴
    const idParamMatch = trimmedUrl.match(/[?&]id=([-a-zA-Z0-9_]+)/);
    if (idParamMatch && idParamMatch[1]) {
      id = idParamMatch[1];
    }
  }

  if (id) {
    return `https://drive.google.com/uc?export=view&id=${id}`;
  }

  return trimmedUrl;
};