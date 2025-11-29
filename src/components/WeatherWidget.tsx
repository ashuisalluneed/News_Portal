'use client';

import { useState, useEffect } from 'react';

/**
 * Weather Widget
 * Fetches real weather data from Open-Meteo API based on user location
 */
export default function WeatherWidget() {
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({
        temp: 0,
        condition: 'Loading...',
        location: 'Locating...',
        high: 0,
        low: 0,
        humidity: 0,
        wind: 0,
        isDay: 1,
        code: 0
    });

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 1. Get Location (Try GeoJS first)
                let lat = 40.7128;
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
                        console.warn('All location fetches failed, using default');
                    }
                }

                // 2. Get Weather
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&timezone=auto`
                );

                if (!weatherRes.ok) throw new Error('Weather API error');

                const weatherData = await weatherRes.json();

                setWeather({
                    temp: Math.round(weatherData.current.temperature_2m),
                    condition: getWeatherDescription(weatherData.current.weather_code),
                    location: city || 'Unknown Location',
                    high: Math.round(weatherData.daily.temperature_2m_max[0]),
                    low: Math.round(weatherData.daily.temperature_2m_min[0]),
                    humidity: weatherData.current.relative_humidity_2m,
                    wind: Math.round(weatherData.current.wind_speed_10m),
                    isDay: weatherData.current.is_day,
                    code: weatherData.current.weather_code
                });
                setLoading(false);
            } catch (error) {
                console.error('Weather fetch error:', error);
                // Fallback to default/mock if error
                setWeather(prev => ({ ...prev, location: 'New York', temp: 22, condition: 'Sunny' }));
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    // WMO Weather interpretation codes (WW)
    const getWeatherDescription = (code: number) => {
        if (code === 0) return 'Clear Sky';
        if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
        if (code === 45 || code === 48) return 'Foggy';
        if (code >= 51 && code <= 55) return 'Drizzle';
        if (code >= 61 && code <= 67) return 'Rain';
        if (code >= 71 && code <= 77) return 'Snow';
        if (code >= 80 && code <= 82) return 'Showers';
        if (code >= 95) return 'Thunderstorm';
        return 'Clear';
    };

    const getWeatherIcon = (code: number, isDay: number) => {
        // Thunderstorm
        if (code >= 95) return '⚡';
        // Snow
        if (code >= 71 && code <= 77) return '❄️';
        // Rain / Drizzle
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️';
        // Fog
        if (code === 45 || code === 48) return '🌫️';
        // Cloudy
        if (code === 2 || code === 3) return '☁️';
        // Clear / Partly Cloudy
        if (code === 0 || code === 1) return isDay ? '☀️' : '🌙';

        return '🌤️';
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg mb-8 animate-pulse">
                <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
                <div className="h-12 bg-white/20 rounded w-1/3 mb-6"></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-8 bg-white/20 rounded"></div>
                    <div className="h-8 bg-white/20 rounded"></div>
                    <div className="h-8 bg-white/20 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg mb-8 transition-all hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {weather.location}
                    </h3>
                    <p className="text-blue-100 text-sm">Live Conditions</p>
                </div>
                <div className="text-4xl animate-bounce-slow">
                    {getWeatherIcon(weather.code, weather.isDay)}
                </div>
            </div>

            <div className="flex items-end gap-4 mb-6">
                <div className="text-5xl font-bold tracking-tighter">
                    {weather.temp}°
                </div>
                <div className="pb-2 text-blue-100 font-medium text-lg">
                    {weather.condition}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4 text-center text-sm">
                <div>
                    <p className="text-blue-200 mb-1">H / L</p>
                    <p className="font-semibold">{weather.high}° / {weather.low}°</p>
                </div>
                <div>
                    <p className="text-blue-200 mb-1">Humidity</p>
                    <p className="font-semibold">{weather.humidity}%</p>
                </div>
                <div>
                    <p className="text-blue-200 mb-1">Wind</p>
                    <p className="font-semibold">{weather.wind} km/h</p>
                </div>
            </div>
        </div>
    );
}
