import React from 'react';
import { XCircleIcon } from './Icons';

interface KakaoConfigWarningProps {
    onClose: () => void;
}

const KakaoConfigWarning: React.FC<KakaoConfigWarningProps> = ({ onClose }) => {
    const currentOrigin = window.location.origin;

    const errorDetails = `
        <p class="font-bold text-lg mb-2">앗! 지도 기능에 문제가 있어요.</p>
        <p class="mb-2">GitHub에 배포된 새 주소(${currentOrigin})가 카카오 개발자 사이트에 등록되지 않아 지도를 불러올 수 없습니다.</p>
        <p class="mb-2"><strong>해결 방법:</strong></p>
        <ol class="list-decimal list-inside space-y-1 text-left mb-3">
            <li><a href="https://developers.kakao.com/console/app" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">카카오 개발자 사이트</a>에 로그인하세요.</li>
            <li><strong>[내 애플리케이션] &gt; [앱 설정] &gt; [플랫폼]</strong>으로 이동하세요.</li>
            <li><strong>[Web 플랫폼 등록]</strong>의 '사이트 도메인'에 아래 주소를 추가하고 저장해주세요.</li>
        </ol>
    `;

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(currentOrigin);
        alert('주소가 클립보드에 복사되었습니다!');
    };

    return (
        <div className="fixed inset-x-0 top-0 z-50 p-4 animate-fade-in-down">
            <div className="max-w-md mx-auto bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-lg shadow-lg relative" role="alert">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    aria-label="닫기"
                >
                    <XCircleIcon className="h-6 w-6" />
                </button>
                <div dangerouslySetInnerHTML={{ __html: errorDetails }} />
                <div className="bg-red-100 p-3 rounded-lg text-left mt-4">
                    <label className="text-xs font-semibold text-red-500">등록할 사이트 주소</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input 
                            type="text" 
                            readOnly 
                            value={currentOrigin}
                            className="w-full bg-white p-2 rounded text-sm font-mono border border-red-200"
                        />
                        <button
                            onClick={handleCopyUrl}
                            className="px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shrink-0"
                        >
                            복사
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KakaoConfigWarning;
