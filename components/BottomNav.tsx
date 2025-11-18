import React from 'react';
import { CafeStatus } from '../types';
import { HeartIcon, ListBulletIcon, SparklesIcon } from './Icons';

interface BottomNavProps {
    activeTab: CafeStatus;
    setActiveTab: (tab: CafeStatus) => void;
}

const NavButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}> = ({ isActive, onClick, icon, label }) => {
    const activeClass = isActive ? 'text-amber-800' : 'text-stone-400';
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center flex-1 transition-colors duration-200 ${activeClass} hover:text-amber-700`}>
            {icon}
            <span className="text-xs font-medium mt-1">{label}</span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <footer className="w-full shrink-0 bg-white border-t border-stone-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-20">
                <NavButton
                    isActive={activeTab === CafeStatus.Wishlist}
                    onClick={() => setActiveTab(CafeStatus.Wishlist)}
                    icon={<ListBulletIcon className="h-6 w-6" />}
                    label="가고싶은 곳"
                />
                <NavButton
                    isActive={activeTab === CafeStatus.Visited}
                    onClick={() => setActiveTab(CafeStatus.Visited)}
                    icon={<HeartIcon className="h-6 w-6" />}
                    label="다녀온 곳"
                />
                <NavButton
                    isActive={activeTab === CafeStatus.Favorite}
                    onClick={() => setActiveTab(CafeStatus.Favorite)}
                    icon={<SparklesIcon className="h-6 w-6" />}
                    label="단골"
                />
            </div>
        </footer>
    );
};

export default BottomNav;