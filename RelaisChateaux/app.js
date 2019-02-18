var fs = require("fs");

var properties = require("./PropertiesList.json");
var starredRestaurant = require("./StarredRestaurantList.json");
var JsonFile = [];


(async function mergePropertiesrestaurant() {
    try{
        for (var i = 0; i < properties.length; i++) {
            for (var j = 0; j < starredRestaurant.length; j++) {
                if (properties[i].Propertyname === starredRestaurant[j].RestaurantName) {
                    JsonFile.push(properties[i]);
                }
            }
        }

        fs.writeFileSync("PropertiesWithStarredRestaurant.json", JSON.stringify(JsonFile));
        console.log('JSON complete !');
    }
    catch(e){
        console.log(e);
    }
  
})();