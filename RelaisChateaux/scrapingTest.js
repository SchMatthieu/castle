/*--------------------Request, Cheerio, Jsonframe-cheerio----------------*/
var request = require('request');
var cheerio = require('cheerio');
var jsonframe = require('jsonframe-cheerio');

//var $ = cheerio.load('https://www.relaischateaux.com/us/destinations/europe/france');
//jsonframe($);

var frame = {
	hotels: {
		_s: '.hotelQuickView.horizontalQuickView',
		_d: [
			{
				category:
					'.body.destination.no-locale-popin:nth-child(2) div.overmapWrap.fullmap-container.js-done:nth-child(11) div.full-overmap:nth-child(5) div.overmapContent div.innerOvermapContent div.hotelQuickView.horizontalQuickView:nth-child(3) div.row.no-gutter div.col-1-2.collapse-m:nth-child(1) div.defaultSlider.js-done.slick-initialized.slick-slider div.slick-list.draggable div.slick-track div.slick-slide.slick-active:nth-child(1) div.category.categoryLeft > span:nth-child(1)',
				name:
					'.mainTitbody.destination.no-locale-popin:nth-child(2) div.overmapWrap.fullmap-container.js-done:nth-child(11) div.full-overmap:nth-child(5) div.overmapContent div.innerOvermapContent div.hotelQuickView.horizontalQuickView:nth-child(3) div.row.no-gutter div.col-1-2.collapse-m:nth-child(2) h3.mainTitle3.fzMedium.cGrey.noVerticalMargin a:nth-child(1) > span:nth-child(1)le3 [itemprop=name]',
				price: {
					currency:
						'.body.destination.no-locale-popin:nth-child(2) div.overmapWrap.fullmap-container.js-done:nth-child(11) div.full-overmap:nth-child(5) div.overmapContent div.innerOvermapContent div.hotelQuickView.horizontalQuickView:nth-child(3) div.row.no-gutter div.col-1-2.collapse-m:nth-child(2) div.priceTag div.tag.tagLight span.price > span.currency',
					price:
						'.body.destination.no-locale-popin:nth-child(2) div.overmapWrap.fullmap-container.js-done:nth-child(11) div.full-overmap:nth-child(5) div.overmapContent div.innerOvermapContent div.hotelQuickView.horizontalQuickView:nth-child(3) div.row.no-gutter div.col-1-2.collapse-m:nth-child(2) div.priceTag div.tag.tagLight span.price > span.price'
				}
			}
		]
	}
};
var frame1 = {
	properties: 'script'
};

request({ uri: 'https://www.relaischateaux.com/us/destinations/europe/france' }, function(error, response, body) {
	if (!error && response == 200) {
		var $ = cheerio.load(body);

		//var properties = $("body div.overmapWrap > script[type='text/javascript']");

		var hotelQuickView = $(
			'body div.overmapWrap .full-overmap .overmapContent .innerOvermapContent #destinationResults .hotelQuickView'
		);

		//$("body div.overmapWrap .full-overmap .overmapContent .innerOvermapContent #destinationResults .hotelQuickView").each(function(element){
		//    var hotel = $(element).html();

		//    console.log(hotel)
		//})

		//console.log(properties.html());
		console.log(hotelQuickView.html());
	}
});
/*
jsonframe($);
var propertiesList = $('div .overmapWrap').scrape(frame1, {string : true});
console.log(propertiesList);
*/

/*------------------Puppeteer------------------*/

const puppeteer = require('puppeteer');

async function getPic() {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto('https://www.relaischateaux.com/us/destinations/europe/france');
	await page.setViewport({ width: 1000, height: 500 });
	await page.screenshot({ path: 'relaischateaux.png' });

	await browser.close();
}

let scrape = async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	await page.goto('https://www.relaischateaux.com/us/destinations/europe/france', { timeout: 100000 });

	/*
    const properties = [];

    const hotels = await page.$$('.hotelQuickView');

    while(await page.$('.navigation > .pagination .next > a') !== null){
        console.log('0');
        hotels.forEach(function(hotel){
            console.log('1');
            let hotelType = hotel.$('.category > span').innerText;
            let hotelName = hotel.$('.mainTitle3 > a > span').innerText;
            let hotelPrice = hotel.$('.priceTag span.price > span.price');
            if(hotel.$('.priceTag span.price > span.price') == null){
                hotelPrice = 'No price found';
            }
            else{
                hotelPrice = hotel.$('.priceTag span.price > span.price').innerText;
            }
                
            properties.push({hotelName, hotelType, hotelPrice});
        })

        await page.click('.navigation > .pagination .next > a');
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    */

	const result = await page.evaluate(() => {
		let properties = [];
		document.querySelectorAll('.hotelQuickView').forEach(function(result) {
			let hotelType = result.querySelector('.category > span').innerText;
			let hotelName = result.querySelector('.mainTitle3 > a > span').innerText;
			let hotelPrice = result.querySelector('.priceTag span.price > span.price');
			if (result.querySelector('.priceTag span.price > span.price') == null) {
				hotelPrice = 'No price found';
			} else {
				hotelPrice = result.querySelector('.priceTag span.price > span.price').innerText;
			}

			properties.push({ hotelName, hotelType, hotelPrice });
		});

		return properties;
	});

	//await page.click('.navigation > .pagination .next > a');
	//await page.click('#destinationResults > div:nth-child(22) > div > div:nth-child(2) > h3 > a > span');
	//await page.waitFor(10000);

	browser.close();
	return result;
};
/*
scrape().then((value) => {
	console.log(value); // Success!
});
*/

//getPic();

//----------------------Puppeteer test----------------------//
const fs = require('fs');

(async function scrapingTest() {
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

		fs.writeFileSync('PropertiesListTest.json', JSON.stringify(properties));
		console.log('JSON complete !');

		await browser.close();
	} catch (e) {
		console.log(e);
	}
})();

async function scrapingTest2() {
	const extractRestaurants = async (url) => {
		//Scrape the data
		const page = await browser.newPage();
		await page.goto(url);
		console.log('Current url: ' + url);

		await page.waitForSelector('#destinationResults');
		const properties = await page.$$('.hotelQuickView');
		const propertiesOnPage = [];

		for (let i = 0; i < properties.length; i++) {
			await page.goto(url);

			await page.waitFor(2000);

			const properties = await page.$$('.hotelQuickView');
			const propertie = properties[i];

			const propertieName = await propertie.$eval('h3 > a > span', (span) => span.innerText);
			const propertieType = await propertie.$eval('div.category.categoryLeft > span', (span) => span.innerText);
			const propertieLocality = await propertie.$eval('h4 > span', (span) => span.innerText);
			const propertieLink = await propertie.$eval('h3 > a', (a) => a.href);
			var propertieRatings = 'N/A';
			if(await propertie.$('div.tripAdvisorRating > img') != null){
				propertieRatings = await propertie.$eval('div.tripAdvisorRating > img', (img) => img.title.match(/-\s(\d(.\d)?)/)[1]);
			}
			var propertiePrice = 'N/A';
			if(await propertie.$('div.tag.tagLight > span > span.price') != null){
				propertiePrice = await propertie.$eval('div.tag.tagLight > span > span.price', (span) => span.innerText);
			}

			const h3Link = await propertie.$('h3 > a');
			h3Link.click();
			await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

			var chef = 'N/A';
			if(propertieType == 'Hotel + Restaurant'){
				const chefLink = await page.evaluate(() => {
					return document.querySelector('body > div.jsSecondNav.will-stick > ul > li:nth-child(2) > a').href;
				})
				await page.goto(chefLink);
				await page.waitFor(1000);

				chef = await page.evaluate(() => {
					if (document.querySelector('#restaurant-chief > h4') != null) {
						return document.querySelector('#restaurant-chief > h4').innerText.replace('\nChef', '');
					}
				});
			} else {
				chef = await page.evaluate(() => {
					if (document.querySelector('#restaurant-chief > h4') != null) {
						return document.querySelector('#restaurant-chief > h4').innerText.replace('\nChef', '');
					}
				});
			}

			propertiesOnPage.push({ PropertieName: propertieName, Type: propertieType, Locality: propertieLocality, Ratings: propertieRatings, Price: propertiePrice, Chef: chef, Link: propertieLink });
		}
		await page.close();

		//Recursively scrape the next page
		if (propertiesOnPage.length < 1) {
			console.log('Terminate..');
			return propertiesOnPage;
		} else {
			const nextPageNumber = parseInt(url.match(/page-(\d+)$/)[1], 10) + 1;
			const nextUrl = `https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-${nextPageNumber}`;
			console.log(propertiesOnPage);
			return propertiesOnPage.concat(await extractRestaurants(nextUrl));
		}
	};

	const browser = await puppeteer.launch({ headless: true });
	const firstUrl =
		'https://www.relaischateaux.com/us/update-destination-results?page=1';
	const properties = await extractRestaurants(firstUrl);

	fs.writeFileSync('PropertiesListTest.json', JSON.stringify(properties));
	console.log('JSON complete !');

	await browser.close();
}

async function scrapingTest3() {
	try {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();

		await page.goto(
			'https://www.relaischateaux.com/us/france/basrupts-vosges-gerardmer'
		);
		
		await page.click('body > div.jsSecondNav.will-stick > ul > li:nth-child(2) > a');
		await page.waitFor(5000);

		await browser.close();
	} catch (e) {
		console.log(e);
	}
}

async function scrapingTest4() {
	try {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();

		await page.goto(
			'https://www.relaischateaux.com/us/destinations/europe/france'
		);

		await page.waitForSelector('#destinationResults');
		const hotels = await page.$$('.hotelQuickView');

		for (let i = 0; i < hotels.length; i++) {
			await page.goto(
				'https://www.relaischateaux.com/us/destinations/europe/france'
			);

			await page.waitFor(2000);
			//await page.waitForSelector('.hotelQuickView');

			const hotels = await page.$$('.hotelQuickView');
			const hotel = hotels[i];

			const hotelName = await hotel.$eval('h3 > a > span', (span) => span.innerText);
			const hotelType = await hotel.$eval('div.category.categoryLeft > span', (span) => span.innerText);
			const hotelLocality = await hotel.$eval('h4 > span', (span) => span.innerText);
			const hotelLink = await hotel.$eval('h3 > a', (a) => a.href);
			var hotelRating = 'N/A';
			if(await hotel.$('div.tripAdvisorRating > img') != null){
				hotelRating = await hotel.$eval('div.tripAdvisorRating > img', (img) => img.title.match(/-\s(\d(.\d)?)/)[1]);
			}
			var hotelPrice = 'N/A';
			if(await hotel.$('div.tag.tagLight > span > span.price') != null){
				hotelPrice = await hotel.$eval('div.tag.tagLight > span > span.price', (span) => span.innerText);
			}

			const h3Link = await hotel.$('h3 > a');
			h3Link.click();
			//await page.waitFor(2000);
			await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
			//console.log(`Url ${i} visited for ${hotelName}: ${hotelType}`);

			var chef = 'N/A';
			if(hotelType == 'Hotel + Restaurant'){
				const chefLink = await page.evaluate(() => {
					return document.querySelector('body > div.jsSecondNav.will-stick > ul > li:nth-child(2) > a').href;
				})
				await page.goto(chefLink);
				await page.waitFor(1000);

				chef = await page.evaluate(() => {
					if (document.querySelector('#restaurant-chief > h4') != null) {
						return document.querySelector('#restaurant-chief > h4').innerText.replace('\nChef', '');
					}
				});
			} else {
				chef = await page.evaluate(() => {
					if (document.querySelector('#restaurant-chief > h4') != null) {
						return document.querySelector('#restaurant-chief > h4').innerText.replace('\nChef', '');
					}
				});
			}

			console.log(hotelName + ': ' + hotelType + ', ' + hotelLocality + ', ' + hotelRating + ', ' + hotelPrice + ', ' + hotelLink + ', ' + chef);
		}

		var url_pages = [2, 4, 5, 6, 7, 7, 8];
        for (let i = 0; i < 7; i++){
			await page.waitForSelector('#destPagination > .pagination > li:nth-child(' + url_pages[i] + ') > a');
			await page.click('#destPagination > .pagination > li:nth-child(' + url_pages[i] + ') > a');
			
			await page.waitForSelector('#destinationResults');
			const hotels = await page.$$('.hotelQuickView');

			for (let j = 0; j < hotels.length; j++) {
				await page.goto(
					'https://www.relaischateaux.com/us/destinations/europe/france'
				);

				await page.waitFor(2000);
				//await page.waitForSelector('.hotelQuickView');

				const hotels = await page.$$('.hotelQuickView');
				const hotel = hotels[j];

				const hotelName = await hotel.$eval('h3 > a > span', (span) => span.innerText);
				const hotelType = await hotel.$eval('div.category.categoryLeft > span', (span) => span.innerText);
				const hotelLocality = await hotel.$eval('h4 > span', (span) => span.innerText);
				const hotelLink = await hotel.$eval('h3 > a', (a) => a.href);
				var hotelRating = 'N/A';
				if(await hotel.$('div.tripAdvisorRating > img') != null){
					hotelRating = await hotel.$eval('div.tripAdvisorRating > img', (img) => img.title.match(/-\s(\d(.\d)?)/)[1]);
				}
				var hotelPrice = 'N/A';
				if(await hotel.$('div.tag.tagLight > span > span.price') != null){
					hotelPrice = await hotel.$eval('div.tag.tagLight > span > span.price', (span) => span.innerText);
				}

				const h3Link = await hotel.$('h3 > a');
				h3Link.click();
				//await page.waitFor(2000);
				await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
				//console.log(`Url ${i} visited for ${hotelName}: ${hotelType}`);

				var chefLinks = [];
				if(hotelType == 'Hotel + Restaurant'){
					chefLinks.push(await page.evaluate(() => {
						return document.querySelector('body > div.jsSecondNav.will-stick > ul > li:nth-child(2) > a').href;
					}))
				} else {
					chefLinks.push(propertieLink);
				}
				await page.goBack({ waitUntil: 'domcontentloaded' })

				console.log(hotelName + ': ' + hotelType + ', ' + hotelLocality + ', ' + hotelRating + ', ' + hotelPrice + ', ' + hotelLink + ', ' + chef);
			}
		}
		await browser.close();
	} catch (e) {
		console.log(e);
	}
}