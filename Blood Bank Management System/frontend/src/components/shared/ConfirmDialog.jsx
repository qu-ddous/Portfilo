import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false, loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="py-2 flex gap-4">
        {isDanger && (
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0 border-2 border-white shadow-[0_4px_0_#FADBD8]">
            <AlertTriangle className="w-6 h-6 text-[#C0392B]" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-[#2C3E50] font-semibold text-lg">{message}</p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button 
          variant={isDanger ? 'danger' : 'primary'} 
          onClick={onConfirm} 
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
