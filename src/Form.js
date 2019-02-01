import React from "react"

function Form (props) {
    const state = props.state
    const currencies = state.currencies
        .sort((a, b) => a.name < b.name ? -1 : 1)
        .filter(el => el.code !== "(none)")
        .map(el => {
            let code = el.code;
            if(el.code.length !== 3) code = code.slice(0, 3) //Remove [G] at end of some codes
            return <option key={code}>{el.name}</option>
        });
    
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