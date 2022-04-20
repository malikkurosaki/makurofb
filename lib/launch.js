const puppeter = require('puppeteer');


async function Launch(){
    let browser = await puppeter.launch({
        headless: false,
        args: [
            '--start-maximized',
            '--disable-notifications',
            '--disable-infobars',
            '--disable-web-security',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-extensions',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--window-size=500,720',
            '--no-first-run',
            '--disable-default-apps',
            '--disable-translate',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-cast',
            '--disable-cast-streaming-hw-encoding',
            '--disable-cloud-import',
            '--disable-component-cloud-policy',
            '--disable-component-extensions-with-background-pages',
            '--ignition-start-pages=about:blank',
            '--default-browser-check-and-update=false',
            '--permission-prompts-enabled=false',
            '--window-position=0,0',
            '--permission-request-bypass-button-label=Bypass',
            '--enable-features=NetworkService,NetworkServiceInProcess,NetworkServiceInProcessOutOfProcess,NetworkServiceOutOfProcess',
            '--dialog-button-label=Bypass',
            '--wap-push-url-bar-allowed=true',
            '--wap-push-url-bar-required=true',
            '--render-process-limit=1',
            '--disable-ipc-flooding-protection',
            '--disable-ipc-flooding-protection-for-renderer',
            '--disable-ipc-flooding-protection-for-browser',
            '--disable-ipc-flooding-protection-for-navigator',
            '--disable-ipc-flooding-protection-for-service-worker',
            '--disable-ipc-flooding-protection-for-shared-worker',
            '--disable-ipc-flooding-protection-for-extension-process',
            '--disable-ipc-flooding-protection-for-extension-process-renderer',
            '--disable-ipc-flooding-protection-for-extension-process-browser',
            '--disable-ipc-flooding-protection-for-extension-process-navigator',
            '--disable-ipc-flooding-protection-for-extension-process-service-worker',
            '--disable-ipc-flooding-protection-for-extension-process-shared-worker'
        ]
    });

    let [page] = await browser.pages();
    
    await page.goto('https://mbasic.facebook.com/');
    // window width
    await page.setViewport({
        width: 500,
        height: 720,

    });
    return page;
}

module.exports = { Launch }