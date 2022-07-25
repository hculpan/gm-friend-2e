<template>
  <div id="morale" class="text-dark">
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-5">
          <label>Pick Morale</label>
        </div>
        <div class="col-2"></div>
        <div class="col-5">
          <label for="creatureType">Set Morale</label>
        </div>
      </div>
      <div class="row d-flex justify-content-center">
        <div class="col-5">
          <select name="creatureType" id="creatureType" v-model="moraleSelected" @change="moraleChanged">
            <option v-for="m in extraMoraleSlots" :key="m" :value="m.value">{{ m.name }}</option
            ><option value="3">Animal, normal and peaceful (3)</option>
            <option value="7">Animal, normal predator (7)</option>
            <option value="7">Average 0-level human (7)</option>
            <option value="9">Mobs (9)</option>
            <option value="10">Low intelligence (10)</option>
            <option value="10">Militia (10)</option>
            <option value="11">Green or disorganized troops (11)</option>
            <option value="11">Semi-intelligent monster (11)</option>
            <option value="12">Animal intelligence monster (12)</option>
            <option value="12">Hirelings (12)</option>
            <option value="12">Regular soldiers (12)</option>
            <option value="14">Elite soldiers (14)</option>
            <option value="15">Henchmen (15)</option>
            <option value="18">Non-intelligent monster (18)</option>
          </select>
        </div>
        <div class="col-2"><label>or</label></div>
        <div class="col-5">
          <input type="number" name="moraleSet" id="moraleSet" min="1" v-model="moraleNumber" />
        </div>
      </div>

      <div class="row row-cols-2 mt-2">
        <div class="col" v-for="mod in moraleModifiers" :key="mod.id">
          <input
            type="checkbox"
            class="btn-check"
            autocomplete="off"
            :checked="modsMap.has(mod.id) && modsMap.get(mod.id) != 0"
          />
          <label class="btn btn-outline-primary" @click="modifierClick(mod.id, mod.modifier)" style="width: 350px">
            {{ mod.description }} ({{ mod.modifier > 0 ? "+" + mod.modifier : mod.modifier }})
          </label>
        </div>
      </div>

      <div class="row d-flex justify-content-between mt-2">
        <div class="col-6">
          <label class="me-2">Other mods</label>
          <input
            type="number"
            name="otherMods"
            id="otherMods"
            v-model="otherMods"
            style="width: 60px"
            @change="calculateTotalMods"
          />
        </div>
        <div class="col-6">
          <label class="me-2">Total mods</label>
          <label class="border" style="width: 60px">{{ totalMods }} </label>
        </div>
      </div>

      <div class="row">
        <div
          class="border rounded mt-2"
          :class="{
            'text-muted fw-normal': moraleResult === moraleResults.NONE,
            'bg-success text-light fw-bold': moraleResult === moraleResults.PASSED,
            'bg-danger text-light fw-bold': moraleResult === moraleResults.FAILED,
          }"
        >
          {{ moraleResult }}
        </div>
      </div>

      <div class="row d-flex justify-content-center">
        <div>
          <button class="btn btn-secondary mt-2 me-2" @click="reset">Reset</button>
          <button class="btn btn-primary mt-2" @click="checkMorale">Check Morale</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import moraleModifiers from "../data/morale-modifiers.json";
import rollDice from "../composables/rollDice";

const moraleResults = {
  NONE: "No morale check rolled",
  PASSED: "Morale check passed; they continue to fight for another round.",
  FAILED: "Morale check failed; they will flee or surrender.",
};

export default {
  props: ["monsters"],
  setup(props) {
    const moraleNumber = ref(9);
    const moraleSelected = ref(null);
    //const extraMoraleSlots = ref([{ name: "Goblin", value: 10 }]);

    const totalMods = ref(0);
    const otherMods = ref(0);

    const modsMap = ref(new Map());

    const moraleResult = ref(moraleResults.NONE);

    const moraleChanged = () => {
      moraleNumber.value = parseInt(moraleSelected.value);
    };

    const calculateMoraleValues = (morale) => {
      let result = [];
      let numbers = morale.match(/\d+/g);

      if (numbers.length == 1) {
        result.push(parseInt(numbers[0]));
      } else if (numbers.length == 2) {
        let start = parseInt(numbers[0]);
        let end = parseInt(numbers[1]);
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
      }

      return result;
    };

    const extraMoraleSlots = computed(() => {
      let moraleMap = new Map();
      for (let i = 0; i < props.monsters.length; i++) {
        if (!moraleMap.has(props.monsters[i].name)) {
          let moraleValues = calculateMoraleValues(props.monsters[i].morale);
          for (let j = 0; j < moraleValues.length; j++) {
            moraleMap.set(props.monsters[i].name + " (" + moraleValues[j] + ")", moraleValues[j]);
          }
        }
      }

      let result = [];
      for (const [key, value] of moraleMap.entries()) {
        result.push({
          name: key,
          value: value,
        });
      }

      return result.sort((a, b) => {
        let result = a.value - b.value;
        if (result == 0) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }

        return result;
      });
    });

    const calculateTotalMods = () => {
      totalMods.value = 0;
      for (let value of modsMap.value.values()) {
        totalMods.value += value;
      }
      totalMods.value += otherMods.value;
    };

    const modifierClick = (id, mod) => {
      if (modsMap.value.has(id) && modsMap.value.get(id) != 0) {
        modsMap.value.set(id, 0);
      } else {
        modsMap.value.set(id, mod);
      }

      calculateTotalMods();
    };

    const checkMorale = () => {
      let roll = rollDice(2, 10).total;
      if (roll <= moraleNumber.value + totalMods.value) {
        moraleResult.value = moraleResults.PASSED;
      } else {
        moraleResult.value = moraleResults.FAILED;
      }
    };

    const reset = () => {
      modsMap.value.clear();
      otherMods.value = 0;
      moraleResult.value = moraleResults.NONE;
      moraleSelected.value = null;
      moraleNumber.value = 9;
      calculateTotalMods();
    };

    return {
      modsMap,
      moraleNumber,
      moraleSelected,
      moraleModifiers,
      otherMods,
      totalMods,
      moraleResult,
      moraleResults,
      modifierClick,
      reset,
      moraleChanged,
      checkMorale,
      calculateTotalMods,
      extraMoraleSlots,
    };
  },
};
</script>

<style></style>
