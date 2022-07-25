import { ref } from "vue";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore/lite";

/************************************
 * returns { monsters, error, load }
 *
 * Call load() after calling this
 * function, e.g.:
 *
 * const { monsters, error, load } = getMonsters();
 * load();
 *
 ************************************/
const getMonsters = () => {
  const monsters = ref([]);
  const error = ref(null);

  const load = async () => {
    try {
      let data = localStorage.getItem("monsters");
      if (!data) {
        const monstersCol = collection(db, "monsters");
        const monstersSnapshot = await getDocs(monstersCol);
        monstersSnapshot.docs.map((doc) => monsters.value.push({ ...doc.data(), id: doc.id }));
        localStorage.setItem("monsters", JSON.stringify(monsters.value));
      } else {
        monsters.value = JSON.parse(data);
      }
      return monsters.value.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } catch (err) {
      error.value = err.message;
    }
  };

  return { monsters, error, load };
};

export default getMonsters;
