import { defineStore } from "pinia";
import axios from "axios";

const cameraStore = defineStore("cameraStore", {
  state: () => {
    return {
      camList: [
        {
          camera_link:
            "http://frigate.intemotech.com/api/1?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "攝影機",
          camera_place: "出境大廳",
          carnumberset_car_numbers: null,
          create_time: "2024-02-29 16:42:00",
          crowdedset_attention_minutes: null,
          crowdedset_warn_minutes: null,
          id: 1,
          is_checked: ["安全帽", "反光背心"],
          note: "",
          recognition: "工地安全",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://admin:ms123456@10.102.130.162:554/ch_103",
          update_time: "2024-03-01 17:48:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/2?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "asdf",
          camera_place: "出境大廳",
          carnumberset_car_numbers: null,
          create_time: "2024-02-29 16:45:00",
          crowdedset_attention_minutes: "1",
          crowdedset_warn_minutes: "2",
          id: 2,
          is_checked: [],
          note: "",
          recognition: "人流判斷",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://admin:ms123456@192.168.50.129:554/ch_103",
          update_time: "2024-02-29 16:45:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/3?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "施工中",
          camera_place: "施工區",
          carnumberset_car_numbers: null,
          create_time: "2024-02-29 16:49:00",
          crowdedset_attention_minutes: "1",
          crowdedset_warn_minutes: "2",
          id: 3,
          is_checked: [],
          note: "",
          recognition: "人流判斷",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://admin:ms123456@10.102.130.163:123456/ch_103",
          update_time: "2024-03-01 17:51:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/5?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "asdf123",
          camera_place: "出境大廳",
          carnumberset_car_numbers: null,
          create_time: "2024-03-01 14:09:00",
          crowdedset_attention_minutes: "1",
          crowdedset_warn_minutes: "2",
          id: 5,
          is_checked: [],
          note: "",
          recognition: "人流判斷",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://admin:ms123456@10.102.130.159:554/ch_103",
          update_time: "2024-03-01 17:50:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/6?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "AMR",
          camera_place: "AMR機器人",
          carnumberset_car_numbers: null,
          create_time: "2024-03-01 14:48:00",
          crowdedset_attention_minutes: null,
          crowdedset_warn_minutes: null,
          id: 6,
          is_checked: ["安全帽", "反光背心"],
          note: "",
          recognition: "工地安全",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://192.168.50.129:554/ch_103",
          update_time: "2024-03-04 09:53:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/7?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "出境大廳攝影機",
          camera_place: "出境大廳",
          carnumberset_car_numbers: null,
          create_time: "2024-03-01 15:05:00",
          crowdedset_attention_minutes: null,
          crowdedset_warn_minutes: null,
          id: 7,
          is_checked: [
            "手機",
            "小型手冊",
            "行李箱",
            "後背包",
            "側背包",
            "手拿包",
            "公事包",
            "箱子",
            "雨傘",
          ],
          note: "",
          recognition: "遺留物",
          remnantsset_warn_minutes: "2",
          rtsp_url: "rtsp://10.102.130.160:1/ch_103",
          update_time: "2024-03-04 09:51:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/8?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "移動",
          camera_place: "移動巡檢",
          carnumberset_car_numbers: null,
          create_time: "2024-03-01 17:25:00",
          crowdedset_attention_minutes: "2",
          crowdedset_warn_minutes: "4",
          id: 8,
          is_checked: [],
          note: "",
          recognition: "人流判斷",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://admin:ms123456@192.168.50.129:554/ch_103",
          update_time: "2024-03-01 17:25:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/9?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "AMR test",
          camera_place: "AMR機器人",
          carnumberset_car_numbers: null,
          create_time: "2024-03-04 09:54:00",
          crowdedset_attention_minutes: "3",
          crowdedset_warn_minutes: "5",
          id: 9,
          is_checked: [],
          note: "",
          recognition: "人流判斷",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://192.168.50.129:554/ch_103",
          update_time: "2024-03-04 10:30:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/10?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "移動2",
          camera_place: "移動巡檢",
          carnumberset_car_numbers: null,
          create_time: "2024-03-04 10:31:00",
          crowdedset_attention_minutes: "1",
          crowdedset_warn_minutes: "2",
          id: 10,
          is_checked: [],
          note: "",
          recognition: "人流判斷",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://192.168.50.129:554/ch_103",
          update_time: "2024-03-04 10:34:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/11?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "wheelchair_001",
          camera_place: "出境大廳",
          carnumberset_car_numbers: "A001",
          create_time: "2024-03-04 10:53:00",
          crowdedset_attention_minutes: null,
          crowdedset_warn_minutes: null,
          id: 11,
          is_checked: ["煙霧", "火", "安全帽", "反光背心"],
          note: "",
          recognition: "工地安全",
          remnantsset_warn_minutes: "1",
          rtsp_url: "rtsp://192.168.50.129:554/ch_103",
          update_time: "2024-03-04 11:42:00",
        },
        {
          camera_link:
            "http://frigate.intemotech.com/api/12?fps=5&h=300&bbox=1&zones=1&mask=1&motion=1&regions=1",
          camera_name: "121901",
          camera_place: "出境大廳",
          carnumberset_car_numbers: null,
          create_time: "2024-03-05 14:34:00",
          crowdedset_attention_minutes: null,
          crowdedset_warn_minutes: null,
          id: 12,
          is_checked: [],
          note: "",
          recognition: "無",
          remnantsset_warn_minutes: null,
          rtsp_url: "rtsp://192.168.50.129:554/ch_103",
          update_time: "2024-03-05 14:34:00",
        },
      ],
    };
  },
  actions: {
    // 取得攝影機列表
    async getCamList() {
      const vm = this;

      const apiserver = document
        .querySelector("#APISERVERWEB")
        .getAttribute("data-url");
      const config = {
        method: "GET",
        url: `${apiserver}/tpefunction/camera`,
      };

      await axios(config)
        .then((res) => {
          // console.log(res);
          vm.camList = res.data.data.data;
        })
        .catch((err) => {
          console.log(err.response);
        });
    },
    // 拆解rtsp
    // [1]~[5]依序：帳號、密碼、IP、port、路徑
    splitRtsp(rtspUrl, param) {
      const regexPattern =
        /^rtsp:\/\/(?:([^:]+):([^@]+)@)?([^:/]+):(\d+)\/(.+)$/;
      const matches = rtspUrl.match(regexPattern);
      return matches[param];
    },
  },
});

export default cameraStore;
