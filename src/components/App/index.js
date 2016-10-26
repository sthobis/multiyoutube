import React, { Component } from 'react';
import Youtube from 'react-youtube';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoParamList : [],
      videoPlayerList : []
    }
    this.videoIsReady = this.videoIsReady.bind(this);
    this.playAllVideos = this.playAllVideos.bind(this);
    this.pauseAllVideos = this.pauseAllVideos.bind(this);
    this.stopAllVideos = this.stopAllVideos.bind(this);
    this.resetAllVideos = this.resetAllVideos.bind(this);
  }
  componentWillMount() {
    this.setState({
      videoParamList : this.parseVideoParams()
    })
  }
  componentDidUpdate() {
    if (this.state.videoPlayerList.length === parseInt(this.state.videoParamList.length)) {
      this.bufferAllVideos();
      setTimeout(() => {
        this.playAllVideos();
      }, 5000);
      // lazy attempt to sync vids, let buffer for 5secs before playing
      // can be improved by checking player.getVideoLoadedFraction() before playing
    }
  }
  parseVideoParams() {
    let videoIDs, videoOpts = [];
    let pathname = this.props.location.pathname.replace('/multiyoutube','');
    if (pathname[0] === '/') {
      videoIDs = pathname.replace('/','').split('/');
    }
    if (this.props.location.hash !== '') {
      videoOpts = this.props.location.hash.replace('#','').split(',');  
    } else if (this.props.location.search !== '') {
      videoOpts = this.props.location.search.replace('?','').split(',');
    }

    let videoParamList = videoIDs.map((videoID, idx) => {
      return {
        id : videoID,
        opts : {
          playerVars : {
            autoplay : 0,
            start : videoOpts[idx] ? videoOpts[idx] : 0
          }
        }
      }
    });
    return videoParamList;
  }
  videoIsReady(event) {
    this.setState((prevState, props) => {
      let newVideoPlayerList = prevState.videoPlayerList.concat([event.target]);
      return {
        videoPlayerList: newVideoPlayerList
      }
    });
  }
  playAllVideos(timeout) {
    this.state.videoPlayerList.forEach(player => {
      player.playVideo();
    });
  }
  pauseAllVideos() {
    this.state.videoPlayerList.forEach(player => {
      player.pauseVideo();
    });
  }
  stopAllVideos() {
    this.state.videoPlayerList.forEach(player => {
      player.stopVideo();
    });
  }
  resetAllVideos() {
    this.state.videoPlayerList.forEach((player, idx) => {
      const startTime = this.state.videoParamList.filter((videoParam) => {
        return videoParam.id === player.getVideoData().video_id;
      })[0].opts.playerVars.start;
      player.seekTo(startTime, true);
      player.pauseVideo();
    });
  }
  bufferAllVideos() {
    this.state.videoPlayerList.forEach(player => {
      player.playVideo();
      player.pauseVideo();
    }); 
  }
  render() {
    const buttonStyle = {
      border: 0,
      display: 'inline-block',
      background: 'black',
      color: 'white',
      padding: '10px 20px',
      margin: '0 5px',
      cursor: 'pointer'
    }

    return (
      <div className="App" style={{padding:'0 0 10px 0', textAlign: 'center'}}>
        <div style={{margin:'20px 0'}}>
          <button style={buttonStyle} onClick={this.playAllVideos}>Play All Videos</button>
          <button style={buttonStyle} onClick={this.pauseAllVideos}>Pause All Videos</button>
          <button style={buttonStyle} onClick={this.stopAllVideos}>Stop All Videos</button>
          <button style={buttonStyle} onClick={this.resetAllVideos}>Reset All Videos</button>
        </div>
        {
          this.state.videoParamList.map((video, idx) => {
            return (
              <div style={{display:'inline-block', marginTop:'-4px'}} key={idx}>
                <Youtube
                  videoId={video.id}
                  opts={video.opts}
                  onReady={this.videoIsReady}
                />
              </div>
            );
          })
        }        
      </div>
    );
  }
}

export default App;
