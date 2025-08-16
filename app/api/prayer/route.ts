import { NextResponse } from 'next/server'

export async function POST(req: Request){
  try{
    const { name, request } = await req.json()
    if(!name || !request){
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, PASTOR_PHONE_NUMBER } = process.env
    if(!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !PASTOR_PHONE_NUMBER){
      return NextResponse.json({ error: 'Missing Twilio configuration' }, { status: 500 })
    }

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')
    const body = new URLSearchParams({
      From: TWILIO_FROM_NUMBER,
      To: PASTOR_PHONE_NUMBER,
      Body: `Prayer request from ${name}: ${request}`
    })

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    })

    if(!res.ok){
      const text = await res.text()
      console.error('Twilio error', text)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  }catch(err){
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
