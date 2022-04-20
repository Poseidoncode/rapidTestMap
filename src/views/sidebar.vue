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
        :showClear="true"
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
        @change="getData"
        :showClear="true"
      />
    </div>
    <div class="p-inputgroup">
      <span class="p-inputgroup-addon">診所名稱</span>
      <InputText
        type="text"
        v-model="selectedClinic"
        @keydown.enter="getData"
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
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-3"
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
import { useStore } from "vuex";
export default defineComponent({
  props: {
    // specColum: {
    //   type: String,
    //   default: "",
    // },
  },
  emits: ["setMarker", "setCenterData"],
  setup(props, { emit }) {
    const store = useStore();
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

    const toast = useToast();

    const getData = async () => {
      try {
        let hasQsed = false;
        let qs = "";

        if (selectedCity.value) {
          qs = qs + `縣市別 LIKE '${selectedCity.value}'`;
          hasQsed = true;
        }
        if (selectedZone.value) {
          if (hasQsed) {
            qs = qs + `And 鄉鎮市區別 LIKE '${selectedZone.value}'`;
          } else {
            qs = qs + `鄉鎮市區別 LIKE '${selectedZone.value}'`;
          }
        }
        if (selectedClinic.value) {
          if (hasQsed) {
            qs = qs + `And 診所名稱 LIKE '${selectedClinic.value}'`;
          } else {
            qs = qs + `診所名稱 LIKE '${selectedClinic.value}'`;
          }
        }

        const res = await getMapLists(qs);
        let arr = res.data?.result?.records.map((s) => {
          return s;
        });
        items.value = [...res.data?.result?.records];

        emit("setMarker", [...arr]);
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
      getData();
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

    const setCenter = (item) => {
      item.needbuild = true;
      emit("setCenterData", item);
    };

    const setDestination = (item) => {
      window.open(
        `https://www.google.com/maps/dir/${store.state.user.locale?.Lat},+${store.state.user.locale?.Long}/${item.Lat},+${item.Long}`
      );
    };

    const optionsLocale = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const successLocale = (pos) => {
      const crd = pos.coords;

      const obj = {
        Lat: crd.latitude,
        Long: crd.longitude,
        needbuild: false,
      };

      let zoneArr = zonesData.map((s) => {
        s.latDifference = Math.abs(+crd.latitude - +s.lat);
        s.lngDifference = Math.abs(+crd.longitude - +s.lng);
        s.differenceTotal =
          Math.abs(+crd.latitude - +s.lat) + Math.abs(+crd.longitude - +s.lng);
        return s;
      });

      zoneArr.sort((a, b) => {
        return a.differenceTotal - b.differenceTotal;
      });

      selectedCity.value = zoneArr[0].text;

      setZones();

      emit("setCenterData", obj);
      store.commit("m_setUserLocale", obj);
    };

    const errorLocale = (err) => {
      toast.error(`需同意定位才能找到最近地點`, {
        timeout: 3000,
        hideProgressBar: true,
      });
      console.warn("ERROR(" + err.code + "): " + err.message);
    };

    const getLocaleData = () => {
      navigator.geolocation.getCurrentPosition(
        successLocale,
        errorLocale,
        optionsLocale
      );
    };

    onMounted(async () => {
      await getLocaleData();
    });

    return {
      //for list data variable
      citiesData,
      zonesData,
      headers,
      items,

      toast,
      zones,
      setZones,
      //list data Function
      getData,

      //paginator

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
