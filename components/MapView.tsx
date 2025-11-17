import React from 'react';
import { Cafe } from '../types';
import KakaoMap from './KakaoMap';

interface MapViewProps {
    cafes: Cafe[];
    onSelectCafe: (cafe: Cafe) => void;
}

const MapView: React.FC<MapViewProps> = ({ cafes, onSelectCafe }) => {
    return (
        <div className="w-full h-[600px] bg-stone-200 rounded-2xl overflow-hidden shadow-inner">
            <KakaoMap cafes={cafes} onSelectCafe={onSelectCafe} />
        </div>
    );
};

export default MapView;