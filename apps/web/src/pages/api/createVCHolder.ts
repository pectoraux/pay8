import Stripe from 'stripe'

// create virtual card
const handler = async (req, res) => {
  const { name, email, phone, first, last, line1, city, state, postal, country, sk } = req.body
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27' })
  try {
    const cardholder = await stripe.issuing.cardholders.create({
      name,
      email,
      phone_number: phone,
      status: 'active',
      type: 'individual',
      individual: {
        first_name: first,
        last_name: last,
      },
      billing: {
        address: {
          line1,
          city,
          state,
          postal_code: postal,
          country,
        },
      },
    })
    res.send({
      cardholderId: cardholder.id,
      err: null,
    })
  } catch (err) {
    res.send({
      cardholderId: null,
      err,
    })
  }
}

export default handler
