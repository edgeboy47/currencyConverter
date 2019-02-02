import React from "react"

function Form (props) {
    const state = props.state
    const currencies = Object.keys(state.currencies)
        .sort((a, b) => a < b ? -1 : 1)
        .map(el =>  <option key={state.currencies[el]}>{el}</option> );
    
    return (
        <form>
            <input 
            name="fromCurrencyValue"
            type="number"
            value={state.fromCurrencyValue}
            onChange={props.onChange} 
            />

            <select 
            name="fromCurrency"
            value={state.fromCurrency}
            onChange={props.onChange}>
                {currencies}
            </select>

            <br />

            <input 
            name="toCurrencyValue" 
            type="number"
            value={state.toCurrencyValue} 
            onChange={props.onChange}
            />

            <select 
            name="toCurrency"
            value={state.toCurrency}
            onChange={props.onChange}>
                {currencies}
            </select>
        </form>
    )
}

export default Form;