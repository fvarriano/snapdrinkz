import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export interface Recipe {
  id?: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  image_url?: string;
  created_at?: string;
  user_id?: string;
}

type FavoritesContextType = {
  favorites: Recipe[];
  loading: boolean;
  addFavorite: (recipe: Omit<Recipe, 'id' | 'created_at'>) => Promise<void>;
  removeFavorite: (recipeName: string) => Promise<void>;
  isFavorite: (recipeName: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentSession(session);
      if (session) {
        fetchFavorites(session);
      } else {
        setFavorites([]);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session);
      if (session) {
        fetchFavorites(session);
      } else {
        setFavorites([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    if (!currentSession?.user) return;

    const channel = supabase
      .channel(`user_favorites_${currentSession.user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${currentSession.user.id}`,
        },
        () => {
          fetchFavorites(currentSession);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentSession?.user?.id]);

  async function fetchFavorites(session: Session) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error.message);
        throw error;
      }
      
      console.log('Fetched favorites:', data?.length || 0);
      setFavorites(data || []);
    } catch (error) {
      console.error('Error in fetchFavorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }

  async function addFavorite(recipe: Omit<Recipe, 'id' | 'created_at'>) {
    if (!currentSession?.user) {
      throw new Error('Must be logged in to add favorites');
    }

    try {
      // Check if recipe already exists
      if (isFavorite(recipe.name)) {
        console.log('Recipe already in favorites');
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: currentSession.user.id,
            name: recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            image_url: recipe.image_url,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding favorite:', error.message);
        throw error;
      }

      console.log('Successfully added favorite:', data);
      await fetchFavorites(currentSession);
    } catch (error) {
      console.error('Error in addFavorite:', error);
      throw error;
    }
  }

  async function removeFavorite(recipeName: string) {
    if (!currentSession?.user) {
      throw new Error('Must be logged in to remove favorites');
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', currentSession.user.id)
        .eq('name', recipeName);

      if (error) {
        console.error('Error removing favorite:', error.message);
        throw error;
      }

      await fetchFavorites(currentSession);
    } catch (error) {
      console.error('Error in removeFavorite:', error);
      throw error;
    }
  }

  function isFavorite(recipeName: string) {
    return favorites.some(fav => fav.name === recipeName);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 