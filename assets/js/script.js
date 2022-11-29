var baseCocktailurl = "https://www.thecocktaildb.com/api/json/v1/1/";
var baseMealUrl = "https://www.themealdb.com/api/json/v1/1/";
var category = document.getElementById("category-select");
var drinkCategory = document.getElementById("alcohol-select");
var generateBtn = document.getElementById("generate");
var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
var savedMeals = document.getElementById("saved-meals-container");
var foodObj;
var dessertObj;
var drinkObj;
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
      drinkObj = {
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
    });
}

//meal api functions
// ---------------------- //

//dessert or main dish can be retrieved with this function
//for dessert pass in "Dessert" as the type
function getFoodItemId(type) {
  fetch(baseMealUrl + "filter.php?c=" + type)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.meals) {
        var item = data.meals[Math.floor(Math.random() * data.meals.length)];
        getFoodObject(item.idMeal, type);
      } else {
        //fetches data for if area is entered
        fetch(baseMealUrl + "filter.php?a=" + type)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            var item =
              data.meals[Math.floor(Math.random() * data.meals.length)];
            getFoodObject(item.idMeal);
          });
      }
    });
}

//creates meal object from id
function getFoodObject(foodItemId) {
  fetch(baseMealUrl + "lookup.php?i=" + foodItemId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var food = data.meals[0];
      foodObj = {
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
    });
}

//dessert api functions
function getDessertId() {
  fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var item = data.meals[Math.floor(Math.random() * data.meals.length)];
      getDessertObject(item.idMeal);
    });
}

//creates dessert object from id
function getDessertObject(dessertItemId) {
  fetch(baseMealUrl + "lookup.php?i=" + dessertItemId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var food = data.meals[0];
      dessertObj = {
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
          dessertObj.ingredients.push(food[ingredient]);
        }
      }
      //gets list of ingredient measurements
      for (let i = 1; i <= 15; i++) {
        var measurement = "strMeasure" + i;
        if (food[measurement]) {
          dessertObj.ingredientMeasurements.push(food[measurement]);
        }
      }

      //call render function with (dessertObj) as parameter
      renderDessertRecipe(dessertObj);
    });
}

// function to create dinner elements and render to page
function renderDinnerRecipe(foodObj) {
  var recipesDisplay = document.getElementById("dinner-recipe");
  var dinnerContainer = document.createElement("div");
  dinnerContainer.classList.add("recipe-container", "card");
  recipesDisplay.append(dinnerContainer);

  var dinnerTitle = document.createElement("div");
  dinnerTitle.classList.add(
    "title",
    "card-header",
    "is-justify-content-space-between"
  );
  dinnerTitle.textContent = foodObj.name;
  dinnerContainer.append(dinnerTitle);

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
  let btn = document.createElement("button");
  btn.innerHTML = "Add to favorites";
  btn.className = "button is-danger";
  dinnerContainer.querySelector(".card-header").appendChild(btn);
  // ingredients
  btn.addEventListener("click", storeDinnerFavorites);
  var ingMeasurements = document.createElement("div");
  var ingMeasurementsUl = document.createElement("ul");
  ingMeasurements.classList.add("column", "px-5");
  for (let i = 0; i < foodObj.ingredients.length; i++) {
    var li = document.createElement("li");
    li.textContent =
      foodObj.ingredientMeasurements[i] + " " + foodObj.ingredients[i];
    ingMeasurementsUl.append(li);
  }
  ingredientsContainer.append(ingMeasurements);
  ingMeasurements.append(ingMeasurementsUl);
  // recipe steps
  var dinnerSteps = document.createElement("div");
  dinnerSteps.classList.add("card-content");
  dinnerSteps.textContent = foodObj.steps;
  dinnerContainer.append(dinnerSteps);
  // Local Storage
}

function clearAllFavorites() {
  favorites = [];
  localStorage.clear();
  renderFavorites();
}

function renderFavorites() {
  savedMeals.innerHTML = "";
  var currentFavorites = JSON.parse(localStorage.getItem("favorites"));
  if (currentFavorites) {
    for (var i = 0; i < currentFavorites.length; i++) {
      var favorite = currentFavorites[i];

      var li = document.createElement("li");
      li.setAttribute("favorites", i);

      var button = document.createElement("button");
      button.classList.add("button", "is-white");
      button.textContent = favorite.name;

      li.appendChild(button);
      savedMeals.appendChild(li);
    }
    var clearBtn = document.createElement("button");
    clearBtn.classList.add("button", "is-danger");
    clearBtn.setAttribute("style", "width: 100%");
    clearBtn.textContent = "Clear All Favorites";
    savedMeals.append(clearBtn);

    clearBtn.addEventListener("click", clearAllFavorites);
  }
}

function init() {
  var storedFavorites = JSON.parse(localStorage.getItem("favorites"));
  if (storedFavorites !== null) {
    renderFavorites();
  }
}

function storeDinnerFavorites() {
  favorites.push(foodObj);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  init();
}

function storeDrinkFavorites() {
  favorites.push(drinkObj);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  init();
}

function storeDessertFavorites() {
  favorites.push(dessertObj);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  init();
}

init();

function renderDessertRecipe(dessertObj) {
  var recipesDisplay = document.getElementById("dessert-recipe");
  // dessert card
  var dessertContainer = document.createElement("div");
  dessertContainer.classList.add("recipe-container", "card");
  recipesDisplay.append(dessertContainer);

  var dessertTitle = document.createElement("div");
  dessertTitle.classList.add(
    "title",
    "card-header",
    "is-justify-content-space-between"
  );
  dessertTitle.textContent = dessertObj.name;
  dessertContainer.append(dessertTitle);

  var dessertBtn = document.createElement("button");
  dessertBtn.innerHTML = "Add to favorites";
  dessertBtn.className = "button is-danger";
  dessertBtn.setAttribute("id", "dessert-fav-button");
  dessertContainer.querySelector(".card-header").appendChild(dessertBtn);

  dessertBtn.addEventListener("click", storeDessertFavorites);

  // dessert image section
  var cardImgContainer = document.createElement("div");
  cardImgContainer.classList.add("card-image");
  dessertContainer.append(cardImgContainer);

  var cardImgFigure = document.createElement("figure");
  cardImgFigure.classList.add("dessert-img");
  cardImgContainer.append(cardImgFigure);
  // actual image
  var cardImg = document.createElement("img");
  cardImg.setAttribute("src", dessertObj.imgSrc);
  cardImg.setAttribute("alt", "A picture of the recipe");
  cardImgFigure.append(cardImg);

  // dessert recipe section
  var ingredientsContainer = document.createElement("div");
  ingredientsContainer.classList.add("recipe-container", "columns");
  dessertContainer.append(ingredientsContainer);
  // ingredients
  var ingMeasurements = document.createElement("div");
  var ingMeasurementsUl = document.createElement("ul");
  ingMeasurements.classList.add("column", "px-5");
  for (let i = 0; i < dessertObj.ingredients.length; i++) {
    var li = document.createElement("li");
    li.textContent =
      dessertObj.ingredientMeasurements[i] + " " + dessertObj.ingredients[i];
    ingMeasurementsUl.append(li);
  }
  ingredientsContainer.append(ingMeasurements);
  ingMeasurements.append(ingMeasurementsUl);
  // recipe steps
  var dessertSteps = document.createElement("div");
  dessertSteps.classList.add("card-content");
  dessertSteps.textContent = dessertObj.steps;
  dessertContainer.append(dessertSteps);
}

// function to create cocktail elements and render to page
function renderCocktailRecipe(drinkObj) {
  var recipesDisplay = document.getElementById("drink-recipe");

  // cocktail card
  var drinkContainer = document.createElement("div");
  drinkContainer.classList.add("recipe-container", "card");
  recipesDisplay.append(drinkContainer);

  var drinkTitle = document.createElement("div");
  drinkTitle.classList.add(
    "title",
    "card-header",
    "is-justify-content-space-between"
  );
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

  var btn = document.createElement("button");
  btn.innerHTML = "Add to favorites";
  btn.className = "button is-danger";
  btn.setAttribute("id", "drink-fav-button");
  drinkContainer.querySelector(".card-header").appendChild(btn);

  btn.addEventListener("click", storeDrinkFavorites);

  // ingredients
  var drinkIngMeasurements = document.createElement("div");
  var drinkIngMeasurementsUl = document.createElement("ul");
  drinkIngMeasurements.classList.add("column", "px-5");
  for (let i = 0; i < drinkObj.ingredients.length; i++) {
    var li = document.createElement("li");
    if (drinkObj.ingredientMeasurements[i] !== undefined) {
      li.textContent =
        drinkObj.ingredientMeasurements[i] + " " + drinkObj.ingredients[i];
    } else {
      li.textContent = drinkObj.ingredients[i];
    }
    drinkIngMeasurementsUl.append(li);
  }
  drinkIngredientsContainer.append(drinkIngMeasurements);
  drinkIngMeasurements.append(drinkIngMeasurementsUl);
  // recipe steps
  var drinkSteps = document.createElement("div");
  drinkSteps.classList.add("card-content");
  drinkSteps.textContent = drinkObj.steps;
  drinkContainer.append(drinkSteps);
}

savedMeals.addEventListener("click", displayFavorite);
var favorite;

function displayFavorite(event) {
  if (event.target.matches("button")) {
    favorite = event.target.textContent;
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + favorite)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.meals) {
          var favorite = data.meals[0];
          var favoriteObj = {
            id: favorite.idMeal,
            name: favorite.strMeal,
            ingredientMeasurements: [],
            ingredients: [],
            steps: favorite.strInstructions,
            imgSrc: favorite.strMealThumb,
          };
          //get list of food ingredients
          for (let i = 1; i <= 15; i++) {
            var ingredient = "strIngredient" + i;
            if (favorite[ingredient]) {
              favoriteObj.ingredients.push(favorite[ingredient]);
            }
          }
          //gets list of ingredient measurements
          for (let i = 1; i <= 15; i++) {
            var measurement = "strMeasure" + i;
            if (favorite[measurement]) {
              favoriteObj.ingredientMeasurements.push(favorite[measurement]);
            }
          }

          resetRender();
          renderDinnerRecipe(favoriteObj);
        } else {
          //if clicked object is not food, call drink api instead
          fetch(
            "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" +
              event.target.textContent
          )
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              var favorite = data.drinks[0];
              favoriteObj = {
                id: favorite.idDrink,
                name: favorite.strDrink,
                ingredientMeasurements: [],
                ingredients: [],
                steps: favorite.strInstructions,
                imgSrc: favorite.strDrinkThumb,
              };
              //get list of drink ingredients
              for (let i = 1; i <= 15; i++) {
                var ingredient = "strIngredient" + i;
                if (favorite[ingredient]) {
                  favoriteObj.ingredients.push(favorite[ingredient]);
                }
              }
              //gets list of ingredient measurements
              for (let i = 1; i <= 15; i++) {
                var measurement = "strMeasure" + i;
                if (favorite[measurement]) {
                  favoriteObj.ingredientMeasurements.push(
                    favorite[measurement]
                  );
                }
              }

              resetRender();
              renderCocktailRecipe(favoriteObj);
            });
        }
      });
  }
}

function resetRender() {
  var dinnerDisplay = document.getElementById("dinner-recipe");
  var dessertDisplay = document.getElementById("dessert-recipe");
  var drinkDisplay = document.getElementById("drink-recipe");
  var recipesDisplay = document.getElementById("header-div");
  var loadImgDisplay = document.getElementById("load-image");
  recipesDisplay.innerHTML = "";
  dinnerDisplay.innerHTML = "";
  dessertDisplay.innerHTML = "";
  drinkDisplay.innerHTML = "";
  loadImgDisplay.innerHTML = "";
  var recipesHeader = document.createElement("h3");
  recipesHeader.classList.add("title", "is-5", "my-3", "has-text-grey-light");
  recipesHeader.textContent = "Your Meal";
  recipesDisplay.append(recipesHeader);
}

generateBtn.addEventListener("click", function () {
  resetRender();
  getFoodItemId(category.value);
  getDessertId();
  getCocktail(drinkCategory.value);
});
