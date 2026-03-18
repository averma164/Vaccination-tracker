import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { DocumentStyles as styles } from '../styles/DocumentStyles';

// Mock data for strictly frontend display
const MOCK_DOCUMENTS = [
    {
        id: '1',
        name: 'First Trimester Ultrasound',
        type: 'PDF',
        date: 'Oct 12, 2025',
        description: 'Detailed scan results from the 12-week ultrasound appointment. Everything looks healthy and normal.',
        icon: 'file-pdf-o',
        iconColor: '#ef4444',
        bgColor: '#fee2e2',
    },
    {
        id: '2',
        name: 'Blood Test Results',
        type: 'PDF',
        date: 'Oct 05, 2025',
        description: 'Routine blood panel including iron levels and blood group confirmation.',
        icon: 'file-pdf-o',
        iconColor: '#ef4444',
        bgColor: '#fee2e2',
    },
    {
        id: '3',
        name: 'Vaccination History',
        type: 'PDF',
        date: 'Sep 28, 2025',
        description: 'Previous vaccination records imported from the old clinic system.',
        icon: 'file-pdf-o',
        iconColor: '#ef4444',
        bgColor: '#fee2e2',
    },
    {
        id: '4',
        name: 'Dietary Plan',
        type: 'PDF',
        date: 'Sep 15, 2025',
        description: 'Recommended nutritional plan for the second trimester prepared by the nutritionist.',
        icon: 'file-pdf-o',
        iconColor: '#ef4444',
        bgColor: '#fee2e2',
    },
];

export default function DocumentScreen({ navigation }) {
    const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
    const [modalVisible, setModalVisible] = useState(false);
    const [newDocName, setNewDocName] = useState('');
    const [newDocDesc, setNewDocDesc] = useState('');

    const handleAddDocument = () => {
        if (!newDocName.trim()) {
            Alert.alert('Error', 'Please enter a document name.');
            return;
        }

        const newDoc = {
            id: Date.now().toString(),
            name: newDocName,
            type: 'PDF',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            description: newDocDesc || 'User uploaded document.',
            icon: 'file-pdf-o',
            iconColor: '#ef4444',
            bgColor: '#fee2e2',
        };

        setDocuments([newDoc, ...documents]);
        setModalVisible(false);
        setNewDocName('');
        setNewDocDesc('');
    };

    const renderDocumentCards = ({ item }) => (
        <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                <FontAwesome name={item.icon} size={24} color={item.iconColor} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.documentName}>{item.name}</Text>
                <View style={styles.documentMeta}>
                    <Text style={styles.documentType}>{item.type}</Text>
                    <Text style={styles.documentDate}>{item.date}</Text>
                </View>
                <Text style={styles.documentDescription}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#64748b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Documents</Text>
            </View>

            {/* Document List */}
            <FlatList
                data={documents}
                keyExtractor={(item) => item.id}
                renderItem={renderDocumentCards}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="folder-open-o" size={48} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No documents uploaded yet.</Text>
                    </View>
                }
            />

            {/* Floating Action Button */}
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={32} color="#ffffff" />
            </TouchableOpacity>

            {/* Upload Document Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Upload Document</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.inputLabel}>Document Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Blood Test Results"
                            value={newDocName}
                            onChangeText={setNewDocName}
                            placeholderTextColor="#94a3b8"
                        />

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Brief details about the document"
                            value={newDocDesc}
                            onChangeText={setNewDocDesc}
                            multiline={true}
                            numberOfLines={4}
                            placeholderTextColor="#94a3b8"
                        />

                        <TouchableOpacity 
                            style={styles.submitButton}
                            onPress={handleAddDocument}
                        >
                            <Text style={styles.submitButtonText}>Save Document</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
