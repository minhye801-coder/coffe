import React, { useState, useEffect, useRef } from 'react';
import { CafeStatus } from '../types';
import { XCircleIcon } from './Icons';

interface AddCafeModalProps {
    onClose: () => void;
    onAdd: (name: string, status: CafeStatus, lat?: number, lon?: number) => void;
    userLocation: { lat: number; lon: number } | null;
}

// Kakao Maps API의 장소 검색 결과 타입을 정의합니다.
// 필요한 필드만 포함합니다.
interface KakaoPlace {
    id: string;
    place_name: string;
    address_name: string;
    road_address_name: string;
    x: string; // 경도 (longitude)
    y: string; // 위도 (latitude)
}


const AddCafeModal: React.FC<AddCafeModalProps> = ({ onClose, onAdd, userLocation }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<CafeStatus>(CafeStatus.Wishlist);
    const [results, setResults] = useState<KakaoPlace[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
    const [searchState, setSearchState] = useState<'idle' | 'searching' | 'error' | 'noResults' | 'found'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [criticalError, setCriticalError] = useState<string | null>(null);
    
    const miniMapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerInstance = useRef<any>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // 카카오 장소 검색 서비스 객체를 ref에 저장합니다.
    const placesService = useRef<any>(null);
    // 서비스 준비 상태를 추적하는 state
    const [isServiceReady, setIsServiceReady] = useState(false);
    // 컴포넌트 마운트 상태를 추적하는 ref
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // 컴포넌트가 마운트될 때 카카오 지도 스크립트를 로드하고 장소 검색 서비스를 초기화합니다.
    useEffect(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
            // kakao.maps.load는 스크립트가 완전히 로드된 후 콜백을 실행하여 타이밍 문제를 방지합니다.
            window.kakao.maps.load(() => {
                if (window.kakao && window.kakao.maps.services && window.kakao.maps.services.Places) {
                    placesService.current = new window.kakao.maps.services.Places();
                    setIsServiceReady(true); // 서비스가 준비되었음을 표시
                } else {
                    console.error("Kakao Maps 'services' library failed to load.");
                    setSearchState('error');
                    setErrorMessage("카카오 지도 서비스 라이브러리를 불러오지 못했습니다.");
                }
            });
        } else {
            console.error("Kakao Maps script not found or load function is not available.");
            setSearchState('error');
            setErrorMessage("카카오 지도 스크립트를 찾을 수 없습니다.");
        }
    }, []);
    
    // 사용자가 장소를 선택했을 때 미니맵을 표시/업데이트합니다.
    useEffect(() => {
        if (selectedPlace && miniMapContainer.current) {
            if (!window.kakao || !window.kakao.maps) return;

            const container = miniMapContainer.current;
            if (!container) return;
            
            const position = new window.kakao.maps.LatLng(selectedPlace.y, selectedPlace.x);

            if (!mapInstance.current) {
                const mapOption = {
                    center: position,
                    level: 3,
                    draggable: false,
                    scrollwheel: false,
                    disableDoubleClick: true,
                    disableDoubleClickZoom: true,
                };
                mapInstance.current = new window.kakao.maps.Map(container, mapOption);
                markerInstance.current = new window.kakao.maps.Marker({ position });
            } else {
                mapInstance.current.setCenter(position);
                markerInstance.current.setPosition(position);
            }
            markerInstance.current.setMap(mapInstance.current);
        }
    }, [selectedPlace]);

    const handleSearch = () => {
        if (!name.trim()) {
            return;
        }
        
        setErrorMessage(''); // 새로운 검색 시 이전 오류 메시지 초기화
        setCriticalError(null); // 새로운 검색 시 치명적 오류 메시지 초기화

        // 장소 검색 서비스가 준비되었는지 확인
        if (!isServiceReady || !placesService.current) {
            console.error("Place search service is not ready.");
            setErrorMessage("검색 서비스가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
            setSearchState('error');
            return;
        }

        setSearchState('searching');
        setResults([]);
        setSelectedPlace(null); // 새로운 검색은 이전 선택을 초기화합니다.

        const searchCallback = (data: KakaoPlace[], status: any) => {
            if (!isMounted.current) {
                return; // 컴포넌트가 언마운트된 후에는 상태 업데이트를 방지합니다.
            }
            if (status === window.kakao.maps.services.Status.OK) {
                setResults(data);
                setSearchState(data.length > 0 ? 'found' : 'noResults');
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                setResults([]);
                setSearchState('noResults');
            } else {
                console.error('Kakao Place Search Error. Status:', status);
                let detailedErrorMessage = "검색에 실패했습니다. 잠시 후 다시 시도해주세요.";
                
                if (status === window.kakao.maps.services.Status.ERROR) {
                    const currentOrigin = window.location.origin;
                    setCriticalError(`
                        <p class="font-bold text-lg mb-2">앗! 카카오 지도 연동에 문제가 있어요.</p>
                        <p class="mb-2">검색 기능이 작동하지 않는 가장 흔한 이유는 카카오 개발자 사이트에 현재 웹사이트 주소가 등록되지 않았기 때문입니다.</p>
                        <p class="mb-2"><strong>해결 방법:</strong></p>
                        <ol class="list-decimal list-inside space-y-1 text-left mb-3">
                            <li><a href="https://developers.kakao.com/console/app" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">카카오 개발자 사이트</a>에 로그인하세요.</li>
                            <li><strong>[내 애플리케이션] &gt; [앱 설정] &gt; [플랫폼]</strong> 메뉴로 이동하세요.</li>
                            <li><strong>[Web 플랫폼 등록]</strong>에서 아래 주소를 <strong>정확히</strong> 복사하여 '사이트 도메인'에 추가하고 저장해주세요.</li>
                        </ol>
                        <div class="bg-stone-200 p-2 rounded text-center text-sm font-mono break-all cursor-pointer" onclick="navigator.clipboard.writeText('${currentOrigin}'); alert('주소가 복사되었습니다!');">
                            ${currentOrigin}
                            <span class="text-xs block text-stone-500 mt-1">(클릭하여 복사)</span>
                        </div>
                    `);
                    detailedErrorMessage = "인증 오류: 위의 안내에 따라 카카오 설정을 확인해주세요.";
                }
                setErrorMessage(detailedErrorMessage);
                setResults([]);
                setSearchState('error');
            }
        };
        
        if (userLocation) {
            const options = {
                location: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lon),
                radius: 20000, // 20km
                sort: window.kakao.maps.services.SortBy.DISTANCE,
            };
            placesService.current.keywordSearch(name, searchCallback, options);
        } else {
            placesService.current.keywordSearch(name, searchCallback);
        }
    };
    
    const handleSelectPlace = (place: KakaoPlace) => {
        setName(place.place_name);
        setSelectedPlace(place);
        setResults([]);
        setSearchState('idle'); // 선택 완료, 결과 목록 숨김
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        // 사용자가 직접 입력하면 선택된 장소와 검색 결과를 초기화합니다.
        if (selectedPlace) {
            setSelectedPlace(null);
        }
        if(searchState !== 'idle') {
            setSearchState('idle');
            setResults([]);
        }
    };
    
    const handleResetSearch = () => {
        setName('');
        setSelectedPlace(null);
        setSearchState('idle');
        setResults([]);
        setCriticalError(null);
        nameInputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && selectedPlace) { // selectedPlace가 있어야만 제출 가능
            const lat = selectedPlace ? parseFloat(selectedPlace.y) : undefined;
            const lon = selectedPlace ? parseFloat(selectedPlace.x) : undefined;
            onAdd(name.trim(), status, lat, lon);
            onClose();
        }
    };

    const statusLabels: Record<CafeStatus, string> = {
        [CafeStatus.Wishlist]: "가고싶은 곳",
        [CafeStatus.Visited]: "다녀온 곳",
        [CafeStatus.Favorite]: "단골",
    };

    const renderSearchResults = () => {
        if (searchState === 'idle') {
            return null;
        }

        return (
            <div className="absolute z-10 w-full mt-1">
                <ul className="bg-white border border-stone-300 rounded-lg max-h-48 overflow-y-auto shadow-lg">
                    {searchState === 'searching' && <li className="p-3 text-sm text-stone-500 animate-pulse">검색 중...</li>}
                    {searchState === 'error' && !criticalError && <li className="p-3 text-sm text-red-500">{errorMessage}</li>}
                    {searchState === 'noResults' && <li className="p-3 text-sm text-stone-500">검색 결과가 없습니다. 다른 이름으로 시도해보세요.</li>}
                    {searchState === 'found' && results.map((place) => (
                        <li
                            key={place.id}
                            onClick={() => handleSelectPlace(place)}
                            onMouseDown={(e) => e.preventDefault()} // onBlur가 onClick보다 먼저 실행되는 것을 방지
                            className="p-3 hover:bg-amber-100 cursor-pointer border-b last:border-b-0"
                        >
                            <p className="font-semibold text-sm text-stone-800">{place.place_name}</p>
                            <p className="text-xs text-stone-500">{place.road_address_name || place.address_name}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold text-stone-800 mb-4">새로운 카페 추가</h2>
                    
                    {criticalError && (
                        <div 
                            className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 mb-4 rounded-md text-sm" 
                            role="alert"
                            dangerouslySetInnerHTML={{ __html: criticalError }}
                        >
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="cafeName" className="text-sm font-medium text-stone-600">카페 이름 검색</label>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="relative flex-grow">
                                    <input
                                        ref={nameInputRef}
                                        type="text"
                                        id="cafeName"
                                        value={name}
                                        onChange={handleNameChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="정확한 카페 이름을 입력하세요"
                                        className="w-full p-2 pr-8 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                        autoFocus
                                        autoComplete="off"
                                    />
                                    {name && (
                                        <button
                                            type="button"
                                            onClick={handleResetSearch}
                                            className="absolute inset-y-0 right-0 flex items-center pr-2 text-stone-400 hover:text-stone-600"
                                            aria-label="입력 초기화"
                                        >
                                            <XCircleIcon className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                                <button 
                                    type="button"
                                    onClick={handleSearch}
                                    disabled={!isServiceReady}
                                    className="px-4 py-2 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition-colors shrink-0 disabled:bg-stone-400 disabled:cursor-wait"
                                    aria-label="카페 검색"
                                >
                                    {isServiceReady ? '검색' : '준비중'}
                                </button>
                            </div>
                            {renderSearchResults()}
                        </div>

                        {selectedPlace && (
                            <div className="space-y-2 animate-fade-in pt-4 mt-2 border-t">
                                <p className="text-sm font-semibold text-stone-600">선택된 장소</p>
                                <div ref={miniMapContainer} className="w-full h-32 bg-stone-200 rounded-lg border overflow-hidden"></div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-800">{selectedPlace.place_name}</p>
                                    <p className="text-xs text-stone-500">{selectedPlace.road_address_name || selectedPlace.address_name}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-sm font-medium text-stone-600">추가할 목록</label>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                {(Object.values(CafeStatus)).map(s => (
                                    <button 
                                        type="button" 
                                        key={s} 
                                        onClick={() => setStatus(s)}
                                        className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${status === s ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                                    >
                                        {statusLabels[s]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                        <button 
                            type="submit"
                            disabled={!selectedPlace}
                            className="flex-1 bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors"
                        >
                            카페 추가
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-300">취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCafeModal;