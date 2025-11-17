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
}

const KakaoMap: React.FC<KakaoMapProps> = ({ cafes, onSelectCafe }) => {
    const mapContainer = useRef<HTMLDivElement>(null);

    const statusColors: Record<CafeStatus, string> = {
        [CafeStatus.Wishlist]: '#FBBF24', // Tailwind's amber-400
        [CafeStatus.Visited]: '#854d0e', // Tailwind's amber-800
        [CafeStatus.Favorite]: '#451a03', // Tailwind's amber-950
    };
    
    // 색상을 적용한 커피콩 SVG 마커 이미지를 생성합니다.
    const createMarkerImageSrc = (color: string) => {
        const svg = `
            <svg viewBox="0 0 18 24" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <path fill="${color}" stroke="#fff" stroke-width="1" d="M16.5,24a7.46,7.46,0,0,1-5.63-2.58,7.5,7.5,0,0,1,0-10.84,7.46,7.46,0,0,1,5.63-2.58,7.5,7.5,0,0,1,5.63,13.42A7.46,7.46,0,0,1,16.5,24Zm0-14a6.5,6.5,0,0,0-4.88,11.75,6.5,6.5,0,0,0,9.76-9.76A6.5,6.5,0,0,0,16.5,10Z" transform="translate(-4.5)" />
              <path fill="${color}" stroke="#fff" stroke-width="1" d="M13.2,10.2a.5.5,0,0,1-.35-.85L17.5,4.7a.5.5,0,0,1,.71.71l-4.65,4.65A.5.5,0,0,1,13.2,10.2Z" transform="translate(-4.5)" />
            </svg>
        `.trim();
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    };

    useEffect(() => {
        if (!mapContainer.current || typeof window.kakao === 'undefined' || !window.kakao.maps) {
            console.error("카카오 지도 API가 로드되지 않았습니다.");
            return;
        }

        const container = mapContainer.current;
        const options = {
            center: new window.kakao.maps.LatLng(36.5, 127.5),
            level: 13,
        };

        const map = new window.kakao.maps.Map(container, options);
        map.setDraggable(true);
        map.setZoomable(true);

        const bounds = new window.kakao.maps.LatLngBounds();
        let hasValidCoords = false;

        cafes.forEach(cafe => {
            if (cafe.lat !== undefined && cafe.lon !== undefined) {
                hasValidCoords = true;
                const position = new window.kakao.maps.LatLng(cafe.lat, cafe.lon);
                
                const imageSrc = createMarkerImageSrc(statusColors[cafe.status]);
                const imageSize = new window.kakao.maps.Size(32, 32);
                const imageOption = {offset: new window.kakao.maps.Point(16, 32)};
                const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

                const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: position,
                    title: cafe.name,
                    image: markerImage
                });

                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;font-size:12px;text-align:center;min-width:120px;">${cafe.name}</div>`,
                    disableAutoPan: true,
                });
                
                window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                    infowindow.open(map, marker);
                });

                window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                    infowindow.close();
                });

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    onSelectCafe(cafe);
                });
                
                bounds.extend(position);
            }
        });

        if (hasValidCoords) {
            map.setBounds(bounds);
        }

    }, [cafes, onSelectCafe]);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default KakaoMap;
