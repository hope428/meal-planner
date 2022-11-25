var baseCocktailurl = "https://www.thecocktaildb.com/api/json/v1/1/";
var baseMealUrl = "https://www.themealdb.com/api/json/v1/1/";

//cocktail api functions
// ---------------------- //
//gets random cocktail id
function getCocktail(alcoholic) {
  fetch(baseCocktailurl + "filter.php?a=" + alcoholic)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //gets random drink
      var drink = data.drinks[Math.floor(Math.random() * data.drinks.length)];
      var drinkId = drink.idDrink;
      getCocktailInformation(drinkId);
    });
}

//creates cocktail object from cocktail id
function getCocktailInformation(drinkId) {
  fetch(baseCocktailurl + "/lookup.php?i=" + drinkId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var drink = data.drinks[0];
      var drinkObj = {
        id: drink.idDrink,
        name: drink.strDrink,
        ingredientMeasurements: [],
        ingredients: [],
        steps: drink.strInstructions,
        imgSrc: drink.strDrinkThumb,
      };
      //gets list of drink ingredents
      for (let i = 1; i <= 15; i++) {
        var ingredient = "strIngredient" + i;
        if (drink[ingredient]) {
          drinkObj.ingredients.push(drink[ingredient]);
        }
      }
      //gets list of ingredient measurements
      for (let i = 1; i <= 15; i++) {
        var measurement = "strMeasure" + i;
        if (drink[measurement]) {
          drinkObj.ingredientMeasurements.push(drink[measurement]);
        }
      }
      //call render function with (drinkObj) as parameter
      console.log(drinkObj);
    });
}

//executed on button click.
//value of Alcoholic or Non_Alcoholic should be passed in
getCocktail("Non_Alcoholic");

//meal api functions
// ---------------------- //

//dessert or main dish can be retrieved with this function
//for dessert pass in "Dessert" as the type
function getFoodItemId(type) {
  //fetches data for if type is entered
  fetch(baseMealUrl + "filter.php?c=" + type)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.meals) {
        var item = data.meals[Math.floor(Math.random() * data.meals.length)];
        getFoodObject(item.idMeal);
      } else {
        //fetches data for if area is entered
        fetch(baseMealUrl + "filter.php?a=" + type)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            var item =
              data.meals[Math.floor(Math.random() * data.meals.length)];
            console.log(item.strMeal);
          });
      }
    });
}

//creates meal or dessert object from id
function getFoodObject(foodItemId) {
  fetch(baseMealUrl + "lookup.php?i=" + foodItemId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var food = data.meals[0];
      var foodObj = {
        id: food.idMeal,
        name: food.strMeal,
        ingredientMeasurements: [],
        ingredients: [],
        steps: food.strInstructions,
        imgSrc: food.strMealThumb,
      }
      //get list of food ingredients
      for (let i = 1; i <= 15; i++) {
        var ingredient = "strIngredient" + i;
        if (food[ingredient]) {
          foodObj.ingredients.push(food[ingredient]);
        }
      }
      //gets list of ingredient measurements
      for (let i = 1; i <= 15; i++) {
        var measurement = "strMeasure" + i;
        if (food[measurement]) {
          foodObj.ingredientMeasurements.push(food[measurement]);
        }
      }

      //call render function with (foodObj) as parameter
      console.log(foodObj);
    });
}

//test function call. should execute on button click
getFoodItemId("Seafood");



// to create elements and render to page
function renderRecipes() {
var recipesDisplay = document.getElementById("recipes-container");

var recipesHeader = document.createElement("h3");
recipesHeader.classList.add("title", "is-5");
recipesHeader.textContent = "Your Meal";
recipesDisplay.append(recipesHeader);

// dinner card
var dinnerContainer = document.createElement("div");
dinnerContainer.classList.add("recipe-container", "card");
recipesDisplay.append(dinnerContainer);

var dinnerTitle = document.createElement("div");
dinnerTitle.classList.add("card-header");
dinnerTitle.textContent = "Dinner Name";
dinnerContainer.append(dinnerTitle);

// dinner image section
var cardImgContainer = document.createElement("div");
cardImgContainer.classList.add("card-image")
dinnerContainer.append(cardImgContainer);

var cardImgFigure = document.createElement("figure");
cardImgFigure.classList.add("dinner-img");
cardImgContainer.append(cardImgFigure);
// actual image
var cardImg = document.createElement("img");
cardImg.setAttribute("src", "https://www.placecage.com/200/300");
cardImg.setAttribute("alt", "A picture of the recipe");
cardImgFigure.append(cardImg);

// dinner recipe section
var ingredientsContainer = document.createElement("div");
ingredientsContainer.classList.add("recipe-container", "columns");
dinnerContainer.append(ingredientsContainer);
// ingredients
var ingMeasurements = document.createElement("div");
ingMeasurements.classList.add("column", "is-one-third");
ingMeasurements.textContent = "Measurements go here";
ingredientsContainer.append(ingMeasurements);
var ingItems = document.createElement("div");
ingItems.classList.add("column", "is-two-thirds");
ingItems.textContent = "Ingredient Items go here";
ingredientsContainer.append(ingItems);
// recipe steps
var dinnerSteps = document.createElement("div");
dinnerSteps.classList.add("card-content");
dinnerSteps.textContent = "Dinner Steps go here Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
dinnerContainer.append(dinnerSteps);
}
renderRecipes();