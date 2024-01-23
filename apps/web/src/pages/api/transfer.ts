// import initStripe from 'stripe'
import Stripe from 'stripe'

const handler = async (req, res) => {
  const { amount, symbol, sk, accountId } = req.body
  // const stripe = initStripe(sk)
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27' })
  try {
    const transfer = await stripe.transfers.create({
      amount: parseInt((parseFloat(amount) * 100)?.toString()),
      currency: symbol?.toLowerCase(),
      destination: accountId,
    })
    // Retrieve the URL from the response and redirect the user to Stripe
    res.send({
      amount: transfer.amount / 100,
      error: '',
    })
  } catch (error) {
    console.log('The Stripe onboarding process has not succeeded.', error)
    res.send({
      amount: undefined,
      error,
    })
  }
}

export default handler
