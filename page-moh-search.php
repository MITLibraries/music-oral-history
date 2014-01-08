<?php


/* Template Name: MOH Search */


$pageRoot = getRoot($post);
$section = get_post($pageRoot);
$isRoot = $section->ID == $post->ID;


get_header();


?>

		
		<!-- Breadcrumb -->
		
		
		<div id="breadcrumb" class="inner" role="navigation" aria-label="breadcrumbs">
			<a href="<?php echo home_url(); ?>">Music Oral History home</a>
			&raquo; <?php the_title(); ?>
		</div>

		
<?php while ( have_posts() ) : the_post(); ?>


		<!-- Stage -->
		
		
		<div id="stage" class="inner column1 row" role="main">
	
			
			<!-- Title -->
			
			
			<div class="title span12">
				<?php if ($isRoot): ?>
				<h2><?php echo $section->post_title; ?></h2>
				<?php else: ?>
				<h2><a href="<?php echo get_permalink($section->ID) ?>"><?php echo $section->post_title; ?></a></h2>
				<?php endif; ?>
				<div class="extraInfo">
					<a href="<?php echo home_url(); ?>"><i class="icon-arrow-right"></i> Back to Music Oral History home</a>
				</div>
			</div>
			
			
			<!-- Content -->
			
			
			<div id="content" class="span12">
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
				<div class="search-area">
					<span class="search-help">Search across all interviews below. Click the play button to start any video, then search within the transcript of each.</span>
					<div class="row">
						<div class="span6">
							<div id="archive1"></div>
						</div>
						<div class="span6">
						
						<!-- BEGIN MODIFICATIONS -->
              
			              <style type="text/css">
			                iframe {width: 432px; height: 200px;}
			                .p3-transcript-main {max-height: 104px;}
			              </style>
			              <script type="text/javascript" src="http://techtv.mit.edu/assets/easyXDM.js"></script>
			              <div id="iframe-location" style="width:432px;height:200px;"></div>
			              <div id="transcript1"></div>
			              <script type="text/javascript">
			              
			              // TECHTV EMBED
			              var TECHTVID = 21824;
			              var rpc = new easyXDM.Rpc({
			                      remote: "http://techtv.mit.edu/embeds/"+TECHTVID,
			                      container: "iframe-location",
			                      props: { style: { width: 432, height: 200 } }
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
			              
			              
			              
			              window.p3_async_init = function() {
			                
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
			                  "iframe-location": {
			                    player_type: "techtv",
			                    platform_integration: true,
			                    file_id: TECHTVID,
			                    transcript: {
			                      target: "transcript1",
			                      width: 430,
			                      height: 200
			                    },
			                    collection: {
			                    target: "archive1",
			                    width: 300,
			                    height: 475,
			                    show_segments: true,
			                    all_files_sort_by: "name"
			                  }
			                }
			              },"h_RJzPyn1vwbLhFaDLRxJUoNvT_756xr");
			              
			              /***
			              
			                TASK: THE CODE BELOW THAT IS COMMENTED OUT CAN BE REMOVED
			              
			              ***/
			              
			              
			              // P3.get(0).player.interface = {};
			              // P3.get(0).player.interface.position = function(){return false;}
			              // P3.get(0).player.load_video = function(obj){
			              //    var iframe = P3.JQuery("#videocontainer_noplayer").find("iframe:first"); 
			              //    var src = P3.JQuery(iframe).attr("src"); 
			              //    src += /autoplay/.test(src) ? "" : "&autoplay=true";
			              //    src = src.replace(/embeds\/\d+/,"embeds/" + obj.video_id);
			              //    P3.JQuery(iframe).attr("src", src); 
			              //  }
			              }
			              
			              </script>
			              <!-- END MODIFICATIONS -->
							<!--<script type="text/javascript" src="http://p3.3playmedia.com/p3.js"></script>-->
						</div>
					</div>
				</div>
			</div>
				
				
			<!-- Edit -->
			
			
			<footer class="entry-meta">
				<?php edit_post_link( __( 'Edit', 'twentytwelve' ), '<span class="edit-link">', '</span>' ); ?>
			</footer>
			
			
			<div class="clear"></div>		
		</div>
		
		
<?php endwhile; ?>


<?php get_footer(); ?>