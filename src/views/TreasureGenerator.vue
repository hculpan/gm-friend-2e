<template>
  <section id="treasure_generator" class="bg-dark text-light">
    <div class="container-xxl text-center">
      <div class="h3">
        Treasure generator<a
          data-bs-toggle="offcanvas"
          href="#offcanvasExample"
          role="button"
          aria-controls="offcanvasExample"
          ><i class="bi bi-info-circle ms-3"></i
        ></a>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <label class="me-2">Treasure Type</label>
        <select name="treasure_type" id="treasure_type" v-model="selectedType" style="width: 75px">
          <option v-for="type in Object.keys(treasureTypes)" :key="type" :value="type">{{ type.toUpperCase() }}</option>
        </select>
        <label class="ms-5 me-2">Number</label>
        <input type="number" name="count" id="count" min="1" max="100" style="max-width: 75px" v-model="count" />
      </div>
      <button class="btn btn-primary mt-2" @click="genTreasure">
        Generate Treasure
      </button>
      <button class="btn btn-primary mt-2 ms-2" :disabled="treasures.length < 2" @click="combineTreasure">
        Combine
      </button>
      <button
        class="btn btn-danger mt-2 ms-2"
        @click="
          treasures = [];
          count = 1;
        "
      >
        Reset
      </button>
    </div>

    <!-- Treasure info sidebar -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title text-dark" id="offcanvasExampleLabel">Treasure Generator</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body text-dark">
        <label>Starts on p. 180 in the <em>Dungeon Master's Guide</em></label>
      </div>
    </div>
  </section>
  <TreasureList :treasures="treasures" @remove-treasure="removeTreasure" @regenerate="regenerateTreasure" />
</template>

<script>
import { ref } from "vue";
import { generateTreasure, treasureTypes } from "../composables/generateTreasure";
import TreasureList from "../components/TreasureList.vue";

export default {
  components: { TreasureList },
  setup() {
    const treasures = ref([]);
    const count = ref(1);
    const selectedType = ref("a");

    const genTreasure = () => {
      for (let i = 0; i < count.value; i++) {
        treasures.value.push(generateTreasure(selectedType.value));
      }
      count.value = 1;
    };

    const regenerateTreasure = (treasure) => {
      let index = 0;
      let id = treasure.id;

      for (let i = 0; i < treasures.value.length; i++) {
        if (treasures.value[i].id === id) {
          index = i;
        }
      }

      let newTreasure = generateTreasure(treasure.type.toLowerCase());
      newTreasure.id = id;
      treasures.value[index] = newTreasure;
    };

    const removeTreasure = (id) => {
      treasures.value = treasures.value.filter((t) => t.id != id);
    };

    const coinTotal = (coinType) => {
      return treasures.value.reduce((total, t) => (total += t.coins[coinType]), 0);
    };

    const combineGems = () => {
      let totalCount = 0;
      let totalValue = 0;
      let gemArray = [];

      let gemMap = new Map();
      for (let i = 0; i < treasures.value.length; i++) {
        if (!treasures.value[i].gems.gems) continue;

        for (let j = 0; j < treasures.value[i].gems.gems.length; j++) {
          let gem = treasures.value[i].gems.gems[j];
          totalCount += gem.count;
          totalValue += gem.value * gem.count;
          if (gemMap.has(gem.value)) {
            gemMap.set(gem.value, gemMap.get(gem.value) + gem.count);
          } else {
            gemMap.set(gem.value, gem.count);
          }
        }
      }

      for (let [key, value] of gemMap) {
        gemArray.push({ value: key, count: value });
      }

      return { totalCount: totalCount, totalValue: totalValue, gems: gemArray };
    };

    const combineArt = () => {
      let totalCount = 0;
      let totalValue = 0;
      let artArray = [];

      for (let i = 0; i < treasures.value.length; i++) {
        if (!treasures.value[i].art.art) continue;

        for (let j = 0; j < treasures.value[i].art.art.length; j++) {
          let art = treasures.value[i].art.art[j];
          totalCount += 1;
          totalValue += art.value;
          artArray.push({ ...art });
        }
      }

      return { totalCount: totalCount, totalValue: totalValue, art: artArray };
    };

    const combineMagic = () => {
      let totalCount = 0;
      let magicArray = [];

      for (let i = 0; i < treasures.value.length; i++) {
        if (!treasures.value[i].magic.items) continue;

        for (let j = 0; j < treasures.value[i].magic.items.length; j++) {
          let item = treasures.value[i].magic.items[j];
          totalCount += 1;
          magicArray.push(item);
        }
      }

      return { totalCount: totalCount, items: magicArray };
    };

    const combineTreasure = () => {
      let summaryTreasure = {
        type: "Total",
        id: treasures.value[0],
        isEmpty: false,
        coins: {
          copper: coinTotal("copper"),
          silver: coinTotal("silver"),
          gold: coinTotal("gold"),
          platinum: coinTotal("platinum"),
        },
        gems: combineGems(),
        collapsedGems: true,
        art: combineArt(),
        collapsedArt: true,
        magic: combineMagic(),
        collapsedMagic: true,
      };

      treasures.value = [summaryTreasure];
    };

    return {
      count,
      selectedType,
      treasures,
      treasureTypes,
      removeTreasure,
      genTreasure,
      regenerateTreasure,
      combineTreasure,
    };
  },
};
</script>

<style></style>
