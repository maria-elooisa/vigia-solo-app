import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Picker,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getEnvironmentalData } from '../services/environmentalData';
import { theme } from '../styles/theme';

const regions = [
  'Todas',
  'Polígono das Secas (Nordeste)',
  'Sudoeste Baiano (Bahia)',
  'Região do Cerrado (Centro-Oeste)',
  'Vale do Itajaí (Santa Catarina)',
  'Região Sul (Paraná, SC, RS)',
];

const parseDate = (dateStr: string) => {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const HistoryScreen = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [regionFilter, setRegionFilter] = useState('Todas');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEnvironmentalData();
      setHistory(data);
      setFilteredHistory(data);
    };

    fetchData();
  }, []);

  const filterData = () => {
    let filtered = [...history];

    if (regionFilter !== 'Todas') {
      filtered = filtered.filter((item) => item.region === regionFilter);
    }

    if (startDate) {
      const start = parseDate(startDate);
      if (!start) {
        Alert.alert('Data inválida', 'Formato da data inicial deve ser dd/mm/aaaa');
        return;
      }
      filtered = filtered.filter((item) => {
        const itemDate = parseDate(item.date.split(' ')[0]);
        return itemDate && itemDate >= start;
      });
    }

    if (endDate) {
      const end = parseDate(endDate);
      if (!end) {
        Alert.alert('Data inválida', 'Formato da data final deve ser dd/mm/aaaa');
        return;
      }
      filtered = filtered.filter((item) => {
        const itemDate = parseDate(item.date.split(' ')[0]);
        return itemDate && itemDate <= end;
      });
    }

    setFilteredHistory(filtered);
    setFilterVisible(false);
  };

  const resetFilters = () => {
    setRegionFilter('Todas');
    setStartDate('');
    setEndDate('');
    setFilteredHistory(history);
    setFilterVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Monitoramento</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterButton}>
          <Ionicons name="filter-outline" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {filteredHistory.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum dado registrado para os filtros aplicados.</Text>
        ) : (
          filteredHistory.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemText}>🌱 Umidade do Solo: {item.soilMoisture}</Text>
              <Text style={styles.itemText}>📐 Inclinação: {item.terrainInclination}°</Text>
              <Text style={styles.itemText}>📍 Região: {item.region}</Text>
              <Text style={styles.itemText}>📅 Data: {item.date}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Filtros</Text>

            <Text style={styles.label}>Região</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={regionFilter}
                onValueChange={setRegionFilter}
                style={styles.picker}
              >
                {regions.map((region) => (
                  <Picker.Item key={region} label={region} value={region} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Data Inicial (dd/mm/aaaa)</Text>
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="Ex: 01/05/2025"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Data Final (dd/mm/aaaa)</Text>
            <TextInput
              style={styles.input}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="Ex: 31/05/2025"
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={filterData}>
                <Text style={styles.buttonText}>Aplicar Filtros</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#aaa', marginLeft: 10 }]}
                onPress={resetFilters}
              >
                <Text style={styles.buttonText}>Limpar Filtros</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.closeButton]}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  filterButton: {
    padding: 6,
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
  item: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 8,
    marginTop: 14,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 12,
    alignItems: 'center',
  },
});
