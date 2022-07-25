<template>
  <form @submit.prevent="handleSubmit">
    <div class="container">
      <div class="row row-cols-2 my-1">
        <label class="text-end">Name:</label>
        <input class="col-3 rounded border-0" type="text" name="name" id="name" required v-model="name" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Armor Class (descending):</label>
        <input
          class="col-1 rounded border-0"
          type="number"
          name="dac"
          id="dac"
          min="-10"
          max="10"
          required
          v-model="ac"
        />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Movement:</label>
        <input class="col-2 rounded border-0" type="text" name="movement" id="movement" required v-model="movement" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Hit Dice:</label>
        <input class="col-1 rounded border-0" type="text" name="hitDice" id="hitDice" required v-model="hitDice" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">THAC0:</label>
        <input
          class="col-1 rounded border-0"
          type="number"
          name="thac0"
          id="thac0"
          min="0"
          max="20"
          required
          v-model="thac0"
        />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Number of Attacks:</label>
        <input
          class="col-1 rounded border-0"
          type="number"
          name="num_attacks"
          id="num_attacks"
          min="0"
          max="10"
          required
          v-model="num_attacks"
        />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Damage:</label>
        <input class="col-3 rounded border-0" type="text" name="damage" id="damage" required v-model="damage" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Size:</label>
        <select class="col-2 rounded border-0" name="size" id="size" v-model="size">
          <option value="Tiny">Tiny</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
          <option value="Huge">Huge</option>
          <option value="Gargantuan">Gargantuan</option>
        </select>
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">Morale:</label>
        <input class="col-2 rounded border-0" type="text" name="morale" id="morale" required v-model="morale" />
      </div>

      <div class="row row-cols-2 my-1">
        <label class="text-end">XP:</label>
        <input
          class="col-1 rounded border-0"
          type="number"
          name="xp"
          id="xp"
          min="1"
          max="999999"
          required
          v-model="xp"
        />
      </div>

      <button class="btn btn-primary my-2">Add Monster</button>
      <button class="btn btn-secondary ms-2" @click.prevent="cancel">Cancel</button>
    </div>
  </form>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { collection, addDoc } from "firebase/firestore/lite";
import { db } from "../firebase/config";

export default {
  setup() {
    const name = ref("");
    const ac = ref(10);
    const movement = ref("12");
    const hitDice = ref("1");
    const thac0 = ref(20);
    const num_attacks = ref(1);
    const damage = ref("");
    const size = ref("Medium");
    const morale = ref("");
    const xp = ref(7);

    const router = useRouter();

    const cancel = () => {
      router.push({ name: "Monster Search" });
    };

    const handleSubmit = async () => {
      let monster = {
        name: name.value,
        ac: ac.value,
        movement: movement.value,
        hitDice: hitDice.value,
        thac0: thac0.value,
        num_attacks: num_attacks.value,
        damage: damage.value,
        size: size.value,
        morale: morale.value,
        xp: xp.value,
      };

      try {
        const docRef = await addDoc(collection(db, "monsters"), monster);
        localStorage.removeItem("monsters"); // force reload of monsters in main page

        router.push("/");
      } catch (err) {
        console.log(err.message);
      }
    };

    return {
      name,
      ac,
      movement,
      hitDice,
      thac0,
      num_attacks,
      damage,
      size,
      morale,
      xp,
      handleSubmit,
      cancel,
    };
  },
};
</script>

<style></style>
