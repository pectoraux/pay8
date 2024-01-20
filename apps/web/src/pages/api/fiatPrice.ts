import axios from 'axios'

// get fiat prices
const handler = async (req, res) => {
  const { symbol, key } = req.body
  console.log('handler================>', symbol, key)

  const options = {
    method: 'GET',
    url: 'https://alpha-vantage.p.rapidapi.com/query',
    params: {
      to_currency: 'USD',
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency: 'EUR',
    },
    headers: {
      'X-RapidAPI-Key': '2601b11ce6msha2179cbbc81731ep1412dbjsn65af7e46f8cd',
      'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com',
    },
  }

  try {
    const response = await axios.request(options)
    console.log(response.data)
    res.send({
      data: response.data['Realtime Currency Exchange Rate'][5],
      error: null,
    })
  } catch (error) {
    res.send({
      data: null,
      error,
    })
  }
}

export default handler
