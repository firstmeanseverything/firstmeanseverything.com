import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'

import { useAuthState } from '../context/auth'

function SubscriptionForm({ price }) {
  const { user } = useAuthState()
  const elements = useElements()
  const methods = useForm()
  const stripe = useStripe()

  const retryInvoiceWithNewPaymentMethod = ({
    customerId,
    paymentMethodId,
    invoiceId,
    priceId,
  }) => {
    return fetch('/api/retry-stripe-invoice', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        invoiceId: invoiceId,
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((result) => {
        if (result.error) throw result

        return result
      })
      .then((result) => {
        return {
          invoice: result,
          paymentMethodId: paymentMethodId,
          priceId: priceId,
          isRetry: true,
        }
      })
      .then(handlePaymentThatRequiresCustomerAction)
      .then(onSubscriptionComplete)
      .catch((error) => {
        console.log(error)
      })
  }

  const handlePaymentThatRequiresCustomerAction = ({
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  }) => {
    if (subscription && subscription.status === 'active')
      return { subscription, priceId, paymentMethodId }

    let paymentIntent = invoice
      ? invoice.payment_intent
      : subscription.latest_invoice.payment_intent

    if (
      paymentIntent.status === 'requires_action' ||
      (isRetry === true && paymentIntent.status === 'requires_payment_method')
    ) {
      return stripe
        .confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
        })
        .then((result) => {
          if (result.error) {
            throw result
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              return {
                priceId: priceId,
                subscription: subscription,
                invoice: invoice,
                paymentMethodId: paymentMethodId,
              }
            }
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      return { subscription, priceId, paymentMethodId }
    }
  }

  const handleRequiresPaymentMethod = ({
    subscription,
    paymentMethodId,
    priceId,
  }) => {
    if (subscription.status === 'active') {
      return { subscription, priceId, paymentMethodId }
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      'requires_payment_method'
    ) {
      localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id)
      localStorage.setItem(
        'latestInvoicePaymentIntentStatus',
        subscription.latest_invoice.payment_intent.status
      )
      throw { error: { message: 'Your card was declined.' } }
    } else {
      return { subscription, priceId, paymentMethodId }
    }
  }

  const onSubscriptionComplete = (result) => {
    localStorage.clear()
    console.log(result)
  }

  const createSubscription = ({ customerId, paymentMethodId, priceId }) => {
    return fetch('/api/create-stripe-subscription', {
      method: 'POST',
      body: JSON.stringify({
        customerId,
        paymentMethodId,
        priceId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) throw result

        return result
      })
      .then((result) => {
        return {
          paymentMethodId,
          priceId,
          subscription: result,
        }
      })
      .then(handlePaymentThatRequiresCustomerAction)
      .then(handleRequiresPaymentMethod)
      .then(onSubscriptionComplete)
      .catch((error) => console.log(error))
  }

  const onSubmit = async () => {
    try {
      if (!stripe || !elements) return

      const latestInvoicePaymentIntentStatus = localStorage.getItem(
        'latestInvoicePaymentIntentStatus'
      )

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })

      if (error) {
        console.log(error)
      } else {
        const paymentMethodId = paymentMethod.id

        if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
          const invoiceId = localStorage.getItem('latestInvoiceId')

          retryInvoiceWithNewPaymentMethod({
            customerId: user.stripe_customer_id,
            invoiceId,
            paymentMethodId,
            priceId: price.id,
          })
        } else {
          createSubscription({
            customerId: user.stripe_customer_id,
            paymentMethodId,
            priceId: price.id,
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit">Go</button>
    </form>
  )
}

export default SubscriptionForm
