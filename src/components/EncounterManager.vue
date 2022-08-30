<template>
  <div class="modal text-dark" id="encounterManagerModal" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <div class="h2 modal-title">Encounter Manager</div>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row" v-for="encounter in encounters" v-bind:key="encounter">
              <div class="col-4"></div>
              <div class="form-check text-start col">
                <input
                  class="form-check-input"
                  type="radio"
                  name="encounterOption"
                  id="flexRadioDefault"
                  :value="encounter"
                />
                <label class="form-check-label text-start" for="flexRadioDefault">
                  {{ encounter }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            style="width: 100px"
            @click="loadClicked"
          >
            Load
          </button>
          <button
            type="button"
            class="btn btn-danger"
            data-bs-dismiss="modal"
            style="width: 100px"
            @click="deleteClicked"
          >
            Delete
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            style="width: 100px"
            @click="cancelClicked"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const encounters = ref([]);

const emit = defineEmits(["load-encounter"]);

const deleteClicked = () => {
  let name = document.querySelector('input[name="encounterOption"]:checked').value;
  if (!name) return;

  let key = "encounter-" + name;
  let data = localStorage.getItem(key);
  if (data) {
    localStorage.removeItem(key);

    data = localStorage.getItem("currentEncounter");
    if (data && data === name) {
      localStorage.removeItem("currentEncounter");
    }
  }

  loadEncounters();
};

const loadEncounters = () => {
  encounters.value = [];
  for (var key in localStorage) {
    if (key.startsWith("encounter-")) {
      const [first, ...rest] = key.split("-");
      encounters.value.push(rest.join("-"));
    }
  }
};

const loadClicked = () => {
  let name = document.querySelector('input[name="encounterOption"]:checked').value;
  if (name) {
    emit("load-encounter", name);
  }
};

onMounted(() => {
  loadEncounters();
});
</script>
