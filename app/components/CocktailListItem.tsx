import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Typography';
import theme from '../styles/theme';

interface CocktailListItemProps {
  name: string;
  strength: string;
  imageUrl?: string;
  isFavorite?: boolean;
  isHighlighted?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

export default function CocktailListItem({
  name,
  strength,
  imageUrl,
  isFavorite,
  isHighlighted,
  onPress,
  onFavoritePress,
}: CocktailListItemProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        isHighlighted && styles.highlighted,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="wine-outline" size={24} color={theme.colors.text.secondary} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.strength}>{strength}</Text>
      </View>

      {isHighlighted ? (
        <View style={styles.highlightIcon}>
          <Ionicons name="star" size={20} color={theme.colors.accent} />
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? theme.colors.accent : theme.colors.text.secondary} 
          />
        </TouchableOpacity>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
  },
  highlighted: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.highlight,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.highlight,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  strength: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  favoriteButton: {
    padding: 8,
  },
  highlightIcon: {
    padding: 8,
  },
}); 