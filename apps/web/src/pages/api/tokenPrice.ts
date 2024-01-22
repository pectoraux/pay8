import axios from 'axios'

// get fiat prices
const handler = async (req, res) => {
  const { symbol, decrypted } = req.body
  console.log('handler================>', symbol, decrypted)
  // const dd = JSON.parse(decrypted)
  // const d = JSON.stringify(dd)
  // const d = JSON.stringify({
  //   method: 'GET',
  //   url: 'https://alpha-vantage.p.rapidapi.com/query',
  //   params: {
  //     to_currency: 'USD',
  //     function: 'CURRENCY_EXCHANGE_RATE',
  //     from_currency: '%symbol%',
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': '2601b11ce6msha2179cbbc81731ep1412dbjsn65af7e46f8cd',
  //     'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com',
  //   },
  // })
  const _decrypted = decrypted?.replace('%symbol%', symbol)

  console.log('1decrypted====================>', _decrypted)
  const options = JSON.parse(_decrypted)
  console.log('decrypted====================>', options)
  // const options = {
  //   method: 'GET',
  //   url: 'https://alpha-vantage.p.rapidapi.com/query',
  //   params: {
  //     symbol: 'MSFT',
  //     function: 'TIME_SERIES_MONTHLY',
  //     datatype: 'csv'
  //   },
  //   headers: {
  //     'X-RapidAPI-Key': '2601b11ce6msha2179cbbc81731ep1412dbjsn65af7e46f8cd',
  //     'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
  //   }
  // };

  try {
    const response = await axios.request(options)
    const chunks = response.data?.split(',')?.filter((val) => !Number.isNaN(parseFloat(val)))
    console.log('chunks==================>', response.data)
    res.send({
      data: chunks?.length && chunks[0],
      // data: Object.values(response.data)[0]['5. Exchange Rate'],
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
