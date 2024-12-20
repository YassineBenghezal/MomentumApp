import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface CalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isVisible: boolean; // Prop pour contrôler la visibilité
}

const generateDays = (centerDate: Date) => {
  const start = new Date(centerDate);
  start.setDate(centerDate.getDate() - 15); // 15 jours avant
  return Array.from({ length: 31 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
};

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onDateChange, isVisible }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [days, setDays] = useState(() => generateDays(new Date()));
  const flatListRef = useRef<FlatList>(null);

  const updateDaysAround = (newDate: Date) => {
    const newStartDate = new Date(newDate);
    newStartDate.setDate(newDate.getDate() - 15);
    setStartDate(newStartDate);
    setDays(generateDays(newDate));
  };

  const centerOnDate = (date: Date) => {
    const selectedIndex = days.findIndex(d => d.toDateString() === date.toDateString());
    if (selectedIndex === -1) {
      updateDaysAround(date); // Mettre à jour les dates si la sélection est hors de la plage actuelle
    } else {
      const offsetIndex = Math.max(0, selectedIndex - 3); // 3 avant pour avoir 7 dates visibles
      flatListRef.current?.scrollToIndex({ animated: true, index: offsetIndex });
    }
  };

  useEffect(() => {
    centerOnDate(new Date()); // Centrer sur "Aujourd'hui" au chargement
  }, []);

  const handleConfirm = (date: Date) => {
    onDateChange(date);
    centerOnDate(date); // Centrer sur la date sélectionnée
  };

  return (
    <View>
      {/* Calendrier horizontal */}
      <FlatList
        ref={flatListRef}
        data={days}
        horizontal
        keyExtractor={(item) => item.toISOString()}
        getItemLayout={(data, index) => ({
          length: 60,
          offset: 60 * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 100);
        }}
        renderItem={({ item }) => {
          const isSelected = item.toDateString() === selectedDate.toDateString();
          const isToday = item.toDateString() === new Date().toDateString();
          return (
            <TouchableOpacity
              onPress={() => onDateChange(item)}
              style={[
                styles.day,
                isSelected && styles.selectedDay,
                isToday && styles.todayDay,
              ]}
            >
              <Text style={styles.dayText}>{item.toLocaleDateString('fr-FR', { weekday: 'short' })}</Text>
              <Text style={styles.dateText}>{item.getDate()}</Text>
            </TouchableOpacity>
          );
        }}
        style={styles.calendar}
        showsHorizontalScrollIndicator={false}
      />

      {/* Modal pour sélectionner une date */}
      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginVertical: 10,
  },
  day: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    width: 60,
  },
  selectedDay: {
    backgroundColor: '#00aaff',
    borderRadius: 10,
  },
  todayDay: {
    borderWidth: 2,
    borderColor: '#ffa500',
    borderRadius: 10,
  },
  dayText: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalendarView;
