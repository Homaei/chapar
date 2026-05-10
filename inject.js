(function() {
    if (!window.Notification) return;

    window.Notification = new Proxy(window.Notification, {
        construct(target, args) {
            const title = args[0] || 'Unknown';
            const options = args[1] || {};
            
            let directUrl = null;
            if (options.data && options.data.url) { 
                directUrl = options.data.url; 
            } else if (options.tag && options.tag.includes('uid')) { 
                let extUid = options.tag.replace(/[^0-9]/g, '');
                if(extUid) directUrl = `https://web.bale.ai/chat?uid=${extUid}`; 
            }

            window.postMessage({
                type: 'BALE_NOTIFICATION_INTERCEPT',
                payload: {
                    title: title,
                    body: options.body || '',
                    directUrl: directUrl
                }
            }, '*');

            return new target(...args);
        }
    });
})();
