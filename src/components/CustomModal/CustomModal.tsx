import React, { FC } from 'react';
import { Modal } from 'antd';

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: React.ReactNode;
  width?: any,
}

const CustomModal: FC<GenericModalProps> = ({ isOpen, onClose, component , width }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      maskClosable={false}
      className='custom-modal'
      width={width}
      
    >
       <div className="vertical-center">
        {component}
      </div>
    </Modal>
  );
};

export default CustomModal;

