import { Fragment } from 'react';
import React, { useState, useEffect } from 'react';
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import Moment from 'moment';
import 'antd/dist/antd.css';
import './layout.css';
import axios from 'axios';
import { type } from '@testing-library/user-event/dist/type';

function Layout() {
    const [useList, setUseList] = useState([]);
    const [dataList, setDataList] = useState([]);
    const [idTitle, setIdTitle] = useState();
    const [propertydata, setProperty] = useState({});
    const [check, setCheck] = useState(true);

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://192.168.1.18:1433/api/orders/',
            responseType: 'stream',
        }).then(function (response) {
            setDataList(response.data[0]);
            // console.log(response.data[0]);
            // console.log(response.data[0][0].Property);
            // let a = JSON.parse(response.data[0][0].Property);
            // console.log(a);
        });
    }, []);

    const [form] = Form.useForm();
    const onFinish = (values, value) => {
        // console.log('Received values of form:', JSON.parse(values.area));
        // console.log(value);
    };
    const array1 = [];
    const handleChange = (value, values) => {
        let Property = JSON.parse(values.value);
        setUseList(Property);
        setIdTitle(values.key);
        setCheck(false);
    };
    function handleSubmit() {
        const formatDate = Moment().format('YYYY-MM-DD');
        for (let i = 0; i < useList.length; i++) {
            if (useList[i].type === 'string') {
                propertydata[useList[i].name] = document.getElementById(useList[i].name).value;
            }
        }

        console.log(propertydata);
        let datajson = {
            IdDynamic: idTitle,
            OrderDate: formatDate,
            jsonValue: JSON.stringify(propertydata),
        };
        console.log(datajson);
        axios({
            method: 'post',
            url: 'http://192.168.1.18:1433/api/insertorders',
            data: datajson,
            type: JSON,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            console.log(response);
            alert('Done');
            window.location.reload();
        });
    }

    const handledata = (value, values) => {
        console.log(values.name);
        propertydata[values.name] = value;
    };

    return (
        <Fragment>
            <div className="wrapper">
                <div className="wrapperform">
                    <h1>ARES Commander Project</h1>
                    <Form
                        form={form}
                        name="dynamic_form_nest_item"
                        className="form-list"
                        onFinish={onFinish}
                        autoComplete="off"
                        id="datalist"
                    >
                        <Form.Item name="area" label="Type Door">
                            <Select onChange={handleChange}>
                                {dataList?.map((item, index) => (
                                    <Select.Option key={item.ID} value={item.Property}>
                                        {item.Name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        {useList?.map((item, index) => {
                            return (
                                <Form.Item label={item.name} key={index}>
                                    {item.type === 'selection' ? (
                                        <Select id={item.name} key={index} onChange={handledata}>
                                            {item.option.map((item1, index) => {
                                                return (
                                                    <Select.Option name={item.name} key={index} value={item1}>
                                                        {item1}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    ) : (
                                        <Input id={item.name} />
                                    )}
                                </Form.Item>
                            );
                        })}
                        <br></br>
                        <Form.Item>
                            <Button type="primary" disabled={check} htmlType="submit" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;
