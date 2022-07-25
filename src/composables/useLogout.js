import { ref } from "vue"
import { auth } from "../firebase/config"
import { signOut } from 'firebase/auth'


const error = ref(null)

const logout = async () => {
    error.value = null

    try {
        error.value = null
        await signOut(auth)
    } catch (err) {
        error.value = 'Incorrect login credentials'
    }
}

const useLogout = () => {
    return { error, logout }
}

export default useLogout