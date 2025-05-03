import { useAppTheme } from '@/hooks/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../context/ThemeContext';

export default function Setting() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { theme, setTheme } = useThemeStore(); 
  
  const ThemeOption = ({
    value,
    label,
    iconName
  }: {
    value: 'light' | 'dark' | 'system';
    label: string;
    iconName: keyof typeof Ionicons.glyphMap;
  }) => {
    const isSelected = theme === value;

    return (
      <TouchableOpacity
        style={[
          styles.option,
          isSelected && styles.selectedOption, 
        ]}
        onPress={() => {
          setTheme(value);
        }}>
        <Ionicons
          name={iconName}
          size={24}
          color={isSelected ? colors.text1 : colors.text} 
        />
        <Text style={[styles.optionText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.options}>
        <ThemeOption value="light" label="Light" iconName="sunny" />
        <ThemeOption value="dark" label="Dark" iconName="moon" />
        <ThemeOption value="system" label="System" iconName="phone-portrait" />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    options: {
      gap: 12,
      padding: 16,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.text,
      backgroundColor: colors.card
    },
    selectedOption: {
      backgroundColor: colors.themeTab, 
    },
    optionText: {
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 12,
      color: colors.text
    },
  });
