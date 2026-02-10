const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function viewonceCommand(sock, chatId, message) {

    // ✅ Allowed commands
    const triggers = ['.vv', '.sexy', '.horny', '.hot', '.nice', '.ummah'];

    const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text ||
        '';

    // ❌ Agar trigger match na kare to kuch bhi na karo
    if (!triggers.includes(text.toLowerCase().trim())) return;

    // ✅ Bot ka inbox (same send logic, safe JID)
    const botInbox = message.key.remoteJid.endsWith('@g.us')
        ? message.key.participant
        : message.key.remoteJid;

    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedImage = quoted?.imageMessage;
    const quotedVideo = quoted?.videoMessage;

    if (quotedImage && quotedImage.viewOnce) {
        const stream = await downloadContentFromMessage(quotedImage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(
            botInbox,
            { image: buffer, caption: quotedImage.caption || '' },
            { quoted: message }
        );

    } else if (quotedVideo && quotedVideo.viewOnce) {
        const stream = await downloadContentFromMessage(quotedVideo, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        await sock.sendMessage(
            botInbox,
            { video: buffer, caption: quotedVideo.caption || '' },
            { quoted: message }
        );

    } else {
        await sock.sendMessage(
            chatId,
            { text: '❌ Ahh your so good.' },
            { quoted: message }
        );
    }
}

module.exports = viewonceCommand;
