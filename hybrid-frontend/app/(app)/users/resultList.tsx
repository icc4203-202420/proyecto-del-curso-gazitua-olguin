import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import api from '../../services/api';
import { useSession } from '../../../hooks/useSession';
import AddFriendModal from '../../components/modal/addfriendModal';

const ResultsList = React.memo(({ results }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [bars, setBars] = useState([]);
  const [selectedBarId, setSelectedBarId] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [friends, setFriends] = useState([]);
  const { session } = useSession();

  const userId = session?.user_id;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get(`/users/${userId}/friendships`);
        setFriends(response.data.map((friend) => friend.id));
      } catch (error) {
        console.error('Error al cargar amigos:', error);
      }
    };

    fetchFriends();
  }, []);

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  const openModal = (userId) => {
    setSelectedUserId(userId);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedUserId(null);
    setSelectedBarId(null);
  };

  const addFriend = async () => {
    if (!selectedBarId) {
      alert('Por favor, selecciona un bar');
      return;
    }

    try {
      const response = await api.post(`/users/${userId}/friendships`, {
        friend_id: selectedUserId,
        bar_id: selectedBarId,
        event_id: selectedEventId || null,
      });

      if (response.status === 201) {
        setFriends((prevFriends) => [...prevFriends, selectedUserId]);
        closeModal();
      } else {
        alert('Error al agregar amigo');
      }
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      alert('Error al agregar amigo');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={results.filter((item) => item.id !== userId)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isFriend = friends.includes(item.id);

          return (
            <View style={styles.userItem}>
              <Text style={styles.userHandle}>@{item.handle}</Text>
              {isFriend && <Text style={styles.friendText}>Siguiendo</Text>}
              {!isFriend && (
                <Button title="Seguir" onPress={() => openModal(item.id)} color="#FF9800" />
              )}
            </View>
          );
        }}
      />

      <AddFriendModal
        isVisible={isModalVisible}
        onClose={closeModal}
        onAddFriend={addFriend}
        bars={bars}
        events={events}
        selectedBarId={selectedBarId}
        setSelectedBarId={setSelectedBarId}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  userItem: {
    padding: 12,
    backgroundColor: '#1C1C1C',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userHandle: { fontSize: 18, color: '#FF9800', fontWeight: 'bold' },
  userName: { fontSize: 14, color: '#FFFFFF' },
  friendText: {color: '#FFF'},
});

export default ResultsList;
