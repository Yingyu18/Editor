import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import SearchPage from './searchPage';

const CreateButton = ({pageList, changePage, refresh}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clear, setClear] = useState(0)
  const showModal = () => {
    setClear(clear+1)
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
      <Modal title="Create Page" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
      <>
        <SearchPage pageList={pageList} clear={clear} changePage={changePage} handleOk={handleOk} refresh={refresh}/>
      </>
      </Modal>
    </>
  );
};

export default CreateButton;








