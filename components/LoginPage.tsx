import React, { useState } from 'react';
import { CoffeeBeanIcon } from './Icons';

interface LoginPageProps {
    onLogin: (name: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        } else {
            onLogin('우리'); // 이름이 없으면 기본값으로 로그인
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-4">
            <div className="w-full max-w-sm text-center">
                <div className="mb-8">
                    <CoffeeBeanIcon className="h-20 w-20 mx-auto text-amber-800" />
                    <h1 className="text-4xl font-bold text-amber-900 mt-4">커피콕</h1>
                    <p className="text-amber-700 mt-2"></p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="sr-only">이름</label>
                            <input 
                                id="username"
                                type="text" 
                                placeholder="이름을 입력해주세요"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="sr-only">비밀번호</label>
                            <input 
                                id="password"
                                type="password" 
                                placeholder="비밀번호"
                                className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div className="mt-8">
                            <button 
                                type="submit" 
                                className="w-20 h-20 mx-auto bg-amber-800 text-white rounded-full font-semibold hover:bg-amber-900 transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                aria-label="로그인"
                            >
                                <CoffeeBeanIcon className="h-10 w-10" />
                            </button>
                        </div>
                    </form>
                </div>
                <p className="text-sm text-stone-500 mt-6">
                    우리만의 카페 일기장♥
                </p>
            </div>
        </div>
    );
};

export default LoginPage;