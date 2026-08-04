import React from 'react'
import { View,Text, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ModelTitle({title, littleTitle, icons}) {
  return (
             <View style={styles.directionRow}>
                    <View style={{flexDirection:"column", alignContent:"center"}}>
                        <Text style={styles.title}>
                            {title}
                        </Text>
                        <Text style={styles.stockLabel}>
                            {littleTitle}
                        </Text>
                    </View>
                    <View style={styles.circle}>
                        <Ionicons name={icons} size={24} color={'#0F172A'}   />
                    </View>
             </View>       
  )
}

const styles = StyleSheet.create({
     stockLabel:    { fontSize: 14, fontWeight: '500', color: '#6B7280' },
     title:         { fontSize: 24, fontWeight: '700', color: '#000000', marginBottom: 5 },
    directionRow: { flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start",marginHorizontal:20, marginTop:10 },
  circle: { width: 50, height: 50, borderRadius: 30, backgroundColor: '#f6f4f0', justifyContent: 'center', alignItems: 'center' },


})