/*--------------------Request, Cheerio, Jsonframe-cheerio----------------*/
var request =  require("request");
var cheerio = require('cheerio');
var jsonframe = require('jsonframe-cheerio');

//var $ = cheerio.load('https://www.relaischateaux.com/us/destinations/europe/france');
//jsonframe($);

var frame = {
    "hotels" : {
        _s : ".hotelQuickView.horizontalQuickView",
        _d : [{
            "category" : ".body.destination.no-locale-popin:nth-child(2) div.overmapWrap.fullmap-container.js-done:nth-child(11) div.full-overmap:nth-child(5) div.overmapContent div.innerOvermapContent div.hotelQuickView.horizontalQuickView:nth-child(3) div.row.no-gutter div.col-1-2.collapse-m:nth-child(1) div.defaultSlider.js-done.slick-initialized.slick-slider div.slick-list.draggable div.slick-track div.slick-slide.slick-active:nth-child(1) div.category.categoryLeft > span:nth-child(1)",
            "name" : ".mainTitbody.destination.no-locale-popin:nth-child(2) div.overmapWrap.fullmap-container.js-done:nth-child(11) div.full-overmap:nth-child(5) div.overmapContent div.innerOvermapContent div.hotelQuickView.horizontalQuickView:nth-child(3) div.row.no-gutter div.col-1-2.collapse-m:nth-child(2) h3.mainTitle3.fzMedium.cGrey.noVerticalMargin a:nth-child(1) > span:nth-child(1)le3 [itemprop=name]",
            "price" : {
                
                "currency" : ".body.destination.no-locale-popin:nth-child(2) div.overmapWrap.fullmap-container.js-done:nth-child(11) div.full-overmap:nth-child(5) div.overmapContent div.innerOvermapContent div.hotelQuickView.horizontalQuickView:nth-child(3) div.row.no-gutter div.col-1-2.collapse-m:nth-child(2) div.priceTag div.tag.tagLight span.price > span.currency",
                "price" : ".body.destination.no-locale-popin:nth-child(2) div.overmapWrap.fullmap-container.js-done:nth-child(11) div.full-overmap:nth-child(5) div.overmapContent div.innerOvermapContent div.hotelQuickView.horizontalQuickView:nth-child(3) div.row.no-gutter div.col-1-2.collapse-m:nth-child(2) div.priceTag div.tag.tagLight span.price > span.price"
            }
        }]
    }
};
var frame1 =  {
    "properties" : "script"
};

request({uri: 'https://www.relaischateaux.com/us/destinations/europe/france'}, function(error, response, body){
    if(!error && response == 200){
    var $ = cheerio.load(body);
    
    //var properties = $("body div.overmapWrap > script[type='text/javascript']");

    var hotelQuickView = $("body div.overmapWrap .full-overmap .overmapContent .innerOvermapContent #destinationResults .hotelQuickView")

    //$("body div.overmapWrap .full-overmap .overmapContent .innerOvermapContent #destinationResults .hotelQuickView").each(function(element){
    //    var hotel = $(element).html();

    //    console.log(hotel)
    //})

    //console.log(properties.html());
    console.log(hotelQuickView.html());
    }
})
/*
jsonframe($);
var propertiesList = $('div .overmapWrap').scrape(frame1, {string : true});
console.log(propertiesList);
*/

/*------------------Puppeteer------------------*/

const puppeteer = require('puppeteer');

async function getPic() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.relaischateaux.com/us/destinations/europe/france');
  await page.setViewport({width: 1000, height: 500})
  await page.screenshot({path: 'relaischateaux.png'});

  await browser.close();
}

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.relaischateaux.com/us/destinations/europe/france', {timeout : 100000});

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
        document.querySelectorAll('.hotelQuickView').forEach(function(result){
            let hotelType = result.querySelector('.category > span').innerText;
            let hotelName = result.querySelector('.mainTitle3 > a > span').innerText;
            let hotelPrice = result.querySelector('.priceTag span.price > span.price');
            if(result.querySelector('.priceTag span.price > span.price') == null){
                hotelPrice = 'No price found';
            }
            else{
                hotelPrice = result.querySelector('.priceTag span.price > span.price').innerText;
            }
            
            properties.push({hotelName, hotelType, hotelPrice});
        })

        return properties;
    })
    
    //await page.click('.navigation > .pagination .next > a');
    //await page.click('#destinationResults > div:nth-child(22) > div > div:nth-child(2) > h3 > a > span');
    //await page.waitFor(10000);
    
    browser.close();
    return result;
  };
  
  scrape().then((value) => {
      console.log(value); // Success!
  });

//getPic();