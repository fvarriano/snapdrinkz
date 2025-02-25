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
    alternatives: ["GIN", "BOMBAY", "SAPPHIRE GIN", "LONDON DRY GIN", "BOMBAY GIN"]
  },
  {
    name: "MARTINI",
    alternatives: ["MARTINI ROSSO", "SWEET VERMOUTH", "RED VERMOUTH", "VERMOUTH", "MARTINI & ROSSI"]
  },
  {
    name: "MCGUINNESS",
    alternatives: ["BLUE CURACAO", "CURACAO", "MCGUINNESS BLUE CURACAO", "MCGUINNESS LIQUEUR", "ILLVA"]
  },
  {
    name: "AMARETTO",
    alternatives: ["DISARONNO", "MCGUINNESS AMARETTO", "ALMOND LIQUEUR"]
  },
  {
    name: "TRIPLE SEC",
    alternatives: ["COINTREAU", "ORANGE LIQUEUR", "MCGUINNESS TRIPLE SEC"]
  },
  {
    name: "VODKA",
    alternatives: ["SMIRNOFF", "ABSOLUT", "GREY GOOSE", "STOLICHNAYA", "KETEL ONE"]
  },
  {
    name: "WHISKEY",
    alternatives: ["BOURBON", "SCOTCH", "JACK DANIELS", "JAMESON", "CROWN ROYAL", "CANADIAN WHISKY"]
  },
  {
    name: "RUM",
    alternatives: ["BACARDI", "CAPTAIN MORGAN", "MALIBU", "WHITE RUM", "DARK RUM", "SPICED RUM"]
  },
  {
    name: "TEQUILA",
    alternatives: ["JOSE CUERVO", "PATRON", "DON JULIO", "SILVER TEQUILA", "GOLD TEQUILA"]
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
    ingredients: ["VODKA", "MCGUINNESS"],
    instructions: [
      "Fill a highball glass with ice",
      "Add 1.5 oz vodka",
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
  },
  {
    name: "Amaretto Sour",
    ingredients: ["AMARETTO"],
    instructions: [
      "Fill a shaker with ice",
      "Add 2 oz Amaretto liqueur",
      "Add 1 oz fresh lemon juice",
      "Add 0.5 oz simple syrup",
      "Shake well",
      "Strain into a rocks glass with ice",
      "Garnish with a lemon slice and a cherry"
    ]
  },
  {
    name: "Blue Hawaiian",
    ingredients: ["RUM", "MCGUINNESS"],
    instructions: [
      "Fill a shaker with ice",
      "Add 1.5 oz white rum",
      "Add 0.75 oz Blue Curacao",
      "Add 2 oz pineapple juice",
      "Add 0.5 oz coconut cream",
      "Shake well",
      "Strain into a hurricane glass with ice",
      "Garnish with a pineapple slice"
    ]
  },
  {
    name: "Margarita",
    ingredients: ["TEQUILA", "TRIPLE SEC"],
    instructions: [
      "Rim a glass with salt",
      "Fill a shaker with ice",
      "Add 2 oz tequila",
      "Add 1 oz triple sec",
      "Add 1 oz fresh lime juice",
      "Shake well",
      "Strain into the prepared glass",
      "Garnish with a lime wheel"
    ]
  },
  {
    name: "Whiskey Sour",
    ingredients: ["WHISKEY"],
    instructions: [
      "Fill a shaker with ice",
      "Add 2 oz whiskey",
      "Add 0.75 oz fresh lemon juice",
      "Add 0.5 oz simple syrup",
      "Shake well",
      "Strain into a rocks glass with ice",
      "Garnish with a lemon wedge and cherry"
    ]
  },
  {
    name: "McGuinness Blue Lagoon",
    ingredients: ["MCGUINNESS"],
    instructions: [
      "Fill a highball glass with ice",
      "Add 1 oz McGuinness Blue Curacao",
      "Add 2 oz lemonade",
      "Add 3 oz sprite or soda water",
      "Stir gently",
      "Garnish with a lemon wheel"
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

  // If McGuinness is detected, make sure it's included
  if (normalizedBottles.some(bottle => bottle.includes('MCGUINNESS') || bottle.includes('ILLVA'))) {
    if (!availableIngredients.includes('MCGUINNESS')) {
      availableIngredients.push('MCGUINNESS');
    }
  }

  // Find possible cocktails
  const matchingCocktails = cocktailRecipes.filter(recipe => 
    recipe.ingredients.every(ingredient => 
      availableIngredients.includes(ingredient)
    )
  );

  // If no exact matches, return recipes that match at least one ingredient
  if (matchingCocktails.length === 0) {
    return cocktailRecipes.filter(recipe => 
      recipe.ingredients.some(ingredient => 
        availableIngredients.includes(ingredient)
      )
    ).slice(0, 3); // Return up to 3 partial matches
  }

  return matchingCocktails;
} 