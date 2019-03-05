var fs = require("fs");

var properties = require("./PropertiesList.json");
var starredRestaurant = require("./StarredRestaurantList.json");
var JsonFile = [];


(async function mergePropertiesRestaurant() {
    try{
        for (var i = 0; i < properties.length; i++) {
            for (var j = 0; j < starredRestaurant.length; j++) {
                if (properties[i].Chef.toLowerCase() === starredRestaurant[j].Chef.toLowerCase()) {
                    JsonFile.push({
                        PropertieName: properties[i].PropertieName,
                        Locality: properties[i].Locality,
                        Price: properties[i].Price,
                        Stars: starredRestaurant[j].Stars,
                        Ratings: properties[i].Ratings,
                        Link: properties[i].Link
                    });
                    break;
                }
            }
        }
        /*
        console.log(properties.length)
        console.log(starredRestaurant.length)
        console.log(JsonFile.length)
        */

        fs.writeFileSync("PropertiesWithStarredRestaurant.json", JSON.stringify(JsonFile));
        console.log('JSON complete !');
    }
    catch(e){
        console.log(e);
    }
  
})();