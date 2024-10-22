import puppeteer from "puppeteer";
import fs from "fs";

const urls = [
    "https://www.fwrd.com/category-clothing/3699fc/?navsrc=main",
    "https://www.fwrd.com/new-arrivals-20241021/ce52d9/?navsrc=main",
    "https://www.fwrd.com/mens-new-arrivals-brand-this-week/613622/?navsrc=main",
    "https://www.fwrd.com/sale-all-sale-items/54cc7b/?navsrc=main"
]

const categories = [
    "women",
    "new",
    "men",
    "sale"
]
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    })
}

fs.appendFileSync('data.json', '[');
let firstItem = true;
(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./tmp",
        defaultViewport: false
    });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(urls[3], { waitUntil: 'networkidle0' });
    await autoScroll(page);


    const scrapePage = async () => {
        // Wait for the products grid to load
        await page.waitForSelector('.product-grids__link');

        const fwrdHandles = await page.$$('.product-grids__link');
        let itemsLength = 0;

        for (const fwrdHandle of fwrdHandles) {
            let fwrdBrand = "Null";
            let fwrdName = "Null";
            let fwrdPrice = "Null";
            let fwrdImage = "Null";
            let fwrdLink = "Null";
            let item = {};

            try {
                fwrdBrand = await page.evaluate(e1 => e1.querySelector(".product-grids__copy-item.js-plp-brand").textContent, fwrdHandle);
            } catch (error) { }

            try {
                fwrdName = await page.evaluate(e1 => e1.querySelector(".product-grids__copy-item.js-plp-name").textContent, fwrdHandle);
            } catch (error) { }
            try {
                fwrdPrice = await page.evaluate(e1 => e1.querySelector(".price__sale")?.textContent || e1.querySelector(".js-plp-price-retail").textContent, fwrdHandle);
            } catch (error) { }
            try {
                fwrdImage = await page.evaluate(e1 => e1.querySelector(".product__image-main-view").getAttribute("src"), fwrdHandle);
            } catch (error) { }
            try {
                fwrdLink = await page.evaluate(e1 => e1.querySelector(".js-plp-pdp-link").getAttribute("href"), fwrdHandle);
            } catch (error) { }
            if (fwrdName !== "Null" && fwrdPrice !== "Null" && fwrdImage !== "Null" && fwrdBrand !== "Null" && fwrdLink !== "Null") {
                fwrdLink = "https://www.fwrd.com" + fwrdLink
                item = {
                    brand: fwrdBrand,
                    name: fwrdName,
                    price: fwrdPrice,
                    image: fwrdImage,
                    link: fwrdLink,
                    category: categories[3],
                    description: "Null",
                };
                itemsLength++;
                console.log('Navigating to:', fwrdLink);
                let url = await browser.newPage();
                await url.goto(fwrdLink, { waitUntil: 'networkidle0' });
                try {
                    item.description = await url.evaluate(() => {
                        return document.querySelector(".pdp-details").textContent.trim().replace(/\n/g, " ").replace(/\s\s+/g, " ");
                    });
                } catch (error) { }
    
                if (!firstItem) {
                    fs.appendFileSync('data.json', ',');
                }
                firstItem = false;
    
                fs.appendFileSync('data.json', JSON.stringify(item, null, 2));
                await url.close();
            }
        }
    }

    let isBtnDisabled = false;

    while (!isBtnDisabled) {

        await scrapePage();

        const nextButtonDisabled = (await page.$('span.icon--arrow-right--lg')) === null;
        isBtnDisabled = nextButtonDisabled;
        if (isBtnDisabled == true) { break }

        // if the page num is 3, break the loop
        if (itemslength >= 100) {
            break;
        }

        await Promise.all([
            page.click('span.icon--arrow-right--lg'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
        // isBtnDisabled = true;

    }
    await browser.close();
    fs.appendFileSync('data.json', ']');
})();

