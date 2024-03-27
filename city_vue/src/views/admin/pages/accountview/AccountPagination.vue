<script>
export default {
  props: ["accountData", "accountDataFilter", "showDelPop", "showEditPop"],
  data() {
    return {
      pageSize: 10, // 每頁顯示的項目數量
      paginationCnt: 5, // 最大顯示分頁數量
      currentPage: 1, // 當前頁碼
    };
  },
  watch: {
    // 有搜尋時，回到第一頁
    accountDataFilter() {
      if (this.accountDataFilter.length != 0) {
        this.gotoPage(1);
      }
    },
  },
  computed: {
    // 計算總頁數
    totalPages() {
      return Math.ceil(this.accountDataFilter.length / this.pageSize);
    },
    // 根據當前頁碼和每頁顯示數量計算出當前頁的資料
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.accountDataFilter.slice(startIndex, endIndex);
    },
    // 計算顯示的分頁數字範圍
    displayedPages() {
      // 限制最大顯示分頁數，不超過5個
      const totalDisplayedPages = Math.min(this.paginationCnt, this.totalPages);
      const middlePage = Math.min(
        Math.max(1, this.currentPage - Math.floor(totalDisplayedPages / 2)),
        Math.max(1, this.totalPages - totalDisplayedPages + 1)
      );

      return Array.from(
        { length: totalDisplayedPages },
        (_, i) => middlePage + i
      );
    },
  },
  methods: {
    // 跳轉到指定頁碼
    gotoPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    // // 拆解權限為文字
    // permissionsDisplay(arr) {
    //   if (arr.length === 7) {
    //     return "全部";
    //   } else if (arr.length === 0 || (arr.length === 1 && arr[0] === "")) {
    //     return "---";
    //   } else {
    //     return arr.join("、");
    //   }
    // },
  },
};
</script>

<template>
  <div>
    <div>
      <!-- 列表 -->
      <table class="w-100 mt-4">
        <thead>
          <tr class="fw-bold">
            <td>身份</td>
            <td>姓名</td>
            <td>電話</td>
            <td>E-mail 帳號</td>
            <td>管理</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(acc, i) in paginatedItems" :key="i">
            <td>
              <div
                class="text-white px-2 py-1 rounded-1"
                :class="[
                  acc.type === 'admin'
                    ? 'bg-info'
                    : acc.type === 'user'
                    ? 'bg-warning'
                    : 'bg-alert',
                ]"
              >
                {{
                  acc.type === "admin"
                    ? "管理者"
                    : acc.type === "user"
                    ? "使用者"
                    : "OBU使用者"
                }}
              </div>
            </td>
            <td>{{ acc.name }}</td>
            <td>{{ acc.phone }}</td>
            <td>{{ acc.account }}</td>
            <!-- <td style="max-width: 150px">
              {{ permissionsDisplay(acc.permissions) }}
            </td> -->
            <td>
              <i
                class="icon-edit-square fs-3 text-primary me-1 cursor-pointer"
                @click="showEditPop(acc)"
              ></i>
              <i
                class="icon-trash-square fs-3 text-primary cursor-pointer"
                @click="showDelPop(acc)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-end my-3">
      <div style="display: inline-block" v-if="accountDataFilter.length != 0">
        <!-- 分頁組件 -->
        <nav aria-label="Page navigation example" class="user-select-none">
          <ul class="pagination">
            <!-- 最前頁 -->
            <li
              class="page-item"
              :class="{
                disabled: currentPage === 1,
                'cursor-pointer': currentPage !== 1,
              }"
            >
              <a class="page-link" @click="gotoPage(1)" aria-label="First">
                <span class="arrow-ll1" aria-hidden="true">
                  <span class="arrow-ll2" aria-hidden="true">««</span>
                </span>
              </a>
            </li>

            <!-- 上一頁 -->
            <li
              class="page-item"
              :class="{
                disabled: currentPage === 1,
                'cursor-pointer': currentPage !== 1,
              }"
            >
              <a
                class="page-link"
                @click="gotoPage(currentPage - 1)"
                aria-label="Previous"
              >
                <span class="arrow-l" aria-hidden="true">‹</span>
              </a>
            </li>

            <!-- 顯示實際的分頁數字 -->
            <li
              v-for="pageNumber in displayedPages"
              :key="pageNumber"
              :class="{ active: currentPage === pageNumber }"
              class="page-item cursor-pointer"
            >
              <a class="page-link" @click="gotoPage(pageNumber)">{{
                pageNumber
              }}</a>
            </li>

            <!-- 下一頁 -->
            <li
              class="page-item"
              :class="{
                disabled: currentPage === totalPages,
                'cursor-pointer': currentPage !== totalPages,
              }"
            >
              <a
                class="page-link"
                @click="gotoPage(currentPage + 1)"
                aria-label="Next"
              >
                <span class="arrow-r" aria-hidden="true">›</span>
              </a>
            </li>

            <!-- 最後頁 -->
            <li
              class="page-item"
              :class="{
                disabled: currentPage === totalPages,
                'cursor-pointer': currentPage !== totalPages,
              }"
            >
              <a
                class="page-link"
                @click="gotoPage(totalPages)"
                aria-label="Last"
              >
                <span class="arrow-rr1" aria-hidden="true">
                  <span class="arrow-rr2" aria-hidden="true">»»</span>
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="text-center" v-else-if="accountDataFilter.length == 0">
        查無此帳號
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/all.scss";
tr {
  border-bottom: 1px solid $gray-100;
}
td {
  padding: 16px 0;
  text-align: center;
}

.arrow-r,
.arrow-rr1,
.arrow-rr2 {
  color: rgba(0, 0, 0, 0);
  &::before,
  &::after {
    content: "";
    width: 9px;
    height: 2px;
    background: $gray-600;
    position: absolute;
    border-radius: 8px;
  }
  &::before {
    transform: rotate(45deg);
    top: 15px;
  }
  &::after {
    transform: rotate(-45deg);
    top: 20px;
  }
}

.arrow-r,
.arrow-rr1 {
  &::before,
  &::after {
    left: 10px;
  }
}
.arrow-rr2 {
  &::before,
  &::after {
    left: 19px;
  }
}

.arrow-l,
.arrow-ll1,
.arrow-ll2 {
  color: rgba(0, 0, 0, 0);
  &::before,
  &::after {
    content: "";
    width: 9px;
    height: 2px;
    background: $gray-600;
    position: absolute;
    left: 9px;
    border-radius: 8px;
  }
  &::before {
    transform: rotate(-45deg);
    top: 15px;
  }
  &::after {
    transform: rotate(45deg);
    top: 20px;
  }
}

.arrow-ll1 {
  &::before,
  &::after {
    left: 10px;
  }
}

.arrow-ll2 {
  &::before,
  &::after {
    left: 19px;
  }
}
</style>
