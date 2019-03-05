const puppeteer = require('puppeteer');
var fs = require('fs');

(async function scrapingCastle() {
	try {
		const properties = [];

		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		await page.goto(
			'https://www.relaischateaux.com/us/site-map/etablissements'
		);

		await page.waitForSelector('#countryF > ul');
		const hotels = await page.$$('#countryF > ul > li');

		for (let i = 1; i < hotels.length - 1; i++) {
			await page.goto(
				'https://www.relaischateaux.com/us/site-map/etablissements'
			);

			const hotels = await page.$$('#countryF > ul > li');
			const hotel = hotels[i];

			const hotelName = await hotel.$eval('a:nth-child(1)', (a) => a.innerText.trim());
			var chef = 'N/A'
			if(await hotel.$('a:nth-child(2)') != null){
				chef = await hotel.$eval('a:nth-child(2)', (a) => a.innerText.replace('Chef -', '').trim());
			}
			const hotelLink = await hotel.$eval('a:nth-child(1)', (a) => a.href);

			const link = await hotel.$('a:nth-child(1)');
			link.click();
			await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

			const hotelPrice = await page.evaluate(() => {
				if (document.querySelector('div.innerHotelHeader > div > div > span.price') != null) {
					return document.querySelector('div.innerHotelHeader > div > div > span.price').innerText;
				} else {
					return 'N/A';
				}
			});
			const hotelRatings = await page.evaluate(() => {
				if (document.querySelector('div.tripAdvisorRating > img:nth-child(1)') != null) {
					return document.querySelector('div.tripAdvisorRating > img:nth-child(1)').title.match(/-\s(\d(.\d)?)/)[1];
				} else {
					return 'N/A';
				}
			});
			const hotelType = await page.evaluate(() => {
				if(document.querySelector('ul.jsSecondNavMain > li.active > a > span').innerText == 'Hotel' && document.querySelector('ul.jsSecondNavMain > li:nth-child(2) > a > span').innerText == 'Restaurant'){
					return 'Hotel + Restaurant';
				} else {
					return document.querySelector('ul.jsSecondNavMain > li.active > a > span').innerText
				}
			});
			const hotelLocality = await page.evaluate(() => {
				if (document.querySelector('h2 > span:nth-child(2)') != null) {
					return document.querySelector('h2 > span:nth-child(2)').innerText;
				} else {
					return 'N/A';
				}
			});

			properties.push({ PropertieName: hotelName, Locality: hotelLocality, Type: hotelType, Chef: chef, Ratings: hotelRatings, Price: hotelPrice, Link: hotelLink })
			console.log(hotelName + ': ' + chef + ' | ' + hotelLink + ' | ' + hotelPrice + ' | ' + hotelRatings + ' | ' + hotelType + ' | ' + hotelLocality);
		}

		fs.writeFileSync('PropertiesList.json', JSON.stringify(properties));
		console.log('JSON complete !');

		await browser.close();
	} catch (e) {
		console.log(e);
	}
})();

async function main() {
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
                console.log('{"PropertyName":"' + name.trim() + '",' + '"Link":"' + link + '",' + '"Type":"' + type + '",' + '"Price":"' + price + '"}');
                JsonFile.push({ "PropertyName": name.trim(), "Link": link, "Type ": type,"Price":price })
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
                    console.log('{"PropertyName":"' + name.trim() + '",' + '"Link":"' + link + '",' + '"Type":"' + type + '",' + '"Price":"' + price + '"}');
                    JsonFile.push({ "PropertyName": name.trim(), "Link": link, "Type ": type,"Price":price })
                }
            }
        }

        fs.writeFileSync("PropertiesList.json", JSON.stringify(JsonFile));
        console.log('JSON complete !');
    }
    catch (e) {
        console.log(e); 
    }
}

