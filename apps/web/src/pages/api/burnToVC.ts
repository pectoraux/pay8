import Stripe from 'stripe'

// create virtual card
const handler = async (req, res) => {
  const { cardId, price, cardholderId, symbol, sk } = req.body
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27' })
  try {
    let _cardId = cardId
    if (!cardId) {
      const mcard = await stripe.issuing.cards.create({
        cardholder: cardholderId,
        currency: symbol,
        type: 'virtual',
        status: 'active',
      })
      _cardId = mcard?.id
    }
    const card = await stripe.issuing.cards.retrieve(_cardId, {
      expand: ['cvc', 'number'],
    })
    await stripe.issuing.cards.update(_cardId, {
      spending_controls: {
        spending_limits: [
          {
            amount: !cardId ? price * 100 : price * 100 + card.spending_controls.spending_limits[0].amount,
            interval: 'all_time',
          },
        ],
      },
    })
    console.log('2card==============>', _cardId, card.spending_controls.spending_limits[0].amount)

    res.send({
      cardId: _cardId,
      error: null,
    })
  } catch (error) {
    res.send({
      cardId: null,
      error,
    })
  }
}

export default handler
