import { ref } from "vue"
import { auth } from "../firebase/config"
import { signInWithEmailAndPassword } from 'firebase/auth'

const error = ref(null)

const login = async (email, password) => {
    error.value = null

    try {
        error.value = null
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        if (userCredential) {
            const user = userCredential.user;
            return user
        } else {
            console.log('got error')
            throw Error('')
        };
    } catch (err) {
        error.value = 'Incorrect login credentials'
        return null
    }
}

const useLogin = () => {
    return { error, login }
}

export default useLogin