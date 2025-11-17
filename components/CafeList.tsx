import React from 'react';
import { Cafe } from '../types';
import CafeCard from './CafeCard';

interface CafeListProps {
    cafes: Cafe[];
    onSelectCafe: (cafe: Cafe) => void;
}

const CafeList: React.FC<CafeListProps> = ({ cafes, onSelectCafe }) => {
    if (cafes.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-stone-500">여기가 조금 비어있네요.</p>
                <p className="text-stone-400 text-sm">새로운 카페를 추가해 볼까요?</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {cafes.map(cafe => (
                <CafeCard key={cafe.id} cafe={cafe} onSelectCafe={onSelectCafe} />
            ))}
        </div>
    );
};

export default CafeList;