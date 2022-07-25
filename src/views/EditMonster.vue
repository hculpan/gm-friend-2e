<template>
  <div class="container mt-3">
    <form id="editMonster" @submit.prevent="handleSubmit">
      <div class="row row-cols-2 my-1">
        <label class="text-end">Name:</label>
        <input class="col-3 rounded border-0" type="text" name="name" id="name" required v-model="monster.name" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Armor Class (descending):</label>
        <input class="col-1 rounded border-0" type="text" name="dac" id="dac" required v-model="monster.ac" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Movement:</label>
        <input
          class="col-2 rounded border-0"
          type="text"
          name="movement"
          id="movement"
          required
          v-model="monster.movement"
        />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Hit Dice:</label>
        <input
          class="col-2 rounded border-0"
          type="text"
          name="hitDice"
          id="hitDice"
          required
          v-model="monster.hit_dice"
        />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">THAC0:</label>
        <input class="col-1 rounded border-0" type="text" name="thac0" id="thac0" required v-model="monster.thac0" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Number of Attacks:</label>
        <input
          name="num_attacks"
          id="num_attacks"
          required
          class="col-1 rounded border-0"
          v-model="monster.no_attacks"
        />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Damage:</label>
        <input class="col-2 rounded border-0" type="text" name="damage" id="damage" required v-model="monster.damage" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Size:</label>
        <input name="size" id="size" required class="col-1 rounded border-0" v-model="monster.size" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Morale:</label>
        <input class="col-2 rounded border-0" type="text" name="morale" id="morale" required v-model="monster.morale" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">XP:</label>
        <input class="col-1 rounded border-0" type="text" name="xp" id="xp" required v-model="monster.xp" />
      </div>

      <button class="btn btn-primary mt-3" :disabled="monster.id == -1">Update Monster</button>
      <button class="btn btn-secondary ms-2 mt-3" @click.prevent="cancel">Cancel</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import getMonster from "../composables/getMonster";
import { doc, setDoc } from "firebase/firestore/lite";
import { db } from "../firebase/config";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    const monster = ref({});
    const error = ref(null);

    onMounted(() => {
      var err = getMonster(route.params.monsterId, monster);
      if (err && err.value) {
        console.log(err);
      }
    });

    const handleSubmit = async () => {
      if (monster.value.id) {
        try {
          await setDoc(doc(db, "monsters", monster.value.id), monster.value);
          localStorage.removeItem("monsters"); // force reload of monsters in main page

          router.push("/");
        } catch (err) {
          error.value = err;
        }
      }
    };

    const cancel = () => {
      router.push({ name: "Monster Search" });
    };

    return {
      error,
      monster,
      handleSubmit,
      cancel,
    };
  },
};
</script>

<style>
#editMonster input {
  width: 300px;
}
</style>
