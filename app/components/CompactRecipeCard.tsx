import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Pressable, Text as RNText } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './Typography';
import theme from '../styles/theme';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface CompactRecipeCardProps {
  name: string;
  ingredients: string[];
  instructions: string[];
  strength?: string;
  imageUrl?: string;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export default function CompactRecipeCard({
  name,
  ingredients,
  instructions,
  strength,
  imageUrl,
  isFavorite,
  onFavoritePress,
}: CompactRecipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded(!expanded);
  };
  
  const handleViewDetails = () => {
    router.push({
      pathname: '/recipe-details',
      params: {
        name,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(instructions),
        imageUrl: imageUrl || '',
        isFavorite: isFavorite ? 'true' : 'false'
      }
    });
  };
  
  const handleFavorite = async () => {
    if (onFavoritePress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onFavoritePress();
    }
  };
  
  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={styles.container}
    >
      <Pressable 
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed
        ]}
        onPress={toggleExpand}
      >
        {/* Header with image, title and favorite button */}
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="wine-outline" size={24} color={theme.colors.text.secondary} />
              </View>
            )}
          </View>
          
          <View style={styles.titleContainer}>
            <RNText 
              style={[styles.title]} 
              numberOfLines={1}
            >
              {name}
            </RNText>
            {strength && (
              <View style={styles.strengthContainer}>
                <Text style={styles.strengthText}>{strength}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={handleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? theme.colors.accent : theme.colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Compact view shows just ingredients summary */}
        {!expanded && (
          <View style={styles.compactContent}>
            <RNText 
              style={styles.ingredientsSummary} 
              numberOfLines={1}
            >
              {ingredients.slice(0, 3).join(', ')}
              {ingredients.length > 3 ? '...' : ''}
            </RNText>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={theme.colors.text.secondary} 
            />
          </View>
        )}
        
        {/* Expanded view shows ingredients and instructions */}
        {expanded && (
          <Animated.View 
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.expandedContent}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.tagsContainer}>
                {ingredients.map((ingredient, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.tag,
                      index % 2 === 0 ? styles.darkTag : styles.lightTag
                    ]}
                  >
                    <Text 
                      style={[
                        styles.tagText,
                        index % 2 === 0 ? styles.lightTagText : styles.darkTagText
                      ]}
                    >
                      {ingredient}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {instructions.slice(0, 3).map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <RNText 
                    style={styles.instructionText} 
                    numberOfLines={2}
                  >
                    {instruction}
                  </RNText>
                </View>
              ))}
              {instructions.length > 3 && (
                <Text style={styles.moreText}>+ {instructions.length - 3} more steps</Text>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={handleViewDetails}
            >
              <Text style={styles.viewDetailsText}>View Full Recipe</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.accent} />
            </TouchableOpacity>
            
            <View style={styles.expandCollapseRow}>
              <Ionicons 
                name="chevron-up" 
                size={20} 
                color={theme.colors.text.secondary} 
              />
            </View>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
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
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  strengthContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  strengthText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  ingredientsSummary: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginRight: 8,
  },
  expandedContent: {
    padding: 16,
    paddingTop: 0,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  darkTag: {
    backgroundColor: theme.colors.background.highlight,
  },
  lightTag: {
    backgroundColor: 'rgba(245, 245, 240, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 240, 0.2)',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lightTagText: {
    color: theme.colors.text.primary,
  },
  darkTagText: {
    color: theme.colors.text.primary,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  instructionNumberText: {
    color: theme.colors.accent,
    fontWeight: '600',
    fontSize: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.primary,
  },
  moreText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accent,
    marginRight: 4,
  },
  expandCollapseRow: {
    alignItems: 'center',
    marginTop: 8,
  },
}); 