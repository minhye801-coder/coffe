import React from 'react';

interface InvitePageProps {
    onMatch: () => void;
}

const InvitePage: React.FC<InvitePageProps> = ({ onMatch }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-4">
            <div className="w-full max-w-sm text-center">
                <div className="mb-8">
                    <span className="text-6xl" role="img" aria-label="two hearts">💕</span>
                    <h1 className="text-3xl font-bold text-pink-800 mt-4">마지막 단계!</h1>
                    <p className="text-pink-600 mt-2">파트너를 초대해 함께 카페 여정을 공유해 보세요.</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full">
                    <p className="text-stone-600 mb-6">
                        파트너가 초대를 수락하면, 두 분 모두 다이어리에 카페를 추가할 수 있습니다.
                    </p>
                    <button 
                        onClick={onMatch}
                        className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors duration-300"
                    >
                        초대하고 시작하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvitePage;