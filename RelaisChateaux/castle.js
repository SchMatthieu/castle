const puppeteer = require('puppeteer');
var fs = require('fs');

var JsonFile = [];

(async function main() {
    try {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()

        await page.goto('https://www.relaischateaux.com/us/destinations/europe/france')
        await page.setViewport({ width: 1440, height: 752 })

        await page.waitForSelector('.hotelQuickView');

        const hotels = await page.$$('.hotelQuickView'); //$$ = querySelectorAll, we're selecting every .hotelQuickView in the page

        for (const hotel of hotels) {
            const link = await hotel.$$eval('.mainTitle3 > a ', as => as.map(a => a.href));
            const name = await hotel.$eval('h3 > a > span', span => span.innerText);
            const type = await hotel.$eval('span', span => span.innerText);
            var price = -1;
            if (await hotel.$('span.price > span.price') !== null) {
                price = await hotel.$eval('span.price > span.price', span => span.innerText);
            }
            if (type === "Hotel + Restaurant") {
                console.log('{"PropertyName":"' + name + '",' + '"Link":"' + link + '",' + '"Type":"' + type + '",' + '"Price":"' + price + '"}');
                JsonFile.push({ "PropertyName": name, "Link": link, "Type ": type,"Price":price })
            }
        }
            
        var url_pages = [2, 4, 5, 6, 7, 7, 8];
        for (var i = 0; i < 7; i++) {
            await page.waitForSelector('#destPagination > .pagination > li:nth-child(' + url_pages[i] + ') > a');
            await page.click('#destPagination > .pagination > li:nth-child(' + url_pages[i] + ') > a');
            
            await page.waitFor(2000);
            await page.waitForSelector('.hotelQuickView');

            const hotels = await page.$$('.hotelQuickView');

            for (const hotel of hotels) {
                const link = await hotel.$$eval('.mainTitle3 > a ', as => as.map(a => a.href));
                const name = await hotel.$eval('h3 > a > span', span => span.innerText);
                const type = await hotel.$eval('span', span => span.innerText);
                var price = -1;
                if (await hotel.$('span.price > span.price') !== null) {
                    price = await hotel.$eval('span.price > span.price', span => span.innerText);
                }
                if (type === "Hotel + Restaurant") {
                    console.log('{"PropertyName":"' + name + '",' + '"Link":"' + link + '",' + '"Type":"' + type + '",' + '"Price":"' + price + '"}');
                    JsonFile.push({ "PropertyName": name, "Link": link, "Type ": type,"Price":price })
                }
            }
        }

        fs.writeFileSync("PropertiesList.json", JSON.stringify(JsonFile));
        console.log('JSON complete !');
    }
    catch (e) {
        console.log(e); 
    }
})();

