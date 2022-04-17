<template>
  <section class="main-section px-3">
    <section class="search-block">
      <h5 class="big-title">產品管理</h5>
      <div class="p-2 search-section">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">啟用狀態</span>
          <div
            v-for="item of activates"
            :key="item.text"
            class="p-field-radiobutton mr-3 mt-2"
          >
            <RadioButton
              :id="item.text"
              name="item"
              :value="item.value"
              v-model="selectedActivate"
              @change="getData"
            />
            <label :for="item.text">{{ item.text }}</label>
          </div>
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">產品代碼</span>
          <InputText
            type="text"
            v-model="selectedNo"
            @keydown.enter="getData"
            class="custom-search"
          />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">產品名稱</span>
          <InputText
            type="text"
            v-model="selectedName"
            @keydown.enter="getData"
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
        <button
          class="text-gray-700 font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
          type="button"
          style="background: #f9be4a"
          @click="showEditModal(1)"
        >
          +新增產品
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
          @click="showEditModal(2, item)"
        >
          編輯
        </button>
        <button
          class="text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 text-sm"
          type="button"
          style="background: #218be1"
          @click="showEditModal(3, item)"
        >
          刪除
        </button>
      </div>

      <div class="content" :title="item.title">
        {{ item.title || "" }}
      </div>
      <div class="content" :title="item.description">
        {{ item.description || "" }}
      </div>
      <div class="content" :title="item.content">
        {{ item.content || "" }}
      </div>
      <div class="content" :title="item.category">
        {{ item.category || "" }}
      </div>
      <div class="content" :title="item.unit">
        {{ item.unit || "" }}
      </div>
      <div class="content" :title="item.origin_price">
        {{ item.origin_price || "" }}
      </div>
      <div class="content" :title="item.price">
        {{ item.price || "" }}
      </div>

      <div class="content" :title="item.imageUrl">
        {{ item.imageUrl || "" }}
      </div>
      <div class="content" :title="item.imagesUrl">
        {{ item.imagesUrl || "" }}
      </div>
      <div class="content" :title="item.is_enabled">
        <Checkbox
          :binary="true"
          v-model="item.is_enabled"
          @change="changeActivate(item)"
        />
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

    <!-- //EditModal -->
    <Dialog
      v-model:visible="editModal"
      style="width: 85vw"
      :draggable="false"
      :modal="true"
      class="custom-modal"
    >
      <template #header>
        <h3>
          {{
            nowType == 1 ? "新增產品" : nowType == 2 ? "編輯產品" : "刪除產品"
          }}
        </h3>
      </template>
      <section class="modal-main-content">
        <!-- {{ modalItem }} -->
        <h2 v-if="nowType == 3" class="mb-2 font-black text-xl">
          是否確定要刪除此產品?
        </h2>
        <div class="p-inputgroup mt-2 col-span-full">
          <span class="p-inputgroup-addon red-star">標題</span>
          <InputText
            type="text"
            v-model.trim="modalItem.title"
            :disabled="nowType == 3"
            class="custom-search"
          />
        </div>
        <div class="p-inputgroup mt-2 col-span-full">
          <span class="p-inputgroup-addon red-star">描述</span>
          <Textarea
            v-model.trim="modalItem.description"
            class="custom-search"
            :disabled="nowType == 3"
          />
        </div>
        <div class="p-inputgroup mt-2 col-span-full">
          <span class="p-inputgroup-addon red-star">說明</span>
          <Textarea
            v-model.trim="modalItem.content"
            class="custom-search"
            :disabled="nowType == 3"
          />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">分類</span>
          <InputText
            v-model.trim="modalItem.category"
            class="custom-search"
            :disabled="nowType == 3"
          />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">單位</span>
          <InputText
            v-model.trim="modalItem.unit"
            class="custom-search"
            :disabled="nowType == 3"
          />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">原價</span>
          <InputText
            type="Number"
            v-model.trim="modalItem.origin_price"
            class="custom-search"
            :disabled="nowType == 3"
          />
        </div>

        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon red-star">售價</span>
          <InputText
            type="Number"
            v-model.trim="modalItem.price"
            class="custom-search"
            :disabled="nowType == 3"
          />
        </div>
        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon">主圖網址</span>
          <InputText
            v-model.trim="modalItem.imagesArr[0].url"
            class="custom-search"
            :disabled="nowType == 3"
          />
        </div>
        <div
          class="p-inputgroup mt-2"
          v-for="(item, i) in modalItem.imagesArr.slice(1)"
          :key="`headers${i}`"
        >
          <span class="p-inputgroup-addon">輸入圖片網址 {{ i + 1 }}</span>

          <InputText
            v-model="item.url"
            class="custom-search"
            :disabled="nowType == 3"
          />
        </div>

        <div class="p-inputgroup mt-2">
          <span class="p-inputgroup-addon">是否啟用</span>
          <Checkbox
            style="margin: 12px 0 0 10px"
            :binary="true"
            v-model="modalItem.is_enabled"
            @change="setStatus(item)"
          />
        </div>

        <div class="col-span-full flex justify-center mt-2">
          <Galleria
            :circular="true"
            :showItemNavigators="true"
            :value="modalItem.imagesArr"
            :responsiveOptions="responsiveOptions"
            :numVisible="6"
            containerStyle="max-width: 640px"
            :showThumbnails="false"
            :showIndicators="true"
          >
            <template #item="slotProps">
              <img
                :src="slotProps.item.url"
                style="width: 100%; display: block"
                :title="slotProps.item.index"
                v-if="!!slotProps.item.url"
              />
              <div
                v-else
                style="width: 500px; height: 310px; border: 1px solid #e1e0e0"
              ></div>
            </template>
          </Galleria>
        </div>
      </section>

      <template #footer>
        <Button label="確定" @click="saveEditModal" />
        <Button
          label="取消"
          class="p-button-success"
          @click="editModal = false"
        />
      </template>
    </Dialog>
  </section>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";

import {
  getProducts,
  postProducts,
  deleteProducts,
  putProducts,
} from "Service/apis.js";

export default defineComponent({
  name: "function",
  components: {},
  setup() {
    //-----------ListData----------------
    //for list
    const headers = ref([
      { name: "操作", key: "", sortDesc: null },

      { name: "標題", key: "title", sortDesc: null }, //必填
      { name: "描述", key: "description", sortDesc: null },
      { name: "說明", key: "content", sortDesc: null },
      { name: "分類", key: "category", sortDesc: null }, //必填
      { name: "單位", key: "unit", sortDesc: null }, //必填
      { name: "原價", key: "origin_price", sortDesc: null }, //必填
      { name: "售價", key: "price", sortDesc: null }, //必填

      { name: "主圖", key: "imageUrl", sortDesc: null },
      { name: "其他圖片", key: "imagesUrl", sortDesc: null },
      { name: "是否啟用", key: "is_enabled", sortDesc: null },
    ]);

    const items = ref([]);

    const offset = ref(0);
    const rows = ref(10);
    const totalItemsCount = ref(1);
    const orderByArr = ref([]);

    const toast = useToast();

    async function getData() {
      try {
        //odata3 qs
        const page = +offset.value / +rows.value + +1;
        const skip = (page - 1) * rows.value;
        const top = rows.value;
        const orderBy = orderByArr.value;

        if (
          !(
            orderByArr.value.includes("Seq") ||
            orderByArr.value.includes("Seq desc")
          )
        ) {
          orderBy.push("Seq");
        }

        const obj = { top, skip, orderBy };
        // let qs = buildQuery(obj);
        let bQs = false;
        let qs = "?page=1";

        //top:筆數、skip:跳過幾筆

        const res = await getProducts(`${qs}`);

        console.log("res", res);
        // let { Items, Count } = res.data;

        items.value = [...res.data?.products];
        // totalItemsCount.value = Count;
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 2000,
          hideProgressBar: true,
        });
      }
    }

    //sort
    function sortData(item) {
      if (!item.key) {
        return;
      }
      if (item.sortDesc) {
        item.sortDesc = null;
      } else if (false === item.sortDesc) {
        item.sortDesc = true;
      } else if (null === item.sortDesc) {
        item.sortDesc = false;
      }
      orderByArr.value = [];

      headers.value.forEach((s) => {
        if (s.sortDesc !== null) {
          orderByArr.value.push(s.sortDesc ? `${s.key} desc` : `${s.key}`);
        }
      });
      getData();
    }

    //for search
    const selectedActivate = ref(null);
    const selectedNo = ref("");
    const selectedName = ref("");

    const activates = ref([
      { value: true, text: "啟用" },
      { value: false, text: "已停用" },
    ]);

    function clearSearch() {
      selectedActivate.value = "";
      selectedNo.value = "";
      selectedName.value = "";
      getData();
    }

    onMounted(async () => {
      await getData();
    });

    watch(offset, (v, pv) => {
      getData();
    });

    watch(rows, (v, pv) => {
      getData();
    });

    //-----------editModal----------------
    const editModal = ref(false);
    const nowType = ref(1);
    const modalItem = ref({
      No: "",
      Name: "",
      IsActivated: true,
    });

    function showEditModal(type, item) {
      //type- 1新增、2編輯、3刪除
      let imgArr = new Array(6).fill().map((s, i) => ({
        url: "",
        index: `網址${i + 1}`,
      }));

      if (type == 2 || type == 3) {
        modalItem.value = { ...item };
        if (item?.imagesUrl) {
          modalItem.value.imagesArr = item.imagesUrl.map((s, i) => ({
            url: s,
            index: `網址${i + 1}`,
          }));
          modalItem.value.imagesArr.unshift({
            url: item.imageUrl,
            index: `主圖網址`,
          });
        } else {
          modalItem.value.imagesArr = imgArr;
          modalItem.value.imagesArr.unshift({
            url: item.imageUrl,
            index: `主圖網址`,
          });
        }
      } else {
        modalItem.value = {
          category: "",
          content: "",
          description: "",
          imageUrl: "",
          imagesArr: imgArr,
          is_enabled: true,

          origin_price: 0,
          price: 0,
          title: "",
          unit: "",
        };
      }
      nowType.value = type;
      editModal.value = true;
    }

    const saveEditModal = async () => {
      // if (!Boolean(modalItem.value.No) || !Boolean(modalItem.value.Name)) {
      //   toast.error(`產品代碼和產品名稱為必填欄位`, {
      //     timeout: 4000,
      //     hideProgressBar: true,
      //   });
      //   return;
      // }

      const obj = {
        ...modalItem.value,
      };

      obj.imagesUrl = obj.imagesArr.slice(1).map((s) => `${s.url}`);
      obj.imageUrl = obj.imagesArr[0].url;
      delete obj.imagesArr;

      try {
        // const res = await putInstitutionList(obj);
        if (nowType.value == 1) {
          const res1 = await postProducts({ data: obj });
        }
        if (nowType.value == 2) {
          const res2 = await putProducts({ data: obj }, obj.id);
        }
        if (nowType.value == 3) {
          const res3 = await deleteProducts(obj.id);
        }

        toast.success(
          `${
            nowType.value == 1 ? "新增" : nowType.value == 2 ? "編輯" : "刪除"
          }成功`,
          {
            timeout: 2000,
            hideProgressBar: true,
          }
        );
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 2000,
          hideProgressBar: true,
        });
      }
      getData();
      editModal.value = false;
    };

    const setStatus = async (item) => {
      const obj = {
        ...item,
      };
      const res2 = await putProducts({ data: obj }, obj.id);
      toast.success(`編輯成功`, {
        timeout: 2000,
        hideProgressBar: true,
      });
    };

    async function changeActivate(item) {
      const obj = {
        No: item.No,
        Name: item.Name,
        IsActivated: item.IsActivated,
      };
      try {
        // await modifyFunctionItem(obj);
        toast.success("產品調整成功", {
          timeout: 2000,
          hideProgressBar: true,
        });
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 2000,
          hideProgressBar: true,
        });
      }
    }

    const images = ref("");

    const responsiveOptions = ref([
      {
        breakpoint: "1024px",
        numVisible: 5,
      },
      {
        breakpoint: "768px",
        numVisible: 3,
      },
      {
        breakpoint: "560px",
        numVisible: 1,
      },
    ]);

    return {
      images,
      responsiveOptions,
      //for list data variable
      headers,
      items,
      toast,

      //list data Function
      getData,
      sortData,

      //paginator
      offset, //目前在第幾筆
      rows, //1頁顯示筆數
      totalItemsCount,
      orderByArr,

      //for search
      selectedActivate,
      selectedNo,
      selectedName,

      activates,

      clearSearch,

      //editModal variable
      editModal,
      modalItem,
      nowType,

      //editModal Function
      showEditModal,
      saveEditModal,
      setStatus,

      changeActivate,
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
  grid-template-columns: 180px repeat(10, 1fr);

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

.modal-main-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 10px;
}

.my-dark {
  > div {
    background: #e0fbfc;
    color: #f3f3f3;
    font-weight: bolder;
  }
}
</style>
