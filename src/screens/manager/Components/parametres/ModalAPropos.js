import React from 'react'
import { Modal, Text, View, TextInput, ScrollView,StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthActions } from '../../../../store/useAuthActions';
export default function ModalAPropos({visible, onClose, onModif}) {
    const handleClose = () => {
        onClose();
    }

 return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={[styles.overlay]}>
                <View style={[styles.modalContainer]}>
                    <Text style={styles.headerTitle}> A propos</Text>
                    <View style={styles.container}>
                        <View style={styles.circleDot}>
                            <Text>🍔</Text>
                        </View>
                        <View>
                            <Text style={styles.appName}>BurgerQueen</Text>
                            <Text style={styles.text}>Version 1.0.0</Text>
                        </View>
                    </View>
                    <Text style={styles.text}> L'app tout-en-un pour piloter votre restaurant : cuisine, menu, stocks et équipe. </Text>
                    <View style={[styles.button, { backgroundColor: "#b2b4b7", paddingHorizontal: 12 }]}>
                        <Text
                            style={styles.helpText}
                            numberOfLines={2}
                            adjustsFontSizeToFit
                            minimumFontScale={0.7}
                        >
                            Besoin d'aide ? Contactez{' '}
                            <Text
                                style={styles.emailText}
                                onPress={() => Linking.openURL('mailto:support@burgerqueen.app')}
                            >
                                support@burgerqueen.app
                            </Text>
                        </Text>
                    </View>
                    <TouchableOpacity onPress={handleClose} style={styles.button}>
                        <Text style= {styles.buttonText}> 
                            Compris
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius:30,borderTopRightRadius:30, padding: 24, maxHeight: '85%', flexDirection:"column" },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#070707',marginBottom:20 },
    button: {
    backgroundColor: '#F59E0B',
    borderRadius: 24,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
    container: { marginBottom: 20, flexDirection:"row", gap:10 ,  },
    text: { fontSize: 14 , color: '#6B7280', paddingBottom: 13 }, 
    card : {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    width: '100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    flexDirection:"row",
    justifyContent:"center" ,
    alignItems:"center", 
    gap:10
  } ,
  circleDot:{
    width: 40,
    height: 40,
    borderRadius: 30, 
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    
  } ,
   appName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#070707',
        marginBottom:5,
    },
   helpText: {
        width: '100%',
        textAlign: "center",
        color: '#111827',
        fontSize: 14,
    },
    emailText: {
        color: '#0c0d10',
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});
