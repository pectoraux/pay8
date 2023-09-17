import NodeRSA from 'encrypt-rsa'
import { getEmailList } from 'state/ssi/helpers'
import { decryptWithAES } from 'views/SSI/Proposal/Overview'

const handler = async (req, res) => {
  const { followers, profile } = req.body

  res.send({
    emailList: '',
    err: '',
  })
}

export default handler
