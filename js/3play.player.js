var TECHTVID = 21824;
var rpc = new easyXDM.Rpc({
        remote: "http://techtv.mit.edu/embeds/"+TECHTVID,
        container: "iframe-location",
        props: { style: { width: 442, height: 200 } }
      },
      {
        local: {
          play: function(successFn, errorFn) {},
          pause: function(successFn, errorFn) {},
          stop: function(successFn, errorFn) {},
          resume: function(successFn, errorFn) {},
          toggle: function(successFn, errorFn) {},
          seek: function(seconds, successFn, errorFn) {},
          isPlaying: function(successFn, errorFn) {},
          isPaused: function(successFn, errorFn) {},
          playState: function(successFn, errorFn) {},
          position: function(successFn, errorFn) {},
          duration: function(successFn, errorFn) {},
          videoId: function(md5, successFn, errorFn) {},
          playFile: function(id, successFn, errorFn) {}
        },
        remote: {
          play: {},
          pause: {},
          stop: {},
          resume: {},
          toggle: {},
          seek: {},
          isPlaying: {},
          isPaused: {},
          playState: {},
          position: {},
          duration: {},
          videoId: {},
          playFile: {}
        }
      }
    );

window.p3_async_init = function(){
  
  P3.PlayerInterface.techtv = function(id, instance) {
                    var parent = this;
                    parent.instance = instance;

                    this.playState = "paused";
                    this.playPosition = false;
                    this.playDuration = false;
                    this.playVideoId = TECHTVID;

                    if (typeof rpc != "undefined" && rpc.play){
                      this.play = function(){rpc.play();};
                      this.pause = function(){rpc.pause();};
                      this.play_state = function(){return parent.playState};
                      this.position = function(){return parent.playPosition};
                      this.video_id = function(){return parent.playVideoId};
                      this.duration = function(){return parent.playDuration};
                      this.seek = function(m){
                        rpc.play();
                        setTimeout(function(){
                          var s = m / 1000;
                          rpc.seek(s);
                        },0);
                      };
                      /***

                        TASK: THERE NEEDS TO BE SOME LOGIC HERE THAT ENABLES A NEW FILE AND TIMESTAMP
                        TO BE LOADED INTO THE PLAYER, AND FOR PLAYBACK TO BEGIN AUTOMATICALLY AND FROM THAT TIMESTAMP
                        RIGHT NOW IT IS TOO CLUNKY

                      ***/
                      this.play_file = function(obj){
                        m = obj.m || 0;
                        if (obj.video_id == parent.playVideoId){
                          parent.seek(m);
                        } else {
                          rpc.playFile(obj.video_id, m/1000);
                        }
                      };
                      /***

                        TASK: THE UPDATE INTERVALS NEED TO BE OPTIMIZED, TRADING OFF USER EXPERIENCE AND PERFORMANCE

                      ***/
                      var SHORT_STAT_INTERVAL = 333;
                      var LONG_STAT_INTERVAL = 3000;
                      this.stat_interval = setInterval(function(){
                        rpc.position(null,function(data){P3.get(0).player.interface.playPosition = data * 1000;});
                      },SHORT_STAT_INTERVAL);
                      this.long_stat_interval = setInterval(function(){
                        rpc.isPlaying(null,function(data){P3.get(0).player.interface.playState = (data ? "PLAYING" : "PAUSED")});
                        rpc.duration(null,function(data){P3.get(0).player.interface.playDuration = data * 1000;})
                        rpc.videoId(null,function(data){P3.get(0).player.interface.playVideoId = data});
                      },LONG_STAT_INTERVAL);
                    }
                  }
  
  
  P3.init({
    "iframe-location" : {
      player_type: "techtv",
      file_id: TECHTVID,
      platform_integration: true,
      transcript: {
        target: "transcript1",
        skin: "playlist_default",
        // template: "bottom_search",
        width: 442,
        height: 253,
        can_print: true,
        can_download: true,
        can_collapse: true
      },
      playlist: {
        target: "collection1",
        playlist_height: 360,
        width: 400,
        list_sort_by: "name",
        search_sort_by: "name",
        show_all_results: false,
        skin: "",
        linked_account_id: 894,
        project_id: 10129,
        suggested_search_terms: ["symphony","oboe", "orchestra","choir"]
      }
    }
  
  },"h_RJzPyn1vwbLhFaDLRxJUoNvT_756xr");
}

$(document).ready(function(){
  
  $("#transcriptskin").change(function(){
    P3.get(0).transcript.apply_skin($(this).val());
  });
  $("#playlistskin").change(function(){
    P3.get(0).playlist.apply_skin($(this).val());
  });
  
});