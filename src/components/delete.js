import React, { useState } from 'react';
import { Button, Modal } from 'antd';
const BASE_URL = 'http://localhost:8000/api'


const Delete = ({deletePage, pageName}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    deletePage(pageName)

  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button  type="primary" danger style={{ width: '100px',marginLeft: 'auto', marginRight: 100 }} onClick={showModal}>
        Delete Page
      </Button>
      <Modal title="Delete Page" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} 
      okText="Continue" okType='danger'>
        <p>you can't recover the page once deleting the page...</p>
      </Modal>
    </>
  );
};

export default Delete;