import React, { useEffect, useState, useCallback } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { conf } from "../conf";

export class PaymentIntentResponse {
    clientSecret: string = "";
    paymentIntentId: string = "";
    ephemeralKey: string | null = null;
    customer: string | null = null;

    constructor(
        clientSecret: string, 
        paymentIntentId: string, 
        ephemeralKey: string | null = null, 
        customer: string | null = null
    ) {
        this.clientSecret = clientSecret;
        this.paymentIntentId = paymentIntentId;
        this.ephemeralKey = ephemeralKey;
        this.customer = customer;
    }
}

interface StripeCheckoutProps {
    shouldInitiate: boolean;
    paymentData: Record<string, any>;
    onSuccess?: (result: any) => void;
    onError?: (error: string) => void;
    onLoading?: (loading: boolean) => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
    shouldInitiate,
    paymentData,
    onSuccess,
    onError,
    onLoading
}) => {
    const stripe = useStripe();
    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Create payment intent on the backend
     */
    const createPaymentIntent = useCallback(async (data: Record<string, any>): Promise<PaymentIntentResponse> => {
        const response = await fetch(`https://dengo-back.onrender.com/api/stripe/create-payment-intent`, {
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Error al crear el Payment Intent");
        }

        return await response.json();
    }, []);

    /**
     * Initialize payment sheet and process checkout
     */
    const processCheckout = useCallback(async () => {
        if (!stripe) {
            onError?.("Stripe no está inicializado");
            return;
        }

        if (isProcessing) return;

        try {
            setIsProcessing(true);
            onLoading?.(true);

            // Create payment intent
            const paymentIntentResponse = await createPaymentIntent(paymentData);

            // Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmPayment({
                clientSecret: paymentIntentResponse.clientSecret,
                confirmParams: {
                    return_url: window.location.origin,
                },
                redirect: 'if_required'
            });

            if (error) {
                throw new Error(error.message || "Error al procesar el pago");
            }

            onSuccess?.({ paymentIntent, paymentIntentResponse });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            onError?.(errorMessage);
        } finally {
            setIsProcessing(false);
            onLoading?.(false);
        }
    }, [stripe, paymentData, createPaymentIntent, onSuccess, onError, onLoading, isProcessing]);

    // Effect to trigger checkout when shouldInitiate changes to true
    useEffect(() => {
        if (shouldInitiate && !isProcessing) {
            processCheckout();
        }
    }, [shouldInitiate, processCheckout, isProcessing]);

    // This component doesn't render anything visible
    return null;
};

// Legacy class for backward compatibility (Note: Cannot use hooks in classes)
export class StripeService {
    private _stripe_url: string = "";

    constructor() {
        this._stripe_url = conf.STRIPE_URL;
    }

    /**
     * This method try to create an intent payment on the backend
     * @param {Record<string, any>} data
     * @return {Promise<PaymentIntentResponse>}
     */
    confirmPayment = async (data: Record<string, any>): Promise<PaymentIntentResponse> => {
        const response = await fetch(`https://dengo-back.onrender.com/api/stripe/create-payment-intent`, {
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Error al crear el Payment Intent");
        }

        return await response.json();
    }
}