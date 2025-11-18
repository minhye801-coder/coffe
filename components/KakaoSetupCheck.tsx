import React, { useState, useEffect, useCallback } from 'react';

interface KakaoSetupCheckProps {
    onSuccess: () => void;
}

const KakaoSetupCheck: React.FC<KakaoSetupCheckProps> = ({ onSuccess }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isConfigValid, setIsConfigValid] = useState(false);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);
    const [retryTrigger, setRetryTrigger] = useState(0);

    const handleRetry = () => {
        setIsChecking(true);
        setIsConfigValid(false);
        setErrorDetails(null);
        setRetryTrigger(count => count + 1);
    };

    useEffect(() => {
        let isMounted = true;

        const performCheck = () => {
            if (typeof window.kakao === 'undefined' || typeof window.kakao.maps === 'undefined' || typeof window.kakao.maps.services === 'undefined') {
                if (isMounted) {
                    setErrorDetails("카카오 지도 스크립트를 불러오는 데 실패했습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.");
                    setIsChecking(false);
                }
                return;
            }

            const places = new window.kakao.maps.services.Places();
            
            places.keywordSearch('서울', (data, status) => {
                if (!isMounted) return;

                if (status === window.kakao.maps.services.Status.OK || status === window.kakao.maps.services.Status.ZERO_RESULT) {
                    setIsConfigValid(true);
                    setTimeout(() => {
                        if (isMounted) {
                            onSuccess();
                        }
                    }, 1000);
                } else {
                    setIsConfigValid(false);
                    setErrorDetails(`
                        <p class="font-bold text-lg mb-2">카카오 지도 연동에 문제가 있어요!</p>
                        <p class="mb-2">보안 정책에 따라, 카카오 지도는 미리 등록된 웹사이트 주소에서만 작동합니다. 현재 앱의 주소가 등록되지 않은 것 같습니다.</p>
                        <p class="mb-2"><strong>간단 해결 방법:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 text-left mb-3">
                            <li><a href="https://developers.kakao.com/console/app" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">카카오 개발자 사이트</a>에 로그인하세요.</li>
                            <li><strong>[내 애플리케이션] &gt; [앱 설정] &gt; [플랫폼]</strong> 메뉴로 이동하세요.</li>
                            <li><strong>[Web 플랫폼 등록]</strong>의 '사이트 도메인'에 아래 주소를 추가하고 저장해주세요.</li>
                        </ol>
                    `);
                }
                setIsChecking(false);
            });
        };
        
        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
            window.kakao.maps.load(performCheck);
        } else {
            if(isMounted) {
                setErrorDetails("카카오 지도 스크립트를 찾을 수 없습니다. 페이지를 새로고침하거나 인터넷 연결을 확인해주세요.");
                setIsChecking(false);
            }
        }


        return () => {
            isMounted = false;
        };
    }, [onSuccess, retryTrigger]);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.origin);
        alert('주소가 클립보드에 복사되었습니다!');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 p-4 text-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-2xl font-bold text-stone-800 mb-4">
                    🛠️ 설정 확인 중...
                </h1>
                
                {isChecking && (
                    <div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto my-4"></div>
                        <p className="text-stone-600">카카오 지도와 안전하게 연결하고 있어요.</p>
                    </div>
                )}
                
                {!isChecking && isConfigValid && (
                    <div className="text-green-600 space-y-3">
                        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="font-semibold text-lg">설정 확인 완료!</p>
                        <p className="text-sm">잠시 후 앱을 시작합니다.</p>
                    </div>
                )}

                {!isChecking && !isConfigValid && (
                     <div className="text-red-700 space-y-4">
                        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                         <div dangerouslySetInnerHTML={{ __html: errorDetails || '' }} />
                         
                         <div className="bg-stone-100 p-3 rounded-lg text-left">
                            <label className="text-xs font-semibold text-stone-500">등록할 사이트 주소</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={window.location.origin}
                                    className="w-full bg-white p-2 rounded text-sm font-mono border border-stone-300"
                                />
                                <button
                                    onClick={handleCopyUrl}
                                    className="px-3 py-2 bg-amber-800 text-white text-sm font-semibold rounded-lg hover:bg-amber-900 transition-colors shrink-0"
                                >
                                    복사
                                </button>
                            </div>
                         </div>
                         
                         <button
                            onClick={handleRetry}
                            className="w-full mt-4 bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
                         >
                             설정을 완료했어요. 다시 확인하기
                         </button>
                     </div>
                )}
            </div>
        </div>
    );
};

export default KakaoSetupCheck;