import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://ecommerce-backend-fawn-eight.vercel.app/api/products');
      setProducts(response.data);
    } catch (error) {
      message.error('Failed to fetch products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setCurrentProduct(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentProduct(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${id}`);
      message.success('Malumotlar ochirildi');
      fetchProducts();
    } catch (error) {
      message.error('Malumotlar ochirilmadi');
    }
    setLoading(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (currentProduct) {
        await axios.put(`https://ecommerce-backend-fawn-eight.vercel.app/api/products/${currentProduct.id}`, values);
        message.success('Product updated successfully');
      } else {
        await axios.post('https://ecommerce-backend-fawn-eight.vercel.app/api/products', values);
        message.success('Product added successfully');
      }
      fetchProducts();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Malumotlar saqlanmadi');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (imgUrl)=>{
        return <img width={100} src={imgUrl} alt={imgUrl} />
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Subtitle',
      dataIndex: 'subTitle',
      key: 'subTitle',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button  type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" onClick={() => handleDelete(record.id)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Product
      </Button>
      <Table columns={columns} dataSource={products} loading={loading} rowKey="id" />
      <Modal
        title={currentProduct ? 'Edit Product' : 'Add Product'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="image" label="Image" rules={[{ required: true, message: 'Please input the name of the product!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the price of the product!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subTitle" label="SubTitle" rules={[{ required: true, message: 'Please input the price of the product!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price of the product!' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
