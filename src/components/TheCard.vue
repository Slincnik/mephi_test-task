<template>
  <div class="card" :style="backgroundStyle">
    <img
      src="/images/visa.png"
      width="50px"
      alt="Visa"
      class="card__provider"
    />
    <div class="card__number">
      <transition-group name="slide-fade">
        <span
          v-for="(digit, index) in parsedCardNumber.join('&nbsp;&nbsp;&nbsp;')"
          :key="index"
        >
          {{ digit }}
        </span>
      </transition-group>
    </div>
    <div class="card__info">
      <div>{{ card.name }}</div>
      <div>{{ card.expire }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  card: Object,
});

const cardBackgroundId = computed(() =>
  Number.isNaN(Number(props.card.number[0])) ? 0 : props.card.number[0] % 4
);
const backgroundStyle = computed(
  () =>
    `background: url('/images/${cardBackgroundId.value}.avif') center no-repeat`
);
const parsedCardNumber = computed(() =>
  props.card.number
    ?.replace(/(.{4})/g, "$1 ")
    .trim()
    .split(" ")
);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Source+Code+Pro:400,500,600,700|Source+Sans+Pro:400,600,700&display=swap");

.card {
  width: 316px;
  height: 200px;
  border-radius: 8px;
  padding: 18px;

  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: space-between;

  transition: background 0.3s ease-in-out;
}

.card__provider {
  margin-left: auto;
}

.card__number {
  letter-spacing: 1px;
  margin-left: 8px;
}

.card .card__number {
  font-size: 24px;
}

.card__info {
  display: flex;
  justify-content: space-between;
}

.card div {
  font-family: "Source Sans Pro", sans-serif;
  color: white;
  font-size: 20px;
  animation: fadeIn 0.5s forwards;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease-in-out;
  transition-delay: 0.1s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
  pointer-events: none;
}

.card span {
  display: inline-block;
}
</style>
