import Stripe from 'stripe'

// create virtual card
const handler = async (req, res) => {
  const { cardId, sk } = req.body
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27' })
  try {
    const card = await stripe.issuing.cards.retrieve(cardId, {
      expand: ['cvc', 'number'],
    })
    console.log('getCard================>', card, sk)
    res.send({
      cardNumber: card.number,
      cvc: card.cvc,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      amount: card.spending_controls.spending_limits[0].amount / 100,
      symbol: card.currency,
      error: null,
    })
  } catch (error) {
    res.send({
      cardNumber: null,
      cvc: null,
      exp_month: null,
      exp_year: null,
      amount: null,
      symbol: null,
      error,
    })
  }
}

export default handler
