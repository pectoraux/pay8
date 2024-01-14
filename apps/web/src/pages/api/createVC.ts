import Stripe from 'stripe'

// create virtual card
const handler = async (req, res) => {
  const { customerId, email, price, symbol, sk } = req.body
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27' })

  // const cardholder = await stripe.issuing.cardholders.create({
  //   name: 'customerId',
  //   email,
  //   phone_number: '+18008675309',
  //   status: 'active',
  //   type: 'individual',
  //   individual: {
  //     first_name: 'first',
  //     last_name: 'last',
  //   },
  //   billing: {
  //     address: {
  //       line1: '123 Main Street',
  //       city: 'San Francisco',
  //       state: 'CA',
  //       postal_code: '94111',
  //       country: 'FR',
  //     },
  //   },
  // })
  const cardholderId = 'ich_1OYT5eAkPdhgtN6IV9DP3osj'

  // const card = await stripe.issuing.cards.create({
  //   cardholder: cardholderId,
  //   currency: 'eur',
  //   type: 'virtual',
  //   status: 'active',
  // })
  // console.log('cardholder=================>', cardholder)

  const cardId = 'ic_1OYT5eAkPdhgtN6ISV6Dz0LB'
  let transferData
  let errorData
  // const transferData2 = await stripe.transfers.create(
  //   {
  //     amount: 10 * 100,
  //     currency: 'eur',
  //     destination: card.id,
  //   },
  //   // function (err, transfer) {
  //   //   // Handle any errors
  //   //   if (err) {
  //   //     console.log(err)
  //   //     errorData = err
  //   //   }
  //   //   console.log(transfer)
  //   //   transferData = transfer
  //   // },
  // )
  const card = await stripe.issuing.cards.update(cardId, {
    spending_controls: {
      spending_limits: [
        {
          amount: 500,
          interval: 'all_time',
        },
      ],
    },
  })
  console.log('card=================>', card)

  // console.log("transferData2=================>", transferData2)
  // const stripe = require('stripe')(sk)
  // // Get the card token from the customer
  // stripe.accounts.retrieve(customerId)
  // , function (err, customer) {
  // console.log("customer====================>", await stripe.accounts.retrieve(customerId))
  //   // Handle any errors
  //   if (err) {
  //     console.log(err)
  //     errorData = err
  //   }
  //   // Get the card token
  //   var card_token = customer.sources.data[0].id
  //   // Transfer money onto the virtual card
  //   stripe.transfers.create(
  //     {
  //       amount: price * 100,
  //       currency: symbol,
  //       destination: card_token,
  //     },
  //     function (err, transfer) {
  //       // Handle any errors
  //       if (err) {
  //         console.log(err)
  //         errorData = err
  //       }
  //       console.log(transfer)
  //       transferData = transfer
  //     },
  //   )
  // })
  res.send({
    transferData,
    errorData,
  })
}

export default handler
