filepicker.setKey('AmCgE3LOTSRAi6q0Vlewrz'); 

  var player;
  var mp3_url = null;
  var latency = .075; // average firebase lag time in seconds
  var prev_time = 0;
  var myDataRef = new Firebase('https://akrolsmir.firebaseio.com');
  var data = {url:'', play:false, time:0};

  function sendURL(URL){
    data.url = URL;
    data.play = false;
    data.time = 0;
    myDataRef.set(data);      
  }

  function send_play_signal(){
    data.play = true;
    // data.url = mp3_url;
    // data.time = get_time() + latency;
    console.log(data);
    myDataRef.set(data);
  }

  function send_pause_signal(){
    data.play = false;
    data.time = get_time() + latency;
    //console.log(data.time);
    myDataRef.set(data);
  }
  // var prev_time = 0;
  function update_time(){
    // if(data.play == true){
      data.time = get_time() + latency;
      //console.log(data.time - prev_time);
      // prev_time = data.time;
      myDataRef.set(data);
    // }
  }

  myDataRef.on('value', function(snapshot){
    var song_url = snapshot.val().url;
    if(song_url != mp3_url){
      mp3_url = song_url;
      init(mp3_url);
    }
    var time = snapshot.val().time;
    if(snapshot.val().play == true){
      if (time != prev_time){
        play(time);
        prev_time = time;
      } else {
        play();
      }
    }else if(snapshot.val().play == false){
      if (time != prev_time){
        pause(time);
        prev_time = time;
      } else {
        pause();
      }
    }
  });

  $(document).ready(function(){
    player = $("#jquery_jplayer_1");
    player.jPlayer({
      ready: function () {
        // $(this).jPlayer("setMedia", {
        //   mp3:"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3"
        // });
      },
      play: send_play_signal,
      pause: send_pause_signal,
      seeking: function(a){
        $(this).jPlayer("pause");
        // update_time();
      },
      seek: function(a){
        console.log("seek ")
        console.log(a);
      },
      swfPath: "js",
      supplied: "mp3",
      wmode: "window"
    });

    // set regular time-updater function
    // window.setInterval(update_time, 5000);
  });

  function init(new_mp3_url, callback){
    player.jPlayer("setMedia", {
      mp3: mp3_url
    });
    player.jPlayer("load");

    if(callback)
      callback();
  }

  function play(optional_time){
    if(mp3_url != null){
      if(optional_time != null)
        player.jPlayer('play', optional_time); //optional_time
      else
        player.jPlayer('play');
    }
  }

  function get_time(){
    if(mp3_url != null)
      return player.data("jPlayer").status.currentTime;
  }

  function pause(optional_time){
    if(mp3_url != null){
      if(optional_time != null)
        player.jPlayer('pause', optional_time);
      else
        player.jPlayer('pause');
    }
  }

  function set_name(new_name){
    $('.jp-title').text(new_name);
  }