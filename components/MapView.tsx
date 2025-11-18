import React from 'react';
import { Cafe } from '../types';
import KakaoMap from './KakaoMap';

interface MapViewProps {
    cafes: Cafe[];
    onSelectCafe: (cafe: Cafe) => void;
    userLocation: { lat: number; lon: number } | null;
}

const MapView: React.FC<MapViewProps> = ({ cafes, onSelectCafe, userLocation }) => {
    return (
        <div className="w-full h-full bg-stone-200 rounded-2xl overflow-hidden shadow-inner">
            <KakaoMap cafes={cafes} onSelectCafe={onSelectCafe} userLocation={userLocation} />
        </div>
    );
};

export default MapView;