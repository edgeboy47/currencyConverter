import React from "react"
import Form from "./Form"

export default class FormContainer extends React.Component {
    constructor(){
        super();
        this.apiKey = "3234bbf539744667a9ace28d3e3bde97"
        this.state = {
            fromCurrencyValue: 0,
            toCurrencyValue: 0,
            currencies: {},
            rates: {},
            fromCurrency: 'Afghan afghani',
            toCurrency: 'Afghan afghani',
            fromManualChange: false, // Flag used when the user input causes a state change
            toManualChange: false
        };
    }

    async componentDidMount(){
        // fetch data from api and  store in state
        const currencies = await this.fetchCurrencies();
        console.log("currencies", currencies)
        const rates = await this.fetchExchangeRates();
        console.log("rates", rates)
        this.setState({currencies: currencies, rates: rates})
    }

    async fetchCurrencies() {
        const url = `https://openexchangerates.org/api/currencies.json?app_id=${this.apiKey}`;
        const response = await fetch(url)
        const data = await response.json()

        const obj = Object.assign({}, data)
        const currencies = {}

        for(let el in obj) currencies[obj[el]] = el

        return currencies
    }

    async fetchExchangeRates() {
        const url = `https://openexchangerates.org/api/latest.json?app_id=${this.apiKey}`;

        const response = await fetch(url);
        const data = await response.json()

        return data.rates;
    }

    calculateExchangeRate(fromCurrency, toCurrency) {
        const fromRate = this.state.rates[`${fromCurrency}`]
        const toRate = this.state.rates[`${toCurrency}`]

        return toRate / fromRate;
    }

    onChange = (event) => {
        let {name, value} = event.target

        // Set state of controlled number input tags
        if(name === "fromCurrencyValue" || name === "toCurrencyValue") {
            if(parseInt(value) < 0 || value.length === 0) return;
            if(value[0] === "0" && value.length > 1) value = value.slice(1);
            let otherName, otherValue;
            const {fromCurrency, toCurrency} = this.state
            const fromCode = this.state.currencies[fromCurrency] || "AFN"
            const toCode = this.state.currencies[toCurrency] || "AFN"
            const rate = Math.round(this.calculateExchangeRate(fromCode, toCode) * 100) / 100
            console.log(fromCode, toCode, rate)
            if(name === "fromCurrencyValue") {
                otherName = "toCurrencyValue"
                otherValue = `${parseInt(value) * 100 * (rate * 100) / 10000}`
            }
            else {
                otherName = "fromCurrencyValue"
                otherValue = `${parseInt(value) * 100 / (rate * 100)}`
            }
            // const amount = Math.round(parseInt(value) * 100) / 100
            this.setState({
                [name]: value,
                [otherName]: otherValue,
            })
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
                <p>{this.state.fromCurrencyValue} {this.state.fromCurrency}({this.state.currencies[this.state.fromCurrency] || "AFN"})</p>
                <p>equals</p>
                <p>{this.state.toCurrencyValue} {this.state.toCurrency}({this.state.currencies[this.state.toCurrency] || "AFN"})</p>
                <p></p>
            </div>
        )
    }
}