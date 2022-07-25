import { ref } from 'vue'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore/lite'

/************************************
 * returns { monster, error, load }
 * 
 * Call load() after calling this
 * function, e.g.:
 * 
 * const { monster, error, load } = getMonsters();
 * load();
 * 
 ************************************/
const getMonsters = (id, monsterRef) => {
    const error = ref(null)

    const load = async () => {
        try {
            const docRef = doc(db, "monsters", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                monsterRef.value = { ...docSnap.data(), id: docSnap.id };
            } else {
                throw Error("Document does not exist");
            }
        } catch (err) {
            error.value = err.message;
        }
    };

    load();

    return { error }
}

export default getMonsters