<div align="center">

<img src="icons/icon128.png" alt="Chapar Logo" width="96" />

# Chapar

**Bale → Telegram Notifier**

A Chrome Extension that intercepts Bale Web notifications and forwards them to your Telegram — instantly, privately, and without any relay server.

[![Version](https://img.shields.io/badge/version-1.0.0-C9A84C?style=flat-square)](https://github.com/homaei/chapar/releases)
[![License](https://img.shields.io/badge/license-MIT-C9A84C?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Chrome-4285F4?style=flat-square&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore)

[English](#-english-guide) · [فارسی](#-راهنمای-فارسی)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Real-time forwarding** | Notifications arrive in Telegram the instant Bale fires them |
| 🔗 **Deep-link buttons** | Every message gets an *Open Chat* inline button that jumps straight into the Bale conversation |
| 💾 **Auto-save** | Settings are persisted as you type — no Save button needed |
| 🛡️ **Privacy-first** | No relay server. The extension communicates directly with the Telegram Bot API |
| 🔓 **CORS/CSP bypass** | Uses Chrome's background service worker to make API calls that the page itself cannot |

---

## 🇬🇧 English Guide

### Step 1 — Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather).
2. Send `/newbot` and follow the prompts to name your bot.
3. Copy the **Bot Token** you receive (format: `123456:ABC-DEF...`).
4. Open your new bot and send it any message to activate it.

### Step 2 — Get your Chat ID

1. Search for [@userinfobot](https://t.me/userinfobot) in Telegram.
2. Send `/start`. It will reply with your numeric **Chat ID** (e.g. `987654321`).

### Step 3 — Install the Extension

1. Download or clone this repository.
2. Navigate to `chrome://extensions/` in Google Chrome.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the repository folder (`chapar-main` if downloaded as a ZIP).

### Step 4 — Configure

1. Click the Chapar icon in your Chrome toolbar.
2. Paste your **Bot Token** and **Chat ID** into the popup.
3. In the **Contacts** section, add each person you want to track:
   - **Name** — exactly as it appears in Bale notifications.
   - **Bale UID** — open their chat at `web.bale.ai` and copy the number after `?uid=` from the URL bar.
4. Settings save automatically. You're done.

---

## 🇮🇷 راهنمای فارسی

افزونه‌ای برای کروم که نوتیفیکیشن‌های نسخه وب پیام‌رسان **بله** را لحظه‌ای به تلگرام شما ارسال می‌کند — بدون هیچ سرور واسطی.

### مرحله اول — ساخت ربات تلگرام

۱. در تلگرام ربات [@BotFather](https://t.me/botfather) را جستجو کنید.  
۲. دستور `/newbot` را ارسال کنید و نام ربات خود را انتخاب کنید.  
۳. **توکن ربات** را که دریافت می‌کنید کپی کنید (شبیه به `123456:ABC-DEF...`).  
۴. وارد ربات جدیدتان شوید و یک پیام دلخواه ارسال کنید تا فعال شود.

### مرحله دوم — دریافت Chat ID

۱. ربات [@userinfobot](https://t.me/userinfobot) را در تلگرام جستجو کنید.  
۲. دکمه Start را بزنید. ربات عدد **Chat ID** شما را نمایش می‌دهد (مثلاً `987654321`).

### مرحله سوم — نصب افزونه

۱. این مخزن را دانلود یا کلون کنید.  
۲. آدرس `chrome://extensions/` را در کروم باز کنید.  
۳. گزینه **Developer mode** را از گوشه بالا-راست فعال کنید.  
۴. روی **Load unpacked** کلیک کرده و پوشه مخزن را انتخاب کنید (اگر به صورت ZIP دانلود کردید، پوشه `chapar-main` را انتخاب کنید).

### مرحله چهارم — تنظیمات

۱. روی آیکون افزونه در نوار ابزار کروم کلیک کنید.  
۲. **توکن ربات** و **Chat ID** خود را وارد کنید.  
۳. در بخش **Contacts**، مشخصات هر مخاطبی که می‌خواهید دنبال کنید را وارد کنید:  
   - **نام** — دقیقاً همان‌طور که در نوتیفیکیشن‌های بله نمایش داده می‌شود.  
   - **Bale UID** — چت شخص را در بله وب باز کنید و عدد بعد از `?uid=` را از آدرس‌بار کپی کنید.  
۴. تنظیمات به صورت خودکار ذخیره می‌شوند.

---

## 🏗️ How It Works

```
Bale Web App
    │
    │  Service Worker intercepts
    │  Web Push notification
    ▼
Chrome Extension (background.js)
    │
    │  Looks up contact UID
    │  Builds Telegram message + inline button
    ▼
Telegram Bot API
    │
    ▼
Your Telegram
```

The extension injects a content script and service worker into the Bale web context that captures `push` events before they reach the browser's native notification system. It then maps the sender's name to a Bale UID (from your configured contacts) and calls `sendMessage` on the Telegram Bot API — entirely from your local machine.

---

## 🗂️ Repository Structure

```
chapar/
├── manifest.json        # Extension manifest (MV3)
├── background.js        # Service worker — intercepts & forwards
├── content.js           # Content script injected into Bale
├── inject.js            # Page-level injection helper
├── popup.html           # Settings UI
├── popup.js             # Auto-save logic
├── popup.css            # Popup styles
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🔒 Privacy

Chapar never sends your data to any server other than `api.telegram.org`.  
No analytics, no logging, no third-party services.  
All configuration is stored locally in `chrome.storage.sync`.

---

## 📄 License

MIT © [Hubert Homaei](mailto:hubert.homaei@gmail.com)

---

<div align="center">

Made with ☕ for the Iranian developer community  
[⭐ Star this repo](https://github.com/homaei/chapar) if it saved you time

</div>
