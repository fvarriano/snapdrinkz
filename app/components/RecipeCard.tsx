import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Text from './Typography';
import theme from '../styles/theme';
import { router } from 'expo-router';

interface RecipeCardProps {
  name: string;
  ingredients: string[];
  equipment: string[];
  description: string;
  strength?: string;
  imageUrl?: string;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export default function RecipeCard({
  name,
  ingredients,
  equipment,
  description,
  strength,
  imageUrl,
  isFavorite,
  onFavoritePress,
}: RecipeCardProps) {
  
  const handlePress = () => {
    // Navigate to recipe details
    router.push({
      pathname: '/recipe-details',
      params: {
        name,
        ingredients: JSON.stringify(ingredients),
        instructions: JSON.stringify(description.split('\n')),
        imageUrl: imageUrl || '',
        isFavorite: isFavorite ? 'true' : 'false'
      }
    });
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>{name}</Text>
        <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? theme.colors.accent : "#000"} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <MaterialIcons name="local-bar" size={48} color="#DDE2E5" />
            <Text style={styles.placeholderText}>No image available</Text>
          </View>
        )}
      </View>

      {strength && (
        <View style={styles.strengthContainer}>
          <Text style={styles.strengthText}>{strength}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text variant="h3" style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.tagsContainer}>
          {ingredients.map((ingredient, index) => (
            <View 
              key={index} 
              style={[
                styles.tag,
                index % 3 === 0 ? styles.blueTag : 
                index % 3 === 1 ? styles.whiteTag : 
                styles.greenTag
              ]}
            >
              <Text 
                style={[
                  styles.tagText,
                  index % 3 === 1 ? styles.darkTagText : styles.lightTagText
                ]}
              >
                {ingredient}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="h3" style={styles.sectionTitle}>Equipment</Text>
        <View style={styles.equipmentList}>
          {equipment.map((item, index) => (
            <Text key={index} style={styles.equipmentItem}>{item}</Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="h3" style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  favoriteButton: {
    padding: 4,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F8F9FA',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#ADB5BD',
  },
  strengthContainer: {
    backgroundColor: '#E7F5FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 16,
  },
  strengthText: {
    color: '#228BE6',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
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
  blueTag: {
    backgroundColor: '#E7F5FF',
  },
  whiteTag: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DDE2E5',
  },
  greenTag: {
    backgroundColor: '#E9FAC8',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lightTagText: {
    color: '#228BE6',
  },
  darkTagText: {
    color: '#495057',
  },
  equipmentList: {
    gap: 8,
  },
  equipmentItem: {
    fontSize: 16,
    color: '#495057',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#495057',
  },
}); 