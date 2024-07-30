import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: "./tmp",
        defaultViewport: false
    });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://www.fwrd.com/category-shoes/3f40a9/?navsrc=main&pageNum=1', { waitUntil: 'networkidle0' });

    let items = [];

    const scrapePage = async () => {
        // Wait for the products grid to load
        await page.waitForSelector('.product-grids__link');

        const fwrdHandles = await page.$$('.product-grids__link');

        for (const fwrdHandle of fwrdHandles) {
            let fwrdBrand = "Null";
            let fwrdTitle = "Null";
            let fwrdPrice = "Null";
            let fwrdImage = "Null";

            try {
                fwrdBrand = await page.evaluate(e1 => e1.querySelector(".product-grids__copy-item.js-plp-brand").textContent, fwrdHandle);
            } catch (error) { }

            try {
                fwrdTitle = await page.evaluate(e1 => e1.querySelector(".product-grids__copy-item.js-plp-name").textContent, fwrdHandle);
            } catch (error) { }
            try {
                fwrdPrice = await page.evaluate(e1 => e1.querySelector(".price__sale")?.textContent || e1.querySelector(".js-plp-price-retail").textContent, fwrdHandle);
            } catch (error) { }
            try {
                fwrdImage = await page.evaluate(e1 => e1.querySelector(".product__image-alt-view").getAttribute("src"), fwrdHandle);
            } catch (error) { }

            if (fwrdTitle !== "Null" && fwrdPrice !== "Null" && fwrdImage !== "Null" && fwrdBrand !== "Null") {
                items.push({ brand: fwrdBrand, title: fwrdTitle, price: fwrdPrice, image: fwrdImage });
                fs.appendFile(
                    "result.csv",
                    `${fwrdBrand},${fwrdTitle},${fwrdPrice},${fwrdImage}\n`,
                    function (err) {
                        if (err) throw err;
                    }
                )
            }
        }
        return items.length
    };
    let isBtnDisabled = false;

    while (!isBtnDisabled) {
        
        // await autoScroll(page);
        await scrapePage();

        const nextButtonDisabled = (await page.$('span.icon--arrow-right--lg')) === null;
        isBtnDisabled = nextButtonDisabled;
        if (isBtnDisabled == true) {break}
        // if the page num is 3, break the loop
        if (items.length >= 100) {
            break;
        }
        await Promise.all([
            page.click('span.icon--arrow-right--lg'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        // console.log(nextButtonDisabled);
        // console.log(isBtnDisabled);
    }

    
    // console.log(items);
    console.log(items.length);


})();

