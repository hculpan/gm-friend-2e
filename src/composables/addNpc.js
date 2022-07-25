import { ref } from "vue";
import { npcsCol } from "../firebase/config";
import { addDoc } from "firebase/firestore/lite";

const addNpc = async (npc) => {
  const error = ref(null);

  try {
    await addDoc(npcsCol, npc);
  } catch (err) {
    error.value = err.message;
  }

  return error;
};

export default addNpc;
