import React, { useContext, useState } from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
	ActivityIndicator
 } from 'react-native'

import { AuthContext } from '../../contexts/AuthContext'

export function SignIn(){
  
	const { signIn, loadingAuth } = useContext(AuthContext)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	async function handleLogin(){
		if(email === '' || password === ''){
			return;
		}		
		await signIn({email, password})

	}


  return(
      <View style={styles.container}>
          <Image
						style={styles.logo}
						source={require('../../assets/logo.png')}
          />

				<View style={styles.inputContainer}>
					<TextInput
						placeholder='Digite Seu Email'
						style={styles.input}
						placeholderTextColor="#F0F0F0"
						value={email}
						onChangeText={setEmail}
					/>
					<TextInput
						placeholder='Sua Senha'
						style={styles.input}
						placeholderTextColor="#F0F0F0"
						secureTextEntry={true}
						value={password}
						onChangeText={setPassword}
					/>
				</View>

				<TouchableOpacity style={styles.button} onPress={handleLogin}>
					{ loadingAuth ? (
						<ActivityIndicator size={25} color="#FFF"/>
					): (
						<Text style={styles.buttonText}>Acesssar</Text>
					)}
				</TouchableOpacity>

      </View>
  )
}

const styles = StyleSheet.create({
  container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1d1d2e'
  },
	logo:{
		marginBottom: 18
	},
	inputContainer:{
		width: '95%',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 20,
		paddingHorizontal: 14,
	},
	input:{
		width: '95%',
		height: 40,
		backgroundColor: '#101026',
		marginBottom: 12,
		borderRadius: 4,
		paddingHorizontal: 8,
		color: '#FFF'
	},
	button:{
		width: '83%',
		height: 45,
		backgroundColor: '#3fffa3',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText:{
		fontSize: 18,
		fontWeight: 'bold',
		color: '#101026'
	}
})