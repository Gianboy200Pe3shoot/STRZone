import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const { to, propertyName, date, time, cleanerName } = await request.json();

    if (!to || !propertyName || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      return NextResponse.json(
        { error: 'Twilio credentials not configured' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    const message = `Hi ${cleanerName}! You have a cleaning scheduled at ${propertyName} on ${date} at ${time}. Reply DONE when complete. - STR Zone`;

    const twilioMessage = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to,
    });

    return NextResponse.json({
      success: true,
      messageSid: twilioMessage.sid,
      message: 'SMS sent successfully'
    });

  } catch (error: any) {
    console.error('Twilio SMS error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send SMS' },
      { status: 500 }
    );
  }
}