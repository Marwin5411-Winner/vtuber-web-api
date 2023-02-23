
//REFactor Data From YT to Our Data model
const ytrefactoredData = (arr) => {
    return arr.map((item) => {
      return {
        channel_id: item.id,
        comments: null,
        description: item.snippet.description,
        last_published_video_at: null,
        published_at: item.snippet.publishedAt,
        subscribers: item.statistics.subscriberCount,
        thumbnail_icon_url: item.snippet.thumbnails.medium.url,
        title: item.snippet.title,
        updated_at: null,
        uploads: item.contentDetails.relatedPlaylists.uploads,
        videos: item.statistics.videoCount,
        views: item.statistics.viewCount,
      };
    });
  };

//Get YT Channels information and return response json to Client
function getYTInfo (res, data) {
    global.yt.channels.list(
        {
        part: ["snippet,contentDetails,statistics"],
        id: data,
        },
        function (err, response) {
        if (err) {
            console.log("The API returned an error: " + err);
            res.status(500).send(err);
            return;
        }
        var channels = ytrefactoredData(response.data.items);
        if (channels.length == 0) {
            console.log("No channel found.");
        } else {
            let result = {
              result: channels,
            };

            res.json(result);
        }
        }
    );
}

module.exports = { getYTInfo };