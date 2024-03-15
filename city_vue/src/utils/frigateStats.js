// 查詢 Frigate 是否正常運作中
import axios from "axios";

export async function frigateStats() {
  const config = {
    method: "GET",
    url: `./frigatestats`,
  };

  return await axios(config)
    .then((res) => {
      return res.data.cameras;
    })
    .catch((err) => {
      console.log(err.response);
      return false;
    });
}
