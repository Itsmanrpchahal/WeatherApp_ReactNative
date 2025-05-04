import { useAppTheme } from '@/hooks/useThemeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableButton from '../../components/ui/button';

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState('');
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { colors } = useAppTheme();

  const styles = createStyles(colors);

  useEffect(() => {
    (async () => {
      try {
        const savedCity = await AsyncStorage.getItem('lastCity');
        if (savedCity) {
          setCity(savedCity);
          fetchWeather(savedCity);
        } else {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setError('Permission to access location was denied');
            return;
          }

          let location = await Location.getCurrentPositionAsync({});
          let geocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (geocode.length > 0) {
            const detectedCity = geocode[0].city;
            if (detectedCity) {
              setCity(detectedCity);
              fetchWeather(detectedCity);
            }
          }
        }
      } catch (err) {
        setError('Failed to load city');
      }
    })();
  }, []);

  const fetchWeather = async (cityName = city) => {
    if (!cityName) return;
    try {
      setLoading(true);
      const apiKey = '8585292949e82eb18c954b43fa6ae477';

      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`),
      ]);

      setWeatherData(currentRes.data);
      setError('');

      const dailyForecast = forecastRes.data.list
        .filter((item: any) => item.dt_txt.includes('12:00:00'))
        .slice(0, 4);

      setForecastData(dailyForecast);

      await AsyncStorage.setItem('lastCity', cityName);
    } catch (err) {
      setWeatherData(null);
      setForecastData([]);
      setError('City not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          placeholderTextColor="#999"
          value={city}
          onChangeText={setCity}
        />
        <ReusableButton
          label="Get Weather"
          loading={loading}
          disabled={city.length ? false : true}
          backgroundColor={colors.green}
          onPress={() => fetchWeather(city)}
          textColor="#ffffff"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {weatherData && (
          <View>
            <Text style={[styles.date, { textAlign: 'center', marginBottom: 8 }]}>
              {new Date().toLocaleString()}
            </Text>

            <View style={styles.card}>
              <Text style={styles.city}>{weatherData.name}</Text>
              <Text style={styles.temp}>{Math.round(weatherData.main.temp)}°C</Text>
              <Text style={styles.condition}>{weatherData.weather[0].main}</Text>
              <Image
                style={styles.icon}
                source={{
                  uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                }}
              />
            </View>
          </View>
        )}

        {forecastData.length > 0 && (
          <View style={styles.forecastContainer}>
            {forecastData.map((day, index) => (
              <View key={index} style={styles.forecastCard}>
                <Text style={styles.forecastDay}>
                  {new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })}
                </Text>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png` }}
                  style={styles.forecastIcon}
                />
                <Text style={styles.forecastTemp}>{Math.round(day.main.temp)}°C</Text>
                <Text style={styles.forecastCondition}>{day.weather[0].main}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      color: colors.text,
    },
    button: {
      backgroundColor: '#1e90ff',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    error: {
      color: 'red',
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    city: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    temp: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.text,
    },
    condition: {
      fontSize: 18,
      color: colors.text,
      marginBottom: 8,
    },
    icon: {
      width: 80,
      height: 80,
    },
    date: {
      fontSize: 14,
      color: colors.text,
    },
    forecastContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    forecastCard: {
      backgroundColor: colors.card,
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      width: '22%',
    },
    forecastDay: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 4,
    },
    forecastTemp: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    forecastCondition: {
      fontSize: 12,
      color: colors.text,
      textAlign: 'center',
    },
    forecastIcon: {
      width: 40,
      height: 40,
      marginVertical: 4,
    },
    loaderContainer: {
      marginVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
