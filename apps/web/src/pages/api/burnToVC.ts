import Stripe from 'stripe'

// create virtual card
const handler = async (req, res) => {
  const { cardId, price, cardholderId, symbol, sk } = req.body
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27' })
  console.log('card=================>', cardId, price, cardholderId, symbol)
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
    // const cardId = "ic_1OYT5eAkPdhgtN6ISV6Dz0LB"

    await stripe.issuing.cards.update(cardId, {
      spending_controls: {
        spending_limits: [
          {
            amount: price * 100 + card.spending_controls.spending_limits[0].amount,
            interval: 'all_time',
          },
        ],
      },
    })

    res.send({
      cardId: _cardId,
      err: null,
    })
  } catch (err) {
    res.send({
      cardId: null,
      err,
    })
  }
}

export default handler
