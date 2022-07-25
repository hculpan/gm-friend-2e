<template>
  <div id="xp-display">
    <div class="d-flex justify-content-center mb-2">
      <label class="text-dark text-end me-2 pt-1">Characters in party:</label>
      <input type="number" min="1" max="100" v-model="numberInParty" class="text-start" style="max-width: 70px" />
    </div>
    <ul class="list-group">
      <li class="d-flex justify-content-between list-group-item bg-primary">
        <div class="fw-bold text-light">Monster</div>
        <div class="fw-bold text-light">Total XP</div>
      </li>
      <li class="d-flex justify-content-between list-group-item" v-for="m in monsterSummary" :key="m.xp">
        <div>{{ m.name }}: {{ m.count }} x {{ m.xp }} xp</div>
        <div>{{ m.totalXp }}</div>
      </li>
    </ul>

    <hr />

    <h5 class="total-xp text-dark">Total XP: {{ totalXp }}</h5>
    <h3 class="total-xp text-dark">XP per party member: {{ Math.floor(totalXp / numberInParty) }}</h3>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { getFirstNumber } from "../composables/recalcStats";

export default {
  props: ["monsters"],
  setup(props) {
    const numberInParty = ref(5);

    const totalXp = computed(() => {
      return props.monsters.map((m) => m.xp).reduce((total, n) => total + getFirstNumber(n), 0);
    });

    const monsterSummary = computed(() => {
      let map = new Map();
      let result = [];

      for (let i = 0; i < props.monsters.length; i++) {
        if (map.has(props.monsters[i].name)) {
          let m = map.get(props.monsters[i].name);
          m.count += 1;
          m.totalXp = m.count * getFirstNumber(m.xp);
        } else {
          map.set(props.monsters[i].name, {
            name: props.monsters[i].name,
            count: 1,
            xp: props.monsters[i].xp,
            totalXp: getFirstNumber(props.monsters[i].xp),
          });
        }
      }

      map.forEach((value, key) => {
        result.push(value);
      });

      result.sort((a, b) => a.xp - b.xp);

      return result;
    });

    return {
      numberInParty,
      totalXp,
      monsterSummary,
    };
  },
};
</script>

<style></style>
