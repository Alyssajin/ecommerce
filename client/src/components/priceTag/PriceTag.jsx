import React,{ useState, useEffect } from 'react';
import './PriceTag.css'


/*
    Toggle API usage for testing
    1 for API conversion, 0 for hardcoded conversion
 */
const REAL_TIME_CURRENCY_CONVERSION = 1
const BASE_CURRENCY = 'CAD'
const SUPPORTED_CURRENCIES = ['CNY', 'HKD', 'USD', 'EUR', 'MXN', 'JPY'];
const STATIC_RATES = [5.23, 5.68, 0.73, 0.67, 13.71, 107.11];


/*
    External API for currency conversion
    https://freecurrencyapi.com/docs/
    Free Rate Limit: 10 per minute, 5k per month
 */
const API_URL = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_sQwZoBHjizBUKXhjbeq7qZOiUns2lgpDPe24dsZV';


/*
    Fetch exchange rates from the API
    Exchange rates are cached in localStorage to avoid unnecessary API calls
 */
const getExchangeRateToday = async () => {
    const cachedRates = localStorage.getItem('exchangeRates');
    const cachedDate = localStorage.getItem('exchangeRatesDate');

    // get today's date in YYYY-MM-DD format
    const now = new Date().toISOString();

    // check if we have cached rates and if they are from today
    if (cachedRates && cachedDate && new Date(cachedDate).toDateString() === new Date().toDateString()) {
        console.log('Using cached exchange rates');
        return JSON.parse(cachedRates);
    }

    // if no rates are cached or if they are outdated, fetch new rates
    try {
        const currenciesParam = SUPPORTED_CURRENCIES.join(',');
        const url = `${API_URL}&base_currency=${BASE_CURRENCY}&currencies=${currenciesParam}`;

        const response = await fetch(url);
        const data = await response.json();
        const exchangeRates = data.data;

        // store the fetched rates and today's date in localStorage
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
        localStorage.setItem('exchangeRatesDate', now);

        console.log('Fetched new exchange rates');
        return exchangeRates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        return null;
    }
};

const convertPriceAPI = async (price, currency) => {
    if (currency === BASE_CURRENCY) return price;

    const exchangeRates = await getExchangeRateToday();

    if (!exchangeRates) {
        console.error('Failed to retrieve exchange rates.');
        return price;
    }

    const rate = exchangeRates[currency];
    if (!rate) {
        console.error(`No rate found for currency: ${currency}`);
        return price; // If no rate is found, return the original price
    }

    return price * rate;
};

const convertPriceHardcoded = async (price, currency) => {
    if (currency === BASE_CURRENCY) return price;
    let rate = 1;
    for (let i = 0; i < SUPPORTED_CURRENCIES.length; i++) {
        if (currency === SUPPORTED_CURRENCIES[i]) {
            rate = STATIC_RATES[i];
            break;
        }
    }
    return price * rate;
};

const convertPrice = REAL_TIME_CURRENCY_CONVERSION ? convertPriceAPI : convertPriceHardcoded

/*
    PriceTag component
 */
const PriceTag = ({ price }) => {
    const [currency, setCurrency] = useState('CAD'); // Default currency
    const [convertedPrice, setConvertedPrice] = useState(price);

    useEffect(() => {
        const fetchConvertedPrice = async () => {
            const newPrice = await convertPrice(price, currency);
            setConvertedPrice(newPrice.toFixed(2)); // Fix to two decimal places
        };
        fetchConvertedPrice();
    }, [price, currency]);

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    return (
        <div className="price-tag">
            <select value={currency} onChange={handleCurrencyChange} className="currency-selector">
                <option value="CAD">CAD $</option>
                <option value="CNY">CNY ¥</option>
                <option value="HKD">HKD $</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="MXN">MXN $</option>
                <option value="JPY">JPY ¥</option>
            </select>
            <span className="price">{convertedPrice} {currency}</span>
        </div>
    );
};

export default PriceTag;