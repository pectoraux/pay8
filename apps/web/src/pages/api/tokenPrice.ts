import axios from 'axios'

// get fiat prices
const handler = async (req, res) => {
  const { symbol, decrypted } = req.body
  console.log('handler================>', symbol, decrypted)

  const _decrypted = decrypted?.replace('%symbol%', symbol)

  console.log('1decrypted====================>', _decrypted)
  const options = JSON.parse(_decrypted)
  console.log('decrypted====================>', options)

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
