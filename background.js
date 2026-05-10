// Enable Side Panel on action click
if (typeof chrome !== 'undefined' && chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
}

let lastMessage = '';
let lastTime = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SEND_TELEGRAM_NOTIFICATION') {
        handleTelegramNotification(message.payload);
        sendResponse({ success: true });
    } else if (message.type === 'SEND_TELEGRAM_ONLINE_STATUS') {
        handleOnlineStatus(message.payload);
        sendResponse({ success: true });
    } else if (message.type === 'SEND_TELEGRAM_SYNC_REPORT') {
        handleSyncReport(message.payload);
        sendResponse({ success: true });
    }
    return true; 
});

async function handleOnlineStatus(payload) {
    try {
        const { title, isOnline } = payload;
        const data = await chrome.storage.local.get(['botToken', 'chatId', 'contacts']);
        if (!data.botToken || !data.chatId) return;

        const emoji = isOnline ? "🟢" : "🔴";
        const statusText = isOnline ? "آنلاین شد" : "آفلاین شد";
        const msgText = `<b>${title}</b> ${statusText} ${emoji}`;

        let chatUrl = 'https://web.bale.ai/';
        if (data.contacts && data.contacts.length > 0) {
            for (let i = 0; i < data.contacts.length; i++) {
                if (title.includes(data.contacts[i].name)) {
                    chatUrl = `https://web.bale.ai/chat?uid=${data.contacts[i].uid}`;
                    break;
                }
            }
        }

        const replyMarkup = {
            inline_keyboard: [[{ text: "\uD83D\uDD17 Open Chat in Bale", url: chatUrl }]]
        };

        await fetch(`https://api.telegram.org/bot${data.botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: data.chatId,
                text: msgText,
                parse_mode: "HTML",
                reply_markup: replyMarkup
            })
        });
    } catch (err) {
        console.error(err);
    }
}

async function handleSyncReport(payload) {
    try {
        const { reportText } = payload;
        const data = await chrome.storage.local.get(['botToken', 'chatId']);
        if (!data.botToken || !data.chatId) return;

        await fetch(`https://api.telegram.org/bot${data.botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: data.chatId,
                text: reportText,
                parse_mode: "HTML"
            })
        });
    } catch (err) {
        console.error(err);
    }
}

async function handleTelegramNotification(payload) {
    try {
        const { title, body, directUrl } = payload;
        
        const data = await chrome.storage.local.get(['botToken', 'chatId', 'contacts']);
        const botToken = data.botToken;
        const chatId = data.chatId;
        const contacts = data.contacts || [];

        if (!botToken || !chatId) {
            console.warn("Telegram Bot Token or Chat ID is missing.");
            return;
        }

        let msgText = `\uD83D\uDD14 <b>New Message in Bale</b>\n\n\uD83D\uDC64 From: <b>${title}</b>`;
        if (body) msgText += `\n\uD83D\uDCAC Text: ${body}`;

        const now = Date.now();
        if (msgText === lastMessage && (now - lastTime) < 2000) return;
        lastMessage = msgText;
        lastTime = now;

        let chatUrl = directUrl || 'https://web.bale.ai/';

        if (!directUrl && contacts.length > 0) {
            for (let i = 0; i < contacts.length; i++) {
                if (title.includes(contacts[i].name)) {
                    chatUrl = `https://web.bale.ai/chat?uid=${contacts[i].uid}`;
                    break;
                }
            }
        }

        const replyMarkup = {
            inline_keyboard: [[
                { text: "\uD83D\uDD17 Open Chat in Bale", url: chatUrl }
            ]]
        };

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: msgText,
                parse_mode: "HTML",
                reply_markup: replyMarkup
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Telegram API Error:", errText);
        }
    } catch (err) {
        console.error("Error sending notification:", err);
    }
}
