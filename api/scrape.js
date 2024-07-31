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
    await page.goto('https://www.fwrd.com/category-clothing/3699fc/?navsrc=main', { waitUntil: 'networkidle0' });

    let items = [];
    let itemId = 0;

    const scrapePage = async () => {
        // Wait for the products grid to load
        await page.waitForSelector('.product-grids__link');

        const fwrdHandles = await page.$$('.product-grids__link');

        for (const fwrdHandle of fwrdHandles) {
            let fwrdBrand = "Null";
            let fwrdTitle = "Null";
            let fwrdPrice = "Null";
            let fwrdImage = "Null";
            let fwrdLink = "Null";

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
                fwrdImage = await page.evaluate(e1 => e1.querySelector(".product__image-main-view").getAttribute("src"), fwrdHandle);
            } catch (error) { }
            try {
                fwrdLink = await page.evaluate(e1 => e1.querySelector(".js-plp-pdp-link").getAttribute("href"), fwrdHandle);
            } catch (error) { }
            if (fwrdTitle !== "Null" && fwrdPrice !== "Null" && fwrdImage !== "Null" && fwrdBrand !== "Null") {
                itemId++;
                items.push({id: itemId, category: "women", brand: fwrdBrand, title: fwrdTitle, price: fwrdPrice, image: fwrdImage });
                fs.appendFile(
                    "result.csv",
                    `${itemId},women,${fwrdBrand},${fwrdTitle},${fwrdPrice.replace(/,/g, "")},${fwrdImage},https://www.fwrd.com${fwrdLink}\n`,
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
    }

    // Close the browser
    await browser.close();
    


})();


