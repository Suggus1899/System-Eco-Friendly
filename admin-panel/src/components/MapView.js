import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default marker icons in webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom colored markers
const createColoredIcon = (color) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 14.5 23 15.3 23.7a1 1 0 0 0 1.4 0C17.5 39 32 26.5 32 16c0-8.837-7.163-16-16-16z" fill="${color}"/>
        <circle cx="16" cy="16" r="8" fill="white" fill-opacity="0.9"/>
        <circle cx="16" cy="16" r="4" fill="${color}"/>
      </svg>
    `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
    });
};

const markerColors = {
    active: '#10b981',    // Green
    pending: '#f59e0b',   // Yellow/Warning
    inactive: '#ef4444',  // Red
};

function MapView({
    centers = [],
    selectedCenter = null,
    onMarkerClick = null,
    height = '400px',
    showPopups = true,
    interactive = true
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        // Initialize map if not already initialized
        if (!mapInstanceRef.current && mapContainerRef.current) {
            // Default center (Venezuela)
            const defaultCenter = [8.5, -66.9];
            const defaultZoom = 6;

            mapInstanceRef.current = L.map(mapContainerRef.current, {
                center: defaultCenter,
                zoom: defaultZoom,
                zoomControl: interactive,
                dragging: interactive,
                scrollWheelZoom: interactive,
            });

            // Add tile layer (OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [interactive]);

    // Update markers when centers change
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        if (centers.length === 0) return;

        // Add markers for each center
        const bounds = [];
        centers.forEach((center) => {
            const lat = parseFloat(center.latitude);
            const lng = parseFloat(center.longitude);

            if (isNaN(lat) || isNaN(lng)) return;

            const color = markerColors[center.status] || markerColors.active;
            const icon = createColoredIcon(color);

            const marker = L.marker([lat, lng], { icon }).addTo(mapInstanceRef.current);

            if (showPopups) {
                const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1f2937;">
              ${center.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">
              📍 ${center.address}
            </p>
            ${center.phone ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">📞 ${center.phone}</p>` : ''}
            ${center.hours_operation ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">🕐 ${center.hours_operation}</p>` : ''}
            <span style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 600;
              background: ${color}20;
              color: ${color};
              text-transform: uppercase;
            ">${center.status}</span>
          </div>
        `;
                marker.bindPopup(popupContent);
            }

            if (onMarkerClick) {
                marker.on('click', () => onMarkerClick(center));
            }

            markersRef.current.push(marker);
            bounds.push([lat, lng]);
        });

        // Fit map to show all markers
        if (bounds.length > 0) {
            if (bounds.length === 1) {
                mapInstanceRef.current.setView(bounds[0], 14);
            } else {
                mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [centers, showPopups, onMarkerClick]);

    // Handle selected center highlight
    useEffect(() => {
        if (!mapInstanceRef.current || !selectedCenter) return;

        const lat = parseFloat(selectedCenter.latitude);
        const lng = parseFloat(selectedCenter.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            mapInstanceRef.current.setView([lat, lng], 15, { animate: true });

            // Open popup of selected marker
            markersRef.current.forEach(marker => {
                const markerLatLng = marker.getLatLng();
                if (markerLatLng.lat === lat && markerLatLng.lng === lng) {
                    marker.openPopup();
                }
            });
        }
    }, [selectedCenter]);

    return (
        <div
            ref={mapContainerRef}
            className="map-container"
            style={{
                height,
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden'
            }}
        />
    );
}

export default MapView;
