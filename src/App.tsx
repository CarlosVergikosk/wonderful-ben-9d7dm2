import "./App.css";
import React, { useState } from "react";
import { Button, Modal } from "antd";
import PDFViewer, { PDFS } from "./components/PDFViewer";

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
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
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
        width="800px"
        bodyStyle={{
          height: "1000px",
        }}
      >
        <PDFViewer index={Math.floor(Math.random() * PDFS.length)} />
      </Modal>
    </>
  );
};

export default App;
