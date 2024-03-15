<script>
import axios from "axios";

export default {
  data() {
    return {
      aicamReportIframe: "",
    };
  },
  methods: {
    getAicamReport() {
      const vm = this;
      const config = {
        method: "GET",
        url: "./aicamReport",
      };

      axios(config)
        .then((res) => {
          console.log(res.data);
          vm.aicamReportIframe = res.data;
        })
        .catch((err) => console.log(err.response));
    },
  },
  mounted() {
    this.getAicamReport();
  },
};
</script>

<template>
  <div>
    <iframe
      :src="aicamReportIframe"
      frameborder="0"
      width="100%"
      allowtransparency
      style="height: calc(100vh - 128px)"
    ></iframe>
  </div>
</template>
