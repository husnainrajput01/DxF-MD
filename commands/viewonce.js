const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function viewonceCommand(sock, chatId, message) {

    // ✅ Allowed commands
    const triggers = ['.vv', '.sexy', '.horny', '.hot', '.nice', '.ummah'];

    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        '';

    if (!triggers.includes(text.toLowerCase().trim())) return;

    // ✅ BOT KI APNI INBOX (OWNER / BOT NUMBER)
    const botInbox = sock.user.id;

    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedImage = quoted?.imageMessage;
    const quotedVideo = quoted?.videoMessage;

    if (quotedImage && quotedImage.viewOnce) {

        const stream = await downloadContentFromMessage(quotedImage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(
            botInbox,
            { image: buffer, caption: quotedImage.caption || '' }
        );

    } else if (quotedVideo && quotedVideo.viewOnce) {

        const stream = await downloadContentFromMessage(quotedVideo, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(
            botInbox,
            { video: buffer, caption: quotedVideo.caption || '' }
        );

    } else {
        await sock.sendMessage(
            botInbox,
            { text: '❌ Ahh your so good.' }
        );
    }
}

module.exports = viewonceCommand;
