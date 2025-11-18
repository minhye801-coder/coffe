import React, { useEffect, useRef } from 'react';
import { Cafe, CafeStatus } from '../types';

// TypeScript에게 window 객체에 kakao가 존재함을 알립니다.
declare global {
    interface Window {
        kakao: any;
    }
}

interface KakaoMapProps {
    cafes: Cafe[];
    onSelectCafe: (cafe: Cafe) => void;
    userLocation: { lat: number; lon: number } | null;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ cafes, onSelectCafe, userLocation }) => {
    const mapContainer = useRef<HTMLDivElement>(null);

    const statusColors: Record<CafeStatus, string> = {
        [CafeStatus.Wishlist]: '#FBBF24', // Tailwind's amber-400
        [CafeStatus.Visited]: '#854d0e', // Tailwind's amber-800
        [CafeStatus.Favorite]: '#451a03', // Tailwind's amber-950
    };
    
    const createMarkerImageSrc = (color: string) => {
        const svg = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                <path fill="${color}" stroke="#fff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        `.trim();
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    const createUserMarkerImageSrc = () => {
        const svg = `
            <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="8" fill="#4285F4" stroke="white" stroke-width="2.5"/>
                <circle cx="14" cy="14" r="13" fill="#4285F4" fill-opacity="0.3"/>
            </svg>
        `.trim();
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    useEffect(() => {
        const container = mapContainer.current;
        if (!container) {
            return;
        }

        // --- 추가된 방어 코드 ---
        // 카카오 지도 스크립트가 로드되었는지 먼저 확인합니다.
        if (typeof window.kakao === 'undefined' || typeof window.kakao.maps === 'undefined') {
            console.error("Kakao 지도 스크립트가 로드되지 않았거나, window.kakao 객체를 찾을 수 없습니다.");
            console.error("네트워크 연결, 광고 차단기(Ad Blocker), 또는 index.html의 스크립트 태그를 확인해주세요.");
            container.innerHTML = `
                <div style="display:flex; flex-direction: column; align-items:center; justify-content:center; height:100%; text-align:center; padding: 20px; box-sizing: border-box; background-color: #f8f9fa;">
                    <p style="color:#d9534f; font-weight:bold; margin-bottom: 10px; font-size: 16px;">
                        카카오 지도를 불러오는 데 실패했습니다.
                    </p>
                    <p style="font-size: 14px; color: #555; line-height: 1.5;">
                        브라우저의 개발자 콘솔(F12)을 열어<br/>에러 메시지를 확인해주세요.
                    </p>
                </div>`;
            return;
        }

        const initializeMap = () => {
            const initialCenterLat = userLocation?.lat || 37.5665;
            const initialCenterLon = userLocation?.lon || 126.9780;
            const centerPosition = new window.kakao.maps.LatLng(initialCenterLat, initialCenterLon);

            // 지도를 새로 그리기 전에 항상 컨테이너를 비웁니다.
            container.innerHTML = ''; 

            const map = new window.kakao.maps.Map(container, {
                center: centerPosition,
                level: 7,
            });

            const bounds = new window.kakao.maps.LatLngBounds();
            let markersExist = false;

            cafes.forEach(cafe => {
                if (cafe.lat !== undefined && cafe.lon !== undefined) {
                    const position = new window.kakao.maps.LatLng(cafe.lat, cafe.lon);
                    
                    const imageSrc = createMarkerImageSrc(statusColors[cafe.status]);
                    const imageSize = new window.kakao.maps.Size(36, 36);
                    const imageOption = { offset: new window.kakao.maps.Point(18, 36) };
                    const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: position,
                        title: cafe.name,
                        image: markerImage
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content: `<div style="padding:5px 8px;font-size:13px;text-align:center;min-width:120px;font-weight:bold;color:#333;">${cafe.name}</div>`,
                        disableAutoPan: true,
                    });
                    
                    window.kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
                    window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
                    window.kakao.maps.event.addListener(marker, 'click', () => onSelectCafe(cafe));
                    
                    bounds.extend(position);
                    markersExist = true;
                }
            });

            if (userLocation) {
                const userPosition = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lon);
                
                const imageSrc = createUserMarkerImageSrc();
                const imageSize = new window.kakao.maps.Size(28, 28);
                const imageOption = { offset: new window.kakao.maps.Point(14, 14) };
                const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
                
                new window.kakao.maps.Marker({
                    map: map,
                    position: userPosition,
                    title: '현재 위치',
                    image: markerImage
                });
                bounds.extend(userPosition);
            }
            
            if (markersExist) {
                 setTimeout(() => map.setBounds(bounds), 100);
            } else if (userLocation) {
                 map.setCenter(centerPosition);
                 map.setLevel(5);
            }
        };

        window.kakao.maps.load(initializeMap);

        return () => {
            // cleanup 함수는 initializeMap 함수 시작 시 container.innerHTML = '' 코드로 대체되어
            // 더욱 확실하게 이전 상태를 정리하므로, 이 부분은 비워둡니다.
        };

    }, [cafes, userLocation, onSelectCafe]);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default KakaoMap;
