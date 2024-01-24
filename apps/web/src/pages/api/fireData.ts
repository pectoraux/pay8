import axios from 'axios'

// get fiat prices
const handler = async (req, res) => {
  const { url } = req.body
  console.log('1handler================>', url)
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
  //     'X-RapidAPI-Key': '3904sdlksdjofere23lsdspdosdpodjakjsasdiaspasopad45',
  //     'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
  //   }
  // };

  try {
    const response = await axios.request(url)
    console.log('response==================>', response.data)
    res.send({
      data: response.data?.fields ?? response.data,
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
