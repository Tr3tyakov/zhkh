/// <reference types="vite/client" />
interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition; // Для старых версий Chrome
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
    timeStamp: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error:
        | 'no-speech'
        | 'aborted'
        | 'audio-capture'
        | 'network'
        | 'not-allowed'
        | 'service-not-allowed';
    message: string;
    timeStamp: number;
}

declare var SpeechRecognition: typeof SpeechRecognition;
declare var webkitSpeechRecognition: typeof SpeechRecognition;
declare var SpeechRecognitionEvent: typeof SpeechRecognitionEvent;
