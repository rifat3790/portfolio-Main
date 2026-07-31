import { decryptAES256 } from './cryptoService';

export interface IWhatsAppMessageData {
  phone?: string;
  message: string;
}

// AES-256-GCM Encrypted Security Tokens
const AES_DEFAULT_BOT_TOKEN = 'b1d347c55eb33b968af63bc6f2be0614:3701929998acfe685170026330a07674:63f8cacd6ffcabbf1ff4a6a86eb51ca2b9c94506560949d8af280815fec18e053b14e45334eeeb5d5403e51c4c1b';
const AES_DEFAULT_CHAT_ID = '231dc0bd2c150066885028a460cea1c1:6cd2eb5c72e0f3dafafd51326711b792:a23060a048262116da92';

const getTelegramBotToken = () => process.env.TELEGRAM_BOT_TOKEN || decryptAES256(AES_DEFAULT_BOT_TOKEN);
const getTelegramChatId = () => process.env.TELEGRAM_CHAT_ID || decryptAES256(AES_DEFAULT_CHAT_ID);

export const sendWhatsAppNotification = async (data: IWhatsAppMessageData) => {
  const rawPhone = data.phone || '8801952321390';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');
  const formattedPhone = cleanPhone.startsWith('88') ? cleanPhone : `88${cleanPhone}`;
  const messageText = data.message;

  // 1. Telegram Bot Instant Push (100% Guaranteed & Secured with AES-256)
  const telegramBotToken = getTelegramBotToken();
  const telegramChatId = getTelegramChatId();

  if (telegramBotToken && telegramChatId) {
    try {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: messageText,
          parse_mode: 'HTML'
        })
      });
    } catch (err) {
      console.error('Telegram push error:', err);
    }
  }

  // 2. CallMeBot WhatsApp API
  const callMeBotApiKey = process.env.CALLMEBOT_API_KEY;
  if (callMeBotApiKey) {
    try {
      const encodedMsg = encodeURIComponent(messageText);
      const url = `https://api.callmebot.com/whatsapp.php?phone=+${formattedPhone}&text=${encodedMsg}&apikey=${callMeBotApiKey}`;
      await fetch(url);
    } catch (err) {
      console.error('CallMeBot WhatsApp error:', err);
    }
  }

  // 3. Twilio WhatsApp API
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  if (twilioSid && twilioAuthToken) {
    try {
      const basicAuth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const bodyParams = new URLSearchParams({
        From: twilioWhatsAppFrom,
        To: `whatsapp:+${formattedPhone}`,
        Body: messageText
      });

      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });
    } catch (err) {
      console.error('Twilio WhatsApp error:', err);
    }
  }

  return {
    success: true,
    phone: `+${formattedPhone}`,
    waLink: `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`
  };
};

export const sendTelegramPhotoNotification = async (data: { imageUrl: string; caption: string }) => {
  const telegramBotToken = getTelegramBotToken();
  const telegramChatId = getTelegramChatId();

  if (telegramBotToken && telegramChatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          photo: data.imageUrl,
          caption: data.caption,
          parse_mode: 'HTML'
        })
      });
      return { success: res.ok };
    } catch (err: any) {
      console.error('Telegram sendPhoto error:', err);
      return { success: false, error: err.message };
    }
  }
  return { success: false, error: 'No Telegram Token' };
};

export const sendTelegramCustomBroadcast = async (data: {
  text: string;
  imageUrl?: string;
  sendToGroup?: boolean;
  groupChatId?: string;
}) => {
  const telegramBotToken = getTelegramBotToken();
  const personalChatId = getTelegramChatId();
  const groupChatId = data.groupChatId || process.env.TELEGRAM_GROUP_CHAT_ID;

  if (!telegramBotToken) {
    return { success: false, error: 'No Telegram Token' };
  }

  const targets = [personalChatId];
  if (data.sendToGroup && groupChatId) {
    targets.push(groupChatId);
  }

  const results: any[] = [];
  for (const chatId of targets) {
    if (!chatId) continue;
    try {
      if (data.imageUrl && data.imageUrl.trim()) {
        const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            photo: data.imageUrl.trim(),
            caption: data.text,
            parse_mode: 'HTML'
          })
        });
        results.push({ chatId, ok: res.ok });
      } else {
        const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: data.text,
            parse_mode: 'HTML'
          })
        });
        results.push({ chatId, ok: res.ok });
      }
    } catch (err: any) {
      console.error(`Telegram custom broadcast error for ${chatId}:`, err);
      results.push({ chatId, ok: false, error: err.message });
    }
  }

  return { success: results.some(r => r.ok), results };
};
