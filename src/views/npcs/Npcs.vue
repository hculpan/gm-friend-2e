<template>
  <section id="npcs" class="bg-dark text-light">
    <div class="h3">NPC's</div>
    <div class="npcs-container">
      <div class="npc-list bg-light text-dark rounded mt-2 py-2 ms-3">
        <div
          v-for="npc in npcs"
          :key="npc.name"
          class="d-flex justify-content-between mx-2 px-2 rounded"
          @click="selectNpc(npc.id)"
          :class="{ active: selectedNpc && selectedNpc.id === npc.id }"
        >
          <div>{{ npc.name }}</div>
          <div>{{ npc.location }}</div>
        </div>
      </div>

      <div id="npc-details" class="bg-light text-dark rounded py-2 mt-2">
        <div class="npc-container">
          <div class="npc-item-label">Name</div>
          <div class="npc-item d-flex justify-content-between mb-0">
            <div class="text-primary">{{ selectedNpc ? selectedNpc.name : "none selected" }}</div>
            <div>
              <div class="material-icons search" v-if="selectedNpc && selectedNpc.name" @click="editNpc">
                edit
              </div>
              <div class="material-icons search" @click="addNpc">
                add
              </div>
            </div>
          </div>
        </div>
        <div class="npc-container">
          <div class="npc-item-label">Location</div>
          <div class="npc-item">{{ selectedNpc ? selectedNpc.location : "" }}</div>
        </div>
        <div class="npc-container">
          <div class="npc-item-label">Notes</div>
          <div class="npc-item">{{ selectedNpc ? selectedNpc.notes : "" }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import getNpcs from "../../composables/getNpcs";
import getNpc from "../../composables/getNpc";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const { npcs, error, load } = getNpcs();
    load();

    const selectedNpc = ref(null);
    const router = useRouter();

    const selectNpc = async (id) => {
      let { result, error } = await getNpc(id);
      if (result) {
        selectedNpc.value = { ...result };
      } else if (error.value) {
        console.log("Error:", error.value);
      }
    };

    const addNpc = () => {
      router.push({ name: "Add NPC" });
    };

    const editNpc = () => {
      router.push({ name: "Edit NPC", params: { npcId: selectedNpc.value.id } });
    };

    return {
      selectedNpc,
      npcs,
      selectNpc,
      addNpc,
      editNpc,
    };
  },
};
</script>

<style>
.npcs-container {
  display: grid;
  grid-template-columns: 40% 40%;
  justify-content: center;
  gap: 20px;
}

.npcs-container-name {
  display: grid;
  grid-template-columns: 40% 40% 10%;
  justify-content: center;
  gap: 20px;
}

#npcs .active {
  background: blue;
  color: white;
}

.npc-list,
#npc-details,
#npc-detail div {
  min-width: 400px;
  height: 600px;
}

.npc-container {
  display: flex;
  align-items: flex-start;
}

.npc-item-label {
  text-align: end;
  margin: 5px 10px;
  flex: 1;
}

.npc-item {
  text-align: start;
  margin: 5px 15px;
  flex: 4;
}
</style>
