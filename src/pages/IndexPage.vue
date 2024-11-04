<template>
  <main class="flex flex-wrap gap-8 m-5 flex-col">
    <input v-model="filter" type="text" placeholder="Filter" />
    <div class="flex flex-wrap gap-8">
      <TheCard
        v-for="(card, index) in filteredCards"
        :key="index"
        class="cursor-pointer"
        :card
        @click="onCardClick(card)"
      />
      <button
        @click="isOpen = true"
        data-testid="new-card-button"
        class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-[316px] h-[200px]"
      >
        Add new Card
      </button>
      <AddCardModal
        :isOpen="isOpen"
        @cancel-button="resetModal"
        @submit-button="onSubmitButtonClicked"
      >
        <template #body>
          <input
            v-model.trim="DTO.number"
            type="text"
            placeholder="Card number"
          />
          <input v-model="DTO.name" type="text" placeholder="Name" />
          <input
            maxlength="3"
            v-model="DTO.cvc"
            type="text"
            placeholder="CVC"
          />
          <input
            maxlength="5"
            v-model="DTO.expire"
            type="text"
            placeholder="Expire"
          />
        </template>
        <template v-if="isEditing" #footer>
          <button @click="copyCVV">copy</button>
          <button @click="deleteCard">delete</button>
          <button @click="saveCard">save</button>
        </template>
      </AddCardModal>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCardsStore } from "../stores/cards.store";
import TheCard from "@/components/TheCard.vue";
import AddCardModal from "@/components/AddCardModal.vue";
import { useFilter } from "../composables/useFilter";

const isOpen = ref(false);
const isEditing = ref(false);
const cardsStore = useCardsStore();
const { addCard, removeCard, updateCard } = cardsStore;
const { cards } = storeToRefs(cardsStore);

const { filter, filteredCards } = useFilter(cards);
const DTO = reactive({
  number: "",
  name: "",
  cvc: "",
  expire: "",
});

const resetModal = () => {
  isOpen.value = false;
  isEditing.value = false;
  Object.assign(DTO, { number: "", name: "", cvc: "", expire: "" });
};

const deleteCard = () => {
  removeCard(DTO.number);
  resetModal();
};

const copyCVV = async () => {
  await navigator.clipboard.writeText(DTO.cvc);
};

const saveCard = () => {
  updateCard({ ...DTO });
  resetModal();
};

const onCardClick = (card) => {
  isOpen.value = true;
  isEditing.value = true;
  Object.assign(DTO, card);
};

const onSubmitButtonClicked = () => {
  addCard({ ...DTO });
  resetModal();
};
</script>
