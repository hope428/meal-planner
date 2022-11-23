var baseCocktailurl = 'https://www.thecocktaildb.com/api/json/v1/1/'

//gets random cocktail id
function getCocktail(){
    fetch(baseCocktailurl + 'random.php').then(function(response){
        return response.json()
    }).then(function(data){
        var drink = data.drinks[0]
        var drinkId = drink.idDrink
        getCocktailInformation(drinkId)
        console.log(drinkId)
    })
}

function getCocktailInformation(drinkId) {
    fetch(baseCocktailurl + '/lookup.php?i=' + drinkId)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        var drink = data.drinks[0]
        var drinkObj = {
            id: drink.idDrink,
            name: drink.strDrink,
            ingredients: [],
        }
        //gets list of drink ingredents
        for (let i = 1; i <= 15; i++) {
            var ingredient = "strIngredient" + i;
            if (drink[ingredient]) {
              drinkObj.ingredients.push(drink[ingredient]);
            }
          }
          console.log(drinkObj)
    })
}

getCocktail()