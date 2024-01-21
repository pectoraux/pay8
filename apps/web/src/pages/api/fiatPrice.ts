import axios from 'axios'

// get fiat prices
const handler = async (req, res) => {
  const { symbol, key } = req.body
  console.log('handler================>', symbol)

  const options = {
    method: 'GET',
    url: 'https://alpha-vantage.p.rapidapi.com/query',
    params: {
      to_currency: 'USD',
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency: symbol,
    },
    headers: {
      'X-RapidAPI-Key': key,
      'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com',
    },
  }

  try {
    const response = await axios.request(options)
    res.send({
      data: Object.values(response.data)[0]['5. Exchange Rate'],
      error: null,
    })
  } catch (error) {
    console.log('1error==========>', error)
    res.send({
      data: null,
      error,
    })
  }
}

export default handler
