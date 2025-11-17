import React, { useState } from 'react';
import { Cafe, CafeStatus } from '../types';
import BottomNav from './BottomNav';
import CafeList from './CafeList';
import CafeDetailModal from './CafeDetailModal';
import AddCafeModal from './AddCafeModal';
import MapView from './MapView';
import { PlusIcon, MapIcon, ListBulletIcon as ListViewIcon } from './Icons';


interface MainPageProps {
    activeTab: CafeStatus;
    setActiveTab: (tab: CafeStatus) => void;
    cafes: Cafe[]; // Filtered cafes for list view
    allCafes: Cafe[]; // All cafes for map view
    selectedCafe: Cafe | null;
    setSelectedCafe: (cafe: Cafe | null) => void;
    onAddCafe: (name: string, status: CafeStatus) => void;
    onUpdateCafe: (cafe: Cafe) => void;
    onDeleteCafe: (cafeId: string) => void;
    isAddCafeModalOpen: boolean;
    setIsAddCafeModalOpen: (isOpen: boolean) => void;
}

const MainPage: React.FC<MainPageProps> = (props) => {
    const {
        activeTab,
        setActiveTab,
        cafes,
        allCafes,
        selectedCafe,
        setSelectedCafe,
        onAddCafe,
        onUpdateCafe,
        onDeleteCafe,
        isAddCafeModalOpen,
        setIsAddCafeModalOpen
    } = props;

    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    const tabTitles: Record<CafeStatus, string> = {
        [CafeStatus.Wishlist]: "가고싶은 곳",
        [CafeStatus.Visited]: "다녀온 곳",
        [CafeStatus.Favorite]: "단골"
    };
    
    const handleTabChange = (tab: CafeStatus) => {
        setActiveTab(tab);
        setViewMode('list'); // Switch back to list view when changing tabs
    };

    return (
        <div className="min-h-screen bg-stone-100 font-sans">
            <div className="max-w-md mx-auto relative pb-28">
                <header className="p-4 pt-6 text-center sticky top-0 bg-stone-100/80 backdrop-blur-sm z-10 flex justify-between items-center">
                    <div className="w-10"></div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-amber-900">{viewMode === 'list' ? tabTitles[activeTab] : "우리의 커피콕 지도"}</h1>
                        <p className="text-sm text-stone-500">우리의 공유 카페 다이어리</p>
                    </div>
                    <button onClick={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')} className="p-2 text-amber-800 rounded-full hover:bg-amber-100 transition-colors">
                        {viewMode === 'list' ? <MapIcon className="h-6 w-6" /> : <ListViewIcon className="h-6 w-6" />}
                    </button>
                </header>

                <main className="p-4">
                    {viewMode === 'list' ? (
                        <CafeList cafes={cafes} onSelectCafe={setSelectedCafe} />
                    ) : (
                        <MapView cafes={allCafes} onSelectCafe={setSelectedCafe} />
                    )}
                </main>

                <button
                    onClick={() => setIsAddCafeModalOpen(true)}
                    className="fixed bottom-24 right-4 bg-amber-800 text-white rounded-full p-4 shadow-lg hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 z-20"
                    aria-label="카페 추가하기"
                >
                    <PlusIcon className="h-6 w-6" />
                </button>

                <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />
            </div>

            {selectedCafe && (
                <CafeDetailModal
                    cafe={selectedCafe}
                    onClose={() => setSelectedCafe(null)}
                    onSave={onUpdateCafe}
                    onDelete={onDeleteCafe}
                />
            )}

            {isAddCafeModalOpen && (
                <AddCafeModal 
                    onClose={() => setIsAddCafeModalOpen(false)}
                    onAdd={onAddCafe}
                />
            )}
        </div>
    );
};

export default MainPage;