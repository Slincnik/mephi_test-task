<template>
  <main class="flex flex-wrap gap-8 m-5 flex-col">
    <div class="flex flex-wrap gap-8">
      <TheCard v-for="(card, index) in cards" :key="index" class="cursor-pointer" :card />
      <button
        data-testid="new-card-button"
        class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-[316px] h-[200px]"
      >
        Add new Card
      </button>
    </div>
  </main>
</template>

<script setup>
import TheCard from "@/components/TheCard.vue";

const cards = [
  {
    id: 1,
    number: "4444333322221111",
    name: "Jane Doe",
    cvc: "123",
    expire: "12/23",
  },
  {
    id: 2,
    number: "5555444433338888",
    name: "John Smith",
    cvc: "123",
    expire: "12/23",
  },
  {
    id: 3,
    number: "6666555544446666",
    name: "Alice Johnson",
    cvc: "123",
    expire: "12/23",
  },
  {
    id: 4,
    number: "3782822463100055",
    name: "Bob Brown",
    cvc: "1234",
    expire: "12/24",
  },
  {
    id: 5,
    number: "3056930902777777",
    name: "Mike Johnson",
    cvc: "123",
    expire: "12/25",
  },
]
</script>
