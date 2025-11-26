import { useState } from "react";

class InputOption {
    value = "";
    label = "";
    disabled = false;

    constructor(value, label, disabled = false) {
        this.value = value;
        this.label = label;
        this.disabled = disabled;
    }
}

class Label {
    text = "";
    htmlFor = "";
    visible = true;
    constructor(text = "", htmlFor = "", visible = true) {
        this.text = text;
        this.htmlFor = htmlFor;
        this.visible = visible;
    }
}

class CustomInput {
    id = "";
    name = "";
    type = "text";
    label = "";
    value = "";
    onChange = () => { };
    placeholder = "";
    options = [];
    className = "";
    style = {};
    disabled = false;
    labelObj = new Label();
    errorLabel = null;

    constructor(id = "", name = "", type = "text", label = "", value = "", onChange = () => { }, placeholder = "", options = [], className = "", style = {}, disabled = false, labelObj = new Label(), errorLabel = null) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.label = label;
        this.value = value;
        this.onChange = onChange;
        this.placeholder = placeholder;
        this.options = options;
        this.className = className;
        this.style = style;
        this.disabled = disabled;
        this.labelObj = labelObj;
        this.errorLabel = errorLabel;
    }
}

class CustomButton {
    id = "";
    label = "";
    onClick = () => { };
    className = "";
    style = {};
    type = "submit";

    constructor(id = "", label = "", onClick = () => { }, className = "", style = {}, type = "submit") {
        this.id = id;
        this.label = label;
        this.onClick = onClick;
        this.className = className;
        this.style = style;
        this.type = type;
    }
}


/**
 * Form component that renders a customizable form with multiple inputs
 * 
 * @param {Object} props - The props object
 * @param {(data: Record<string, any>) => void} props.onSubmit - Handler function for form submission
 * @param {CustomInput[]} props.inputs - Array of input elements to be rendered in the form
 * @param {CustomButton} [props.submitButton] - Optional custom submit button configuration
 * @param {CustomButton} [props.resetButton] - Optional custom reset button configuration
 * @param {string} [props.className] - Optional CSS class name for form styling
 * @param {React.CSSProperties} [props.style] - Optional inline styles for the form
 * @returns {JSX.Element} The rendered form component
 */
const Form = ({ onSubmit, inputs, submitButton, resetButton, className, style }) => {
    return (

        <form onSubmit={onSubmit} className={className} style={style}>
            {inputs.map((input) => (
                <div key={input.name} className="formulario-grupo">
                    <label htmlFor={input.id || input.name}>{input.label}</label>
                    {input.type === "select" ? (
                        <select
                            id={input.id || input.name}
                            name={input.name}
                            value={input.value}
                            onChange={input.onChange}
                            className={input.className || "formulario-select"}
                            style={input.style}
                        >
                            {input.placeholder && (
                                <option value="" disabled={input.disabled}>
                                    {input.placeholder}
                                </option>
                            )}
                            {input.options.map((option, index) => (
                                <option
                                    key={option.value || index}
                                    value={option.value}
                                    disabled={option.disabled}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : input.type === "textarea" ? (
                        <textarea
                            id={input.id || input.name}
                            name={input.name}
                            value={input.value}
                            onChange={input.onChange}
                            placeholder={input.placeholder}
                            className={input.className || "formulario-textarea"}
                            style={input.style}
                            rows={input.rows || 3}
                            disabled={input.disabled}
                        />
                    ) : (
                        <input
                            type={input.type}
                            id={input.id || input.name}
                            name={input.name}
                            value={input.value}
                            onChange={input.onChange}
                            placeholder={input.placeholder}
                            className={input.className || "formulario-input"}
                            style={input.style}
                            disabled={input.disabled}
                        />
                    )}
                    {input.errorLabel && input.errorLabel.text && input.errorLabel.visible && (
                        <label htmlFor={input.errorLabel.htmlFor} className="formulario-error-label" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {input.errorLabel.text}
                        </label>
                    )}
                </div>
            ))}
            {(submitButton || resetButton) && (
                <div className="formulario-acciones">
                    {submitButton && (
                        <button
                            type={submitButton.type || "submit"}
                            onClick={submitButton.onClick}
                            className={submitButton.className || "btn-guardar"}
                            style={submitButton.style}
                        >
                            {submitButton.label || "Guardar"}
                        </button>
                    )}
                    {resetButton && (
                        <button
                            type={resetButton.type || "button"}
                            onClick={resetButton.onClick}
                            className={resetButton.className || "btn-limpiar"}
                            style={resetButton.style}
                        >
                            {resetButton.label || "Limpiar"}
                        </button>
                    )}
                </div>
            )}
        </form>
    )
}

export { InputOption, CustomInput, CustomButton, Label, Form };