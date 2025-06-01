import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Picker,
} from 'react-native';
import { getEnvironmentalData } from '../services/environmentalData';

const regions = [
  'Todas',
  'Polígono das Secas (Nordeste)',
  'Sudoeste Baiano (Bahia)',
  'Região do Cerrado (Centro-Oeste)',
  'Vale do Itajaí (Santa Catarina)',
  'Região Sul (Paraná, SC, RS)',
];

const HistoryScreen = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [regionFilter, setRegionFilter] = useState('Todas');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEnvironmentalData();
      setHistory(data);
      setFilteredHistory(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (regionFilter === 'Todas') {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(history.filter(item => item.region === regionFilter));
    }
  }, [regionFilter, history]);

  const formatDateToBR = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Picker
          selectedValue={regionFilter}
          onValueChange={setRegionFilter}
          style={styles.picker}
        >
          {regions.map(region => (
            <Picker.Item key={region} label={region} value={region} />
          ))}
        </Picker>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {filteredHistory.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum dado encontrado.</Text>
        ) : (
          filteredHistory.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemText}>
                🌱 {item.soilMoisture} | 📐 {item.terrainInclination}°
              </Text>
              <Text style={styles.itemSubText}>{item.region}</Text>
              <Text style={styles.itemSubText}>{formatDateToBR(item.date)}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  container: {
    padding: 14,
  },
  item: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubText: {
    fontSize: 13,
    color: '#555',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});
