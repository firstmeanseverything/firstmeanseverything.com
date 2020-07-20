import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'

import firebase from '../lib/firebase'
import { useAuthState } from '../context/auth'

function SubscriptionForm({ price }) {
  const { user } = useAuthState()
  const elements = useElements()
  const methods = useForm()
  const stripe = useStripe()

  const onSubmit = async () => {
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })

      const {
        stripe_subscription_id,
        stripe_subscription_status,
      } = await fetch('/api/create-stripe-subscription', {
        method: 'POST',
        body: JSON.stringify({
          customerId: user.stripe_customer_id,
          paymentMethodId: paymentMethod.id,
          priceId: price.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())

      await firebase.firestore().collection('users').doc(user.uid).set(
        {
          stripe_subscription_id,
          stripe_subscription_status,
        },
        { merge: true }
      )
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
