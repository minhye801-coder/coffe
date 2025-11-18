import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// 이 파일은 React 애플리케이션의 진입점(Entry Point)입니다.
// 메인 컴포넌트인 App.tsx를 불러와 index.html의 'root' div에 렌더링합니다.

const container = document.getElementById('root');

// 렌더링할 root 컨테이너가 존재하는지 확인합니다.
if (container) {
  const root = createRoot(container);
  
  // React.StrictMode는 애플리케이션 내의 잠재적인 문제를 알아내기 위한 도구입니다.
  // 개발 모드에서 자손들에 대한 추가적인 검사와 경고를 활성화합니다.
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // 앱을 마운트할 수 없는 치명적인 오류입니다.
  console.error("오류: 'root' 요소를 찾을 수 없습니다. React 앱을 마운트할 수 없습니다.");
}
