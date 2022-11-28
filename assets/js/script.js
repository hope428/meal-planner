var storedItem = localStorage.getItem("storedItem");

function save() {
  var Item = document.getElementById("input").value;
  localStorage.setItem("storedItem", Item);
  document.getElementById("savedtext").innerHTML = Item + "SAVED";
}
var baseCocktailurl = "https://www.thecocktaildb.com/api/json/v1/1/";
var baseMealUrl = "https://www.themealdb.com/api/json/v1/1/";
var category = document.getElementById("category-select");
var drinkCategory = document.getElementById("alcohol-select");
var generateBtn = document.getElementById("generate");
var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
var savedMeals = document.getElementById('saved-meals-container');
var foodObj;

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
function get() {
  localStorage.getItem("storedItem");
  document.getElementById("openedtext").innerHTML = storedItem + "OPENED";
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
      renderCocktailRecipe(drinkObj);
      console.log(drinkObj);
    });
}


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
            getFoodObject(item.idMeal)
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
      };
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
      // favorites.push(foodObj);
      renderDinnerRecipe(foodObj);
      console.log(foodObj);
    });
}


// function to create dinner elements and render to page
function renderDinnerRecipe(foodObj) {
  // if (getFoodItemId("dessert")) {
  //   var recipesDisplay = document.getElementById("dessert-recipe")
  // }
  // else {
  var recipesDisplay = document.getElementById("dinner-recipe");
  // }
  // dinner card
  var dinnerContainer = document.createElement("div");
  dinnerContainer.classList.add("recipe-container", "card");
  recipesDisplay.append(dinnerContainer);

  var dinnerTitle = document.createElement("div");
  dinnerTitle.classList.add("card-header");
  dinnerTitle.textContent = foodObj.name;
  dinnerContainer.append(dinnerTitle);

  var favDinnerButton = document.createElement("button");
  favDinnerButton.innerHTML = "Add to favorites";
  document.body.appendChild(favDinnerButton);

  favDinnerButton.onclick = function () {
    storeFavorites();
  };

  // dinner image section
  var cardImgContainer = document.createElement("div");
  cardImgContainer.classList.add("card-image");
  dinnerContainer.append(cardImgContainer);

  var cardImgFigure = document.createElement("figure");
  cardImgFigure.classList.add("dinner-img");
  cardImgContainer.append(cardImgFigure);
  // actual image
  var cardImg = document.createElement("img");
  cardImg.setAttribute("src", foodObj.imgSrc);
  cardImg.setAttribute("alt", "A picture of the recipe");
  cardImgFigure.append(cardImg);

  // dinner recipe section
  var ingredientsContainer = document.createElement("div");
  ingredientsContainer.classList.add("recipe-container", "columns");
  dinnerContainer.append(ingredientsContainer);
  // ingredients
  var ingMeasurements = document.createElement("div");
  var ingMeasurementsUl = document.createElement("ul");
  ingMeasurements.classList.add("column", "is-one-third", "px-5");
  for (let i = 0; i < foodObj.ingredients.length; i++) {
    var li = document.createElement('li')
    li.textContent = foodObj.ingredientMeasurements[i] + " " + foodObj.ingredients[i]
    ingMeasurementsUl.append(li)
  }
  ingredientsContainer.append(ingMeasurements);
  ingMeasurements.append(ingMeasurementsUl);
  // recipe steps
  var dinnerSteps = document.createElement("div");
  dinnerSteps.classList.add("card-content");
  dinnerSteps.textContent = foodObj.steps;
  dinnerContainer.append(dinnerSteps);

  // Local Storage
  function renderFavorites() {
    savedMeals.innerHTML = "";
    var currentFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (currentFavorites) {
      for (var i = 0; i < currentFavorites.length; i++) {
        var favorite = currentFavorites[i];
        console.log(favorite);

        var li = document.createElement("li");
        li.setAttribute("favorites", i);

        var button = document.createElement("button");
        button.textContent = favorite.name;

        li.appendChild(button);
        savedMeals.appendChild(li);
      }
    }
  }

  function init() {
    var storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites !== null) {
    }
    renderFavorites();
  }

  function storeFavorites() {
    favorites.push(foodObj);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  init()
}

// function to create cocktail elements and render to page
function renderCocktailRecipe(drinkObj) {
  var recipesDisplay = document.getElementById("drink-recipe");

  // cocktail card
  var drinkContainer = document.createElement("div");
  drinkContainer.classList.add("recipe-container", "card");
  recipesDisplay.append(drinkContainer);

  var drinkTitle = document.createElement("div");
  drinkTitle.classList.add("card-header");
  drinkTitle.textContent = drinkObj.name;
  drinkContainer.append(drinkTitle);

  // cocktail image section
  var drinkCardImgContainer = document.createElement("div");
  drinkCardImgContainer.classList.add("card-image");
  drinkContainer.append(drinkCardImgContainer);

  var drinkCardImgFigure = document.createElement("figure");
  drinkCardImgFigure.classList.add("drink-img");
  drinkCardImgContainer.append(drinkCardImgFigure);
  // actual image
  var drinkCardImg = document.createElement("img");
  drinkCardImg.setAttribute("src", drinkObj.imgSrc);
  drinkCardImg.setAttribute("alt", "A picture of the recipe");
  drinkCardImgFigure.append(drinkCardImg);

  // cocktail recipe section
  var drinkIngredientsContainer = document.createElement("div");
  drinkIngredientsContainer.classList.add("recipe-container", "columns");
  drinkContainer.append(drinkIngredientsContainer);
  // ingredients
  var drinkIngMeasurements = document.createElement("div");
  var drinkIngMeasurementsUl = document.createElement("ul");
  drinkIngMeasurements.classList.add("column", "is-one-third", "px-5");
  for (let i = 0; i < drinkObj.ingredients.length; i++) {
    var li = document.createElement('li')
    li.textContent = drinkObj.ingredientMeasurements[i] + " " + drinkObj.ingredients[i]
    drinkIngMeasurementsUl.append(li)
  }
  drinkIngredientsContainer.append(drinkIngMeasurements);
  drinkIngMeasurements.append(drinkIngMeasurementsUl);
  // recipe steps
  var drinkSteps = document.createElement("div");
  drinkSteps.classList.add("card-content");
  drinkSteps.textContent = drinkObj.steps;
  drinkContainer.append(drinkSteps);
}

function resetRender() {
  var dinnerDisplay = document.getElementById("dinner-recipe");
  var dessertDisplay = document.getElementById("dessert-recipe");
  var drinkDisplay = document.getElementById("drink-recipe");
  var recipesDisplay = document.getElementById("header-div");
  var loadImgDisplay = document.getElementById("load-image");
  recipesDisplay.innerHTML = ""
  dinnerDisplay.innerHTML = ""
  dessertDisplay.innerHTML = ""
  drinkDisplay.innerHTML = ""
  loadImgDisplay.innerHTML = ""
  var recipesHeader = document.createElement("h3");
  recipesHeader.classList.add("title", "is-5");
  recipesHeader.textContent = "Your Meal";
  recipesDisplay.append(recipesHeader);
}

generateBtn.addEventListener('click', function () {
  // var dinnerDisplay = document.getElementById("dinner-recipe");
  // var dessertDisplay = document.getElementById("dessert-recipe");
  // var drinkDisplay = document.getElementById("drink-recipe");
  // var recipesDisplay = document.getElementById("header-div");
  // var loadImgDisplay = document.getElementById("load-image");
  // recipesDisplay.innerHTML = ""
  // dinnerDisplay.innerHTML = ""
  // dessertDisplay.innerHTML = ""
  // drinkDisplay.innerHTML = ""
  // loadImgDisplay.innerHTML = ""
  // var recipesHeader = document.createElement("h3");
  // recipesHeader.classList.add("title", "is-5");
  // recipesHeader.textContent = "Your Meal";
  // recipesDisplay.append(recipesHeader);
  resetRender();
  getFoodItemId(category.value);
  getFoodItemId("dessert");
  getCocktail(drinkCategory.value);
})
