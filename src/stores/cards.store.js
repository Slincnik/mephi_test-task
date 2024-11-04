import { defineStore } from "pinia";
import { reactive } from "vue";

export const useCardsStore = defineStore("cards", () => {
  const cards = reactive([
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
  ]);

  const addCard = (card) => {
    cards.push({
      ...card,
      number: card.number.replace(/\s/g, ""),
      id: cards.length + 1,
    });
  };

  const updateCard = (newCard) => {
    const cardIndex = cards.findIndex(({ id }) => id === newCard.id);
    if (!cardIndex === -1) return;

    Object.assign(cards[cardIndex], newCard);
  };

  const getCard = (cardNumber) => {
    return cards.find((c) => c.number === cardNumber);
  };

  const removeCard = (cardNumber) => {
    const cardIndex = cards.findIndex((c) => c.number === cardNumber);
    cards.splice(cardIndex, 1);
  };

  return {
    cards,
    addCard,
    removeCard,
    updateCard,
    getCard,
  };
});
