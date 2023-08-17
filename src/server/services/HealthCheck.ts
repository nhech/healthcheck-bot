import { IBot, ChatDestination } from 'app';

interface CheckConfig {
    alert: boolean;
    success: boolean;
}

export default class {
    failCount: number = 0;
    maxFailCount: number = 5;
    urls: string[];
    urls_state: any = {};

    bot: IBot;

    checkUrl: (url: string) => Promise<any>;

    constructor(bot: IBot, urls: string[], checkUrl: (url: string) => Promise<any>) {
        this.urls = urls;
        for (const url of urls) {
            this.urls_state[url] = true;
        }

        this.checkUrl = checkUrl;
        this.bot = bot;
    }

    checkAll(detination: ChatDestination, conf: CheckConfig = { alert: true, success: false }) {
        return this.urls.map((url) =>
            this.checkUrl(url)
                .then(() => {
                    if (conf.success || !this.urls_state[url]) {
                        this.urls_state[url] = true;
                        this.bot.sendOk(url, detination);
                    }
                })
                .catch(() => {
                    this.urls_state[url] = false;
                    this.failCount++;
                    if (this.failCount <= this.maxFailCount) {
                        conf.alert && this.bot.sendAlert(url, detination);
                    } else {
                        console.error('max fail count reached');
                    }
                })
        );
    }
}
