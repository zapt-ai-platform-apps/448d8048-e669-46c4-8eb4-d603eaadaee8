import { createSignal, onCleanup } from 'solid-js';
import { Show } from 'solid-js';
import focusMusicUrl from './assets/focus-music.mp3';
import alarmSoundUrl from './assets/alarm-sound.mp3';

function App() {
  const [isFocusMode, setIsFocusMode] = createSignal(false);
  const [elapsedTime, setElapsedTime] = createSignal(0);
  const [message, setMessage] = createSignal('');
  let focusMusicAudio;
  let alarmAudio;
  let timerInterval;
  let alarmInterval;
  let messageTimeout;

  const startFocusMode = () => {
    setIsFocusMode(true);
    focusMusicAudio.play();
    setElapsedTime(0);
    setMessage('');
    timerInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000); // update every second

    // set the alarm interval
    alarmInterval = setInterval(() => {
      alarmAudio.play();
      setMessage('Time to get up and stretch your legs for 5 minutes!');
      messageTimeout = setTimeout(() => {
        setMessage('');
      }, 5 * 60 * 1000); // clear message after 5 minutes
    }, 60 * 60 * 1000); // every hour
  };

  const stopFocusMode = () => {
    setIsFocusMode(false);
    focusMusicAudio.pause();
    focusMusicAudio.currentTime = 0;
    clearInterval(timerInterval);
    clearInterval(alarmInterval);
    clearTimeout(messageTimeout);
    setElapsedTime(0);
    setMessage('');
  };

  onCleanup(() => {
    clearInterval(timerInterval);
    clearInterval(alarmInterval);
    clearTimeout(messageTimeout);
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4 text-gray-800">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold text-blue-600 mb-8 text-center">Focus Mode App</h1>
        <div class="flex justify-center">
          <Show when={!isFocusMode()}>
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={startFocusMode}
            >
              Start Focus Mode
            </button>
          </Show>
          <Show when={isFocusMode()}>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-8 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={stopFocusMode}
            >
              Stop Focus Mode
            </button>
          </Show>
        </div>
        <Show when={isFocusMode()}>
          <div class="mt-8 text-center">
            <p class="text-2xl">Elapsed Time: {Math.floor(elapsedTime() / 3600)}h {Math.floor((elapsedTime() % 3600) / 60)}m {elapsedTime() % 60}s</p>
            <Show when={message()}>
              <div class="mt-4 bg-yellow-200 p-4 rounded-lg">
                <p class="text-xl font-semibold">{message()}</p>
              </div>
            </Show>
          </div>
        </Show>
        <audio src={focusMusicUrl} loop ref={(el) => (focusMusicAudio = el)}></audio>
        <audio src={alarmSoundUrl} ref={(el) => (alarmAudio = el)}></audio>
      </div>
    </div>
  );
}

export default App;