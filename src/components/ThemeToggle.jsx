import React from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";

const ThemeToggle = ({isDark, onToggle, theme}) => (
    <TouchableOpacity
    style={[styles.button, {backgroundColor: theme.primary}]}
    onPress={onToggle}>
        <Text style={styles.icon}>{isDark ? '🌙' : '☀️'}</Text>

    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 18,
    },
});

export default ThemeToggle;