const i18n = {
    en: {
        appTitle: "Chapar",
        botSettings: "Bot Settings",
        botTokenLabel: "Bot Token",
        botTokenTooltip: "Message @BotFather on Telegram to create a bot and get your token.",
        chatIdLabel: "Chat ID",
        chatIdTooltip: "Message @userinfobot on Telegram and copy the Id number it gives you.",
        contactsMap: "Contacts Mapping",
        contactsTooltip: "Make sure the name exactly matches the one in Bale. Also, copy the UID from the browser address bar.",
        nameTooltip: "Write the exact name of the contact as it appears in Bale to correctly receive notifications.",
        uidTooltip: "Open the chat in Bale Web and copy the number after 'uid=' from the address bar.",
        addBtn: "Add",
        saveBtn: "Save Configuration",
        savedStatus: "Saved successfully!",
        placeholderName: "Contact Name",
        placeholderUid: "Bale UID",
        receiveStatus: "Receive status for",
        toggleMsg: "Messages",
        toggleCall: "Calls",
        toggleOnline: "Online Status",
        toggleDelete: "Delete",
        defaultMother: "Mother",
        defaultFather: "Father",
        defaultSister: "Sister",
        defaultBrother: "Brother"
    },
    fa: {
        appTitle: "چاپار",
        botSettings: "تنظیمات ربات",
        botTokenLabel: "توکن ربات",
        botTokenTooltip: "برای ساخت ربات به BotFather@ در تلگرام پیام دهید و توکن را اینجا قرار دهید.",
        chatIdLabel: "آیدی چت تلگرام",
        chatIdTooltip: "به ربات userinfobot@ پیام دهید تا آیدی عددی شما را بدهد.",
        contactsMap: "دفترچه مخاطبین",
        contactsTooltip: "نام مخاطب را دقیقاً مشابه بله وارد کنید. آیدی (UID) را هم از نوار آدرس مرورگر کپی کنید.",
        nameTooltip: "سعی کنید اسمی که در هر مخاطب نوشتید رو دقیق در اینجا درج کنید تا در تلگرام با اسم همون شخص ناتیف رو دریافت کنید.",
        uidTooltip: "توی مرورگر وقتی صفحه چت با مخاطبی رو باز کردید، توی نوار آدرس یک عدد جلوی uid= هست، اونو اینجا بذارید.",
        addBtn: "افزودن",
        saveBtn: "ذخیره تنظیمات",
        savedStatus: "با موفقیت ذخیره شد!",
        placeholderName: "نام شخص",
        placeholderUid: "آیدی عددی (UID)",
        receiveStatus: "دریافت وضعیت برای",
        toggleMsg: "پیام‌ها",
        toggleCall: "تماس‌ها",
        toggleOnline: "وضعیت آنلاین",
        toggleDelete: "حذف",
        defaultMother: "مادر",
        defaultFather: "پدر",
        defaultSister: "خواهر",
        defaultBrother: "برادر"
    }
};

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    const botTokenInput = document.getElementById('botToken');
    const chatIdInput = document.getElementById('chatId');
    const contactsList = document.getElementById('contactsList');
    const addContactBtn = document.getElementById('addContactBtn');
    const saveBtn = document.getElementById('saveBtn');
    const statusMessage = document.getElementById('statusMessage');
    
    const themeToggleBtn = document.getElementById('themeToggle');
    const langEnBtn = document.getElementById('langEn');
    const langFaBtn = document.getElementById('langFa');

    let isLightMode = true; // Default to Light Mode

    function applyTheme(lightMode) {
        isLightMode = lightMode;
        if (isLightMode) {
            document.body.classList.add('light-mode');
            themeToggleBtn.textContent = '🌙';
        } else {
            document.body.classList.remove('light-mode');
            themeToggleBtn.textContent = '☀️';
        }
        chrome.storage.local.set({ lightMode: isLightMode });
    }

    themeToggleBtn.addEventListener('click', () => {
        applyTheme(!isLightMode);
    });

    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18n[lang][key]) {
                el.textContent = i18n[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-dynamic]').forEach(el => {
            const key = el.getAttribute('data-i18n-dynamic');
            if (i18n[lang][key]) {
                el.textContent = i18n[lang][key];
            }
        });

        document.querySelectorAll('.contact-name').forEach(el => {
            el.placeholder = i18n[lang].placeholderName;
        });
        document.querySelectorAll('.contact-uid').forEach(el => {
            el.placeholder = i18n[lang].placeholderUid;
        });

        langEnBtn.classList.toggle('active', lang === 'en');
        langFaBtn.classList.toggle('active', lang === 'fa');
        
        chrome.storage.local.set({ uiLang: lang });
    }

    langEnBtn.addEventListener('click', () => applyLanguage('en'));
    langFaBtn.addEventListener('click', () => applyLanguage('fa'));

    function createContactRow(name = '', uid = '', notifyMsg = true, notifyCall = true, notifyOnline = true) {
        const row = document.createElement('div');
        row.className = 'contact-row';
        
        row.innerHTML = `
            <div class="contact-inputs">
                <div class="input-wrapper contact-name-wrapper">
                    <input type="text" class="contact-name" placeholder="${i18n[currentLang].placeholderName}" value="${name}">
                    <div class="tooltip-container row-tooltip">
                        <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                        <div class="tooltip-text" data-i18n-dynamic="nameTooltip">${i18n[currentLang].nameTooltip}</div>
                    </div>
                </div>
                <div class="input-wrapper contact-uid-wrapper">
                    <input type="text" class="contact-uid" placeholder="${i18n[currentLang].placeholderUid}" value="${uid}">
                    <div class="tooltip-container row-tooltip">
                        <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                        <div class="tooltip-text" data-i18n-dynamic="uidTooltip">${i18n[currentLang].uidTooltip}</div>
                    </div>
                </div>
            </div>
            <div class="contact-actions">
                <span style="font-size: 11px; color: var(--text-muted); margin-left: auto; margin-right: auto;" data-i18n-dynamic="receiveStatus">${i18n[currentLang].receiveStatus}:</span>
                <div class="toggles-group">
                    <label class="toggle-label toggle-msg" title="${i18n[currentLang].toggleMsg}">
                        <input type="checkbox" class="check-msg" ${notifyMsg ? 'checked' : ''}>
                        <svg class="toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </label>
                    <label class="toggle-label toggle-call" title="${i18n[currentLang].toggleCall}">
                        <input type="checkbox" class="check-call" ${notifyCall ? 'checked' : ''}>
                        <svg class="toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </label>
                    <label class="toggle-label toggle-online" title="${i18n[currentLang].toggleOnline}">
                        <input type="checkbox" class="check-online" ${notifyOnline ? 'checked' : ''}>
                        <svg class="toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4" fill="currentColor"></circle></svg>
                    </label>
                </div>
                <button class="btn-delete" title="${i18n[currentLang].toggleDelete}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        row.querySelector('.btn-delete').addEventListener('click', () => {
            row.remove();
            saveSettings(false);
        });
        
        return row;
    }

    chrome.storage.local.get(['botToken', 'chatId', 'contacts', 'uiLang', 'lightMode'], (data) => {
        if (data.lightMode !== undefined) {
            applyTheme(data.lightMode);
        } else {
            applyTheme(true);
        }

        if (data.uiLang) {
            applyLanguage(data.uiLang);
        } else {
            applyLanguage('en');
        }

        if (data.botToken) botTokenInput.value = data.botToken;
        if (data.chatId) chatIdInput.value = data.chatId;
        
        if (data.contacts && data.contacts.length > 0) {
            data.contacts.forEach(contact => {
                contactsList.appendChild(createContactRow(contact.name, contact.uid, contact.notifyMsg !== false, contact.notifyCall !== false, contact.notifyOnline !== false));
            });
        } else {
            // No default contacts for official version
            contactsList.appendChild(createContactRow('', ''));
        }
        
        setTimeout(() => saveSettings(false), 500);
    });

    addContactBtn.addEventListener('click', () => {
        contactsList.appendChild(createContactRow());
        contactsList.scrollTop = contactsList.scrollHeight;
    });

    function saveSettings(showStatus = false) {
        const botToken = botTokenInput.value.trim();
        const chatId = chatIdInput.value.trim();
        
        const contacts = [];
        const rows = document.querySelectorAll('.contact-row');
        rows.forEach(row => {
            const name = row.querySelector('.contact-name').value.trim();
            const uid = row.querySelector('.contact-uid').value.trim();
            const notifyMsg = row.querySelector('.check-msg').checked;
            const notifyCall = row.querySelector('.check-call').checked;
            const notifyOnline = row.querySelector('.check-online').checked;
            if (name || uid) {
                contacts.push({ name, uid, notifyMsg, notifyCall, notifyOnline });
            }
        });

        chrome.storage.local.set({ botToken, chatId, contacts }, () => {
            if (showStatus) {
                statusMessage.classList.remove('hidden');
                setTimeout(() => {
                    statusMessage.classList.add('hidden');
                }, 2000);
            }
        });
    }

    document.querySelector('.container').addEventListener('input', () => {
        saveSettings(false);
    });

    saveBtn.addEventListener('click', () => {
        saveSettings(true);
    });
});
