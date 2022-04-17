<template>
  <div class="open-icon" v-show="!cartOpen" @click="cartOpen = !cartOpen">
    <i class="pi pi-angle-double-left" style="font-size: 2rem"></i>
  </div>

  <div
    :class="cartOpen ? 'translate-x-0 ease-out' : 'translate-x-full ease-in'"
    class="fixed right-0 top-0 max-w-md w-full h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300"
    style="z-index: 9999999999999"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-medium text-gray-700">
        COVID-19家用快篩試劑社區定點診所名單
      </h3>
      <button
        @click="cartOpen = !cartOpen"
        class="text-gray-600 focus:outline-none"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <hr class="my-3" />

    <div v-for="(item, i) in 50" :key="`headers${i}`" class="mt-2">
      <div class="max-w-2xl mx-auto">
        <div
          class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-5">
            <a href="#">
              <h5
                class="text-gray-900 font-bold text-2xl tracking-tight mb-2 dark:text-white"
              >
                Noteworthy technology acquisitions 2021
              </h5>
            </a>
            <p class="font-normal text-gray-700 mb-3 dark:text-gray-400">
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </p>
            <a
              href="#"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Read more
              <svg
                class="-mr-1 ml-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";

export default {
  props: {
    // specColum: {
    //   type: String,
    //   default: "",
    // },
  },
  setup(props, { emit }) {
    const cartOpen = ref(true);
    // emit("update:modelValue", _newValues);
    return { cartOpen };
  },
};
</script>

<style lang="scss" scoped>
.list-content {
  width: 1200px;
}
.open-icon {
  position: fixed;
  z-index: 999999;
  width: 36px;
  right: 20px;
  top: 100px;
  cursor: pointer;
  color: #fff;
  height: 36px;
  background: #1c54d4;
  border-radius: 50%;
}
</style>
