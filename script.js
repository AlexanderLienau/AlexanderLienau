// #region Imports
// @ts-ignore
import { Remote } from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";
import { scale } from "../../../ixfx/data.js";
import * as Dom from '../../../ixfx/dom.js';

// #endregion

// #region Settings & state
const settings = Object.freeze({
  remote: new Remote(),
  // If true, x values are flipped
  horizontalMirror: true,
  labelFont: `"Cascadia Code", Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace`,
  classHues: new Map()
});

let state = Object.freeze({
  bounds: {
    width: 0,
    height: 0,
    center: { x: 0, y: 0 }
  },
  ticks: 0,
  /** @type {ObjectPrediction[]} */
  predictions: [],

});
// #endregion

/**
* Received predictions
* @param {ObjectPrediction[]} predictions
*/
const onPredictions = (predictions) => {
  saveState({
    predictions: predictions
  });
};

/**
* Draw a prediction
* @param {ObjectPrediction} p
* @param {CanvasRenderingContext2D} ctx
*/
const drawPrediction = (p, ctx) => {
  const { horizontalMirror, classHues } = settings;
  const { bounds } = state;

  // Position of detected object comes in relative terms,
  // so we need to map to viewport size. Since the viewport ratio
  // is not necessarily same as camera ratio, distortion may occur.
  // To avoid this, use the same value for yDim & xDim.
  const yDim = bounds.height;
  const xDim = bounds.width;

  const rect = {
    x: ((horizontalMirror ? 1 - p.bbox[0] : p.bbox[0])) * xDim,
    y: p.bbox[1] * yDim,
    width: p.bbox[2] * xDim,
    height: p.bbox[3] * yDim
  };

  // Get or create a random hue for each seen class
  if (!classHues.has(p.class)) classHues.set(p.class, Math.random() * 360);

  const hue = classHues.get(p.class);

  ctx.fillStyle = ctx.strokeStyle = `hsl(${hue}, 80%, 40%)`;

  // Rectangle for object
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

  // Label
  ctx.fillText(
    `${p.class} (${Math.round(p.score * 100)}%)`,
    rect.x + 4,
    rect.y + 4);
};


let storeData
let clockXAxis;
let clockYAxis;
let clockW;
let clockH;
let signXAxis;
let signYAxis;
let signW;
let signH;
let bananaXAxis;
let bananaYAxis;
let bananaW;
let bananaH;




const useState = () => {
  const { labelFont } = settings;
  const { predictions } = state;
  const { width, height } = state.bounds;

  const canvasEl = /** @type {HTMLCanvasElement|null} */(document.getElementById(`canvas`));
  const ctx = canvasEl?.getContext(`2d`);
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw predictions
  ctx.font = `14pt ${labelFont}`;
  ctx.textBaseline = `top`;
  ctx.lineWidth = 3;

  predictions.forEach(p => drawPrediction(p, ctx));
};


const setup = async () => {
  const { remote } = settings;

  // Listen for data from the remote
  remote.onData = (d) => {
    if (d.data && Array.isArray(d.data)) {
      onPredictions(d.data);
      storeData = d.data

      //Object Triggers
      let clock = storeData.findIndex(x => x.class === "clock");
      let sign = storeData.findIndex(x => x.class === "stop sign");
      let banana = storeData.findIndex(x => x.class === "banana");





      if (clock > -1) {
        if (gain.gain.value < 0.8) { gain.gain.value = gain.gain.value + 0.2; }
        clockXAxis = storeData[clock].bbox[0];
        clockYAxis = storeData[clock].bbox[1];
        clockW = storeData[clock].bbox[2];
        clockH = storeData[clock].bbox[3];
        let distance = (clockW + clockH) * 0.5
        dlyGain.gain.value = dlyValue;
        pan.pan.value = scale(clockXAxis, 0, 1, 1, -1);
        audio.playbackRate.value = scale(clockYAxis, 0, 1, 1.5, 0.5);
        filter.frequency.value = scale(distance, 0.2, 1, 200, 20000);
        calcDly();
      } else if (clock === -1) {
        if (gain.gain.value > 0) { gain.gain.value = gain.gain.value - 0.1; }
        if (gain.gain.value < 0) { gain.gain.value = 0 };
        dlyValue = 0;
        pan.pan.value = 0;
      };


      if (sign > -1) {
        signXAxis = storeData[sign].bbox[0];
        signYAxis = storeData[sign].bbox[1];
        signW = storeData[sign].bbox[2];
        signH = storeData[sign].bbox[3];
        let distance = (signW + signH) * 0.5
        if (gain2.gain.value < 0.8) { gain2.gain.value = gain2.gain.value + 0.2; }
        dlyGain2.gain.value = dlyValue2;
        pan2.pan.value = scale(signXAxis, 0, 1, 1, -1);
        audio2.playbackRate.value = scale(signYAxis, 0, 1, 4, 0.5)
        filter2.frequency.value = scale(distance, 0.2, 1, 200, 20000);
        calcDly2();
      } else if (sign === -1) {
        if (gain2.gain.value > 0) { gain2.gain.value = gain2.gain.value - 0.1; }
        if (gain2.gain.value < 0) { gain2.gain.value = 0 };
        dlyValue2 = 0;
      };


      if (banana > -1) {
        bananaXAxis = storeData[banana].bbox[0];
        bananaYAxis = storeData[banana].bbox[1];
        bananaW = storeData[banana].bbox[2];
        bananaH = storeData[banana].bbox[3];
        let distance = (bananaW + bananaH) * 0.5
        if (gain3.gain.value < 0.8) { gain3.gain.value = gain3.gain.value + 0.2; }
        dlyGain3.gain.value = dlyValue3;
        pan3.pan.value = scale(bananaXAxis, 0, 1, 1, -1);
        audio3.playbackRate.value = scale(bananaYAxis, 0, 1, 4, 0.5)
        filter3.frequency.value = scale(distance, 0.2, 1, 200, 20000);

        calcDly3();

      } else if (banana === -1) {
        if (gain3.gain.value > 0) { gain3.gain.value = gain3.gain.value - 0.1; }
        if (gain3.gain.value < 0) { gain3.gain.value = 0 };
        dlyValue3 = 0;
      }
    };

    //DISPLAY BBOX VALUES

    // document.getElementById("B0").innerHTML = storeData[cellPhone].bbox[0];
    // document.getElementById("B1").innerHTML = storeData[cellPhone].bbox[1];
    // document.getElementById("B2").innerHTML = storeData[cellPhone].bbox[2];
    // document.getElementById("B3").innerHTML = storeData[cellPhone].bbox[3];
    // document.getElementById("dly").innerHTML = dlyValue;



    // console.warn(`Got data we did not expect`);
    //console.log(d);
  }
};

// Keep CANVAS filling the screen
Dom.fullSizeCanvas(`#canvas`, args => {
  saveState({ bounds: args.bounds });
});

// If the floating source window is there, respond to clicking on the header
document.getElementById(`sourceSection`)?.addEventListener(`click`, evt => {

  const hdr = /** @type HTMLElement */(document.getElementById(`sourceSection`));
  Dom.cycleCssClass(hdr, [`s`, `m`, `l`]);
});

const loop = () => {
  useState();
  window.requestAnimationFrame(loop);

};
window.requestAnimationFrame(loop);
setup();


// #region Toolbox
/**
* Save state
* @param {Partial<state>} s
*/
function saveState(s) {
  state = Object.freeze({
    ...state,
    ...s
  });
}


/**
* @typedef { import("../../common-vision-source").ObjectPrediction } ObjectPrediction
*/
// #endregion

// AUDIO NODES AND OSC
const context = new AudioContext();

const gain = context.createGain();
const filter = context.createBiquadFilter();
const pan = context.createStereoPanner();
const dly = context.createDelay();
//const rev = context.createConvolver();
const dlyGain = context.createGain();
const feedback = context.createGain();

const gain2 = context.createGain();
const filter2 = context.createBiquadFilter();
const pan2 = context.createStereoPanner();
const dly2 = context.createDelay();
const dlyGain2 = context.createGain();
const feedback2 = context.createGain();

const gain3 = context.createGain();
const filter3 = context.createBiquadFilter();
const pan3 = context.createStereoPanner();
const dly3 = context.createDelay();
const dlyGain3 = context.createGain();
const feedback3 = context.createGain();

let dlyValue = 0;
let dlyValue2 = 0;
let dlyValue3 = 0;

//AUDIO INIT VALUES
filter.type = "lowpass";
gain.gain.value = 0;
dlyGain.gain.value = 0;
dly.delayTime.setValueAtTime(0.3, context.currentTime);
filter.frequency.value = 20000;
feedback.gain.value = 0.6;

filter2.type = "lowpass";
gain2.gain.value = 0;
dlyGain2.gain.value = 0;
filter2.frequency.value = 20000;
dly2.delayTime.setValueAtTime(0.3, context.currentTime);
feedback2.gain.value = 0.6;

filter3.type = "lowpass";
gain3.gain.value = 0;
dlyGain3.gain.value = 0;
filter3.frequency.value = 20000;
dly3.delayTime.setValueAtTime(0.3, context.currentTime);
feedback3.gain.value = 0.6;

const audio = context.createBufferSource();
const audio2 = context.createBufferSource();
const audio3 = context.createBufferSource();

const initAudio = async url => {
  const audioBuffer = await fetch(url)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));
  audio.buffer = audioBuffer;
  audio.loop = true;

  audio.connect(gain);
  gain.connect(pan);
  pan.connect(filter)
  filter.connect(dlyGain);
  filter.connect(context.destination)
  dlyGain.connect(dly)
  dly.connect(feedback);
  feedback.connect(dly);
  dly.connect(context.destination);

  audio.start(context.currentTime);
  console.log("audio 1 initiated " + audio);
};


const initAudio2 = async url => {
  const audioBuffer2 = await fetch(url)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));
  audio2.buffer = audioBuffer2;
  audio2.loop = true;

  audio2.connect(gain2);
  gain2.connect(pan2);
  pan2.connect(filter2)
  filter2.connect(dlyGain2);
  filter2.connect(context.destination)
  dlyGain2.connect(dly2)
  dly2.connect(feedback2);
  feedback2.connect(dly2);
  dly2.connect(context.destination);

  audio2.start(context.currentTime);
  console.log("audio 2 initiated" + audio2);
};


const initAudio3 = async url => {
  const audioBuffer2 = await fetch(url)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));
  audio3.buffer = audioBuffer2;
  audio3.loop = true;

  audio3.connect(gain3);
  gain3.connect(pan3);
  pan3.connect(filter3)
  filter3.connect(dlyGain3);
  filter3.connect(context.destination)
  dlyGain3.connect(dly3)
  dly3.connect(feedback3);
  feedback3.connect(dly3);
  dly3.connect(context.destination);

  audio3.start(context.currentTime);
  console.log("audio 3 initiated" + audio2);
};


document.getElementById("contextButton").onclick = function () {
  initAudio("Kick.mp3");
  initAudio2("Buch Arp C.mp3");
  initAudio3("Drone.mp3");
};

function calcDly() {
  if (clockXAxis >= 0 && clockXAxis <= 0.25) {
    dlyValue = scale(clockXAxis, 0.25, 0, 0.3, 0.8)
  } if (clockXAxis >= 0.75 && clockXAxis <= 1) {
    dlyValue = scale(clockXAxis, 0.65, 1, 0.3, 0.8)
  } else if (clockXAxis < 75 && clockXAxis > 0.25) {
    dlyValue = 0
  }
  return dlyValue;
};



function calcDly2() {
  if (signXAxis >= 0 && signXAxis <= 0.25) {
    dlyValue2 = scale(signXAxis, 0.25, 0, 0.3, 0.8)
  } if (signXAxis >= 0.75 && signXAxis <= 1) {
    dlyValue2 = scale(signXAxis, 0.65, 1, 0.3, 0.8)
  } else if (signXAxis < 75 && signXAxis > 0.25) {
    dlyValue2 = 0
  }
  return dlyValue2;
};

function calcDly3() {
  if (bananaXAxis >= 0 && bananaXAxis <= 0.25) {
    dlyValue3 = scale(bananaXAxis, 0.25, 0, 0.3, 0.8)
  } if (bananaXAxis >= 0.75 && bananaXAxis <= 1) {
    dlyValue3 = scale(bananaXAxis, 0.65, 1, 0.3, 0.8)
  } else if (bananaXAxis < 75 && bananaXAxis > 0.25) {
    dlyValue3 = 0
  }
  return dlyValue3;
};










