import React from "react";
import { Text,View, StyleSheet } from 'react-native';
import themeColorsAppList from "../../app_values/Themes";
const ColorsApp = themeColorsAppList[1]
const RowDaysWeek = ({LanguageStore}) => {

    return (
        <View style = {styles.Views_row}>
            <View style = {styles.Views_day}>
                <Text style = {styles.week_day}>{LanguageStore.Calendar.ListWeekDaysShortName[0]}</Text>
            </View>
            <View style = {styles.Views_day}>
                <Text style = {styles.week_day}>{LanguageStore.Calendar.ListWeekDaysShortName[1]}</Text>
            </View>
            <View style = {styles.Views_day}>
                <Text style = {styles.week_day}>{LanguageStore.Calendar.ListWeekDaysShortName[2]}</Text>
            </View>
            <View style = {styles.Views_day}>
                <Text style = {styles.week_day}>{LanguageStore.Calendar.ListWeekDaysShortName[3]}</Text>
            </View>
            <View style = {styles.Views_day}>
                <Text style = {styles.week_day}>{LanguageStore.Calendar.ListWeekDaysShortName[4]}</Text>
            </View>
            <View style = {styles.Views_day}>
                <Text style = {styles.week_day}>{LanguageStore.Calendar.ListWeekDaysShortName[5]}</Text>
            </View>
            <View style = {styles.Views_day}>
                <Text style = {styles.week_day}>{LanguageStore.Calendar.ListWeekDaysShortName[6]}</Text>
            </View>
        </View>
    )
}
export default RowDaysWeek;

const styles = StyleSheet.create({
    Views_row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8

    },
    Views_day: {
        justifyContent: 'center',
        alignItems: 'center', 
        margin: 1,
        height: 27,
        width: 50,
        backgroundColor: ColorsApp.skyUpUp,
        borderRadius: 12,
        
    },
    week_day: {
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: "bold",
        textTransform: 'uppercase'
    }
});