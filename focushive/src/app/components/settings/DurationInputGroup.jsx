import FormInput from '@/app/components/shared/FormInput';

export default function DurationInputGroup({ 
  label, 
  value, 
  onChange, 
  inputId,
  focusColor = 'blue' 
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-gray-600 font-medium">{label}</label>
      <div className="flex items-center space-x-2">
        <FormInput
          id={inputId}
          type="number"
          min="1"
          max="120"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          focusColor={focusColor}
          size="sm"
          isInSidebar={true}
          className="w-16 text-center"
        />
        <span className="text-gray-500 text-sm">min</span>
      </div>
    </div>
  );
}