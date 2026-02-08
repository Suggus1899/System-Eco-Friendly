import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom picker icon
const pickerIcon = L.divIcon({
    className: 'location-picker-marker',
    html: `
    <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C8.954 0 0 8.954 0 20c0 13.125 18.125 28.75 19.125 29.625a1.25 1.25 0 0 0 1.75 0C21.875 48.75 40 33.125 40 20c0-11.046-8.954-20-20-20z" fill="#3b82f6"/>
      <circle cx="20" cy="20" r="10" fill="white"/>
      <circle cx="20" cy="20" r="5" fill="#3b82f6"/>
      <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="0.5s" repeatCount="indefinite" additive="sum"/>
    </svg>
  `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
});

function LocationPicker({
    initialLat = null,
    initialLng = null,
    onLocationSelect,
    height = '300px'
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [coordinates, setCoordinates] = useState({
        lat: initialLat || '',
        lng: initialLng || ''
    });

    useEffect(() => {
        if (!mapInstanceRef.current && mapContainerRef.current) {
            // Default center (Venezuela) or initial coordinates
            const defaultLat = initialLat || 9.0;
            const defaultLng = initialLng || -66.0;
            const defaultZoom = initialLat && initialLng ? 15 : 6;

            mapInstanceRef.current = L.map(mapContainerRef.current, {
                center: [defaultLat, defaultLng],
                zoom: defaultZoom,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);

            // Add initial marker if coordinates provided
            if (initialLat && initialLng) {
                markerRef.current = L.marker([initialLat, initialLng], {
                    icon: pickerIcon,
                    draggable: true
                }).addTo(mapInstanceRef.current);

                markerRef.current.on('dragend', handleMarkerDrag);
            }

            // Click handler to place/move marker
            mapInstanceRef.current.on('click', handleMapClick);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        updateMarkerPosition(lat, lng);
    };

    const handleMarkerDrag = (e) => {
        const { lat, lng } = e.target.getLatLng();
        updateMarkerPosition(lat, lng);
    };

    const updateMarkerPosition = (lat, lng) => {
        const roundedLat = Math.round(lat * 1000000) / 1000000;
        const roundedLng = Math.round(lng * 1000000) / 1000000;

        setCoordinates({ lat: roundedLat, lng: roundedLng });

        if (markerRef.current) {
            markerRef.current.setLatLng([roundedLat, roundedLng]);
        } else {
            markerRef.current = L.marker([roundedLat, roundedLng], {
                icon: pickerIcon,
                draggable: true
            }).addTo(mapInstanceRef.current);
            markerRef.current.on('dragend', handleMarkerDrag);
        }

        if (onLocationSelect) {
            onLocationSelect(roundedLat, roundedLng);
        }
    };

    const handleInputChange = (field, value) => {
        const numValue = parseFloat(value);
        const newCoords = { ...coordinates, [field]: value };
        setCoordinates(newCoords);

        if (!isNaN(numValue)) {
            const lat = field === 'lat' ? numValue : parseFloat(coordinates.lat);
            const lng = field === 'lng' ? numValue : parseFloat(coordinates.lng);

            if (!isNaN(lat) && !isNaN(lng)) {
                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                    mapInstanceRef.current.setView([lat, lng], 15);
                } else {
                    markerRef.current = L.marker([lat, lng], {
                        icon: pickerIcon,
                        draggable: true
                    }).addTo(mapInstanceRef.current);
                    markerRef.current.on('dragend', handleMarkerDrag);
                    mapInstanceRef.current.setView([lat, lng], 15);
                }

                if (onLocationSelect) {
                    onLocationSelect(lat, lng);
                }
            }
        }
    };

    return (
        <div>
            <div
                ref={mapContainerRef}
                style={{
                    height,
                    width: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '12px',
                    border: '2px solid var(--border-color)'
                }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)'
                    }}>
                        Latitud
                    </label>
                    <input
                        type="number"
                        step="0.000001"
                        value={coordinates.lat}
                        onChange={(e) => handleInputChange('lat', e.target.value)}
                        placeholder="Ej: 8.622016"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)'
                    }}>
                        Longitud
                    </label>
                    <input
                        type="number"
                        step="0.000001"
                        value={coordinates.lng}
                        onChange={(e) => handleInputChange('lng', e.target.value)}
                        placeholder="Ej: -66.856633"
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '2px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>
            <p style={{
                marginTop: '8px',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                textAlign: 'center'
            }}>
                📍 Haz clic en el mapa o arrastra el marcador para seleccionar ubicación
            </p>
        </div>
    );
}

export default LocationPicker;
