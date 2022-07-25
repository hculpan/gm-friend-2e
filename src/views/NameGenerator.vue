<template>
  <section id="name-generator">
    <div class="h3">Names</div>

    <div class="container justify-content-center">
      <div class="btn-group mb-3" role="group" aria-label="Basic radio toggle button group">
        <input
          type="checkbox"
          class="btn-check"
          name="btnradio"
          id="btnradio1"
          autocomplete="off"
          :value="NameType.MALE"
          v-model="types"
        />
        <label class="btn btn-outline-primary" for="btnradio1">Male</label>

        <input
          type="checkbox"
          class="btn-check"
          name="btnradio"
          id="btnradio2"
          autocomplete="off"
          :value="NameType.FEMALE"
          v-model="types"
        />
        <label class="btn btn-outline-primary" for="btnradio2">Female</label>

        <input
          type="checkbox"
          class="btn-check"
          name="btnradio"
          id="btnradio3"
          autocomplete="off"
          :value="NameType.TOWN"
          v-model="types"
        />
        <label class="btn btn-outline-primary" for="btnradio3">Town</label>
      </div>
      <div>
        <label class="me-2">Number of names</label>
        <input type="number" name="nameCount" id="nameCount" min="1" max="100" v-model="nameCount" />
      </div>
      <div class="my-3">
        <button class="btn btn-primary me-2" @click="generateNames">Generate Names</button>
        <button class="btn btn-secondary" @click="names = []">Clear List</button>
      </div>

      <NameList :names="names" :showType="showType" />

      <div>
        <input
          type="checkbox"
          class="btn-check"
          name="toggletypes"
          id="toggletypes"
          autocomplete="off"
          v-model="showType"
        />
        <label class="btn btn-outline-primary mt-2 btn-sm" for="toggletypes">Show Types</label>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import NameList from "../components/NameList.vue";
import rollDice from "../composables/rollDice";

import maleNames from "../data/male-names.json";
import femaleNames from "../data/female-names.json";
import placePrefix from "../data/place-prefix.json";
import placeSuffix from "../data/place-suffix.json";

const names = ref([]);

const NameType = {
  MALE: "male",
  FEMALE: "female",
  TOWN: "town",
};

export default {
  components: { NameList },
  setup() {
    const nameCount = ref(20);
    const types = ref([NameType.MALE]);
    const showType = ref(false);

    const toggleType = (type) => {
      if (types.value.includes(type)) {
        let index = types.value.findIndex((i) => i === type);
        types.slice(index, 1);
      } else {
        types.value.push(type);
      }
    };

    const generateNames = () => {
      console.log(types.value);
      names.value = [];
      for (let i = 0; i < nameCount.value; i++) {
        let typeIndex = rollDice(1, types.value.length, -1).total;

        switch (types.value[typeIndex]) {
          case NameType.MALE:
            names.value.push({ name: maleNames[rollDice(1, maleNames.length, -1).total], type: NameType.MALE });
            break;
          case NameType.FEMALE:
            names.value.push({ name: femaleNames[rollDice(1, femaleNames.length, -1).total], type: NameType.FEMALE });
            break;
          case NameType.TOWN:
            names.value.push({
              name:
                placePrefix[rollDice(1, placePrefix.length, -1).total] +
                placeSuffix[rollDice(1, placeSuffix.length, -1).total],
              type: NameType.TOWN,
            });
            break;
        }
      }

      showType.value = types.value.length > 1;
    };

    const storeWindowState = () => {
      localStorage.setItem("names", JSON.stringify(names.value));
      localStorage.setItem("types", JSON.stringify(types.value));
    };

    onMounted(() => {
      let data = localStorage.getItem("names");
      if (data) {
        names.value = JSON.parse(data);
      }
      data = localStorage.getItem("types");
      if (data) {
        types.value = JSON.parse(data);
      }

      window.addEventListener("beforeunload", storeWindowState);
    });

    onUnmounted(() => {
      storeWindowState();

      window.removeEventListener("beforeunload", storeWindowState);
    });

    return {
      NameType,
      types,
      names,
      nameCount,
      showType,
      generateNames,
      toggleType,
    };
  },
};
</script>

<style></style>
