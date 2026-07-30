/**
 * WhatsApp Notification Service for Md. Rifayet Hossen Portfolio & Personal Wallet
 * Target Phone: +8801952321390
 */

export interface IWhatsAppMessageData {
  phone?: string;
  message: string;
}

export const sendWhatsAppNotification = async (data: IWhatsAppMessageData) => {
  const targetPhone = data.phone || process.env.WHATSAPP_PHONE || '8801952321390';
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;

  const messageText = data.message;

  // 1. If Twilio WhatsApp API credentials exist
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  if (twilioSid && twilioAuthToken) {
    try {
      const basicAuth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('From', twilioWhatsAppFrom.startsWith('whatsapp:') ? twilioWhatsAppFrom : `whatsapp:${twilioWhatsAppFrom}`);
      params.append('To', `whatsapp:+${formattedPhone}`);
      params.append('Body', messageText);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const responseData = await res.json();
      if (res.ok) {
        return { success: true, provider: 'Twilio', sid: responseData.sid };
      }
    } catch (err) {
      console.error('Twilio WhatsApp error:', err);
    }
  }

  // 2. CallMeBot Free WhatsApp Gateway API
  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY;
  if (callMeBotApiKey) {
    try {
      const encodedMsg = encodeURIComponent(messageText);
      const url = `https://api.callmebot.com/whatsapp.php?phone=+${formattedPhone}&text=${encodedMsg}&apikey=${callMeBotApiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        return { success: true, provider: 'CallMeBot' };
      }
    } catch (err) {
      console.error('CallMeBot WhatsApp error:', err);
    }
  }

  // 3. Custom Webhook or Gateway fallback
  const customWebhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  if (customWebhookUrl) {
    try {
      await fetch(customWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, message: messageText })
      });
      return { success: true, provider: 'Custom Webhook' };
    } catch (err) {
      console.error('WhatsApp Webhook error:', err);
    }
  }

  console.log(`[WhatsApp Notification queued for +${formattedPhone}]:\n${messageText}`);
  return {
    success: true,
    simulated: true,
    phone: `+${formattedPhone}`,
    waLink: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`
  };
};
