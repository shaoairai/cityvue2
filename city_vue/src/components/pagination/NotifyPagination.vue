<script>
import { Tooltip } from "bootstrap/dist/js/bootstrap.bundle.min.js";

export default {
  props: ["notifyDataMerged", "notifyDataFilter"],
  data() {
    return {
      pageSize: 10, // 每頁顯示的項目數量
      paginationCnt: 5, // 最大顯示分頁數量
      currentPage: 1, // 當前頁碼
    };
  },
  computed: {
    // 計算總頁數
    totalPages() {
      return Math.ceil(this.notifyDataFilter.length / this.pageSize);
    },
    // 根據當前頁碼和每頁顯示數量計算出當前頁的資料
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.notifyDataFilter.slice(startIndex, endIndex);
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
      // 重讀 Tooltips
      this.initTooltips();
    },
    initTooltips() {
      // 重讀時，需要有 $nextTick 確保 DOM 完成
      this.$nextTick(() => {
        this.paginatedItems.forEach((item, i) => {
          const button = this.$refs["tooltips_" + i][0];
          new Tooltip(button, {
            title: item.text,
          });
        });
      });
    },
  },
  mounted() {
    // 初始化所有按钮的 Tooltip
    this.$nextTick(() => {
      this.initTooltips();
    });
  },
};
</script>

<template>
  <div>
    <div>
      <table class="w-100">
        <thead>
          <tr class="fw-bold">
            <td>通報時間</td>
            <td>通報類型</td>
            <td>影像來源</td>
            <td>接收通報人員</td>
            <td>影像回放</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in paginatedItems" :key="i">
            <td>{{ item.alert_time }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.camera_name }}</td>
            <td>{{ item.person }}</td>
            <td>
              <i class="icon-video-square fs-3 cursor-pointer">
                <i class="path1"></i>
                <i class="path2"></i>
              </i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-end my-3">
      <div class="text-center" v-if="notifyDataMerged.length == 0">
        無通報紀錄
      </div>

      <div
        style="display: inline-block"
        v-else-if="notifyDataFilter.length != 0"
      >
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

      <div class="text-center" v-else-if="notifyDataFilter.length == 0">
        查無通報紀錄
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
