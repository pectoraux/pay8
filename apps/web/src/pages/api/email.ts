const handler = async (req, res) => {
  const nodemailer = require('nodemailer')
  const markdown = require('nodemailer-markdown').markdown
  const showdown = require('showdown')

  const { messageHtml, email } = req.body
  const converter = new showdown.Converter()
  const htmlOutput = converter.makeHtml(messageHtml)

  const user = process.env.NEXT_PUBLIC_USER
  const pass = process.env.NEXT_PUBLIC_PASSWORD
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
      user,
      pass,
    },
    secure: true,
  })
  transporter.use('compile', markdown())

  const mailData = {
    from: 'no-reply@payswap.org',
    to: email,
    subject: `Verify Email`,
    text: messageHtml,
    html: htmlOutput,
  }
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log('err================>', err)
    } else {
      console.log('info==============>', info)
    }
    res.send({
      info,
      err,
    })
  })
}

export default handler
