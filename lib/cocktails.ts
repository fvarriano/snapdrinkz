import { Recipe } from '../contexts/FavoritesContext';

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
  },
  {
    name: "Mojito",
    ingredients: ["RUM"],
    instructions: [
      "Muddle 6-8 mint leaves with 0.5 oz simple syrup in a highball glass",
      "Add 2 oz white rum",
      "Add 0.75 oz fresh lime juice",
      "Fill glass with crushed ice",
      "Top with soda water",
      "Garnish with mint sprig and lime wheel"
    ]
  },
  {
    name: "Daiquiri",
    ingredients: ["RUM"],
    instructions: [
      "Add 2 oz white rum to a shaker",
      "Add 1 oz fresh lime juice",
      "Add 0.75 oz simple syrup",
      "Fill with ice and shake well",
      "Strain into a chilled coupe glass",
      "Garnish with a lime wheel"
    ]
  },
  {
    name: "Piña Colada",
    ingredients: ["RUM"],
    instructions: [
      "Add 2 oz white rum to a blender",
      "Add 1.5 oz cream of coconut",
      "Add 1.5 oz pineapple juice",
      "Add 0.5 cup crushed ice",
      "Blend until smooth",
      "Pour into a hurricane glass",
      "Garnish with pineapple wedge and cherry"
    ]
  },
  {
    name: "Dark 'n Stormy",
    ingredients: ["RUM"],
    instructions: [
      "Fill a highball glass with ice",
      "Add 2 oz dark rum",
      "Top with 4-5 oz ginger beer",
      "Garnish with a lime wedge"
    ]
  },
  {
    name: "Mai Tai",
    ingredients: ["RUM"],
    instructions: [
      "Add 1 oz dark rum to a shaker",
      "Add 1 oz white rum",
      "Add 0.5 oz orange curaçao",
      "Add 0.5 oz orgeat syrup",
      "Add 0.25 oz simple syrup",
      "Add 1 oz fresh lime juice",
      "Shake with ice and strain into a rocks glass filled with crushed ice",
      "Garnish with mint sprig and lime wheel"
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

export function findMoreCocktails(detectedBottles: string[], existingRecipeNames: string[]): CocktailRecipe[] {
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

  // If McGuinness is detected, make sure it's included
  if (normalizedBottles.some(bottle => bottle.includes('MCGUINNESS') || bottle.includes('ILLVA'))) {
    if (!availableIngredients.includes('MCGUINNESS')) {
      availableIngredients.push('MCGUINNESS');
    }
  }

  // Find additional cocktails that match at least one ingredient but weren't in the original results
  const additionalCocktails = cocktailRecipes.filter(recipe => 
    !existingRecipeNames.includes(recipe.name) && // Exclude recipes we've already shown
    recipe.ingredients.some(ingredient => 
      availableIngredients.includes(ingredient)
    )
  );

  // Sort by number of matching ingredients (most matches first)
  additionalCocktails.sort((a, b) => {
    const aMatches = a.ingredients.filter(ingredient => availableIngredients.includes(ingredient)).length;
    const bMatches = b.ingredients.filter(ingredient => availableIngredients.includes(ingredient)).length;
    return bMatches - aMatches;
  });

  // Return up to 3 additional recipes
  return additionalCocktails.slice(0, 3);
}

export function getRecommendedCocktails(favorites: Recipe[], searchQuery: string = ''): CocktailRecipe[] {
  // If we have a search query, prioritize finding recipes that match the query
  if (searchQuery) {
    const normalizedQuery = searchQuery.toUpperCase();
    
    // Find the ingredient that matches the search query
    const matchingIngredients = ingredients.filter(ing => 
      ing.name.includes(normalizedQuery) || 
      ing.alternatives.some(alt => alt.includes(normalizedQuery))
    );
    
    // Get the standardized ingredient names that match the query
    const matchingIngredientNames = matchingIngredients.map(ing => ing.name);
    
    // Find recipes that use any of the matching ingredients
    let matchingRecipes = cocktailRecipes.filter(recipe => 
      recipe.ingredients.some(ingredient => 
        matchingIngredientNames.includes(ingredient)
      )
    );
    
    // Also check recipe names
    const nameMatchingRecipes = cocktailRecipes.filter(recipe => 
      recipe.name.toUpperCase().includes(normalizedQuery)
    );
    
    // Combine and remove duplicates
    matchingRecipes = [...new Set([...matchingRecipes, ...nameMatchingRecipes])];
    
    // Filter out favorites
    const favoriteNames = new Set(favorites.map(fav => fav.name));
    matchingRecipes = matchingRecipes.filter(recipe => !favoriteNames.has(recipe.name));
    
    // Return up to 5 matching recipes
    return matchingRecipes.slice(0, 5);
  }
  
  // If no search query, proceed with the original recommendation logic
  // If no favorites, return a few random recipes
  if (favorites.length === 0) {
    return [...cocktailRecipes]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }
  
  // Extract ingredients from favorites
  const favoriteIngredients = new Set<string>();
  favorites.forEach(favorite => {
    favorite.ingredients.forEach(ingredient => {
      // Normalize ingredient names
      const normalizedIngredient = ingredient.toUpperCase();
      ingredients.forEach(ing => {
        if ([ing.name, ...ing.alternatives].some(alt => 
          normalizedIngredient.includes(alt)
        )) {
          favoriteIngredients.add(ing.name);
        }
      });
    });
  });
  
  // Get favorite recipe names for exclusion
  const favoriteNames = new Set(favorites.map(fav => fav.name));
  
  // Find recipes that use similar ingredients but aren't in favorites
  let recommendations = cocktailRecipes.filter(recipe => {
    // Skip recipes already in favorites
    if (favoriteNames.has(recipe.name)) {
      return false;
    }
    
    // Check if recipe uses any favorite ingredients
    return recipe.ingredients.some(ingredient => 
      favoriteIngredients.has(ingredient)
    );
  });
  
  // Sort by number of matching ingredients (most matches first)
  recommendations.sort((a, b) => {
    const aMatches = a.ingredients.filter(ingredient => favoriteIngredients.has(ingredient)).length;
    const bMatches = b.ingredients.filter(ingredient => favoriteIngredients.has(ingredient)).length;
    return bMatches - aMatches;
  });
  
  // Return up to 5 recommendations
  return recommendations.slice(0, 5);
} 