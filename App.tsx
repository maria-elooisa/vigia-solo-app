import React from 'react';
import Routes from './src/routes';
//import AsyncStorage from '@react-native-async-storage/async-storage';

// Adiciona isso no início do App.tsx ou WelcomeScreen pra rodar só uma vez
//AsyncStorage.clear();


export default function App() {
  return <Routes />;
}
