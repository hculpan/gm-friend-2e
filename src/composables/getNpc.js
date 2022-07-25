import { ref } from "vue";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore/lite";

const getNpc = async (id) => {
  const error = ref(null);
  let result = null;

  try {
    const docRef = doc(db, "npcs", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      result = { ...docSnap.data(), id: docSnap.id };
    } else {
      throw Error("Document does not exist");
    }
  } catch (err) {
    error.value = err.message;
  }

  return { result, error };
};

export default getNpc;
