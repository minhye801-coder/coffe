
import React from 'react';
import { Cafe } from '../types';
import { StarIcon } from './Icons';

interface CafeCardProps {
    cafe: Cafe;
    onSelectCafe: (cafe: Cafe) => void;
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe, onSelectCafe }) => {
    return (
        <div 
            onClick={() => onSelectCafe(cafe)} 
            className="bg-white rounded-2xl shadow-md overflow-hidden flex items-center p-4 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
        >
            <img 
                src={cafe.photo || `https://picsum.photos/seed/${cafe.id}/200/200`}
                alt={cafe.name} 
                className="w-20 h-20 object-cover rounded-lg mr-4"
            />
            <div className="flex-1">
                <h3 className="font-bold text-lg text-stone-800">{cafe.name}</h3>
                {cafe.rating !== undefined && (
                    <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-5 w-5 ${i < (cafe.rating || 0) ? 'text-amber-500' : 'text-stone-300'}`} />
                        ))}
                    </div>
                )}
                 {cafe.review && <p className="text-sm text-stone-500 mt-2 line-clamp-2">{cafe.review}</p>}
            </div>
        </div>
    );
};

export default CafeCard;
