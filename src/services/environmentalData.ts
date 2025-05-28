import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@environmental_data';

export const saveEnvironmentalData = async (data: any) => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const parsedData = existingData ? JSON.parse(existingData) : [];

    parsedData.push(data);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
  } catch (error) {
    console.error('Erro ao salvar dados ambientais:', error);
  }
};

export const getEnvironmentalData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao buscar dados ambientais:', error);
    return [];
  }
};

export const clearEnvironmentalData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar dados ambientais:', error);
  }
};
