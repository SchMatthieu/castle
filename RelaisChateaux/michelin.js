const puppeteer = require('puppeteer');
const fs = require('fs');

var JsonFile = [];

(async function main() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.setViewport({ width: 1440, height: 752 });
        await page.goto('https://restaurant.michelin.fr/magazine/les-restaurants-etoiles-du-guide-michelin-2018');

        const restaurants = await page.$$('p ');

        for (const restaurant of restaurants) {
            if(await restaurant.$('strong')!==null)
            {
                const name = await restaurant.$eval('strong', span => span.innerText);
                console.log('{"RestaurantName":"' + name + '"}');
                JsonFile.push({"RestaurantName" : name})
            }
        }
        /*
        await page.goto('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin');

        const restaurants = await page.$$('.ds-1col');

        for (const restaurant of restaurants) {
            const name = await restaurant.$eval('.poi_card-display-title', div => div.innerText);
            console.log('{"RestaurantName":"' + name + '"}');
            JsonFile.push({"RestaurantName" : name})
        }

        for(var i = 2; i < 35; i++){
            //await page.waitForSelector('.mr-pager-item.last');
            //await page.click('.mr-pager-item.last');
            await page.goto('https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-' + i)

            await page.waitFor(2000);
            await page.waitForSelector('.ds-1col');

            const restaurants = await page.$$('.ds-1col');

            for (const restaurant of restaurants) {
                const name = await restaurant.$eval('.poi_card-display-title', div => div.innerText);
                console.log('{"RestaurantName":"' + name + '"}');
                JsonFile.push({"RestaurantName" : name})
            }
        }
        */
        
        fs.writeFileSync("StarredRestaurantList.json", JSON.stringify(JsonFile));
        console.log('JSON complete !');
    }
    catch(e){
        console.log(e);
    }
})();