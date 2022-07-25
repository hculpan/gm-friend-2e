import { ref } from "vue";
import { locationsCol } from "../firebase/config";
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
const getLocations = async () => {
  let result = [];
  let error = null;

  try {
    const q = query(locationsCol, orderBy("location"));
    const snapshot = await getDocs(q);
    snapshot.docs.map((doc) => result.push({ ...doc.data(), id: doc.id }));
    return { result, error };
  } catch (err) {
    error = err.message;
  }

  return { result, error };
};

export default getLocations;
