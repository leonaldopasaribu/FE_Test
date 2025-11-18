import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import type { GateMaster } from '../../../api/gate-master/types';

interface GateMasterDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedGateMaster: GateMaster | null;
  isSubmitting: boolean;
}

export default function GateMasterDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  selectedGateMaster,
  isSubmitting,
}: GateMasterDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md mx-4 p-6 sm:p-8"
    >
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-900/20 mb-4">
          <svg
            className="h-6 w-6 text-error-600 dark:text-error-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
          Delete Gate Master
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {selectedGateMaster?.NamaGerbang}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex gap-3">
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
            type="button"
            variant="danger"
            onClick={onConfirm}
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
