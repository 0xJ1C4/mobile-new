import { NEXT_API_URL } from "@/constants/api"
import { removeSession } from "./session"
import { Router, useRouter } from "expo-router"
import { AuthenticationError } from "@/constants/error"
import { saveSessionFromQr } from "./session"
import { Alert } from "react-native"
type Credentials = {
    email: string,
    password: string
}

export const signInUser = async (credentials: Credentials) => {
    try {
        const request = await fetch(`${NEXT_API_URL}/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })

        const data = await request.json()
        if(!request.ok) throw new AuthenticationError()


        return data?.session;
    } catch (error ) {
        if(error  instanceof AuthenticationError) {
            Alert.alert(error.message)
        }
    }

}