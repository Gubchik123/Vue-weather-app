import ua from './ua.json';
import en from './en.json';

export function get_locale(lang) { 
    return lang === 'ua' ? ua : en;
}
