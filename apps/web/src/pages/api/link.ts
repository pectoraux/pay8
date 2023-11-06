// import initStripe from 'stripe'
import Stripe from 'stripe'

const handler = async (req, res) => {
  const { rampAddress, sk, accountId } = req.body
  // const stripe = initStripe(sk)
  const stripe = new Stripe(sk, { apiVersion: '2020-08-27' })
  let loginLink
  let account
  try {
    if (!accountId) {
      // Generate a unique login link for the associated Stripe account to access their Express dashboard
      account = await stripe.accounts.create({
        type: 'express',
        capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      })
      loginLink = await stripe.accountLinks.create({
        account: account?.id,
        refresh_url: `${req.headers.origin}/ramps/${rampAddress}`,
        return_url: `${req.headers.origin}/ramps/${rampAddress}`,
        type: 'account_onboarding',
      })
    }
    // Retrieve the URL from the response and redirect the user to Stripe
    res.send({
      link: loginLink ? loginLink.url : undefined,
      accountId: account?.id,
      err: '',
    })
  } catch (err) {
    console.log('The Stripe onboarding process has not succeeded.', err)
    res.send({
      link: undefined,
      account: accountId,
      err,
    })
  }
}

export default handler
