<template>
  <section id="npcs" class="bg-dark text-light">
    <form @submit.prevent="formSubmitted" class="justify-content-center">
      <div class="h3">Add NPC</div>
      <div class="grid-container mt-3">
        <label>Name</label>
        <input type="text" class="rounded border-0" v-model="name" />
        <label>Location</label>
        <div class="d-flex justify-content-between">
          <select name="location" id="location" class="rounded border-0 flex-grow-1" v-model="location">
            <option value=""></option>
            <option v-for="l in locations" :key="l.location" :value="l.location">{{ l.location }}</option>
          </select>
          <span class="material-icons search">
            add
          </span>
        </div>
        <label>Notes</label>
        <textarea name="notes" id="notes" cols="30" rows="10" class="rounded border-0" v-model="notes"></textarea>
      </div>

      <div class="mt-3">
        <button class="btn btn-primary me-2" :disabled="!name || !location">Save</button>
        <button class="btn btn-secondary" @click.prevent="cancel">Cancel</button>
      </div>
    </form>
    <div class="mt-3 d-flex justify-content-center">
      <div
        v-if="message"
        ref="messageContainer"
        class="alert alert-success p-1"
        :class="{ fadeout: messageFade, 'alert-success': !messageIsError, 'alert-danger': messageIsError }"
        style="width: 25%"
      >
        {{ message }}
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import addNpc from "../../composables/addNpc";
import getLocations from "../../composables/getLocations";

export default {
  setup() {
    const router = useRouter();

    const locations = ref([]);

    const name = ref(null);
    const location = ref(null);
    const notes = ref(null);

    const message = ref(null);
    const messageFade = ref(false);
    const messageIsError = ref(false);

    onMounted(async () => {
      var { result, error } = await getLocations();
      if (error) {
        setMessage(error, true);
      } else {
        locations.value = result;
      }
    });

    const addClicked = () => {
      router.push({ name: "Add NPC" });
    };

    const setMessage = (msg, isError = false) => {
      message.value = msg;
      messageIsError.value = isError;
      messageFade.value = false;
      setTimeout(function() {
        messageFade.value = true;
        setTimeout(function() {
          message.value = null;
        }, 2000);
      }, 2000);
    };

    const formSubmitted = async () => {
      let npc = { name: name.value, location: location.value, notes: notes.value };
      let error = await addNpc(npc);
      if (error && error.value) {
        setMessage(error.value, true);
      } else {
        setMessage("NPC saved");
      }
      setTimeout(function() {
        router.push({ name: "NPCs" });
      }, 2000);
    };

    const cancel = () => {
      router.push({ name: "NPCs" });
    };

    return {
      addClicked,
      name,
      location,
      locations,
      notes,
      formSubmitted,
      cancel,
      message,
      messageFade,
      messageIsError,
    };
  },
};
</script>

<style>
.grid-container {
  width: 75%;
  display: grid;
  grid-template-columns: 42% 50%;
  gap: 10px;
}

.grid-container label {
  text-align: end;
}
.fadeout {
  animation: fadeOut ease 2s;
  -webkit-animation: fadeOut ease 2s;
  -moz-animation: fadeOut ease 2s;
  -o-animation: fadeOut ease 2s;
  -ms-animation: fadeOut ease 2s;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-moz-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-o-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-ms-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
