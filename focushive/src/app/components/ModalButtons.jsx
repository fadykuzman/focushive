export default function ModalButtons({ onSave, onCancel, isDirty = false }) {
  return (
    <div className="pt-4 border-t">
      <div className="flex gap-3">
        <button
          id="settings-cancel-button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          id="settings-save-button"
          onClick={onSave}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
            isDirty 
              ? 'bg-primary-600 text-white hover:bg-primary-700' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={!isDirty}
        >
          Save
        </button>
      </div>
    </div>
  );
}