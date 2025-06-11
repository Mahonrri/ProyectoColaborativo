import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Registro {
  id: number;
  sensor: string;
  lugar: string;
  hora: string;
  fecha: string;
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [form, setForm] = useState({
    sensor: '',
    lugar: '',
    hora: '',
    fecha: '',
  });

  const generarDatoAleatorio = () => {
    const sensores = ['Sensor-A', 'Sensor-B', 'Sensor-C'];
    const lugares = ['Entrada', 'Sala', 'Laboratorio', 'Oficina'];

    const sensor = sensores[Math.floor(Math.random() * sensores.length)];
    const lugar = lugares[Math.floor(Math.random() * lugares.length)];
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString();
    const fecha = ahora.toLocaleDateString();

    return { sensor, lugar, hora, fecha };
  };

  const agregarRegistro = () => {
    const { sensor, lugar, hora, fecha } = generarDatoAleatorio();
    const nuevoRegistro = {
      sensor,
      lugar,
      hora,
      fecha,
      id: registros.length + 1,
    };

    setRegistros((prev) => [...prev, nuevoRegistro]);
  };

  useEffect(() => {
    agregarRegistro();

    const intervalo = setInterval(() => {
      agregarRegistro();
    }, 180000); // 3 minutos

    return () => clearInterval(intervalo);
  }, []);

  // 🔢 Función para contar ocurrencias por campo
  const contarPorCampo = (campo: keyof Registro) => {
    return registros.reduce((acc: Record<string, number>, registro) => {
      const valor = registro[campo];
      acc[valor] = (acc[valor] || 0) + 1;
      return acc;
    }, {});
  };

  const conteoPorSensor = contarPorCampo('sensor');
  const conteoPorLugar = contarPorCampo('lugar');

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ausencia y Presencia</Text>

      <FlatList
        data={registros}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <View style={styles.tablaEncabezado}>
            <Text style={styles.encabezado}>ID</Text>
            <Text style={styles.encabezado}>Sensor</Text>
            <Text style={styles.encabezado}>Lugar</Text>
            <Text style={styles.encabezado}>Hora</Text>
            <Text style={styles.encabezado}>Fecha</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.fila}>
            <Text>{item.id}</Text>
            <Text>{item.sensor}</Text>
            <Text>{item.lugar}</Text>
            <Text>{item.hora}</Text>
            <Text>{item.fecha}</Text>
          </View>
        )}
      />

      {/* 📊 Información adicional */}
      <View style={styles.resumenContainer}>
        <Text style={styles.resumenTitulo}>Resumen de Registros</Text>
        <Text>Total: {registros.length}</Text>

        <Text style={styles.resumenSubtitulo}>Por Sensor:</Text>
        {Object.entries(conteoPorSensor).map(([sensor, count]) => (
          <Text key={sensor}>
            {sensor}: {count}
          </Text>
        ))}

        <Text style={styles.resumenSubtitulo}>Por Lugar:</Text>
        {Object.entries(conteoPorLugar).map(([lugar, count]) => (
          <Text key={lugar}>
            {lugar}: {count}
          </Text>
        ))}
      </View>

      {/* Modal para nuevo registro manual */}
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.titulo}>Nuevo Registro</Text>

            <TextInput
              placeholder="Sensor"
              style={styles.input}
              value={form.sensor}
              onChangeText={(text) => setForm({ ...form, sensor: text })}
            />
            <TextInput
              placeholder="Lugar"
              style={styles.input}
              value={form.lugar}
              onChangeText={(text) => setForm({ ...form, lugar: text })}
            />
            <TextInput
              placeholder="Hora"
              style={styles.input}
              value={form.hora}
              onChangeText={(text) => setForm({ ...form, hora: text })}
            />
            <TextInput
              placeholder="Fecha"
              style={styles.input}
              value={form.fecha}
              onChangeText={(text) => setForm({ ...form, fecha: text })}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={styles.botonModal}
                onPress={() => {
                  setRegistros((prev) => [
                    ...prev,
                    { ...form, id: prev.length + 1 },
                  ]);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.botonTexto}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonModal}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.botonTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F2F2F2' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  tablaEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#007bff',
    padding: 10,
  },
  encabezado: {
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  resumenContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
  },
  resumenTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  resumenSubtitulo: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  botonTexto: { color: 'white', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContenido: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  botonModal: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '48%',
    alignItems: 'center',
  },
});
