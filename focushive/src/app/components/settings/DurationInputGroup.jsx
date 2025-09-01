export default function DurationInputGroup({ 
  label, 
  value, 
  onChange, 
  inputId,
  focusColor = 'blue' 
}) {
  const getFocusColorClass = () => {
    switch (focusColor) {
      case 'green': return 'focus:ring-green-500';
      case 'blue': return 'focus:ring-blue-500';
      default: return 'focus:ring-blue-500';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <label className="text-gray-600 font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          id={inputId}
          type="number"
          min="1"
          max="120"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-16 px-2 py-1 text-gray-700 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 ${getFocusColorClass()}`}
        />
        <span className="text-gray-500 text-sm">min</span>
      </div>
    </div>
  );
}