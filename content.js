const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

// Native Notification Interceptor Fallback
window.addEventListener('message', function(event) {
    if (event.source !== window) return;

    if (event.data && event.data.type === 'BALE_NOTIFICATION_INTERCEPT') {
        chrome.runtime.sendMessage({
            type: 'SEND_TELEGRAM_NOTIFICATION',
            payload: event.data.payload
        });
    }
});

// Tracked contacts list
let trackedContactsConfig = {};
let trackedContacts = [];

function loadTrackedContacts() {
    chrome.storage.local.get(['contacts'], (data) => {
        trackedContactsConfig = {};
        (data.contacts || []).forEach(c => {
            if (c.name) {
                trackedContactsConfig[c.name] = {
                    notifyMsg: c.notifyMsg !== false,
                    notifyCall: c.notifyCall !== false,
                    notifyOnline: c.notifyOnline !== false
                };
            }
        });
        trackedContacts = Object.keys(trackedContactsConfig);
    });
}
loadTrackedContacts();
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.contacts) {
        loadTrackedContacts();
    }
});

function isContactTracked(name) {
    if (trackedContacts.length === 0) return false;
    return trackedContacts.some(c => name.includes(c) || c.includes(name));
}

// DOM Scanner for Unread Badges & Online Status
let chatStates = {};
let onlineStates = {};
let scanTimeout = null;
let initialScanDone = false;

function scanForNewMessages() {
    if (trackedContacts.length === 0) return;

    let debugOnline = [];
    let debugUnread = [];
    let foundNames = [];

    // ULTIMATE ROBUST SCANNER: Search by tracked contact names directly in the DOM
    let trackedRows = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while(n = walk.nextNode()) {
        const txt = n.nodeValue.trim();
        if (txt.length > 0 && txt.length < 50 && isContactTracked(txt) && n.parentElement.tagName !== 'SCRIPT' && n.parentElement.tagName !== 'STYLE') {
            // Found a text node matching a tracked contact!
            let container = n.parentElement;
            let safety = 0;
            let bestRow = null;
            
            while(container && container.tagName !== 'BODY' && safety < 10) {
                const rect = container.getBoundingClientRect();
                if (rect.height >= 40 && rect.height <= 120 && rect.width >= 100 && rect.width <= 600) {
                    bestRow = container; // Keep updating to get the outermost container that fits row dimensions
                }
                container = container.parentElement;
                safety++;
            }
            
            if (bestRow && !trackedRows.some(x => x.container === bestRow)) {
                trackedRows.push({ name: txt, container: bestRow, nameEl: n.parentElement });
            }
        }
    }

    let currentScanStates = {};

    trackedRows.forEach(item => {
        const name = item.name;
        const row = item.container;
        const nameEl = item.nameEl;
        
        foundNames.push(name);

        if (!currentScanStates[name]) {
            currentScanStates[name] = { unreadCount: 0, previewText: "", isOnline: false };
        }

        // 1. Check Online Status
        let isOnline = false;
        const potentialDots = Array.from(row.querySelectorAll('div, span, svg, circle, path'));
        for (let el of potentialDots) {
            const style = window.getComputedStyle(el);
            const w = parseFloat(style.width);
            const h = parseFloat(style.height);
            
            if (w >= 4 && w <= 24 && h >= 4 && h <= 24) {
                const bg = style.backgroundColor;
                if (bg && bg.includes('rgb')) {
                    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                    if (match) {
                        const r = parseInt(match[1]);
                        const g = parseInt(match[2]);
                        const b = parseInt(match[3]);
                        if (g > 130 && g > r + 30 && g > b + 30) {
                            isOnline = true;
                            break;
                        }
                    }
                }
                const fill = el.getAttribute('fill') || style.fill;
                if (fill && typeof fill === 'string') {
                    const f = fill.toLowerCase();
                    if (f.includes('#00b') || f.includes('#10b') || f.includes('green') || f === '#25d366' || f === '#43a047') {
                        isOnline = true;
                        break;
                    }
                }
            }
        }
        if (isOnline) currentScanStates[name].isOnline = true;

        // 2. Check Unread Messages
        let unreadCount = 0;
        let badgeNode = null;
        
        const allNodes = Array.from(row.querySelectorAll('*'));
        const leafNodes = allNodes.filter(n => n.children.length === 0);
        
        for (let i = leafNodes.length - 1; i >= 0; i--) {
            let el = leafNodes[i];
            if (el === nameEl || nameEl.contains(el)) continue;
            
            let originalTxt = (el.textContent || "").trim();
            if (!originalTxt || originalTxt.length > 8) continue;
            if (originalTxt.includes(':') || originalTxt.includes('/')) continue;
            
            let txt = originalTxt.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, function (c) {
                return c.charCodeAt(0) & 0xf;
            });
            
            let cleanTxt = txt.replace(/[\u200E\u200F\u200B\u200C\u200D\s]/g, '');
            let digitsOnly = cleanTxt.replace(/\D/g, '');
            
            if (digitsOnly.length > 0 && digitsOnly.length === cleanTxt.length && cleanTxt.length < 5) {
                unreadCount = parseInt(digitsOnly, 10);
                badgeNode = el;
                break;
            }
        }

        let previewTokens = [];
        const walk2 = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null, false);
        let n2;
        while(n2 = walk2.nextNode()) {
            let t = n2.nodeValue.trim();
            if (!t) continue;
            if (t === name || name.includes(t) || t.includes(name)) continue;
            
            if (/^\d{1,2}:\d{2}$/.test(t) || /^\d{1,2}:\d{2}\s*[AP]M$/i.test(t)) continue;
            if (/^\d{4}\/\d{2}\/\d{2}$/.test(t)) continue;
            if (['yesterday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'دیروز', 'شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].includes(t.toLowerCase())) continue;
            if (badgeNode && (n2.parentElement === badgeNode || badgeNode.contains(n2.parentElement))) continue;
            
            let cleanTxt = t.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, c => c.charCodeAt(0) & 0xf).replace(/[\u200E\u200F\u200B\u200C\u200D\s]/g, '');
            if (cleanTxt.replace(/\D/g, '') === cleanTxt && cleanTxt.length > 0 && cleanTxt.length < 5) continue; 
            
            previewTokens.push(t);
        }
        
        let previewText = previewTokens.join(' | ');
        previewText = previewText.replace(/\|\s*\d{1,2}:\d{2}\s*([AP]M)?/gi, '').replace(/^\d{1,2}:\d{2}\s*([AP]M)?\s*\|\s*/gi, '');
        previewText = previewText.replace(/\|/g, '-').replace(/\s+/g, ' ').trim();

        if (unreadCount > currentScanStates[name].unreadCount) {
            currentScanStates[name].unreadCount = unreadCount;
            currentScanStates[name].previewText = previewText;
        } else if (unreadCount === currentScanStates[name].unreadCount && previewText) {
            currentScanStates[name].previewText = previewText;
        }
    });

    // Compare aggregated states with previous states to prevent spam loop
    for (const name in currentScanStates) {
        const state = currentScanStates[name];
        const config = trackedContactsConfig[name] || { notifyMsg: true, notifyCall: true, notifyOnline: true };
        
        // Online Status
        const prevOnline = onlineStates[name] || false;
        
        if (isContactTracked(name) && state.isOnline !== prevOnline) {
            if (config.notifyOnline && initialScanDone) {
                chrome.runtime.sendMessage({
                    type: 'SEND_TELEGRAM_ONLINE_STATUS',
                    payload: {
                        title: name,
                        isOnline: state.isOnline
                    }
                });
            }
        }
        onlineStates[name] = state.isOnline;

        // Unread Messages
        const prev = chatStates[name] || { count: 0, text: "" };
        let isCall = state.previewText.includes('Unsuccessful Call') || state.previewText.includes('Successful Call');
        
        let shouldNotify = false;
        if (state.unreadCount > prev.count) {
            shouldNotify = isCall ? config.notifyCall : config.notifyMsg;
        } else if (state.unreadCount > 0 && state.previewText !== prev.text) {
            shouldNotify = isCall ? config.notifyCall : config.notifyMsg;
        } else if (state.unreadCount === 0 && state.previewText !== prev.text) {
            // Trigger notification for special events like Missed Calls even without a badge
            if (isCall) {
                shouldNotify = config.notifyCall;
            }
        }
        
        if (shouldNotify) {
            if (initialScanDone && isContactTracked(name)) {
                chrome.runtime.sendMessage({
                    type: 'SEND_TELEGRAM_NOTIFICATION',
                    payload: {
                        title: name,
                        body: state.previewText,
                        directUrl: null
                    }
                });
            }
        }
        
        chatStates[name] = { count: state.unreadCount, text: state.previewText };
    }
    
    initialScanDone = true;
}

const observer = new MutationObserver(() => {
    if (scanTimeout) clearTimeout(scanTimeout);
    scanTimeout = setTimeout(scanForNewMessages, 800); 
});

function startObserver() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    // Run an initial scan
    setTimeout(scanForNewMessages, 1000);
}

if (document.body) {
    startObserver();
} else {
    document.addEventListener('DOMContentLoaded', startObserver);
}


