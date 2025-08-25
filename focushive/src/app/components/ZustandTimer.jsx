import { useEffect } from 'react'
import useTimerStore from '../stores/timerStore'

const ZustandTimer = () => {
  const {
    timeLeft,
    isActive,
    isPaused,
    mode,
    round,
    totalRounds,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    switchMode,
    tick
  } = useTimerStore()
  
  // Handle timer tick
  useEffect(() => {
    let interval = null
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    } else {
      clearInterval(interval)
    }
    
    return () => clearInterval(interval)
  }, [isActive, isPaused, tick])
  
  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  // Get mode display name
  const getModeDisplayName = (mode) => {
    switch (mode) {
      case 'focus':
        return 'Focus Time'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return 'Focus Time'
    }
  }
  
  const progress = ((getModeDuration(mode) - timeLeft) / getModeDuration(mode)) * 100;

  // Get duration for current mode
  function getModeDuration(currentMode) {
    switch (currentMode) {
      case 'focus':
        return 25 * 60; // 25 minutes
      case 'shortBreak':
        return 5 * 60; // 5 minutes
      case 'longBreak':
        return 15 * 60; // 15 minutes
      default:
        return 25 * 60;
    }
  }

  // Get color scheme based on mode
  const getColorScheme = (currentMode) => {
    switch (currentMode) {
      case 'focus':
        return 'red';
      case 'shortBreak':
        return 'green';
      case 'longBreak':
        return 'blue';
      default:
        return 'red';
    }
  };

  const colorScheme = getColorScheme(mode);

  return (
    <div className={`min-h-screen bg-${colorScheme}-500 flex items-center justify-center transition-colors duration-500`}>
      <div className="text-center">
        <div className={`bg-${colorScheme}-600 rounded-lg p-8 shadow-2xl max-w-md mx-auto`}>
          <h1 className="text-white text-2xl font-bold mb-2">{getModeDisplayName(mode)}</h1>
          <p className="text-white/80 mb-8">Round {round} of {totalRounds}</p>
          
          {/* Timer Display */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Progress Ring */}
            <svg className="transform -rotate-90 w-64 h-64">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 120}`}
                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-6xl font-mono font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex gap-2 mb-6 justify-center">
            {!isActive ? (
              <button 
                onClick={startTimer}
                className={`px-8 py-4 rounded-lg font-bold text-xl transition-all bg-white text-${colorScheme}-500 hover:bg-${colorScheme}-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                Start
              </button>
            ) : isPaused ? (
              <button 
                onClick={resumeTimer}
                className={`px-8 py-4 rounded-lg font-bold text-xl transition-all bg-white text-${colorScheme}-500 hover:bg-${colorScheme}-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                Resume
              </button>
            ) : (
              <button 
                onClick={pauseTimer}
                className={`px-6 py-3 rounded-lg font-bold transition-all bg-${colorScheme}-700 text-${colorScheme}-300 hover:bg-${colorScheme}-800`}
              >
                Pause
              </button>
            )}
            
            <button 
              onClick={stopTimer}
              className={`px-6 py-3 rounded-lg font-bold transition-all bg-${colorScheme}-700 text-${colorScheme}-300 hover:bg-${colorScheme}-800`}
            >
              Stop
            </button>
            
            <button 
              onClick={resetTimer}
              className={`px-6 py-3 rounded-lg font-bold transition-all bg-${colorScheme}-700 text-${colorScheme}-300 hover:bg-${colorScheme}-800`}
            >
              Reset
            </button>
          </div>
          
          {/* Mode Switcher */}
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => switchMode('focus')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                mode === 'focus' 
                  ? 'bg-white text-red-500' 
                  : 'bg-red-700 text-red-300 hover:bg-red-800'
              }`}
            >
              Focus
            </button>
            <button 
              onClick={() => switchMode('shortBreak')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                mode === 'shortBreak' 
                  ? 'bg-white text-green-500' 
                  : 'bg-green-700 text-green-300 hover:bg-green-800'
              }`}
            >
              Short Break
            </button>
            <button 
              onClick={() => switchMode('longBreak')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                mode === 'longBreak' 
                  ? 'bg-white text-blue-500' 
                  : 'bg-blue-700 text-blue-300 hover:bg-blue-800'
              }`}
            >
              Long Break
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZustandTimer
