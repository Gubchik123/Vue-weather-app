const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;


export function get_weather_json(city, lang) {
    return fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=${API_KEY}`
    ).then((result) => result.json());
}
