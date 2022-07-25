import { ref } from "vue";
import { npcsCol } from "../firebase/config";
import { getDocs, query, orderBy } from "firebase/firestore/lite";

/************************************
 * returns { npcs, error, load }
 *
 * Call load() after calling this
 * function, e.g.:
 *
 * const { npcs, error, load } = getNpcs();
 * load();
 *
 ************************************/
const getNpcs = () => {
  const npcs = ref([]);
  const error = ref(null);

  const load = async () => {
    try {
      const q = query(npcsCol, orderBy("name"));
      const snapshot = await getDocs(q);
      snapshot.docs.map((doc) => npcs.value.push({ ...doc.data(), id: doc.id }));
      return npcs.value;
    } catch (err) {
      error.value = err.message;
    }
  };

  return { npcs, error, load };
};

export default getNpcs;
