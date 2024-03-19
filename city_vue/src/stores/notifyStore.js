import { defineStore } from "pinia";
import axios from "axios";

const notifyStore = defineStore("notifyStore", {
  state: () => {
    return {
      // 所有通知資料
      notifyData: [
        {
          IP: "192.168.50.129",
          alert_time: "2024-03-04 13:43:42",
          batch: 8,
          camera_name: "wheelchair_001",
          id: 13,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129",
          alert_time: "2024-03-04 12:00:29",
          batch: 7,
          camera_name: "wheelchair_001",
          id: 12,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129",
          alert_time: "2024-03-04 12:00:21",
          batch: 6,
          camera_name: "wheelchair_001",
          id: 11,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129",
          alert_time: "2024-03-04 11:59:54",
          batch: 5,
          camera_name: "wheelchair_001",
          id: 10,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129",
          alert_time: "2024-03-04 11:59:37",
          batch: 4,
          camera_name: "wheelchair_001",
          id: 9,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129",
          alert_time: "2024-03-04 11:58:58",
          batch: 3,
          camera_name: "wheelchair_001",
          id: 8,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129",
          alert_time: "2024-03-04 11:58:56",
          batch: 2,
          camera_name: "wheelchair_001",
          id: 7,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129:554",
          alert_time: "2024-03-04 03:09:25",
          batch: 13,
          camera_name: "wheelchair_001",
          id: 6,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129:554",
          alert_time: "2024-03-04 03:05:02",
          batch: 12,
          camera_name: "wheelchair_001",
          id: 5,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129:554",
          alert_time: "2024-03-04 03:02:26",
          batch: 11,
          camera_name: "wheelchair_001",
          id: 4,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.129:554",
          alert_time: "2024-03-04 03:02:24",
          batch: 9,
          camera_name: "wheelchair_001",
          id: 3,
          person: "Alex",
          picture: null,
          text: "wheelchair_001使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
        {
          IP: "192.168.50.100",
          alert_time: "2024-03-01 17:00:00",
          batch: 1,
          camera_name: "大廳",
          id: 1,
          person: "小江",
          picture: null,
          text: "攝影機名稱使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: null,
        },
        {
          IP: "192.168.50.100",
          alert_time: "2024-03-01 17:00:00",
          batch: 1,
          camera_name: "大廳",
          id: 2,
          person: "Admin",
          picture: null,
          text: "攝影機名稱使用人員點擊SOS按鈕，請留意！",
          type: "SOS",
          view: "true",
        },
      ],
    };
  },
  actions: {
    // 取得攝影機列表
    async getNotifyDataPinia() {
      // const vm = this;
      // const apiserver = document
      //   .querySelector("#apiserver")
      //   .getAttribute("data-api");
      // const config = {
      //   method: "GET",
      //   url: `${apiserver}/tpefunction/notify`,
      // };
      // await axios(config)
      //   .then((res) => {
      //     // console.log(res.data.data);
      //     vm.notifyData = res.data.data;
      //   })
      //   .catch((err) => {
      //     console.log(err.response);
      //   });
    },
  },
});

export default notifyStore;
