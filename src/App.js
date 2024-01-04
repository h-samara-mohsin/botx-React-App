import { useRef, useState } from "react";
import { useEffect } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./App.css";
import microPhoneIcon from "./microphone.svg";
function App() {
  const [ourText, setOurText] = useState("")

  const msg = new SpeechSynthesisUtterance()
  // msg.text = "Hello World"
  useEffect(() => {
    window.speechSynthesis.speak(msg)
  }, [msg])
  const speechHandler = (msg) => {
    msg.text = ourText
    window.speechSynthesis.speak(msg)
  }

  const commands = [
    {
      command: "open *",
      callback: (website) => {
        window.open("http://" + website.split(" ").join(""));
      },
    },
    {
      command: "change background colour to *",
      callback: (color) => {
        document.body.style.background = color;
      },
    },
    {
      command: "reset",
      callback: () => {
        handleReset();
      },
    },
    ,
    {
      command: "reset background colour",
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`;
      },
    },
  ];
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser is not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    const output = SpeechRecognition.startListening({
      continuous: true,
    });
    console.log("output: ",output)
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };
  console.log("testing transcript: ",transcript)


  return (
    <>
      <div className="microphone-wrapper">
      <div className="mircophone-container">
        <div
          className="microphone-icon-container"
          ref={microphoneRef}
          onClick={handleListing}
        >
          <img src={microPhoneIcon} className="microphone-icon" />
        </div>
        <div className="microphone-status">
          {isListening ? "Listening........." : "Click to start Listening"}
        </div>
        {isListening && (
          <button className="microphone-stop btn" onClick={stopHandle}>
            Stop
          </button>
        )}
      </div>
      {transcript && (
        <div className="microphone-result-container">
          <div className="microphone-result-text">{transcript}</div>
          <button className="microphone-reset btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      )}
    </div>
    <div>
       <h1>React Text to Speech</h1>
      <input
        type='text'
        value={ourText}
        placeholder='Enter Text'
        onChange={(e) => setOurText(e.target.value)}
      />
      <button onClick={() => speechHandler(msg)}>SPEAK</button>
    </div>
    </>
  
  );
}
export default App;