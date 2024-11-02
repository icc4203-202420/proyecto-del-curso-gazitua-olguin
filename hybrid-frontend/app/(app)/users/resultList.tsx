import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import api from '../../services/api';
import { useSession } from '../../../hooks/useSession';


type UsersStackParamList = {
  UserDetails: { userId: string };
};

const ResultsList = React.memo(({ results }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [bars, setBars] = useState([]);
  const [selectedBarId, setSelectedBarId] = useState(null);
  const [friends, setFriends] = useState([]); // Lista de IDs de amigos
  const { session } = useSession();

  const userId = session?.user_id; // Obtener el ID del usuario autenticado

  // Cargar lista de amigos cuando se monta el componente
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get(`/users/${userId}/friendships`); // Endpoint que devuelve la lista de amigos del usuario actual
        setFriends(response.data.map((friend) => friend.id));
      } catch (error) {
        console.error('Error al cargar amigos:', error);
      }
    };

    fetchFriends();
  }, []);

  // Cargar lista de bares cuando se monta el componente
  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await api.get('/bars');
        setBars(response.data.bars);
      } catch (error) {
        console.error('Error al cargar bares:', error);
      }
    };

    fetchBars();
  }, []);

  // Función para abrir el modal y configurar el usuario seleccionado
  const openModal = (userId) => {
    setSelectedUserId(userId);
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedUserId(null);
    setSelectedBarId(null);
  };

  // Función para agregar amigo
  const addFriend = async () => {
    if (!selectedBarId) {
      alert('Por favor, selecciona un bar');
      return;
    }

    console.log('Intentando agregar amigo:');
    console.log('ID del usuario autenticado:', userId); // Mostrar el ID del usuario autenticado
    console.log('ID del amigo seleccionado:', selectedUserId);
    console.log('ID de bar seleccionado:', selectedBarId);

    try {
        const response = await api.post(`/users/${userId}/friendships`, {
          friend_id: selectedUserId,
          bar_id: selectedBarId,
        });
        
        if (response.status === 201) {
          console.log('Amigo agregado exitosamente');
          setFriends((prevFriends) => [...prevFriends, selectedUserId]);
        } else {
          console.log('Código de estado inesperado:', response.status);
          alert('Error al agregar amigo');
        }
      
        closeModal();
      } catch (error) {
        console.error('Error al agregar amigo:', error);
        if (error.response) {
          console.log('Detalles del error:', error.response.data);
        }
        alert('Error al agregar amigo');
      }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isFriend = friends.includes(item.id);

          return (
            <View style={styles.userItem}>
                <Text style={styles.userHandle}>@{item.handle}</Text>
                <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
                {isFriend && <Text style={styles.friendText}>Amigos</Text>}
              {!isFriend && <Button title="Agregar Amigo" onPress={() => openModal(item.id)} />}
            </View>
          );
        }}
      />

      {/* Modal para seleccionar el bar */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona el bar donde se conocieron</Text>
            <View style={styles.optionsContainer}>
              {bars.map((bar) => (
                <TouchableOpacity
                  key={bar.id}
                  onPress={() => setSelectedBarId(bar.id)}
                  style={[
                    styles.optionItem,
                    selectedBarId === bar.id && styles.selectedOption,
                  ]}
                >
                  <Text style={styles.optionText}>{bar.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={closeModal} />
              <Button title="Agregar Amigo" onPress={addFriend} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  userItem: { padding: 12, backgroundColor: '#1C1C1C', marginBottom: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userHandle: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
  userName: { fontSize: 14, color: '#FFFFFF' },
  friendText: { fontSize: 14, color: '#FF9800', fontWeight: 'bold', marginTop: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: 300, padding: 20, backgroundColor: '#FFFFFF', borderRadius: 10 },
  modalTitle: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  optionsContainer: { marginBottom: 20 },
  optionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  selectedOption: { backgroundColor: '#FF9800' },
  optionText: { fontSize: 16, color: '#333' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  emptyText: { color: '#FFFFFF', textAlign: 'center', marginTop: 20 },
});

export default ResultsList;
