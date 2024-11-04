<script setup>
import { useRoute } from "vue-router";
import { useCardsStore } from "../stores/cards.store";

const route = useRoute();
const id = route.params.number;
const cardsStore = useCardsStore();

const card = cardsStore.getCard(id);
</script>

<template>
  <div v-if="card">
    <span>Card info:</span>
    <div class="flex flex-col">
      <span>{{ card.number }}</span>
      <span>{{ card.name }}</span>
      <span>{{ card.expire }}</span>
    </div>
  </div>
  <div v-else>Card not found</div>
</template>
