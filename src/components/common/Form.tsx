import { useState, useEffect } from "react";
import React from "react";

// Interfaces TypeScript
interface InputOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface Label {
    text?: string;
    htmlFor?: string;
    visible?: boolean;
}

interface ValidationResult {
    isValid: boolean;
    message: string;
}

interface CustomInput {
    id?: string;
    name: string;
    type?: string;
    label: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    options?: InputOption[];
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    labelObj?: Label;
    errorLabel?: Label | null;
    validator?: (value: any) => ValidationResult;
    rows?: number;
}

interface CustomButton {
    id?: string;
    label: string;
    onClick: () => void;
    className?: string;
    style?: React.CSSProperties;
    type?: "submit" | "button" | "reset";
    disabled?: boolean;
}

interface FormProps {
    onSubmit: (e: React.FormEvent) => void;
    inputs: CustomInput[];
    submitButton?: CustomButton;
    resetButton?: CustomButton;
    className?: string;
    style?: React.CSSProperties;
}

// Funciones helper para crear objetos con las interfaces
const createInputOption = (value: string, label: string, disabled: boolean = false): InputOption => ({
    value,
    label,
    disabled
});

const createLabel = (text: string = "", htmlFor: string = "", visible: boolean = true): Label => ({
    text,
    htmlFor,
    visible
});

const createCustomInput = (
    name: string,
    label: string,
    value: any,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
    options: Partial<CustomInput> = {}
): CustomInput => ({
    name,
    label,
    value,
    onChange,
    type: "text",
    placeholder: "",
    options: [],
    className: "",
    style: {},
    disabled: false,
    labelObj: createLabel(),
    errorLabel: null,
    ...options
});

const createCustomButton = (
    label: string,
    onClick: () => void,
    options: Partial<CustomButton> = {}
): CustomButton => ({
    label,
    onClick,
    type: "submit",
    className: "",
    style: {},
    ...options
});


/**
 * Form component that renders a customizable form with multiple inputs and validation
 */
const Form: React.FC<FormProps> = ({ onSubmit, inputs, submitButton, resetButton, className, style }) => {
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Función para validar un input específico
    const validateInput = (input: CustomInput, value: any): string => {
        if (input.validator) {
            const result = input.validator(value);
            return result.isValid ? '' : result.message;
        }
        return '';
    };

    // Manejar cambios en los inputs con validación
    const handleInputChange = (input: CustomInput, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        
        // Ejecutar validación si existe
        if (input.validator) {
            const errorMessage = validateInput(input, value);
            setValidationErrors(prev => ({
                ...prev,
                [input.name]: errorMessage
            }));
        }
        
        // Ejecutar el onChange original
        input.onChange(e);
    };

    // Validar todos los inputs cuando se monte el componente o cambien los valores
    useEffect(() => {
        const newErrors: Record<string, string> = {};
        inputs.forEach(input => {
            if (input.validator) {
                const errorMessage = validateInput(input, input.value);
                if (errorMessage) {
                    newErrors[input.name] = errorMessage;
                }
            }
        });
        setValidationErrors(newErrors);
    }, [inputs]);

    return (
        <form onSubmit={onSubmit} className={className} style={style}>
            {inputs.map((input) => {
                const hasValidationError = validationErrors[input.name];
                const displayError = input.errorLabel?.text || hasValidationError;
                
                return (
                    <div key={input.name} className="formulario-grupo">
                        <label htmlFor={input.id || input.name}>{input.label}</label>
                        {input.type === "select" ? (
                            <select
                                id={input.id || input.name}
                                name={input.name}
                                value={input.value}
                                onChange={(e) => handleInputChange(input, e)}
                                className={`${input.className || "formulario-select"} ${hasValidationError ? 'error' : ''}`}
                                style={input.style}
                                disabled={input.disabled}
                            >
                                {input.placeholder && (
                                    <option value="" disabled>
                                        {input.placeholder}
                                    </option>
                                )}
                                {input.options?.map((option, index) => (
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
                                onChange={(e) => handleInputChange(input, e)}
                                placeholder={input.placeholder}
                                className={`${input.className || "formulario-textarea"} ${hasValidationError ? 'error' : ''}`}
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
                                onChange={(e) => handleInputChange(input, e)}
                                placeholder={input.placeholder}
                                className={`${input.className || "formulario-input"} ${hasValidationError ? 'error' : ''}`}
                                style={input.style}
                                disabled={input.disabled}
                            />
                        )}
                        {displayError && (
                            <label 
                                htmlFor={input.errorLabel?.htmlFor || input.name} 
                                className="formulario-error-label" 
                                style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}
                            >
                                {hasValidationError || input.errorLabel?.text}
                            </label>
                        )}
                    </div>
                );
            })}
            {(submitButton || resetButton) && (
                <div className="formulario-acciones">
                    {submitButton && (
                        <button
                            type={submitButton.type || "submit"}
                            onClick={submitButton.onClick}
                            className={submitButton.className || "btn-guardar"}
                            style={submitButton.style}
                            disabled={submitButton.disabled}
                        >
                            {submitButton.label}
                        </button>
                    )}
                    {resetButton && (
                        <button
                            type={resetButton.type || "button"}
                            onClick={resetButton.onClick}
                            className={resetButton.className || "btn-limpiar"}
                            style={resetButton.style}
                        >
                            {resetButton.label}
                        </button>
                    )}
                </div>
            )}
        </form>
    );
};

export type { InputOption, CustomInput, CustomButton, Label, FormProps, ValidationResult };
export { createInputOption, createLabel, createCustomInput, createCustomButton, Form };