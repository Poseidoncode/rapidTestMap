<template>
  <div class="open-icon" v-show="!cartOpen" @click="cartOpen = !cartOpen">
    <i class="pi pi-angle-double-left" style="font-size: 2rem"></i>
  </div>

  <div
    :class="cartOpen ? 'translate-x-0 ease-out' : 'translate-x-full ease-in'"
    class="fixed right-0 top-0 max-w-md w-full h-full px-6 py-4 transition duration-300 transform overflow-y-auto bg-white border-l-2 border-gray-300"
    style="z-index: 1000"
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
    <div class="p-inputgroup mb-1">
      <span class="p-inputgroup-addon">縣市別</span>

      <Dropdown
        v-model="selectedCity"
        :options="citiesData"
        placeholder="請選擇..."
        style="padding-top: 5px"
        optionLabel="text"
        optionValue="value"
        class="custom-height"
        @change="setZones"
      />
    </div>
    <div class="p-inputgroup mb-1">
      <span class="p-inputgroup-addon">鄉鎮市區別</span>

      <Dropdown
        v-model="selectedZone"
        :options="zones"
        placeholder="請選擇..."
        style="padding-top: 5px"
        optionLabel="text"
        optionValue="value"
        class="custom-height"
        @change="filterItems"
      />
    </div>
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">診所名稱</span>
      <InputText
        type="text"
        v-model="selectedClinic"
        @keydown.enter="filterItems"
        class="custom-search"
      />
    </div>
    <hr class="my-3" />

    <div v-for="(item, i) in items" :key="`headers${i}`" class="mt-2">
      <div class="max-w-2xl mx-auto">
        <div
          class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <div class="p-5">
            <a href="#">
              <h5
                class="text-gray-900 font-bold text-2xl tracking-tight mb-2 dark:text-white"
              >
                {{ item.診所名稱 || "" }}
              </h5>
            </a>
            <p class="font-normal text-gray-700 mb-1 dark:text-gray-400">
              地址: {{ item.診所地址 || "" }}
            </p>
            <p class="font-normal text-gray-700 mb-3 dark:text-gray-400">
              電話: {{ item.診所電話 || "" }}
            </p>
            <a
              href="#"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click.prevent="setCenter(item)"
            >
              Map
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

            <a
              href="#"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click.prevent="setDestination(item)"
            >
              Google導航
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
import { defineComponent, inject, ref, onMounted, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { citiesData, zonesData } from "@/utils/constant.js";
import { getMapLists } from "Service/apis.js";
export default defineComponent({
  props: {
    // specColum: {
    //   type: String,
    //   default: "",
    // },
  },
  emits: ["setMarker", "setCenterData"],
  setup(props, { emit }) {
    const cartOpen = ref(true);
    // emit("update:modelValue", _newValues);
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "操作", key: "", sortDesc: null },

      { name: "縣市別", key: "", sortDesc: null }, //必填
      { name: "鄉鎮市區別", key: "", sortDesc: null },
      { name: "診所名稱", key: "", sortDesc: null },
    ]);

    const items = ref([]);
    const allItems = ref([]);

    const offset = ref(0);
    const rows = ref(10);
    const totalItemsCount = ref(1);

    const toast = useToast();

    const filterItems = () => {
      //top & skip
      // const page = +offset.value / +rows.value + +1;
      // const skip = (page - 1) * rows.value;
      // const top = rows.value;

      //search Filter
      let arr = JSON.parse(JSON.stringify(allItems.value));
      if (selectedCity.value) {
        arr = arr.filter((s) => `${s.縣市別}` == selectedCity.value);
      }
      if (selectedZone.value) {
        arr = arr.filter((s) => `${s.鄉鎮市區別}` == selectedZone.value);
      }
      if (selectedClinic.value) {
        arr = arr.filter((s) => `${s.診所名稱}`.includes(selectedClinic.value));
      }

      totalItemsCount.value = arr.length;
      // this.totalCountStr = `共${arr.length} 筆`;

      //pageNow
      // arr = arr.slice(skip, top + skip);
      items.value = JSON.parse(JSON.stringify(arr));

      emit("setMarker", arr);
    };

    const getData = async () => {
      try {
        // //odata3 qs
        // const page = +offset.value / +rows.value + +1;
        // const skip = (page - 1) * rows.value;
        // const top = rows.value;

        // const obj = { top, skip };
        // // let qs = buildQuery(obj);
        // let bQs = false;
        // let qs = "";

        //top:筆數、skip:跳過幾筆

        const res = await getMapLists();

        // items.value = [...res.data?.result?.records];
        allItems.value = [...res.data?.result?.records];
        totalItemsCount.value = res.data?.result?.total || 0;
        filterItems();
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 2000,
          hideProgressBar: true,
        });
      }
    };

    const zones = ref([]);

    const setZones = () => {
      const arr = zonesData.find((s) => s.text == selectedCity.value);

      if (!!arr) {
        let arrData = [];
        arrData = arr.zone.map((s) => ({
          value: s,
          text: s,
        }));

        arrData.unshift({ text: "全部", value: null });
        zones.value = arrData;
      } else {
        zones.value = null;
      }
      selectedZone.value = null;
      filterItems();
    };

    //for search
    const selectedCity = ref(null);
    const selectedZone = ref(null);
    const selectedClinic = ref(null);

    const clearSearch = () => {
      selectedZone.value = null;
      selectedCity.value = null;
      selectedClinic.value = null;
      getData();
    };

    onMounted(async () => {
      await getData();
    });

    watch(offset, (v, pv) => {
      filterItems();
    });

    watch(rows, (v, pv) => {
      filterItems();
    });

    const setCenter = (item) => {
      emit("setCenterData", item);
    };

    const setDestination = (item) => {
      window.open(`https://www.google.com/maps/dir/${item.診所地址}/`);
    };

    return {
      //for list data variable
      citiesData,
      zonesData,
      headers,
      items,
      allItems,
      toast,
      zones,
      setZones,
      //list data Function
      getData,
      filterItems,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,

      //for search
      selectedZone,
      selectedCity,
      selectedClinic,

      clearSearch,
      cartOpen,

      setCenter,
      setDestination,
    };
  },
});
</script>

<style lang="scss" scoped>
.list-content {
  width: 1200px;
}
.open-icon {
  position: fixed;
  z-index: 1000;
  width: 36px;
  right: 20px;
  top: 100px;
  cursor: pointer;
  color: #fff;
  height: 36px;
  background: #1c54d4;
  border-radius: 50%;
}

.p-inputgroup-addon {
  color: #fff;
  background: #1c54d4;
  width: 97px;
}
</style>
