import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchBar } from '@rneui/themed';
import api from '../../services/api';
import ResultsList from './resultList'; 
import { debounce } from 'lodash';

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = useCallback(
    async (query) => {
      if (query.trim() === '') {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/users/search?query=${query}`);
        setResults(response.data.users);
      } catch (error) {
        console.error('Error al buscar usuarios:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search function
  const debouncedSearch = useCallback(debounce(searchUsers, 300), [searchUsers]);

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <SearchBarInput
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        loading={loading}
      />
      <ResultsList results={results} />
    </View>
  );
};

const SearchBarInput = React.memo(({ searchTerm, onSearchChange, loading }) => (
  <SearchBar
    placeholder="Buscar usuario..."
    value={searchTerm}
    onChangeText={onSearchChange}
    platform="default"
    containerStyle={styles.searchBarContainer}
    inputContainerStyle={styles.searchBarInput}
    showLoading={loading}
  />
));

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#000' },
  searchBarContainer: { backgroundColor: '#000', borderBottomColor: 'transparent', borderTopColor: 'transparent' },
  searchBarInput: { backgroundColor: '#1C1C1C' },
});

export default SearchUser;
