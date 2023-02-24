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

const videoFactoredData = (arr) => {
  return arr.map((item) => {
    return {
      channel_id: item.snippet.videoOwnerChannelId,
      lastest_video_id: item.contentDetails.videoId,
      lastest_videoTitle: item.snippet.title,
    };
  });
};
function getYTInfo(row) {
  // your logic to retrieve data from YouTube API
  const sql =
    "REPLACE INTO channels (`id`, `description`, `published_at`, `subscribers`, `thumbnail_icon_url`, `title`, `uploads`, `videos`, `views`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
      let channels = ytrefactoredData(response.data.items);
      if (channels.length == 0) {
        console.log("No channel found.");
      } else {
        console.log(channels);
        for (let i = 0; i < channels.length; i++) {
          let sqlvalues = [
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
          con.query(sql, sqlvalues, function (err) {
            if (err) {
              console.error(err);
              return;
            }
          });
          let playlistId = channels[i].uploads;
          const videoSql = "UPDATE channels SET lastest_video = ? ,lastest_videoTitle = ? WHERE id = ?;";
          global.yt.playlistItems
            .list({
              part: ["snippet,contentDetails"],
              maxResults: 1,
              playlistId: playlistId,
            })
            .then((response) => {
              let video = videoFactoredData(response.data.items);

              let videoValues = [
                video[0].lastest_video_id,
                video[0].lastest_videoTitle,
                video[0].channel_id,
              ];
              con.query(videoSql, videoValues, function (err) {
                console.log(err);
              });
            })
            .catch((e) => {
             console.log("error: " + JSON.stringify(e));
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
