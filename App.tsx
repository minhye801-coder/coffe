import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Cafe, CafeStatus } from './types';
import LoginPage from './components/LoginPage';
import InvitePage from './components/InvitePage';
import MainPage from './components/MainPage';

const MOCK_CAFE_DATA: Cafe[] = [
    { id: '1', name: '어반 빈즈', status: CafeStatus.Visited, visitDate: '2023-10-26', menu: '라떼, 크루아상', review: '아늑한 분위기, 훌륭한 커피!', photo: 'https://picsum.photos/400/300?random=1', rating: 5, lat: 37.5665, lon: 126.9780 }, // 서울
    { id: '2', name: '더 그라인드 하우스', status: CafeStatus.Wishlist, lat: 35.1796, lon: 129.0756 }, // 부산
    { id: '3', name: '데일리 브루', status: CafeStatus.Favorite, visitDate: '2023-09-15', menu: '아메리카노', review: '빠르게 카페인 충전이 필요할 때 가는 곳.', photo: 'https://picsum.photos/400/300?random=3', rating: 4, lat: 37.4979, lon: 127.0276 }, // 강남
    { id: '4', name: '아로마 모카', status: CafeStatus.Wishlist, lat: 33.4996, lon: 126.5312 }, // 제주
    { id: '5', name: '십 앤 손더', status: CafeStatus.Visited, visitDate: '2023-11-05', menu: '말차 라떼, 스콘', review: '조금 붐볐지만 말차는 그럴 가치가 있었어.', photo: 'https://picsum.photos/400/300?random=5', rating: 3, lat: 35.8714, lon: 128.6014 }, // 대구
    { id: '6', name: '커파 러브', status: CafeStatus.Favorite, visitDate: '2023-11-10', menu: '카푸치노, 티라미수', review: '동네 최고의 티라미수! 우리가 정말 좋아하는 곳.', photo: 'https://picsum.photos/400/300?random=6', rating: 5, lat: 37.5519, lon: 126.9248 }, // 홍대
];


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMatched, setIsMatched] = useState(false);
    const [userName, setUserName] = useState('');
    const [cafes, setCafes] = useState<Cafe[]>(MOCK_CAFE_DATA);
    const [activeTab, setActiveTab] = useState<CafeStatus>(CafeStatus.Visited);
    const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
    const [isAddCafeModalOpen, setIsAddCafeModalOpen] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    
    const [kakaoConfigStatus, setKakaoConfigStatus] = useState<'checking' | 'success' | 'error'>('checking');
    const [isKakaoWarningVisible, setIsKakaoWarningVisible] = useState(true);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // 위치를 가져올 수 없을 때 기본 위치(서울 시청)로 설정
                    setUserLocation({ lat: 37.5665, lon: 126.9780 });
                }
            );
        } else {
             // Geolocation API를 지원하지 않을 경우 기본 위치로 설정
             setUserLocation({ lat: 37.5665, lon: 126.9780 });
        }
    }, []);

    // Kakao setup check logic
    useEffect(() => {
        const performCheck = () => {
            if (typeof window.kakao === 'undefined' || typeof window.kakao.maps === 'undefined' || typeof window.kakao.maps.services === 'undefined') {
                console.error("Kakao Maps script or services failed to load.");
                setKakaoConfigStatus('error');
                return;
            }

            const places = new window.kakao.maps.services.Places();
            
            // A simple search to check if the API key and domain are correctly configured.
            places.keywordSearch('판교역', (data, status) => {
                if (status === window.kakao.maps.services.Status.OK || status === window.kakao.maps.services.Status.ZERO_RESULT) {
                    setKakaoConfigStatus('success');
                } else {
                    // status is likely ERROR, which means domain is not registered
                    console.error("Kakao services check failed with status:", status);
                    setKakaoConfigStatus('error');
                }
            });
        };
        
        // Ensure kakao.maps.load is available and use it to run the check
        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
            window.kakao.maps.load(performCheck);
        } else {
            // Fallback if the script hasn't loaded at all, try after a short delay
            const timeoutId = setTimeout(() => {
                if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
                     window.kakao.maps.load(performCheck);
                } else {
                    console.error("Kakao Maps script not found.");
                    setKakaoConfigStatus('error');
                }
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, []);

    const handleLogin = (name: string) => {
        setUserName(name);
        setIsLoggedIn(true);
    };
    const handleMatch = () => setIsMatched(true);

    const handleAddCafe = (name: string, status: CafeStatus, lat?: number, lon?: number) => {
        const newCafe: Cafe = {
            id: new Date().toISOString(),
            name,
            status,
            lat,
            lon,
        };
        setCafes(prev => [newCafe, ...prev]);
        if(status !== CafeStatus.Wishlist) {
            setSelectedCafe(newCafe);
        }
    };
    
    const handleUpdateCafe = (updatedCafe: Cafe) => {
        setCafes(prev => prev.map(cafe => cafe.id === updatedCafe.id ? updatedCafe : cafe));
        setSelectedCafe(null);
    };

    const handleDeleteCafe = (cafeId: string) => {
        setCafes(prev => prev.filter(cafe => cafe.id !== cafeId));
        setSelectedCafe(null);
    }
    
    const filteredCafes = useMemo(() => {
        return cafes.filter(cafe => cafe.status === activeTab);
    }, [cafes, activeTab]);

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (!isMatched) {
        return <InvitePage onMatch={handleMatch} />;
    }

    return (
        <MainPage
            userName={userName}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            cafes={filteredCafes}
            allCafes={cafes} // Pass all cafes to the map view
            selectedCafe={selectedCafe}
            setSelectedCafe={setSelectedCafe}
            onAddCafe={handleAddCafe}
            onUpdateCafe={handleUpdateCafe}
            onDeleteCafe={handleDeleteCafe}
            isAddCafeModalOpen={isAddCafeModalOpen}
            setIsAddCafeModalOpen={setIsAddCafeModalOpen}
            userLocation={userLocation}
            kakaoConfigStatus={kakaoConfigStatus}
            isKakaoWarningVisible={isKakaoWarningVisible}
            setIsKakaoWarningVisible={setIsKakaoWarningVisible}
        />
    );
};

export default App;