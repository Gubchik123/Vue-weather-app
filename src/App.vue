<template>
    <div>
        <button
            @click="change_lang"
            style="top: 20px; left: 20px"
            class="position-absolute btn btn-lg btn-secondary"
        >
            {{ lang === "en" ? "UA" : "EN" }}
        </button>

        <div class="container mt-5 py-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="weather-card">
                        <template v-if="weather">
                            <h2>{{ t("weather_in") }} {{ result_city }}</h2>
                            <div class="d-flex align-items-center">
                                <!-- Weather icon -->
                                <img
                                    :src="
                                        'http://openweathermap.org/img/w/' +
                                        weather.weather[0].icon +
                                        '.png'
                                    "
                                    :alt="t('weather_icon')"
                                />
                                <!-- Main weather info -->
                                <div class="d-flex align-items-center">
                                    <div class="ms-3">
                                        <h3 class="mb-0">
                                            {{ parseInt(weather.main.temp / 10) }}°C
                                        </h3>
                                        <p>
                                            {{
                                                weather.weather[0].description
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                weather.weather[0].description.slice(1)
                                            }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <h2 v-else class="mb-4">{{ t("weather_app") }}</h2>
                        <!-- Form -->
                        <div class="form-floating text-dark" :class="{ 'mb-3': !error_message }">
                            <input
                                v-model.lazy.trim="city"
                                @keyup.enter="get_weather"
                                @input="input"
                                type="text"
                                id="city_input"
                                class="form-control"
                                :placeholder="t('label_city_name')"
                            />
                            <label for="city_input">{{ t("label_city_name") }}</label>
                        </div>
                        <!-- Error message -->
                        <div v-if="error_message" class="text-sm text-white bg-danger mb-3">
                            {{ error_message }}
                        </div>
                        <button @click="get_weather" class="btn btn-primary">
                            {{ t("btn_get_weather") }}
                        </button>
                        <!-- Weather details -->
                        <div v-if="weather" class="mt-4">
                            <h4>{{ t("weather_details") }}</h4>
                            <div>
                                <strong>{{ t("wind") }}:</strong>
                                {{ parseInt(weather.wind.speed) }} {{ t("km_h") }}
                            </div>
                            <div>
                                <strong>{{ t("humidity") }}:</strong>
                                {{ weather.main.humidity }}%
                            </div>
                            <div>
                                <strong>{{ t("pressure") }}:</strong>
                                {{ weather.main.pressure }} {{ t("hPa") }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get_locale } from "./locales"
import { get_weather_json } from "./api"

export default {
    name: "App",
    data() {
        return {
            lang: "en",
            city: "",
            result_city: "",
            error_message: "",
            locale: {},
            weather: null
        }
    },
    created() {
        this.lang = localStorage.getItem("lang") || "en"
        this.locale = get_locale(this.lang)
    },
    watch: {
        lang() {
            localStorage.setItem("lang", this.lang)
            this.locale = get_locale(this.lang)
        }
    },
    computed: {
        city_patters() {
            return {
                en: /^[a-zA-Z\s]+$/,
                ua: /^[а-яА-ЯіЇґє\s]+$/
            }
        },
    },
    methods: {
        change_lang() {
            this.lang = this.lang === "en" ? "ua" : "en"
        },
        t(key) {
            return this.locale[key]
        },
        input() {
            this.weather = null
            this.error_message = ""
        },
        get_weather() {
            if (!this._is_valid_city()) {
                this.error_message = this.t("error_messages")[this.error_message]
                return
            }
            get_weather_json(this.city, this.lang)
                .then((response) => {
                    this.weather = response
                })
                .catch((error) => {
                    this.error_message = this.t("error_messages")[error.message]
                })
            this.result_city = this.city
            this.city = ""
        },
        _is_valid_city() {
            if (!this.city) this.error_message = "city_name_required"
            else if (this.city.length < 3) this.error_message = "city_name_too_short"
            else if (this.city.length > 25) this.error_message = "city_name_too_long"
            else if (!this.city_patters[this.lang].test(this.city))
                this.error_message = "lang_invalid"
            else this.error_message = ""
            return this.error_message ? false : true
        }
    }
}
</script>
