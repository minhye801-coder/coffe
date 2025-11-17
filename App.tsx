import React, { useState, useMemo } from 'react';
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
    const [cafes, setCafes] = useState<Cafe[]>(MOCK_CAFE_DATA);
    const [activeTab, setActiveTab] = useState<CafeStatus>(CafeStatus.Visited);
    const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
    const [isAddCafeModalOpen, setIsAddCafeModalOpen] = useState(false);

    const handleLogin = () => setIsLoggedIn(true);
    const handleMatch = () => setIsMatched(true);

    const handleAddCafe = (name: string, status: CafeStatus) => {
        const newCafe: Cafe = {
            id: new Date().toISOString(),
            name,
            status,
            // For now, new cafes don't have coordinates.
            // A real app would use a geocoding API.
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
            // FIX: Corrected typo in prop name from 'setIsAddCafe-ModalOpen' to 'setIsAddCafeModalOpen'.
            setIsAddCafeModalOpen={setIsAddCafeModalOpen}
        />
    );
};

export default App;