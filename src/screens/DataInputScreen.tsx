import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, Picker } from 'react-native';
import { saveEnvironmentalData } from '../services/environmentalData';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const regions = [
  'Polígono das Secas (Nordeste)',
  'Sudoeste Baiano (Bahia)',
  'Região do Cerrado (Centro-Oeste)',
  'Vale do Itajaí (Santa Catarina)',
  'Região Sul (Paraná, SC, RS)',
];

const DataInputScreen = () => {
  const [soilMoisture, setSoilMoisture] = useState('');
  const [terrainInclination, setTerrainInclination] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);

  const handleSaveData = async () => {
    if (!soilMoisture || !terrainInclination || !selectedRegion) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const newData = {
      soilMoisture,
      terrainInclination,
      region: selectedRegion,
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR'),
    };

    await saveEnvironmentalData(newData);

    Alert.alert('Sucesso', 'Dados salvos com sucesso!');
    setSoilMoisture('');
    setTerrainInclination('');
    setSelectedRegion(regions[0]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inserir Dados Ambientais</Text>

      <Text style={styles.label}>Umidade do Solo (%)</Text>
      <TextInput
        style={styles.input}
        value={soilMoisture}
        onChangeText={setSoilMoisture}
        keyboardType="numeric"
        placeholder="Ex: 45"
      />

      <Text style={styles.label}>Inclinação do Terreno (°)</Text>
      <TextInput
        style={styles.input}
        value={terrainInclination}
        onChangeText={setTerrainInclination}
        keyboardType="numeric"
        placeholder="Ex: 30"
      />

      <Text style={styles.label}>Região do Sensor</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRegion}
          onValueChange={(itemValue) => setSelectedRegion(itemValue)}
          style={styles.picker}
        >
          {regions.map((region) => (
            <Picker.Item key={region} label={region} value={region} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveData}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Salvar Dados</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DataInputScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
});
