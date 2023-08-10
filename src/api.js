const API_KEY = "95e9e8893e20796295c3a6c8e875bd33";


export function get_weather_json(city, lang) {
    return fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=${API_KEY}`
    ).then((result) => result.json());
}
