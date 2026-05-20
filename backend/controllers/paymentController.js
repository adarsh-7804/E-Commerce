const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            console.error('User not authenticated:', req.user);
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.user.id;
        const { items, totalAmount } = req.body;

        console.log('Creating payment intent:', {
            userId,
            items,
            totalAmount,
        });

        // Validate inputs
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is Empty' });
        }

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const amountInCents = Math.round(totalAmount * 100);

        // Ensure amount is valid for Stripe (minimum 50 paise = 50 cents in lowest currency unit)
        if (amountInCents < 50) {
            return res.status(400).json({ error: 'Amount must be at least ₹0.50' });
        }

        console.log('Amount in cents:', amountInCents);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'inr',
            metadata: {
                userId: userId.toString(),
                itemCount: items.length.toString(),
            },
        });

        console.log('Payment intent created:', paymentIntent.id);

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (err) {
        console.error('Payment Intent Error:', err);
        res.status(500).json({
            error: err.message,
            type: err.type,
        });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId } = req.body;
        const userId  = req.user.id;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
         res.json({
            success: true,
            message: 'Payment successful',
            orderId: paymentIntentId,
         })   
        }else {
            res.status(400).json({
                success: false,
                message: 'Payment not successful',
            })
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.getPaymentStatus = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
        })
    } catch(err) {
        console.error('Payment Status Error:', err);
        res.status(500).json({error: err.message});
    }
}

exports.handleWebhook = async (req,res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            console.log('Payment succeeded:', event.data.object.id);

            break;
        case 'payment_intent.payment_failed':
            console.log('Payment failed:', event.data.object.id);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);  
    }
        
    res.json({received: true});
    }

