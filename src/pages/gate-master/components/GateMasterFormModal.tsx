import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import InputField from '../../../components/form/input/InputField';
import type { GateMaster } from '../../../api/gate-master/types';

interface GateMasterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedGateMaster: GateMaster | null;
  formData: {
    id: string;
    IdCabang: string;
    NamaCabang: string;
    NamaGerbang: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

export default function GateMasterFormModal({
  isOpen,
  onClose,
  onSubmit,
  selectedGateMaster,
  formData,
  onInputChange,
  isSubmitting,
}: GateMasterFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md mx-4 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
        {selectedGateMaster ? 'Update Gate Master' : 'Create Gate Master'}
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="IdCabang"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            ID Cabang <span className="text-error-500">*</span>
          </label>
          <InputField
            id="IdCabang"
            name="IdCabang"
            type="number"
            value={formData.IdCabang}
            onChange={onInputChange}
            placeholder="Enter ID Cabang"
            required
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="NamaCabang"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nama Cabang <span className="text-error-500">*</span>
          </label>
          <InputField
            id="NamaCabang"
            name="NamaCabang"
            type="text"
            value={formData.NamaCabang}
            onChange={onInputChange}
            placeholder="Enter Nama Cabang"
            required
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="NamaGerbang"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Nama Gerbang <span className="text-error-500">*</span>
          </label>
          <InputField
            id="NamaGerbang"
            name="NamaGerbang"
            type="text"
            value={formData.NamaGerbang}
            onChange={onInputChange}
            placeholder="Enter Nama Gerbang"
            required
            className="w-full"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={selectedGateMaster ? 'primary' : 'success'}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : selectedGateMaster
                ? 'Update'
                : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
