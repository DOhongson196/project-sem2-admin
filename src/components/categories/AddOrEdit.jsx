import { Button, Col, Divider, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { API_CATEGORY } from '../../services/constant';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '../../utils/useAxios';

function AddOrEditCategory() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const categoryId = useParams();
  const [form] = Form.useForm();
  const api = useAxios();

  useEffect(() => {
    if (categoryId.id) {
      const fectchApi = async () => {
        try {
          const response = await api.get(API_CATEGORY + '/' + categoryId.id);
          form.setFieldsValue({
            categoryId: response.data.id,
            name: response.data.name,
            status: response.data.status,
          });
        } catch (error) {
          console.log(error);
        }
      };

      fectchApi();
    }
  }, []);

  const onSubmitForm = (value) => {
    if (!categoryId.id) {
      api
        .post(API_CATEGORY, value)
        .then((res) => {
          console.log(res);
          form.setFieldsValue({
            name: '',
            status: '',
          });
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: 'OK',
            content: 'Add Category success',
            onOk: () => navigate('/categories/list'),
            cancelText: 'Continue Add Category?',
            okText: 'List Categories',
          });
        })
        .catch((res) => {
          setError(res.response.data.message);
        });
    } else {
      api
        .patch(API_CATEGORY + '/' + categoryId.id, value)
        .then((res) => {
          console.log(res);
          Modal.success({
            title: 'OK',
            content: 'Edit Category success',
            onOk: () => navigate('/categories/list'),
            okText: 'List Categories',
          });
        })
        .catch((res) => {
          setError(res.response.data.message);
        });
    }
  };
  return (
    <div>
      <h1>{categoryId.id ? 'Update Categories' : 'Add Categories'}</h1>
      <Divider></Divider>
      <Form form={form} layout="vertical" className="form" onFinish={onSubmitForm} key={categoryId.id}>
        <Row>
          <Col md={6}>
            {categoryId.id && (
              <Form.Item label="Category ID" name="id">
                <Input readOnly />
              </Form.Item>
            )}

            <Form.Item label="Name" name="name" rules={[{ required: true, min: 2 }]}>
              <Input />
            </Form.Item>
            <span style={{ color: 'red' }}>{error}</span>
            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="0">Visible</Select.Option>
                <Select.Option value="1">In-Visible</Select.Option>
              </Select>
            </Form.Item>
            <Divider></Divider>
            <Button htmlType="submit" type="primary" style={{ float: 'right' }}>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddOrEditCategory;