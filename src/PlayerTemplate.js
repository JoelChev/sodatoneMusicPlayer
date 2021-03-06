import React from "react"
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player'

import PrevTrackIcon from './assets/previous-track.svg';
import PlayTrackIcon from './assets/play-track.svg';
import PauseTrackIcon from './assets/pause-track.svg';
import NextTrackIcon from './assets/next-track.svg';
import VolumeIcon from './assets/volume.svg';
import MutedVolumeIcon from './assets/muted-volume.svg';
import JoelIcon from './assets/joel.jpg';

import * as timeUtil from './timeUtil';

class Player extends React.Component {

    state = {
        isPlaying: false,
        currentTrackIndex: 0,
        played: 0,
        volume: 0.8,
        muted: false,
        cachedVolume: 0,
        duration: 0,
        isMuteControlDisabled: false,
    }
    constructor(props) {
        super(props);
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.onSeekMouseDown = this.onSeekMouseDown.bind(this);
        this.onSeekMouseUp = this.onSeekMouseUp.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onDuration = this.onDuration.bind(this);
        this.handleVolumeToggle = this.handleVolumeToggle.bind(this);
        this.handleMuteToggle = this.handleMuteToggle.bind(this);
        this.onEnded = this.onEnded.bind(this);

        this.tracks = [
            {
                id: 1,
                trackName: "The Pretender",
                artistName: "Foo Fighters",
                artworkUrl: "https://images.sk-static.com/images/media/profile_images/artists/29315/huge_avatar",
                mediaUrl: "https://p.scdn.co/mp3-preview/6aba2f4e671ffe07fd60807ca5fef82d48146d4c?cid=1cef747d7bdf4c52ac981490515bda71",
                durationMilliseconds: 30000
            },
            {
                id: 2,
                artistName: "Arctic Monkeys",
                trackName: "Do I Wanna Know?",
                artworkUrl: "https://cps-static.rovicorp.com/3/JPG_500/MI0003/626/MI0003626958.jpg?partner=allrovi.com",
                mediaUrl: "https://p.scdn.co/mp3-preview/9ec5fce4b39656754da750499597fcc1d2cc82e5?cid=1cef747d7bdf4c52ac981490515bda71",
                durationMilliseconds: 30000
            },
        ];
    }

    handlePlay() {
        this.setState(prevState => ({
            isPlaying: !prevState.isPlaying
        }));
    }

    onSeekMouseDown() {
        this.setState({ isSeeking: true });
    }

    handleSeek(event) {
        const played = parseFloat(event.target.value);
        this.setState({played});
    }

    onSeekMouseUp() {
        this.setState({ isSeeking: false });
    }

    onProgress(state) {
        // Do not progress music timing when seeking.
        if (!this.state.isSeeking) {
            this.setState(state);
        }
    }

    onDuration(duration) {
        this.setState({ duration });
    }

    onEnded() {
        // First navigate to the next song in the queue.
        this.handleNext();
        // After navigating to the next song, if you are on the first song that 
        // implies you were at the end of the list, so pause.
        if (this.state.currentTrackIndex === 0) {
            this.setState({isPlaying: false});
        }
    }

    handleVolumeToggle(event) {
        const volume = parseFloat(event.target.value);
        this.setState({ volume});
        // If the volume slider is set such that there is no volume, both mute AND disable
        // the mute button.
        if (!volume) {
            this.setState({ muted: true });
            this.setState({ isMuteControlDisabled: true });
        }
        else {
            // Otherwise ensure that the track is not muted and that the mute button is enabled.
            this.setState({ muted: false });
            this.setState({ isMuteControlDisabled: false });
        }
    }

    handlePrevious() {
        const { currentTrackIndex } = this.state;
        const previousTrackIndex = currentTrackIndex - 1;
        // If on the first track, then we go back to the beginning of it on previous button click, we do not loop around.
        if (previousTrackIndex < 0) {
            this.setState({ played: 0 });
        } else {
            // Otherwise we go to the previous track if not on the first.
            this.setState({ currentTrackIndex: previousTrackIndex });
        }
    }

    handleNext() {
        const { currentTrackIndex } = this.state;
        const nextTrackIndex = (currentTrackIndex + 1) % this.tracks.length;
        this.setState({ currentTrackIndex: nextTrackIndex });
    }

    handleMuteToggle() {
        const { muted, volume, cachedVolume } = this.state;
        // If we are going to be muting, save the volume for later as a cached value.
        // We will reset it back if we unmute.
        if (!muted) {
            this.setState({ cachedVolume: volume });
            this.setState({ volume: 0 })
        } else {
            // Otherwise restore the volume if we are unmuting.
            this.setState({ volume: cachedVolume });
            this.setState({ cachedVolume: 0 });
        }
        this.setState(prevState => ({
            muted: !prevState.muted
        }));
    }

    render() {
        return (
            <div>
                <div className="player-template-title-container">
                    <h2 className="player-template-title">Sodatone.</h2>
                    <a href="https://github.com/JoelChev"
                        target="_blank"
                        rel="noopener noreferrer">
                        <img className="player-template-author-image" src={JoelIcon} alt="Joel_Cheverie"/>
                    </a>
                </div>
                <div className={`player-template-ocean ${this.state.isPlaying ? 'player-template-ocean--paused' : ''}`}>
                    <div className={`player-template-wave ${!this.state.isPlaying ? 'player-template-wave--paused' : ''}`}/>
                    <div className={`player-template-wave ${!this.state.isPlaying ? 'player-template-wave--paused' : ''}`}/>
                </div>
                <MediaPlayer
                    tracks={this.tracks}
                    currentTrackIndex={this.state.currentTrackIndex}
                    handlePlay={this.handlePlay}
                    handlePrevious={this.handlePrevious}
                    handleNext={this.handleNext}
                    isPlaying={this.state.isPlaying}
                    played={this.state.played}
                    duration={this.state.duration}
                    handleSeek={this.handleSeek}
                    onSeekMouseDown={this.onSeekMouseDown}
                    onSeekMouseUp={this.onSeekMouseUp}
                    onProgress={this.onProgress}
                    onDuration={this.onDuration}
                    volume={this.state.volume}
                    handleVolumeToggle={this.handleVolumeToggle}
                    muted={this.state.muted}
                    handleMuteToggle={this.handleMuteToggle}
                    onEnded={this.onEnded}
                    isMuteControlDisabled={this.state.isMuteControlDisabled} />
            </div>
        );
    }
}

class MediaPlayer extends React.Component {

    constructor(props) {
        super(props);
        this.reactPlayer = React.createRef();
    }

    static propTypes = {
        tracks: PropTypes.array,
        currentTrackIndex: PropTypes.number,
        handlePlay: PropTypes.func,
        handlePrevious: PropTypes.func,
        handleNext: PropTypes.func,
        isPlaying: PropTypes.bool,
        played: PropTypes.number,
        handleSeek: PropTypes.func,
        onSeekMouseDown: PropTypes.func,
        onSeekMouseUp: PropTypes.func,
        onProgress: PropTypes.func,
        onDuration: PropTypes.func,
        volume: PropTypes.number,
        handleVolumeToggle: PropTypes.func,
        handleMuteToggle: PropTypes.func,
        onEnded: PropTypes.func,
        isMuteControlDisabled: PropTypes.bool,
    }

    seekMouseUp() {
        this.props.onSeekMouseUp();
        this.reactPlayer.current.seekTo(this.props.played);
    }

    onPreviousClick() {
        // If on the first song, simply go to the beginning of the current song.
        if (this.props.currentTrackIndex === 0) {
            this.reactPlayer.current.seekTo(0);
        }
        this.props.handlePrevious();
    }

    onNextClick() {
        // If you are on the last song, navigate to the end of the current song so that
        // the first track starts as 'paused'.
        if (this.props.currentTrackIndex === this.props.tracks.length - 1) {
            this.reactPlayer.current.seekTo(this.props.duration);
        } else {
            // Otherwise, move onto the next song.
            this.props.handleNext();
        }
    }

    getPlayedTime() {
        return timeUtil.formatTime(this.props.played * this.props.duration);
    }

    getTotalTime() {
        return timeUtil.formatTime(this.props.duration);
    }

    getCurrentTrack() {
        const { tracks, currentTrackIndex } = this.props;
        if (tracks) {
            return tracks[currentTrackIndex];
        }
    }

    render() {
        return (
            <div className="react-player-container">
                <ReactPlayer
                    ref={this.reactPlayer}
                    playing={this.props.isPlaying}
                    height={'0px'}
                    width={'0px'}
                    config={{ file: { forceAudio: true } }}
                    url={this.getCurrentTrack() ? this.getCurrentTrack().mediaUrl : null}
                    onProgress={(state) => this.props.onProgress(state)}
                    onDuration={(state) => this.props.onDuration(state)}
                    onEnded={() => this.props.onEnded()}
                    volume={this.props.volume}/>
                {
                    this.getCurrentTrack() ?
                        <div className="react-player-information-container">
                            {
                                this.getCurrentTrack() ?
                                    <div className="react-player-information-container__track-artwork-container">
                                        <img
                                            className="react-player-information-container__track-artwork"
                                            src={this.getCurrentTrack().artworkUrl}
                                            alt={`${this.getCurrentTrack().artistName} : ${this.getCurrentTrack().trackName}`}/>
                                    </div>
                                    : null
                            }
                            <div className="react-player-information-container__text-container">
                                <p className="react-player-information-container__track-name">{this.props.tracks[this.props.currentTrackIndex].trackName}</p>
                                <p className="react-player-information-container__artist-name">{this.props.tracks[this.props.currentTrackIndex].artistName}</p>
                            </div>
                        </div>
                        :
                        <div className="react-player-information-container--empty">
                            <p className="react-player-empty-message">No Track Found</p>
                        </div>
                }
                <div className="react-player-button-container">
                    <button
                        className="react-player-previous-button"
                        onClick={() => this.onPreviousClick()}>
                        <img 
                            src={PrevTrackIcon} 
                            className="react-player-previous-button__icon" 
                            alt="Previous Track"/>
                    </button>
                    {
                        !this.props.isPlaying ?
                            <button
                                className="react-player-play-button"
                                onClick={() => this.props.handlePlay()}>
                                <img 
                                    src={PlayTrackIcon} 
                                    className="react-player-play-button__icon" 
                                    alt="Play Track"/>
                            </button>
                            :
                            <button
                                className="react-player-pause-button"
                                onClick={() => this.props.handlePlay()}>
                                <img 
                                    src={PauseTrackIcon} 
                                    className="react-player-pause-button__icon" 
                                    alt="Pause Track"/>
                            </button>
                    }
                    <button
                        className="react-player-next-button"
                        onClick={() => this.onNextClick()}>
                        <img 
                            src={NextTrackIcon} 
                            className="react-player-next-button__icon" 
                            alt="Next Track"/>
                    </button>
                    <div className="react-player-time-container">
                        <p className="react-player-played-time">{this.getPlayedTime()}</p>
                        <p className="react-player-total-time">{this.getTotalTime()}</p>
                    </div>
                    <input
                        className="react-player-tracker"
                        type='range' min={0} max={1} step='any'
                        value={this.props.played}
                        onMouseDown={(event) => this.props.onSeekMouseDown(event)}
                        onChange={(event) => this.props.handleSeek(event)}
                        onMouseUp={() => this.seekMouseUp()} />
                </div>
                <div className="react-player-volume-container">
                    <button className="react-player-mute-button"
                        disabled={this.props.isMuteControlDisabled}
                        onClick={() => this.props.handleMuteToggle()}>
                        <img
                            className={`react-player-mute-button__icon ${this.props.muted ? 'react-player-mute-button__icon--muted' : ''}`}
                            src={this.props.muted ? MutedVolumeIcon : VolumeIcon}
                            alt={this.props.muted ? "Unmute" : "Mute"} />
                    </button>
                    <input
                        className="react-player-volume-input-bar"
                        type='range' min={0} max={1} step='any'
                        value={this.props.volume}
                        onChange={(event) => this.props.handleVolumeToggle(event)} />
                </div>
            </div>
        )
    }
}

export default Player;