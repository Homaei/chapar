# Chapar - Bale to Telegram Notifier 🚀
[🇮🇷 راهنمای فارسی در پایین صفحه](#راهنمای-نصب-فارسی-ir)

**Support:** hubert.homaei@gmail.com

A Chrome Extension that intercepts notifications from Bale Web App and forwards them to your Telegram via a Telegram Bot. It supports deep-linking to specific chats using Inline Buttons.

## 🌟 Features
- **Real-time Forwarding**: Forwards Bale web notifications to Telegram instantly.
- **Deep Links**: Creates an "Open Chat" inline button in Telegram that directly opens the specific chat in Bale.
- **Auto-Save**: The settings popup automatically saves your input as you type.
- **Privacy-First**: No external servers are involved. The extension communicates directly with the Telegram API.
- **Bypass CORS/CSP**: Uses Chrome extension background service workers to bypass Content Security Policies.

## 🛠️ English Setup Guide

### 1. Create a Telegram Bot
1. Open Telegram and search for [@BotFather](https://t.me/botfather).
2. Send `/newbot` and follow the instructions to create a bot.
3. Once created, copy the **Bot Token** (e.g., `123456:ABC-DEF...`).
4. Start your newly created bot by sending a message like "Hello" to it.

### 2. Get Your Chat ID
1. Search for [@userinfobot](https://t.me/userinfobot) in Telegram.
2. Send `/start` and it will reply with your `Id` (e.g., `123456789`). This is your **Chat ID**.

### 3. Install the Extension
1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the `Notifier` folder.

### 4. Configuration
1. Click the extension icon in your Chrome toolbar.
2. Paste your **Bot Token** and **Chat ID**.
3. In the Contacts section, enter the exact **Name** of the contact as it appears in Bale, and their **Bale UID** (You can find their UID by looking at the URL when you open their chat in Bale Web, e.g., `web.bale.ai/chat?uid=569651864`).
4. All settings are saved automatically as you type!

---

# راهنمای نصب فارسی 🇮🇷

افزونه‌ای برای مرورگر کروم که نوتیفیکیشن‌های نسخه وب پیام‌رسان بله را دریافت کرده و به صورت خودکار به تلگرام شما فوروارد می‌کند. این افزونه با ایجاد دکمه‌های شیشه‌ای، امکان باز کردن مستقیم چت شخص مورد نظر را در بله فراهم می‌کند.

## 🌟 ویژگی‌ها
- **ارسال در لحظه**: فوروارد آنی پیام‌ها به تلگرام.
- **لینک مستقیم (Deep Link)**: ساخت دکمه شیشه‌ای برای باز کردن مستقیم چت شخص در بله.
- **ذخیره خودکار**: فرم تنظیمات به صورت لحظه‌ای اطلاعات شما را ذخیره می‌کند.
- **حریم خصوصی**: هیچ سرور واسطی وجود ندارد؛ افزونه مستقیما با سرور تلگرام ارتباط برقرار می‌کند.

## 🛠️ راهنمای راه‌اندازی

### ۱. ساخت ربات تلگرام
۱. در تلگرام به ربات پدر [@BotFather](https://t.me/botfather) پیام دهید.
۲. دستور `/newbot` را ارسال کنید و نام و آیدی ربات خود را بسازید.
۳. در پایان، یک **توکن (Bot Token)** دریافت می‌کنید (مثل `123456:ABC...`). آن را کپی کنید.
۴. وارد رباتی که ساختید بشوید و دکمه Start را بزنید (یا یک پیام دلخواه برایش بفرستید).

### ۲. دریافت Chat ID (آیدی عددی شما)
۱. در تلگرام ربات [@userinfobot](https://t.me/userinfobot) را جستجو کنید.
۲. دکمه Start را بزنید. ربات یک عدد چند رقمی به عنوان `Id` به شما می‌دهد. این همان **Chat ID** شماست.

### ۳. نصب افزونه روی کروم
۱. مرورگر کروم را باز کرده و آدرس `chrome://extensions/` را وارد کنید.
۲. در گوشه بالا سمت راست، گزینه **Developer mode** را فعال کنید.
۳. روی دکمه **Load unpacked** کلیک کرده و فولدر `Notifier` را انتخاب کنید.

### ۴. انجام تنظیمات
۱. روی آیکون افزونه در بالای مرورگر کلیک کنید.
۲. **توکن ربات** و **Chat ID** خود را وارد کنید.
۳. در بخش کانتکت‌ها، **نام دقیق مخاطب** (دقیقا همانطور که در نوتیفیکیشن بله می‌بینید) و **آیدی بله (UID)** او را وارد کنید. (برای پیدا کردن UID هر شخص، چت او را در بله وب باز کنید و عدد جلوی `uid=` را از آدرس‌بار کپی کنید).
۴. به محض تایپ کردن در کادرها، تمام تنظیمات ذخیره می‌شوند و نیازی به زدن دکمه Save نیست!
