import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPostAuth, apiPutAuth } from '../config/apiRequest';
import { useFlash } from '../context/FlashContext';
import { FontAwesome } from '@expo/vector-icons';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function RegisterBabyScreen({ route, navigation }) {
    const { showFlash } = useFlash();

    const existingBaby = route?.params?.babyData;
    const isEditMode = !!existingBaby;

    const [babyName, setBabyName] = useState(existingBaby?.babyName || '');
    const [dateOfBirth, setDateOfBirth] = useState(existingBaby?.dateOfBirth ? existingBaby.dateOfBirth.split('T')[0] : '');
    const [gender, setGender] = useState(existingBaby?.gender || '');
    const [bloodGroup, setBloodGroup] = useState(existingBaby?.bloodGroup || '');
    const [motherConceiveDate, setMotherConceiveDate] = useState(existingBaby?.motherConceiveDate ? existingBaby.motherConceiveDate.split('T')[0] : '');

    const [showDobPicker, setShowDobPicker] = useState(false);
    const [showMcdPicker, setShowMcdPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDateChange = (event, selectedDate, setter, hidePicker) => {
        hidePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setter(selectedDate.toISOString().split('T')[0]);
        }
    };

    const handleSubmit = async () => {
        if (!babyName.trim() || !dateOfBirth.trim()) {
            showFlash('Baby Name and Date of Birth are mandatory', 'warning');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const payload = {
                babyName: babyName.trim(),
                dateOfBirth,
                gender: gender || null,
                bloodGroup: bloodGroup || null,
                motherConceiveDate: motherConceiveDate || null
            };

            let response, data;
            if (isEditMode) {
                const result = await apiPutAuth(`/user/baby/${existingBaby._id}`, payload, token);
                response = result.response; data = result.data;
            } else {
                const result = await apiPostAuth('/user/baby', payload, token);
                response = result.response; data = result.data;
            }

            if (response.ok) {
                showFlash(`Child ${isEditMode ? 'updated' : 'registered'} successfully!`, 'success');
                setTimeout(() => navigation.goBack(), 800);
            } else {
                showFlash(data.message || 'Failed to save', 'error');
            }
        } catch (error) {
            showFlash('Connection Error', 'error');
        } finally {
            setLoading(false);
        }
    };

    const SectionLabel = ({ text }) => (
        <Text style={styles.sectionLabel}>{text}</Text>
    );

    const Selector = ({ options, selected, onSelect }) => (
        <View style={styles.selectorRow}>
            {options.map(opt => (
                <TouchableOpacity
                    key={opt}
                    style={[styles.selectorChip, selected === opt && styles.selectorChipActive]}
                    onPress={() => onSelect(selected === opt ? '' : opt)}
                >
                    <Text style={[styles.selectorChipText, selected === opt && styles.selectorChipTextActive]}>{opt}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <FontAwesome name="chevron-left" size={14} color="#e8703a" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Edit Child' : 'Register Child'}</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>{isEditMode ? 'Update child details' : 'Add your child'}</Text>
                    <Text style={styles.subtitle}>Name and Date of Birth are mandatory. Other fields are optional.</Text>
                </View>

                {/* Basic Info */}
                <SectionLabel text="Basic Information" />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Child's Full Name *</Text>
                    <TextInput style={styles.input} placeholder="Enter child's name" value={babyName} onChangeText={setBabyName} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Date of Birth *</Text>
                    {Platform.OS === 'web' ? (
                        <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={dateOfBirth} onChangeText={setDateOfBirth} />
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => setShowDobPicker(true)} style={[styles.input, { justifyContent: 'center' }]}>
                                <Text style={{ fontSize: 16, color: dateOfBirth ? '#0f172a' : '#94a3b8' }}>{dateOfBirth || "Select Date of Birth"}</Text>
                            </TouchableOpacity>
                            {showDobPicker && <DateTimePicker value={dateOfBirth ? new Date(dateOfBirth) : new Date()} mode="date" display="default" maximumDate={new Date()} onChange={(e, d) => { if (Platform.OS !== 'ios') setShowDobPicker(false); handleDateChange(e, d, setDateOfBirth, setShowDobPicker); }} />}
                        </>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender</Text>
                    <Selector options={GENDERS} selected={gender} onSelect={setGender} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Blood Group</Text>
                    <Selector options={BLOOD_GROUPS} selected={bloodGroup} onSelect={setBloodGroup} />
                </View>

                {/* Pregnancy Info */}
                <SectionLabel text="Pregnancy Details (Optional)" />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mother's Conception Date</Text>
                    {Platform.OS === 'web' ? (
                        <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={motherConceiveDate} onChangeText={setMotherConceiveDate} />
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => setShowMcdPicker(true)} style={[styles.input, { justifyContent: 'center' }]}>
                                <Text style={{ fontSize: 16, color: motherConceiveDate ? '#0f172a' : '#94a3b8' }}>{motherConceiveDate || "Select Conception Date"}</Text>
                            </TouchableOpacity>
                            {showMcdPicker && <DateTimePicker value={motherConceiveDate ? new Date(motherConceiveDate) : new Date()} mode="date" display="default" onChange={(e, d) => { if (Platform.OS !== 'ios') setShowMcdPicker(false); handleDateChange(e, d, setMotherConceiveDate, setShowMcdPicker); }} />}
                        </>
                    )}
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>{isEditMode ? 'Save Changes' : 'Register Child'}</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    backButton: { flexDirection: 'row', alignItems: 'center', width: 60 },
    backText: { color: '#e8703a', fontSize: 16, marginLeft: 4, fontWeight: '500' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
    container: { padding: 24, paddingBottom: 48 },
    headerContainer: { marginBottom: 24 },
    title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
    subtitle: { fontSize: 14, color: '#64748b' },
    sectionLabel: { fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 8 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
    input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#0f172a' },
    selectorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    selectorChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#e2e8f0' },
    selectorChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
    selectorChipText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    selectorChipTextActive: { color: '#ffffff' },
    submitButton: { backgroundColor: '#3b82f6', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
    submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' }
});
