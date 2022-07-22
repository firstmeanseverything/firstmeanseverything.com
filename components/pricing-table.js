import Script from 'next/script'

function PricingTable() {
  return (
    <>
      <Script src="https://js.stripe.com/v3/pricing-table.js" />
      <stripe-pricing-table
        pricing-table-id="prctbl_1LOKTFDgvoj38NK2gKuuscY4"
        publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      />
    </>
  )
}

export default PricingTable
