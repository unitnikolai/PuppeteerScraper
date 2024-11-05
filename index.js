
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const fs = require('fs/promises')
// const fetch = require('node-fetch');

puppeteer.use(StealthPlugin())

const {executablePath} = require('puppeteer')

async function start(){
    const browser = await puppeteer.launch({headless: true, executablePath: executablePath()});
    const page = await browser.newPage()
    await page.setViewport({'width': 1920, 'height': 1080});
    await page.goto("https://zillow.com/mason-oh-45040")

    
    const wait = async (time) => new Promise(resolve => setTimeout(resolve, time));

    await page.screenshot({path: "amazing.png", fullPage: true})

    async function captcha(byFun, pageOn, timer){
        
        while(true){
            const captchaElement = await pageOn.$('#px-captcha');
            if(captchaElement){
                console.log('Captcha present')
                await byFun(pageOn, timer);
                await timer(5000)
                await pageOn.screenshot({path: "2.png", fullPage: true})
                await timer(7000)
            }
            else{
                search(pageOn);
                break
            }
        }
    }

    async function bypass(page_, timer){
        try {
            const rect = await page_.$eval('#px-captcha', element =>{
                const {x, y} = element.getBoundingClientRect();
                return {x, y};
            });

            const offset = {x: 235, y:19};
            const vectorX = rect.x + offset.x;
            const vectorY = rect.y + offset.y;
            console.log(vectorX, vectorY);
            
            await page_.mouse.move(vectorX, vectorY);
            await page_.screenshot({path: "2.png", fullPage: true})
            await timer(3000)
            await page_.mouse.move(vectorX, vectorY);
            await page_.mouse.down()   
            console.log('Mouse down')
        
            for(let y = 0; y < 4; y++){
                await timer(2500)
                await page_.screenshot({path: "2.png", fullPage: true})
            }
            // // await new Promise(resolve => setTimeout(resolve, 9500));
            await page_.mouse.up();

            console.log('Mouse up')

            // await page_.screenshot({path: "2.png", fullPage: true})
            // await waitwait(1000)
            await page_.screenshot({path: "2.png", fullPage: true})

        }
        catch{}
    }
   
    captcha(bypass, page, wait)
     //Create array of data scraped from document

    async function search(pageOn){
        const find = await pageOn.$eval('[data-testid="search-bar-container"]', element =>{
            const {x, y} = element.getBoundingClientRect();
            return {x, y};
        });
        console.log(find.x, find.y)
        await pageOn.type('[data-testid="search-bar-container"]', "45040")
        await pageOn.click('[type="submit"]')
    }

    // await page.screenshot({path: "3.png", fullPage: true})
    // const names = await page.evaluate(() => {
    //     return Array.from(document.querySelectorAll("div.hdp__sc-x83qu3-0 eMgJTO")).map(x => x.textContent)
    // })
    // await fs.writeFile("names.txt", names.join("\r\n"))
    
}

start()

