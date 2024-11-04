import { useArrayFilter } from "@vueuse/core";
import { computed, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useFilter = (fields) => {
  const route = useRoute();
  const router = useRouter();

  const filteredCards = computed(() => {
    return useArrayFilter(fields, (field) => {
      return Object.entries(field).some(([key, value]) => {
        if (key === "id") return false;
        return value
          .toString()
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      });
    }).value;
  });

  const filter = ref("");

  watch(
    () => filter.value,
    (newValue) => {
      if (!newValue) return router.replace({ query: {} });
      router.replace({
        query: { filter: newValue },
      });
    }
  );

  watchEffect(() => {
    filter.value = route.query.filter || "";
  });

  return {
    filter,
    filteredCards,
  };
};
