/**
 * Google Drive Picker API 유틸리티
 * 주의: 실제로 작동하려면 아래 CONFIG 객체에 Google Cloud Console에서 발급받은 키를 입력해야 합니다.
 */

// TODO: Google Cloud Console에서 발급받은 키를 여기에 입력하세요.
export const GOOGLE_DRIVE_CONFIG = {
  developerKey: '',       // API Key
  clientId: '',           // Client ID
  appId: '',              // Project Number (App ID)
  scope: 'https://www.googleapis.com/auth/drive.readonly' // 읽기 전용 권한
};

let pickerApiLoaded = false;
let oauthToken: string | null = null;

/**
 * Google Drive Picker API 스크립트 로드
 */
export const loadGoogleDriveApi = () => {
  if (typeof window === 'undefined') return;

  // Prevent duplicate script loading
  if (document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
    // If gapi is already present, ensure picker is loaded
    if (window.gapi) {
        window.gapi.load('picker', { callback: () => { pickerApiLoaded = true; } });
    }
  } else {
    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.async = true;
    script1.defer = true;
    script1.onload = () => {
        if (window.gapi) {
            window.gapi.load('picker', { callback: () => { pickerApiLoaded = true; } });
        }
    };
    document.body.appendChild(script1);
  }

  if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.async = true;
    script2.defer = true;
    document.body.appendChild(script2);
  }
};

// 앱 시작 시 API 로드 시도
loadGoogleDriveApi();

/**
 * 구글 드라이브 피커 열기
 */
export const openGoogleDrivePicker = (
  onSelect: (url: string) => void,
  onCancel?: () => void
) => {
  if (!GOOGLE_DRIVE_CONFIG.developerKey || !GOOGLE_DRIVE_CONFIG.clientId) {
    alert('Google Drive API 설정이 되어있지 않습니다.\nutils/googleDrivePicker.ts 파일에서 API Key와 Client ID를 설정해주세요.');
    return;
  }

  if (!window.google || !window.google.picker) {
    alert('Google API가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  // OAuth 토큰이 없으면 요청
  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_DRIVE_CONFIG.clientId,
    scope: GOOGLE_DRIVE_CONFIG.scope,
    callback: (response: any) => {
      if (response.error !== undefined) {
        console.error("OAuth Error:", response);
        return;
      }
      oauthToken = response.access_token;
      createPicker(onSelect, onCancel);
    },
  });

  if (oauthToken) {
    createPicker(onSelect, onCancel);
  } else {
    // 토큰이 없으면 팝업 트리거
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }
};

const createPicker = (onSelect: (url: string) => void, onCancel?: () => void) => {
  if (!oauthToken || !window.google) return;

  const view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
  view.setMimeTypes('image/png,image/jpeg,image/jpg,image/webp');

  const picker = new window.google.picker.PickerBuilder()
    .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
    .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
    .setAppId(GOOGLE_DRIVE_CONFIG.appId)
    .setOAuthToken(oauthToken)
    .addView(view)
    .addView(new window.google.picker.DocsUploadView())
    .setDeveloperKey(GOOGLE_DRIVE_CONFIG.developerKey)
    .setCallback((data: any) => {
      const action = data[window.google.picker.Response.ACTION];
      if (action === window.google.picker.Action.PICKED) {
        const doc = data[window.google.picker.Response.DOCUMENTS][0];
        // 자동 변환 로직 제거: 원본 URL을 그대로 반환
        const url = doc[window.google.picker.Document.URL];
        onSelect(url);
      } else if (action === window.google.picker.Action.CANCEL) {
        if (onCancel) onCancel();
      }
    })
    .build();

  picker.setVisible(true);
};

// Window 객체 타입 확장
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}