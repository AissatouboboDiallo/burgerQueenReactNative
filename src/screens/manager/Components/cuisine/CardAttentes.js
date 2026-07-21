import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMinutesElapsed } from '../../../../store/cuisineActions'
import { cuisineCommandeActions } from './ActionsCuisine';
import { Swipeable } from 'react-native-gesture-handler';

export default function CardAttentes({ cmdAttente }) {

    const { formatDeliveryDate, formatDeliveryTime, handleDelete, handleUpdateCmd } = cuisineCommandeActions()

    const renderRightActions = () => (
        <TouchableOpacity style={styles.deleteAction} onPress={() => handleDelete(cmdAttente)}>
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
                        <Text style={[styles.cardText, { textTransform: 'uppercase' }]}>  En attente </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View>
                            <Text style={styles.cardTitle}> {cmdAttente.nature === "place" ? `Table n°${cmdAttente.numeroTable}` : "A Exporter"} </Text>
                            <Text style={{ color: "#aeaeae" }}>{`C-${cmdAttente.id}`}</Text>
                        </View>
                        <View style={styles.circle}>
                            <Text> {`il y a ${getMinutesElapsed(cmdAttente.createdAt)} `}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "column", gap: 6, marginVertical: 20 }}>
                        {cmdAttente.plats.map((plat, index) => (
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
                                {formatDeliveryDate(cmdAttente.dateCommande)}
                            </Text>
                            <Text style={styles.deliveryTime}>
                                à {formatDeliveryTime(cmdAttente.heureCommande)}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.buttonCard} onPress={() => handleUpdateCmd(cmdAttente.id, 'cuisson')}>
                        <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#0f0f10" />
                        <Text style={[styles.cardText, { fontWeight: "bold", fontSize: 18 }]}> Lancer la préparation </Text>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        </View>
    )
}

const styles = StyleSheet.create({
    // Gère la largeur et l'espacement, à l'extérieur du Swipeable
    wrapper: {
        width: "100%",
        paddingHorizontal: 10,
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
        margin:5,
        width: "95%", // occupe tout l'espace donné par "wrapper" (moins son padding)
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
        backgroundColor: '#dbdbda',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCard: {
        flexDirection: "row",
        gap: 6,
        justifyContent: "center",
        backgroundColor: "#e7e7e2",
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
        marginLeft: 10,
    },
    deleteActionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});