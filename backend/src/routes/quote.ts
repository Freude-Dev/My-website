import { Router, Request, Response } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

// POST /api/quote — receive quote data + PDF base64, send via Gmail
router.post('/', async (req: Request, res: Response) => {
  const { clientName, clientEmail, clientPhone, serviceName, selectedServices, total, pdfBase64 } = req.body

  if (!clientName || !clientEmail || !serviceName || !pdfBase64) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  // Convert base64 PDF to buffer
  const pdfBuffer = Buffer.from(pdfBase64, 'base64')

  const servicesList = selectedServices
    .map((s: { name: string; price: number }) => `  • ${s.name} — ${s.price.toLocaleString()} FCFA`)
    .join('\n')

  try {
    // Email to FreudeDev (you receive the quote request)
    await transporter.sendMail({
      from: `"FreudeDev Quotes" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `New Quote Request — ${serviceName} — ${clientName}`,
      text: `
New quote request received.

Client: ${clientName}
Email: ${clientEmail}
Phone: ${clientPhone}

Service: ${serviceName}
Selected Subservices:
${servicesList}

Total: ${total.toLocaleString()} FCFA

The full quote PDF is attached.
      `.trim(),
      attachments: [
        {
          filename: `FreudeDev_Quote_${clientName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    // Confirmation email to the client
    await transporter.sendMail({
      from: `"FreudeDev" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: `Your FreudeDev Quote — ${serviceName}`,
      text: `
Dear ${clientName},

Thank you for reaching out to FreudeDev!

We have received your quote request for ${serviceName}.

Selected Services:
${servicesList}

Total Estimate: ${total.toLocaleString()} FCFA

Your quote PDF is attached to this email. Our team will contact you shortly to discuss the details.

Best regards,
FreudeDev Team
+237 650 812 141
      `.trim(),
      attachments: [
        {
          filename: `FreudeDev_Quote_${clientName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    })

    res.json({ message: 'Quote sent successfully' })
  } catch (err: any) {
    console.error('Email send error:', err)
    res.status(500).json({ message: 'Failed to send email', error: err.message })
  }
})

export default router
