import React, { useState } from 'react';
import { CafeStatus } from '../types';

interface AddCafeModalProps {
    onClose: () => void;
    onAdd: (name: string, status: CafeStatus) => void;
}

const AddCafeModal: React.FC<AddCafeModalProps> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<CafeStatus>(CafeStatus.Wishlist);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim(), status);
            onClose();
        }
    };

    const statusLabels: Record<CafeStatus, string> = {
        [CafeStatus.Wishlist]: "가고싶은 곳",
        [CafeStatus.Visited]: "다녀온 곳",
        [CafeStatus.Favorite]: "단골",
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-bold text-stone-800 mb-4">새로운 카페 추가</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="cafeName" className="text-sm font-medium text-stone-600">카페 이름</label>
                            <input
                                type="text"
                                id="cafeName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="예: 아늑한 구석"
                                className="w-full mt-1 p-2 border border-stone-300 rounded-lg"
                                required
                                autoFocus
                            />
                        </div>
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
                        <button type="submit" className="flex-1 bg-amber-800 text-white py-3 rounded-lg font-semibold hover:bg-amber-900">카페 추가</button>
                        <button type="button" onClick={onClose} className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-lg font-semibold hover:bg-stone-300">취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCafeModal;