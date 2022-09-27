import Stripe from 'stripe'
import { GoogleSpreadsheet } from 'google-spreadsheet'

interface SpectatorSheetRowProps {
  id: string
  name: string
  email: string
  quantity: number
}

const addSpectatorSheetRow = async ({
  sheetId,
  checkoutSession
}: {
  sheetId: string
  checkoutSession: Stripe.Checkout.Session
}): Promise<void> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27'
    })

    const {
      data: [lineItem]
    }: Stripe.ApiList<Stripe.LineItem> = await stripe.checkout.sessions.listLineItems(
      checkoutSession.id
    )

    const doc = new GoogleSpreadsheet(sheetId)

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })

    const sheet = await doc.addSheet({
      headerValues: ['id', 'name', 'email', 'quantity'],
      title: lineItem.description
    })

    const row: SpectatorSheetRowProps = {
      id: checkoutSession.id,
      name: checkoutSession.customer_details.name,
      email: checkoutSession.customer_details.email,
      quantity: lineItem.quantity
    }

    await sheet.addRow({ ...row })
  } catch (error) {
    console.log(error)
  }
}

export { addSpectatorSheetRow }
