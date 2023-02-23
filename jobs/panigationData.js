const { con } = require("../config/dbcon.js");
var { google } = require("googleapis");
const PAGE_SIZE = 50;
global.yt = google.youtube({
  version: "v3",
  auth: "AIzaSyDR49p1SGcGayJbWVMnl3kERtrrg0dkCCs",
});

const ytrefactoredData = (arr) => {
  return arr.map((item) => {
    return {
      channel_id: item.id,
      description: item.snippet.description,
      published_at: item.snippet.publishedAt,
      subscribers: item.statistics.subscriberCount,
      thumbnail_icon_url: item.snippet.thumbnails.medium.url,
      title: item.snippet.title,
      uploads: item.contentDetails.relatedPlaylists.uploads,
      videos: item.statistics.videoCount,
      views: item.statistics.viewCount,
    };
  });
};
function getYTInfo(row) {
  // your logic to retrieve data from YouTube API
  let ids = row.map((result) => result.id);
  global.yt.channels.list(
    {
      part: ["snippet,contentDetails,statistics"],
      id: ids,
    },
    function (err, response) {
      if (err) {
        console.log("The API returned an error: " + err);
        //res.status(500).send(err);
        return;
      }
      var channels = ytrefactoredData(response.data.items);
      if (channels.length == 0) {
        console.log("No channel found.");
      } else {
        console.log(channels);
        for (var i = 0; i < channels.length; i++) {
          const sql = "REPLACE INTO channels (`id`, `description`, `published_at`, `subscribers`, `thumbnail_icon_url`, `title`, `uploads`, `videos`, `views`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
          const values = [
            channels[i].channel_id,
            channels[i].description,
            channels[i].published_at,
            channels[i].subscribers,
            channels[i].thumbnail_icon_url,
            channels[i].title,
            channels[i].uploads,
            channels[i].videos,
            channels[i].views,
          ];
          con.query(sql, values, function (err) {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
      }
    }
  );
}
function processData(offset = 0) {
  con.query(
    `SELECT * FROM channelList LIMIT ?, ?`,
    [offset, 50],
    function (err, rows) {
      if (err) {
        console.error(err);
        return;
      }
      if (rows.length === 0) {
        console.log("All data has been processed");
        return;
      }
      console.log(rows);
      getYTInfo(rows);
      // Insert ytInfo into another table in the database
      processData(offset + PAGE_SIZE);
    }
  );
}


module.exports = { processData };
