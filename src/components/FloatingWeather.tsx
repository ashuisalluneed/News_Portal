'use client';

import { useState, useEffect } from 'react';

/**
 * Floating Weather Icon
 * Displays current weather in a small floating circle
 */
export default function FloatingWeather() {
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({
        temp: 0,
        code: 0,
        isDay: 1,
        city: ''
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 1. Get Location (Try GeoJS first)
                let lat = 40.7128; // Default: New York
                let lon = -74.0060;
                let city = 'New York';

                try {
                    const locRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
                    if (locRes.ok) {
                        const locData = await locRes.json();
                        if (locData.latitude && locData.longitude) {
                            lat = parseFloat(locData.latitude);
                            lon = parseFloat(locData.longitude);
                            city = locData.city;
                        }
                    } else {
                        throw new Error('GeoJS failed');
                    }
                } catch (e) {
                    // Fallback to ipapi.co
                    try {
                        const locRes = await fetch('https://ipapi.co/json/');
                        if (locRes.ok) {
                            const locData = await locRes.json();
                            if (locData.latitude && locData.longitude) {
                                lat = locData.latitude;
                                lon = locData.longitude;
                                city = locData.city;
                            }
                        }
                    } catch (err) {
                        console.warn('Location fetch failed, using default');
                    }
                }

                // 2. Get Weather
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&temperature_unit=celsius`
                );

                if (!weatherRes.ok) throw new Error('Weather API error');

                const weatherData = await weatherRes.json();

                setWeather({
                    temp: Math.round(weatherData.current.temperature_2m),
                    code: weatherData.current.weather_code,
                    isDay: weatherData.current.is_day,
                    city: city
                });
                setLoading(false);
            } catch (error) {
                console.error('Weather widget error:', error);
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (code: number, isDay: number) => {
        if (code >= 95) return '⚡';
        if (code >= 71 && code <= 77) return '❄️';
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️';
        if (code === 45 || code === 48) return '🌫️';
        if (code === 2 || code === 3) return '☁️';
        if (code === 0 || code === 1) return isDay ? '☀️' : '🌙';
        return '🌤️';
    };

    if (loading) return null;

    return (
        <div className="fixed top-[130px] right-4 z-40 animate-fade-in hidden md:block">
            <div className="group relative flex items-center justify-center w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 hover:scale-110 transition-transform cursor-pointer">
                <div className="flex flex-col items-center leading-none">
                    <span className="text-xl mb-0.5">{getWeatherIcon(weather.code, weather.isDay)}</span>
                    <span className="text-xs font-bold text-gray-800">{weather.temp}°</span>
                </div>

                {/* Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                    {weather.city ? `${weather.city}: ` : ''}Current Weather
                </div>
            </div>
        </div>
    );
}
