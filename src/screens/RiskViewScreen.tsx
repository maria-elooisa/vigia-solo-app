import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getEnvironmentalData } from '../services/environmentalData';

const screenWidth = Dimensions.get('window').width;

const VisualizarRiscosScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const environmentalData = await getEnvironmentalData();
      setData(environmentalData);

      const uniqueRegions = [
        ...new Set(environmentalData.map((item) => item.region).filter(Boolean)),
      ];
      setRegions(uniqueRegions);
    };

    fetchData();
  }, []);

  // Obter labels (datas únicas ordenadas)
  const getDates = () => {
    const dates = [...new Set(data.map((item) => item.date))];
    return dates.sort();
  };

  const dates = getDates();

  // Quando sem filtro: gráfico com linhas de umidade por região
  const getChartDataByRegion = () => {
    const datasets = regions.map((region, idx) => {
      const regionData = dates.map((date) => {
        const item = data.find((d) => d.region === region && d.date === date);
        return item ? parseFloat(item.soilMoisture) : 0;
      });

      return {
        data: regionData,
        color: () => `hsl(${(idx * 60) % 360}, 70%, 50%)`,
        strokeWidth: 2,
        name: region,
      };
    });

    return {
      labels: dates,
      datasets,
      legend: regions,
    };
  };

  // Quando filtrado: gráfico com umidade e inclinação no tempo
  const getChartDataByRegionFiltered = () => {
    const regionData = dates.map((date) => {
      const item = data.find((d) => d.region === selectedRegion && d.date === date);
      return item ? parseFloat(item.soilMoisture) : 0;
    });

    const inclineData = dates.map((date) => {
      const item = data.find((d) => d.region === selectedRegion && d.date === date);
      return item ? parseFloat(item.terrainInclination) : 0;
    });

    return {
      labels: dates,
      datasets: [
        {
          data: regionData,
          color: () => '#1976D2',
          strokeWidth: 2,
          name: 'Umidade (%)',
        },
        {
          data: inclineData,
          color: () => '#64B5F6',
          strokeWidth: 2,
          name: 'Inclinação (°)',
        },
      ],
      legend: ['Umidade (%)', 'Inclinação (°)'],
    };
  };

  // Definir nível de risco pela última leitura
  const lastData = data.filter((d) => d.region === selectedRegion).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const riskLevel =
    lastData && (lastData.soilMoisture > 70 || lastData.terrainInclination > 30)
      ? '⚠️ ALTO'
      : lastData
      ? '✅ OK'
      : '–';

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Visualização de Riscos</Text>

      <Text style={styles.label}>Filtrar Região:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRegion}
          onValueChange={(itemValue) => setSelectedRegion(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todas" value="" />
          {regions.map((region, idx) => (
            <Picker.Item key={idx} label={region} value={region} />
          ))}
        </Picker>
      </View>

      <Text style={styles.subTitle}>
        {selectedRegion ? `Dados de ${selectedRegion}` : 'Umidade por Região'}
      </Text>

      {dates.length > 0 && (
        <LineChart
          data={
            selectedRegion === ''
              ? getChartDataByRegion()
              : getChartDataByRegionFiltered()
          }
          width={screenWidth - 40}
          height={300}
          chartConfig={chartConfig}
          bezier
        />
      )}

      {selectedRegion !== '' && (
        <>
          <Text style={styles.riskText}>Risco Atual: {riskLevel}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Mitigation')}
          >
            <Text style={styles.buttonText}>Mitigar Riscos</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default VisualizarRiscosScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1976D2',
  },
  riskText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#D32F2F',
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
