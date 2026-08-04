import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMinutesElapsed } from '../../../../store/cuisineActions'
import { cuisineCommandeActions } from './ActionsCuisine';
import { Swipeable } from 'react-native-gesture-handler';

export default function CardCuisson({ cmdCuisson }) {

    const { handleUpdateCmd, formatDeliveryDate, formatDeliveryTime, handleDelete } = cuisineCommandeActions()

    const renderRightActions = () => (
        <TouchableOpacity style={styles.deleteAction} onPress={() => handleDelete(cmdCuisson)}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#fff" />
            <Text style={styles.deleteActionText}>Supprimer</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.wrapper}>
            <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
                <View style={styles.card}>
                    <View style={{ flexDirection: "row", gap: 6, alignItems: "center", marginBottom: 10 }}>
                        <View style={styles.circleDot} />
                        <Text style={[styles.cardText, { textTransform: 'uppercase' }]}>  En Cuisson </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text style={styles.cardTitle}> {cmdCuisson.nature === "place" ? `Table n°${cmdCuisson.numeroTable}` : "A Exporter"} </Text>
                            <Text style={{ color: "#aeaeae" }}>{`C-${cmdCuisson.id}`}</Text>
                        </View>
                        <View style={styles.circle}>
                            <Text> {` ${getMinutesElapsed(cmdCuisson.updatedAt)}`}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "column", gap: 6, marginVertical: 20 }}>
                        {cmdCuisson.plats.map((plat, index) => (
                            <View key={index} style={{ flexDirection: "row", gap: 6, alignItems: "center", marginBottom: 10 }}>
                                <View style={[styles.circleDot, { width: 5, height: 5, backgroundColor: "#F59E0B" }]} />
                                <Text style={styles.cardText}> {plat.nbre}x {plat.label} </Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.deliveryBox}>
                        <View style={styles.deliveryHeader}>
                            <MaterialCommunityIcons name="clock-outline" size={18} color="#F59E0B" />
                            <Text style={styles.deliveryLabel}>Livraison prévue</Text>
                        </View>
                        <View style={styles.deliveryContent}>
                            <Text style={styles.deliveryDate}>
                                {formatDeliveryDate(cmdCuisson.dateCommande)}
                            </Text>
                            <Text style={styles.deliveryTime}>
                                à {formatDeliveryTime(cmdCuisson.heureCommande)}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buttonCard} onPress={() => handleUpdateCmd(cmdCuisson.id, 'prete')}>
                        <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#0b0c0e" />
                        <Text style={[styles.cardText, { fontWeight: "bold", fontSize: 18 }]}> Marquer comme prêt </Text>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        </View>
    )
}

const styles = StyleSheet.create({
    // Nouveau : gère la largeur et le centrage, à l'extérieur du Swipeable
    wrapper: {
        width: "95%",
        alignSelf: "center",
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: "column",
        gap: 6,
        width: "96%",
        margin:5 // ← occupe tout l'espace donné par "wrapper"
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#070707',
        textTransform: 'uppercase',
    },
    cardText: {
        fontSize: 15,
        color: '#010101',
    },
    circle: {
        borderRadius: 25,
        backgroundColor: '#e7e7e2',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    circleDot: {
        width: 10,
        height: 10,
        borderRadius: 25,
        backgroundColor: '#F59E0B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCard: {
        flexDirection: "row",
        gap: 6,
        justifyContent: "center",
        backgroundColor: "#F59E0B",
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "100%",
    },
    deliveryBox: {
        backgroundColor: '#FFF7ED',
        borderWidth: 1,
        borderColor: '#FDE68A',
        borderRadius: 18,
        padding: 12,
        marginBottom: 14,
    },
    deliveryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    deliveryLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#92400E',
        textTransform: 'uppercase',
    },
    deliveryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
    },
    deliveryDate: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    deliveryTime: {
        fontSize: 15,
        color: '#374151',
    },
    deleteAction: {
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        borderRadius: 25,
        gap: 4,
        marginLeft: 10, // remplace le marginRight qu'on avait mis côté card avant
    },
    deleteActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});