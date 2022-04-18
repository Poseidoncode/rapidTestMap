<template>
  <sidebar @setMarker="setMarker" @setCenterData="setCenterData"></sidebar>
  <div style="height: 100vh; width: 100vw">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="[ceterdata.lat, ceterdata.lng]"
      @move="log('move')"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>
      <l-control-layers />

      <l-marker
        v-for="(item, i) in allMarkers"
        :key="`allMarkers${i}`"
        :lat-lng="[item.Lat, item.Long]"
        draggable
      >
        <l-tooltip>
          <p>診所名稱: {{ item.診所名稱 || "" }}</p>
          <p>診所地址: {{ item.診所地址 || "" }}</p>
          <p>診所電話: {{ item.診所電話 || "" }}</p>
        </l-tooltip>
      </l-marker>

      <!-- <l-marker
        :lat-lng="[25.06752703436326, 121.57563054124498]"
        draggable
        @moveend="log('moveend')"
      >
        <l-tooltip> lol </l-tooltip>
      </l-marker> -->

      <!-- <l-marker :lat-lng="[47.41322, -1.219482]">
        <l-icon :icon-url="iconUrl" :icon-size="iconSize" />
      </l-marker>

      <l-marker :lat-lng="[50, 50]" @moveend="log('moveend')">
        <l-popup> lol </l-popup>
      </l-marker>

      <l-polyline
        :lat-lngs="[
          [47.334852, -1.509485],
          [47.342596, -1.328731],
          [47.241487, -1.190568],
          [47.234787, -1.358337],
        ]"
        color="green"
      ></l-polyline>
      <l-polygon
        :lat-lngs="[
          [46.334852, -1.509485],
          [46.342596, -1.328731],
          [46.241487, -1.190568],
          [46.234787, -1.358337],
        ]"
        color="#41b782"
        :fill="true"
        :fillOpacity="0.5"
        fillColor="#41b782"
      />
      <l-rectangle
        :lat-lngs="[
          [46.334852, -1.509485],
          [46.342596, -1.328731],
          [46.241487, -1.190568],
          [46.234787, -1.358337],
        ]"
        :fill="true"
        color="#35495d"
      />
      <l-rectangle
        :bounds="[
          [46.334852, -1.190568],
          [46.241487, -1.090357],
        ]"
      >
        <l-popup> lol </l-popup>
      </l-rectangle> -->
    </l-map>
    <!-- <button @click="changeIcon">New kitten icon</button> -->
  </div>
  <!-- <section class="main-section px-3">
    <section class="search-block">
      <h5 class="big-title">公費COVID-19家用快篩試劑社區定點診所名單</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
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
        <div class="p-inputgroup">
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
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
          type="button"
          style="background: #0c69e1"
          @click="getData"
        >
          查詢
        </button>
        <button
          class="text-white font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
          type="button"
          style="background: #6a9f3e"
          @click="clearSearch"
        >
          清除
        </button>
      </div>
    </section>

    <header class="ecommerce-grid my-dark">
      <div v-for="(item, i) in headers" :key="`headers${i}`" class="header">
        {{ item.name }}
      </div>
    </header>
    <main
      class="ecommerce-grid"
      v-for="(item, idx) in items"
      :key="`content${idx}`"
      style="color: #39312e"
      :style="
        idx % 2 == 0
          ? 'background-color:#ffffff ;'
          : 'background-color:#e7f2f3;'
      "
    >
      <div class="content" style="cursor: pointer; padding-top: 3px">
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm"
          type="button"
          style="background: #0d4a9e"
        >
          地圖
        </button>
      </div>

      <div class="content" :title="item.縣市別">
        {{ item?.縣市別 || "" }}
      </div>
      <div class="content" :title="item.鄉鎮市區別">
        {{ item?.鄉鎮市區別 || "" }}
      </div>
      <div class="content" :title="item.診所名稱">
        {{ item?.診所名稱 || "" }}
      </div>
    </main>
    <main
      v-if="!items.length"
      class="mt-2 text-center text-xl font-semibold col-span-full"
      style="font-family: Microsoft JhengHei, Helvetica"
    >
      No Data
    </main>
    <footer class="grid grid-flow-col auto-cols-max justify-center">
      <Paginator
        v-model:first="offset"
        v-model:rows="rows"
        :totalRecords="totalItemsCount"
        :rowsPerPageOptions="[5, 10, 50]"
      ></Paginator>
      <div class="mt-4">共{{ totalItemsCount }}筆</div>
    </footer>
  </section> -->
</template>

<script>
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { citiesData, zonesData } from "@/utils/constant.js";
import { getMapLists } from "Service/apis.js";
import sidebar from "./sidebar.vue";
import {
  LMap,
  LIcon,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPopup,
  LPolyline,
  LPolygon,
  LRectangle,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

export default defineComponent({
  name: "function",
  components: {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LPolygon,
    LRectangle,
    sidebar,
  },
  setup() {
    //map
    const ceterdata = ref({
      lat: 25.053065384952,
      lng: 121.59537159907072,
    });
    const zoom = ref(14);
    const iconWidth = ref(25);
    const iconHeight = ref(40);
    const iconUrl = computed(() => {
      return `https://placekitten.com/${iconWidth.value}/${iconHeight.value}`;
    });
    const iconSize = computed(() => {
      return [iconWidth.value, iconHeight.value];
    });

    const log = (a) => {
      console.log(a);
    };
    const changeIcon = (a) => {
      iconWidth.value += 2;
      if (iconWidth.value > iconHeight.value) {
        iconWidth.value = Math.floor(iconHeight.value / 2);
      }
    };

    const allMarkers = ref([]);

    const setMarker = (data) => {
      allMarkers.value = [...data];
      // console.log("setMarker", data, "allMarkers.value", allMarkers.value);
    };

    const setCenterData = (data) => {
      ceterdata.value.lat = data.Lat;
      ceterdata.value.lng = data.Long;
    };

    return {
      ceterdata,
      allMarkers,
      setMarker,
      setCenterData,

      zoom,
      iconWidth,
      iconHeight,
      iconUrl,
      iconSize,
      log,
      changeIcon,
    };
  },
});
</script>

<style lang="scss" scoped>
.search-block {
  .big-title {
    background: #e1e8f5;
    padding: 5px;
    color: #333;
    border-radius: 0.15rem 0.15rem 0 0;
    font-size: 20px;
    font-weight: bold;
  }
  margin-bottom: 6px;
  margin-top: 10px;
  background: #fbfcf9;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem 0.25rem 0 0;

  .search-section {
    display: grid;
    grid-template-columns: repeat(8, max-content);
    grid-column-gap: 6px;
  }
}

.p-inputgroup-addon {
  width: 135px;
  background: #3b86f2;
  color: #ffffff;
  font-weight: bold;
  border: 0px !important;
}

.custom-search {
  // height: 42px;
}
.p-dropdown {
  line-height: 12px;
}
.ecommerce-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  text-align: center;

  > div {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    font-size: 15px;
    padding: 4px 0;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    display: -webkit-box;
    height: 40px;
    line-height: 30px;
    font-size: 16px;
    color: rgb(46, 45, 45);
  }
  > div:first-child {
    border-left: 2px solid #ffffff;
  }
  > .header {
    line-height: 2rem;
    font-weight: 700;
    color: #1c2a54;
  }
  > .content {
    padding: 6px;
    padding-top: 4px;
    height: 43px;
  }
  > .full-content {
    grid-column: 1 / -1;
  }
}

.my-dark {
  > div {
    background: #e0fbfc;
    color: #f3f3f3;
    font-weight: bolder;
  }
}

::v-deep(.leaflet-right) {
  display: none;
}
</style>
