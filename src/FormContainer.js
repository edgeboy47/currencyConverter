import React from "react"
import Form from "./Form"

export default class FormContainer extends React.Component {
    constructor(){
        super();
        this.state = {
            fromCurrencyValue: 0,
            toCurrencyValue: 0,
            currencies: [],
            rates: {},
            fromCurrency: 'Afghan afghani',
            toCurrency: 'Afghan afghani',
        };
    }

    async componentDidMount(){
        // fetch data from api and  store in state
        const currencies = await this.fetchCurrencies();
        const rates = await this.fetchExchangeRates();
        this.setState({currencies: currencies, rates: rates})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Do calculations and display result
        const {fromCurrency, toCurrency} = this.state
        const fromCode = this.getCodeFromCurrency(fromCurrency)
        const toCode = this.getCodeFromCurrency(toCurrency)
        const rate = Math.round(this.calculateExchangeRate(fromCode, toCode) * 100) / 100

        if(this.state.fromCurrency !== this.state.toCurrency){
            if(this.state.fromCurrencyValue !== prevState.fromCurrencyValue) {
                this.setState({toCurrencyValue: parseFloat(this.state.fromCurrencyValue) * rate})
            }

            if(this.state.toCurrencyValue !== prevState.toCurrencyValue) {
                this.setState({fromCurrencyValue: parseFloat(this.state.toCurrencyValue) / rate})
            }
        }

    }

    async fetchCurrencies() {
        const url = "https://restcountries.eu/rest/v2/all?fields=currencies";
        const response = await fetch(url)
        const data = await response.json()

        let allCurrencies = data.map(el => el.currencies).flat()
        let uniqueCurrencies = [];
        const map = new Map();

        for(const currency of allCurrencies){
            if(!map.has(currency.code) && currency.code !== undefined){
                map.set(currency.code, true)
                uniqueCurrencies.push(currency)
            }
        }

        return uniqueCurrencies;
    }

    async fetchExchangeRates() {
        const apiKey =  "87b72015c61840739f82c13f99bf8240";
        const baseUrl = `http://apilayer.net/api/live?access_key=${apiKey}&source=USD`

        const response = await fetch(baseUrl);
        const data = await response.json()

        return data.quotes;
    }

    calculateExchangeRate(fromCurrency, toCurrency) {
        const fromRate = this.state.rates[`USD${fromCurrency}`]
        const toRate = this.state.rates[`USD${toCurrency}`]

        return toRate / fromRate;
    }

    getCodeFromCurrency(currency) {
        const currencyObject = this.state.currencies.find(el => el["name"] === currency)
        if(currencyObject !== undefined) return currencyObject["code"]
    }

    onChange = (event) => {
        let {name, value} = event.target

        // Set state of controlled number input tags
        if(name === "fromCurrencyValue" || name === "toCurrencyValue") {
            if(parseInt(value) < 0 || value.length === 0) return;
            if(value[0] === "0" && value.length > 1) value = value.slice(1)
            this.setState({[name]: value})
        }

        // Set state of controlled select tags
        if(name === "fromCurrency" || name === "toCurrency") {
            this.setState({[name]: value})
        }
    }

    render() {
        return (
            <div>
                <Form onChange={this.onChange} state={this.state}/>
                <p>{this.state.fromCurrencyValue} {this.state.fromCurrency} ({this.getCodeFromCurrency(this.state.fromCurrency) || "AFN"})</p>
                <p>equals</p>
                <p>{this.state.toCurrencyValue} {this.state.toCurrency} ({this.getCodeFromCurrency(this.state.toCurrency) || "AFN"})</p>
                <p></p>
            </div>
        )
    }
}