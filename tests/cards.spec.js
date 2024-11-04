import { createRouter, createWebHistory } from "vue-router";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { routes } from "@/router/index";
import AddCardModal from "@/components/AddCardModal.vue";
import App from "@/App.vue";
import IndexPage from "@/pages/IndexPage.vue";
import TheCard from "@/components/TheCard.vue";

import isPiniaAvailable from "@/../tests/utils/isPiniaAvailable"

let router, wrapper;

const createPinia = isPiniaAvailable ? (await import("pinia")).createPinia : undefined

beforeEach(async () => {
  router = createRouter({
    history: createWebHistory(),
    routes: routes,
  });

  router.push("/");
  await router.isReady();

  wrapper = mount(App, {
    global: {
      plugins: [router, createPinia?.()],
      stubs: {
        teleport: true,
      },
    },
  });
});

describe("card list tests", async () => {
  test("should not contain modal initialy", async () => {
    const bodysLastChild = document.body.children[document.body.children.length - 1];
    const dataTestid = bodysLastChild?.attributes?.getNamedItem("data-testid")?.value;

    expect(dataTestid).toBeUndefined();
  });

  test("should render modal on New Card button click", async () => {
    wrapper = mount(App, {
      global: {
        plugins: [router, createPinia?.()],
      },
    });
    const button = wrapper.find('[data-testid="new-card-button"]');

    await button.trigger("click");

    const bodysLastChild = document.body.children[document.body.children.length - 1];
    const dataTestid = bodysLastChild.attributes.getNamedItem("data-testid").value;
    expect(dataTestid).toBe("modal");
  });

  test("should create new card on create button click", async () => {
    const initialState = wrapper.findAllComponents(TheCard);
    const button = wrapper.find('[data-testid="new-card-button"]');
    await button.trigger("click");
    const modal = wrapper.findComponent(AddCardModal);

    const inputs = modal.findAll("input").reduce((accumulator, currentValue) => {
      accumulator[currentValue.attributes()["placeholder"]] = currentValue;
      return accumulator;
    }, {});
    inputs["Card number"].setValue("1111 2222 3333 4444");
    inputs["Name"].setValue("Vasya Pupkin");
    inputs["CVC"].setValue("999");
    inputs["Expire"].setValue("12/44");

    const submitButton = modal.find('[data-testid="submit-button"]');
    await submitButton.trigger("click");

    const newCards = wrapper.findAllComponents(TheCard);
    const newCard = wrapper.findAllComponents(TheCard).at(-1);

    expect(newCards.length).toBe(initialState.length + 1);
    expect(initialState).not.toContain(newCard);
    expect(newCard.text().replace(/\s+/g, "")).toContain("1111222233334444");
    expect(newCard.text()).toContain("Vasya Pupkin");
    expect(newCard.text()).toContain("12/44");
    expect(newCard.text()).not.toContain("999");
  });

  test("should not create new card on cancel form modal data", async () => {
    const initialState = wrapper.findAllComponents(TheCard);
    const button = wrapper.find('[data-testid="new-card-button"]');
    await button.trigger("click");
    const modal = wrapper.findComponent(AddCardModal);

    const inputs = modal.findAll("input").reduce((accumulator, currentValue) => {
      accumulator[currentValue.attributes()["placeholder"]] = currentValue;
      return accumulator;
    }, {});
    inputs["Card number"].setValue("1111 2222 3333 4444");
    inputs["Name"].setValue("Vasya Pupkin");
    inputs["CVC"].setValue("999");
    inputs["Expire"].setValue("12/44");

    const cancelButton = modal.find('[data-testid="cancel-button"]');
    await cancelButton.trigger("click");

    const newCards = wrapper.findAllComponents(TheCard);

    expect(newCards.length).toBe(initialState.length);
  });

  test("should copy to clipboard cvc code on Copy button click", async () => {
    const clipboardMock = { writeText: vi.fn() };
    navigator.clipboard = clipboardMock;
    const firstCard = wrapper.findAllComponents(TheCard).at(0);
    await firstCard.trigger("click");
    const modal = wrapper.findComponent(AddCardModal);

    const copyButton = modal.findAll("button").find((button) => button.text().toLowerCase() === "copy");
    await copyButton.trigger("click");

    expect(clipboardMock.writeText).toHaveBeenCalledWith("123");
  });

  test("should delete card on \"delete\" button click", async () => {
    const initialCardsState = wrapper.findAllComponents(TheCard);
    await initialCardsState.at(0).trigger("click");
    const modal = wrapper.findComponent(AddCardModal);

    const deleteButton = modal.findAll("button").find((button) => button.text().toLowerCase() === "delete");
    await deleteButton.trigger("click");

    expect(wrapper.findAllComponents(TheCard).length).toBe(initialCardsState.length - 1);
  });

  test("should update card on \"save\" button click", async () => {
    const firstCard = wrapper.findAllComponents(TheCard).at(0);
    await firstCard.trigger("click");
    const modal = wrapper.findComponent(AddCardModal);

    const input = modal.findAll("input").find((input) => input.attributes()["placeholder"] === "Card number");
    input.setValue("1234567890123456");

    const saveButton = modal.findAll("button").find((button) => button.text().toLowerCase() === "save");
    await saveButton.trigger("click");

    expect(wrapper.findAllComponents(TheCard).at(0).text().replace(/\s+/g, "")).toContain("1234567890123456");
  });

  test("should not create new card on cancel \"button\" click", async () => {
    const initialCardsState = wrapper.findAllComponents(TheCard);
    const button = wrapper.find('[data-testid="new-card-button"]');
    await button.trigger("click");
    const modal = wrapper.findComponent(AddCardModal);

    const cancelButton = modal.find('[data-testid="cancel-button"]');
    await cancelButton.trigger("click");

    const newCardsState = wrapper.findAllComponents(TheCard);
    expect(newCardsState.length).toBe(initialCardsState.length);
  });

  test("should be synced with router query", async () => {
    const DESIRED_QUERY_AND_INPUT = "some random string";
    const input = wrapper.find("input");
  
    await input.setValue(DESIRED_QUERY_AND_INPUT);
  
    await flushPromises();
    expect(router.currentRoute.value.query.filter).toBe(DESIRED_QUERY_AND_INPUT);
  });
});

let indexPage;

describe("filter input tests", () => {
  beforeEach(() => {
    indexPage = mount(IndexPage, {
      global: {
        plugins: [router, createPinia?.()],
      },
    });
  });

  test("should not contain cards if filter field is not present in cards", async () => {
    const input = indexPage.find("input");
    await input.setValue("4444444");

    const cards = indexPage.findAllComponents(TheCard);
    expect(cards.length).toBe(0);
  });

  test("should filter cards on input in search field", async () => {
    const input = indexPage.find("input");
    await input.setValue("Jane");

    const cards = indexPage.findAllComponents(TheCard);
    expect(cards.length).toBe(1);
  });

  test.each([
    { filter: "Jane", result: 1 },
    { filter: "12/23", result: 3 },
    { filter: 6310, result: 1 },
  ])("should work with each public field, filter: $filter should be $result length", async ({ filter, result }) => {
    const input = indexPage.find("input");
    await input.setValue(filter);

    const cards = indexPage.findAllComponents(TheCard);
    expect(cards.length).toBe(result);
  });
});


describe("card page tests", () => {
  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: routes,
    });
  
    router.push("/");
    await router.isReady();
  
    wrapper = mount(App, {
      global: {
        plugins: [router, createPinia?.()],
        stubs: {
          teleport: true,
        },
      },
    });
  });
  
  test("should contain card info on page", async () => {
    router.push("/card/4444333322221111");
    await router.isReady();
    await flushPromises();
    wrapper = mount(App, {
      global: {
        plugins: [router, createPinia?.()],
        stubs: {
          teleport: true,
        },
      },
    });

    expect(wrapper.text()).toContain("Card info:");
    expect(wrapper.text()).toContain("Jane Doe");
    expect(wrapper.text()).toContain("12/23");
  });

  test("should sustain state on routers change", async () => {
    router.push("/");
    await router.isReady();
    const button = wrapper.find('[data-testid="new-card-button"]');
    await button.trigger("click");
    const modal = wrapper.findComponent(AddCardModal);

    const inputs = modal.findAll("input").reduce((accumulator, currentValue) => {
      accumulator[currentValue.attributes()["placeholder"]] = currentValue;
      return accumulator;
    }, {});
    inputs["Card number"].setValue("1234567890123456");
    inputs["Name"].setValue("Vasya Pupkin");
    inputs["CVC"].setValue("999");
    inputs["Expire"].setValue("12/44");

    const submitButton = modal.find('[data-testid="submit-button"]');
    await submitButton.trigger("click");
    router.push("/card/1234567890123456");
    await router.isReady();
    await flushPromises()

    expect(wrapper.text()).toContain("Card info:");
    expect(wrapper.text()).toContain("Vasya Pupkin")
  })
});
