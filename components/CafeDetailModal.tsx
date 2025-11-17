import React, { useState, useCallback, useEffect } from 'react';
import { Cafe, CafeStatus } from '../types';
import { StarIcon, TrashIcon, SparklesIcon as SuggestionIcon } from './Icons';
import { generateReviewSummary } from '../services/geminiService';

interface CafeDetailModalProps {
    cafe: Cafe;
    onClose: () => void;
    onSave: (cafe: Cafe) => void;
    onDelete: (cafeId: string) => void;
}

const StarRatingInput: React.FC<{ rating: number; onRatingChange: (rating: number) => void; }> = ({ rating, onRatingChange }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <button key={i} type="button" onClick={() => onRatingChange(i + 1)}>
                <StarIcon className={`h-8 w-8 transition-colors ${i < rating ? 'text-amber-500' : 'text-stone-300 hover:text-amber-300'}`} />
            </button>
        ))}
    </div>
);

const CafeDetailModal: React.FC<CafeDetailModalProps> = ({ cafe, onClose, onSave, onDelete }) => {
    const [editedCafe, setEditedCafe] = useState<Cafe>(cafe);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setEditedCafe(cafe);
    }, [cafe]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedCafe(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (newRating: number) => {
        setEditedCafe(prev => ({ ...prev, rating: newRating }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedCafe(prev => ({ ...prev, photo: reader.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEditedCafe(prev => ({...prev, status: e.target.value as CafeStatus}));
    };

    const handleGenerateReview = useCallback(async () => {
        if (!editedCafe.menu || !editedCafe.rating) {
            alert("먼저 메뉴와 별점을 추가해주세요.");
            return;
        }
        setIsGenerating(true);
        const summary = await generateReviewSummary(editedCafe.name, editedCafe.menu, editedCafe.rating);
        setEditedCafe(prev => ({...prev, review: summary}));
        setIsGenerating(false);
    }, [editedCafe.name, editedCafe.menu, editedCafe.rating]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedCafe);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-t-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSave}>
                    <h2 className="text-2xl font-bold text-stone-800">{editedCafe.name}</h2>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-stone-600">상태</label>
                            <select name="status" value={editedCafe.status} onChange={handleStatusChange} className="w-full mt-1 p-2 border border-stone-300 rounded-lg">
                                <option value={CafeStatus.Wishlist}>가고싶은 곳</option>
                                <option value={CafeStatus.Visited}>다녀온 곳</option>
                                <option value={CafeStatus.Favorite}>단골</option>
                            </select>
                        </div>
                        {editedCafe.status !== CafeStatus.Wishlist && (
                        <>
                        <div>
                            <label className="text-sm font-medium text-stone-600">별점</label>
                            <StarRatingInput rating={editedCafe.rating || 0} onRatingChange={handleRatingChange} />
                        </div>
                        <div>
                            <label htmlFor="visitDate" className="text-sm font-medium text-stone-600">방문 날짜</label>
                            <input type="date" id="visitDate" name="visitDate" value={editedCafe.visitDate || ''} onChange={handleChange} max={today} className="w-full mt-1 p-2 border border-stone-300 rounded-lg"/>
                        </div>
                        <div>
                            <label htmlFor="menu" className="text-sm font-medium text-stone-600">메뉴</label>
                            <input type="text" id="menu" name="menu" value={editedCafe.menu || ''} onChange={handleChange} placeholder="예: 아이스 라떼, 아몬드 크루아상" className="w-full mt-1 p-2 border border-stone-300 rounded-lg"/>
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="review" className="text-sm font-medium text-stone-600">우리의 후기</label>
                                <button type="button" onClick={handleGenerateReview} disabled={isGenerating} className="flex items-center text-xs text-amber-700 hover:text-amber-900 disabled:opacity-50">
                                    <SuggestionIcon className="h-4 w-4 mr-1"/>
                                    {isGenerating ? '생각 중...' : '추천받기'}
                                </button>
                            </div>
                            <textarea id="review" name="review" value={editedCafe.review || ''} onChange={handleChange} rows={4} placeholder="어땠나요?" className="w-full mt-1 p-2 border border-stone-300 rounded-lg"></textarea>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-stone-600">사진</label>
                            {editedCafe.photo && <img src={editedCafe.photo} alt="카페 추억" className="mt-2 rounded-lg w-full h-48 object-cover"/>}
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full mt-2 text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"/>
                        </div>
                        </>
                        )}
                    </div>
                    <div className="mt-6 flex gap-4">
                        <button type="submit" className="flex-1 bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900">저장</button>
                        <button type="button" onClick={onClose} className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-300">취소</button>
                        <button type="button" onClick={() => { if (window.confirm('이 추억을 정말 삭제하시겠어요?')) onDelete(cafe.id); }} className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                           <TrashIcon className="h-5 w-5"/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CafeDetailModal;