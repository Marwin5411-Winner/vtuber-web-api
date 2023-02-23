const {con} = require('../config/dbcon');
const { getYTInfo } = require('./getYTInfo'); 

function getChannelsFromDB(res) {
    con.query('SELECT id FROM `channelList`', function (err, channelList) {
        let ids = channelList.map(result => result.id);
        console.log(ids);
        return ids;
    });
}

function getChannelsInfo(res) {
    con.query('SELECT * FROM channels', function (err, channelList) {
        if (err) {
            console.log(err);
        }
        console.log(channelList);

        channelList.sort(() => Math.random() - 0.5);

          
        let data = {
            result: channelList
        }
        
        res.json(data);
    });
}


module.exports = {getChannelsFromDB , getChannelsInfo};