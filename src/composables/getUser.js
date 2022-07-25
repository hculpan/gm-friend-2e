import { ref } from 'vue'
import { auth } from '../firebase/config'

const user = ref(auth.currentUser)

auth.onAuthStateChanged((currentUser) => {
    user.value = currentUser
})

const getUser = () => {
    return { user }
}

export default getUser