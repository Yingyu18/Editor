import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import SearchPage from './searchPage';

const CreateButton = ({pageList}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0)
  const showModal = () => {
    setRefresh(refresh+1)
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        + Create Page
      </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      <>
        <SearchPage pageList={pageList} refresh={refresh}/>
      </>
      </Modal>
    </>
  );
};

export default CreateButton;








