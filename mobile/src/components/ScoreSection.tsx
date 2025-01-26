import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ScoreSection = ({ completionRate }: { completionRate: number }) => {
    return (
        <View style={styles.centeredBlock}>
            {getCustomIcon('SCORE')}
            <Text style={styles.sectionTitle}>Score d'habitude</Text>
            <View style={styles.chartContainer}>
                <ProgressChart
                    data={{ data: [completionRate] }}
                    width={screenWidth - 80}
                    height={220}
                    strokeWidth={16}
                    radius={50}
                    chartConfig={{
                        backgroundGradientFrom: '#1e1e1e',
                        backgroundGradientTo: '#1e1e1e',
                        color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: { borderRadius: 16 },
                    }}
                    hideLegend={true}
                />
                <Text style={styles.completionText}>{Math.round(completionRate * 100)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredBlock: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 10,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingVertical: 5,
        backgroundColor: '#333',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
    },
    completionText: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default ScoreSection;