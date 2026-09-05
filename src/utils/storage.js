import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveData(key, value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    return false;
  }
}

export async function loadData(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);

    if (jsonValue === null) {
      return null;
    }

    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;
  }
}

export async function removeData(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove data:', error);
    return false;
  }
}