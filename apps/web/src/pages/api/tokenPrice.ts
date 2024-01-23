import axios from 'axios'

// get fiat prices
const handler = async (req, res) => {
  const { symbol, decrypted } = req.body
  console.log('handler================>', symbol, decrypted)
  const _decrypted = decrypted?.replace('%symbol%', symbol)
  const options = JSON.parse(_decrypted)
  console.log('decrypted====================>', options)
  // const options = {
  //   method: 'GET',
  //   url: 'https://alpha-vantage.p.rapidapi.com/query',
  //   params: {
  //     function: 'TIME_SERIES_DAILY',
  //     symbol: '%symbol%',
  //     outputsize: 'compact',
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
