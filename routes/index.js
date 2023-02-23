const express = require("express");
const router = express.Router();
const sD = require("../modules/storeData");
const gD = require("../modules/getData");
const { processData } = require("../jobs/panigationData");

/* GET home page. */
router.get("/api/channels/", async function (req, res, next) {
  const data = gD.getChannelsFromDB();
  console.log(data);
});

/* 
Example Data Model
channel_id:"UC0C2fagfuiXuEgVCHEkJi4Q"
comments:null
description:"จากคอนเซ็ปต์ค่าย คนเกือบธรรมดา เซนอสฮะ ก็มาดิคับ เหมือนผมกลัวอะ จะหมัด จะมวย จะแมวอะไรก็มาได้หมดอะค้าบบบ\nหมายถึงมาดูอะฮะ มาเถอะ ผมเหงา รับรองไม่ผิดหวังแน่นอน หึหึ\nYo!! I'm Zenos Are you looking for fun?\nIt's not here .....n..nah I'm just kidding\n"
is_rebranded:false
last_published_video_at:"2022-12-31T17:00:27Z"
published_at:"2022-08-24T09:08:33.959394Z"
subscribers:1530
thumbnail_icon_url:"https://yt3.ggpht.com/ZrqISZctyF78dvvbBiE-BfGcHgaoNGHE7RSEj2N-HIxDFwzlgA_iAwVhl8v3htw-4mnYfWT0mQ=s240-c-k-c0x00ffffff-no-rj"
title:"Zenos Ch. [Pandora]"
updated_at:1672510383422
uploads:"UU0C2fagfuiXuEgVCHEkJi4Q"
videos:33
views:18657
*/

router.get("/api/channels/yt", (req, res, next) => {
  gD.getChannelsInfo(res);
});

router.get("/api/channels/tranfer", (req, res, next) => {
  processData().then(e => {
    res.send("success!");
  })
});

/* POST request ADD channel */
router.post('/api/addChannel', function(req, res, next) {
  sD.channelIdToDB(req.body, res);  
});


module.exports = router;
