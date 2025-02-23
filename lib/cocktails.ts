interface CocktailRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

interface Ingredient {
  name: string;
  alternatives: string[];
}

const ingredients: Ingredient[] = [
  {
    name: "BOMBAY SAPPHIRE",
    alternatives: ["GIN", "BOMBAY", "SAPPHIRE GIN", "LONDON DRY GIN"]
  },
  {
    name: "MARTINI",
    alternatives: ["MARTINI ROSSO", "SWEET VERMOUTH", "RED VERMOUTH", "VERMOUTH"]
  },
  {
    name: "MCGUINNESS",
    alternatives: ["BLUE CURACAO", "CURACAO", "MCGUINNESS BLUE CURACAO"]
  }
];

const cocktailRecipes: CocktailRecipe[] = [
  {
    name: "Classic Martini",
    ingredients: ["BOMBAY SAPPHIRE", "MARTINI"],
    instructions: [
      "Fill a mixing glass with ice",
      "Add 2 oz Bombay Sapphire gin",
      "Add 1 oz Martini vermouth",
      "Stir well for about 30 seconds",
      "Strain into a chilled martini glass",
      "Garnish with a lemon twist or olive"
    ]
  },
  {
    name: "Blue Lagoon",
    ingredients: ["BOMBAY SAPPHIRE", "MCGUINNESS"],
    instructions: [
      "Fill a highball glass with ice",
      "Add 1.5 oz Bombay Sapphire gin",
      "Add 1 oz Blue Curacao",
      "Add 4 oz lemonade",
      "Stir gently",
      "Garnish with a lemon wheel"
    ]
  },
  {
    name: "Blue Moon",
    ingredients: ["BOMBAY SAPPHIRE", "MCGUINNESS"],
    instructions: [
      "Fill a cocktail glass with ice",
      "Add 2 oz Bombay Sapphire gin",
      "Add 0.5 oz Blue Curacao",
      "Add 0.5 oz fresh lemon juice",
      "Shake well with ice",
      "Strain into a chilled cocktail glass",
      "Garnish with a lemon twist"
    ]
  },
  {
    name: "Perfect Martini",
    ingredients: ["BOMBAY SAPPHIRE", "MARTINI"],
    instructions: [
      "Fill a mixing glass with ice",
      "Add 2 oz Bombay Sapphire gin",
      "Add 0.5 oz sweet vermouth",
      "Add 0.5 oz dry vermouth",
      "Stir until well-chilled",
      "Strain into a chilled cocktail glass",
      "Garnish with a lemon twist"
    ]
  },
  {
    name: "Sapphire Negroni",
    ingredients: ["BOMBAY SAPPHIRE", "MARTINI"],
    instructions: [
      "Fill a rocks glass with ice",
      "Add 1 oz Bombay Sapphire gin",
      "Add 1 oz sweet vermouth",
      "Add 1 oz Campari",
      "Stir until well-chilled",
      "Garnish with an orange peel"
    ]
  }
];

export function findCocktails(detectedBottles: string[]): CocktailRecipe[] {
  // Normalize detected bottle names
  const normalizedBottles = detectedBottles.map(bottle => 
    bottle.toUpperCase()
  );

  // Find available ingredients
  const availableIngredients = ingredients.filter(ing => 
    normalizedBottles.some(bottle => 
      [ing.name, ...ing.alternatives].some(alt => 
        bottle.includes(alt)
      )
    )
  ).map(ing => ing.name);

  console.log('Available ingredients:', availableIngredients);

  // Find possible cocktails
  return cocktailRecipes.filter(recipe => 
    recipe.ingredients.every(ingredient => 
      availableIngredients.includes(ingredient)
    )
  );
} 