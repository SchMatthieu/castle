const puppeteer = require('puppeteer');
const fs = require('fs');

(async function scrapingMichelin2() {
	const extractRestaurants = async (url) => {
		//Scrape the data
		const page = await browser.newPage();
		await page.goto(url);
		console.log('Current url: ' + url);

		//await page.waitForSelector('ul.poi-search-result');
		const restaurants = await page.$$('ul.poi-search-result > li');
		const restaurantsOnPage = [];

		for (let i = 0; i < restaurants.length; i++) {
			await page.goto(url);
			//await page.waitForSelector('ul.poi-search-result');

			const restaurants = await page.$$('ul.poi-search-result > li');
			const restaurant = restaurants[i];

            const restaurantName = await restaurant.$eval('.poi_card-display-title', (title) => title.innerText);
            var stars = 'N/A';
			if(await restaurant.$('span.icon-cotation1etoile') != null) stars = 1;
			if(await restaurant.$('span.icon-cotation2etoiles') != null) stars = 2;
			if(await restaurant.$('span.icon-cotation3etoiles') != null) stars = 3;

			const imgLink = await restaurant.$('.poi_card-picture');
			imgLink.click();

			await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
			const chef = await page.evaluate(() => {
				if (document.querySelector('div.field.field--name-field-chef.field--type-text.field--label-above > div.field__items > div.field__item.even') != null) {
					return document.querySelector('div.field.field--name-field-chef.field--type-text.field--label-above > div.field__items > div.field__item.even').innerText;
				} else {
					return 'N/A';
				}
			});

			restaurantsOnPage.push({ RestaurantName: restaurantName, Chef: chef, Stars: stars });
		}
		await page.close();

		//Recursively scrape the next page
		if (restaurantsOnPage.length < 1) {
			console.log('Terminate..');
			return restaurantsOnPage;
		} else {
			const nextPageNumber = parseInt(url.match(/page-(\d+)$/)[1], 10) + 1;
			const nextUrl = `https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-${nextPageNumber}`;
			return restaurantsOnPage.concat(await extractRestaurants(nextUrl));
		}
	};

	const browser = await puppeteer.launch({ headless: true });
	const firstUrl =
		'https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-1';
	const starredRestaurants = await extractRestaurants(firstUrl);

	fs.writeFileSync('StarredRestaurantList.json', JSON.stringify(starredRestaurants));
	console.log('JSON complete !');

	await browser.close();
})();