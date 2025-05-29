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

  // Função para agrupar e calcular média por dia para uma região (ou todas as regiões)
  const agruparMediaPorDia = (dados, region = null) => {
    const agrupados = {};

    dados.forEach(({ date, region: reg, soilMoisture, terrainInclination }) => {
      if (region && reg !== region) return;

      // Extrai só a parte da data (ano-mês-dia)
      const dia = date.split('T')[0];

      if (!agrupados[dia]) {
        agrupados[dia] = { soilMoistureSoma: 0, terrainInclinationSoma: 0, count: 0 };
      }

      agrupados[dia].soilMoistureSoma += parseFloat(soilMoisture);
      agrupados[dia].terrainInclinationSoma += parseFloat(terrainInclination);
      agrupados[dia].count += 1;
    });

    const resultado = Object.entries(agrupados)
      .map(([dia, valores]) => ({
        dia,
        soilMoistureMedia: valores.soilMoistureSoma / valores.count,
        terrainInclinationMedia: valores.terrainInclinationSoma / valores.count,
      }))
      .sort((a, b) => new Date(a.dia) - new Date(b.dia));

    return resultado;
  };

  // Função para criar a lista única e ordenada de todas as datas entre todas as regiões
  const obterTodasDatas = () => {
    const diasSet = new Set();

    regions.forEach((region) => {
      const dadosAgrupados = agruparMediaPorDia(data, region);
      dadosAgrupados.forEach(({ dia }) => diasSet.add(dia));
    });

    return Array.from(diasSet).sort((a, b) => new Date(a) - new Date(b));
  };

  const allDates = obterTodasDatas();

  const getChartDataByRegion = () => {
    const datasets = regions.map((region, idx) => {
      const dadosAgrupados = agruparMediaPorDia(data, region);

      // Mapear dados para os dias gerais, colocando 0 se não tiver dado naquele dia
      const soilMoisturePorDia = allDates.map((dia) => {
        const entry = dadosAgrupados.find((d) => d.dia === dia);
        return entry ? entry.soilMoistureMedia : 0;
      });

      return {
        data: soilMoisturePorDia,
        color: () => `hsl(${(idx * 60) % 360}, 70%, 50%)`,
        strokeWidth: 2,
        name: region,
      };
    });

    return {
      labels: allDates,
      datasets,
    };
  };

  const getChartDataByRegionFiltered = () => {
    const dadosAgrupados = agruparMediaPorDia(data, selectedRegion);

    return {
      labels: dadosAgrupados.map((d) => d.dia),
      datasets: [
        {
          data: dadosAgrupados.map((d) => d.soilMoistureMedia),
          color: () => '#1976D2',
          strokeWidth: 2,
          name: 'Umidade (%)',
        },
        {
          data: dadosAgrupados.map((d) => d.terrainInclinationMedia),
          color: () => '#64B5F6',
          strokeWidth: 2,
          name: 'Inclinação (°)',
        },
      ],
    };
  };

  const lastData = data
    .filter((d) => d.region === selectedRegion)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const riskLevel =
    lastData && (lastData.soilMoisture > 70 || lastData.terrainInclination > 30)
      ? '⚠️ ALTO'
      : lastData
      ? '✅ OK'
      : '–';

  const riskColor =
    riskLevel === '⚠️ ALTO' ? '#D32F2F' : riskLevel === '✅ OK' ? '#1976D2' : '#1976D2';

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

      <Text style={[styles.riskText, { color: riskColor }]}>
        Risco Atual: {riskLevel}
      </Text>

      <Text style={styles.subTitle}>
        {selectedRegion ? `Dados de ${selectedRegion}` : 'Umidade por Região'}
      </Text>

      {(selectedRegion === '' ? allDates.length > 0 : data.length > 0) && (
        <LineChart
          data={
            selectedRegion === '' ? getChartDataByRegion() : getChartDataByRegionFiltered()
          }
          width={screenWidth - 40}
          height={300}
          chartConfig={chartConfig}
          bezier
          formatXLabel={(label) => {
            if (!label) return '';
            const parts = label.split('-');
            if (parts.length !== 3) return label;
            const [year, month, day] = parts;
            return `${day}/${month}`;
          }}
          withInnerLines={false}
          verticalLabelRotation={45}
        />
      )}

      {/* Legenda separada e organizada */}
      <View style={styles.legendContainer}>
        {selectedRegion === ''
          ? regions.map((region, idx) => (
              <Text
                key={idx}
                style={{
                  color: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
                  fontSize: 14,
                  marginVertical: 2,
                }}
              >
                ● {region}
              </Text>
            ))
          : ['Umidade (%)', 'Inclinação (°)'].map((label, idx) => (
              <Text
                key={idx}
                style={{
                  color: idx === 0 ? '#1976D2' : '#64B5F6',
                  fontSize: 14,
                  marginVertical: 2,
                }}
              >
                ● {label}
              </Text>
            ))}
      </View>

      {selectedRegion !== '' && riskLevel === '⚠️ ALTO' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Mitigation')}
        >
          <Text style={styles.buttonText}>Mitigar Riscos</Text>
        </TouchableOpacity>
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
    marginVertical: 12,
    color: '#1976D2',
  },
  riskText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#00416d',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
});
