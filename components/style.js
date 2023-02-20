import { StyleSheet} from 'react-native'
import color from '../contains/color'

const styles = StyleSheet.create({
    header:{
        backgroundColor: color.box,
        width : '100%',
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btnBox:{
        padding: 15,
    },
    text :{
        fontSize: 24,
        color: color.white,
        fontWeight: 'bold',
    },
    searchBox:{
        flex: 1,
        backgroundColor: color.white,
        marginVertical: 10,
        // justifyContent: 'center'
        // alignItems:
    },
    searchInput:{
        // backgroundColor: color.buttonBlue,
        justifyContent: 'center',
        color: color.black,
    },
})

export default styles
