import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Form, message, Modal, FormInstance } from 'antd';
import _ from "lodash";
interface FormValues {
    id?: number;
}
interface UseFormModalProps {
    title: React.ReactNode; // 标题
    content: React.ReactNode | ((form: FormInstance) => React.ReactNode); // 表单内容
    mounted?: (data: any, form: FormInstance) => void; // 页面加载完成
    unmount?: () => void; // 弹窗卸载之前执行
    onOk: (values: FormValues) => Promise<{ status: boolean, message?: string }>; // 点击确认按钮后的回调
    formArgs?: Record<string, any>;
    customRender?: boolean;
    [key: string]: any;
}

let common_modal = document.getElementById('common_modal');
if (!common_modal) {
    common_modal = document.createElement('div');
    common_modal.id = '_common_modal';
    document.body.appendChild(common_modal);
}

function UseFormModal({
                          title,
                          content,
                          mounted,
                          unmount,
                          onOk,
                          formArgs = {},
                          customRender = false,
                          ...args
                      }: UseFormModalProps, deps: React.DependencyList = []) {

    const [open, setOpen] = useState<boolean | Record<string, any>>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const handleOk = useCallback(async () => {
        try {
            const values = await form.validateFields();
            if (values.id === undefined) {
                delete values.id;
            }
            setLoading(true);
            const valueBk = _.cloneDeep(values);
            const result = await onOk(valueBk);
            if (result.status) {
                onClose();
                result.message && message.success(result.message);
            } else {
                message.error(result.message);
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [onOk, form]);

    const onClose = useCallback(() => {
        setOpen(false);
        setLoading(false);
        unmount && unmount();
    }, [unmount]);

    useEffect(() => {
        if (open === true) return;
        if (open && typeof open === 'object') {
            mounted ? mounted(open, form) : form.setFieldsValue(open);
        } else {
            form.resetFields();
            setLoading(false);
        }
    }, [open, form, mounted]);

    useEffect(() => {
        if (customRender) return;
            ReactDOM.render(
                <Modal
                    title={title}
                    open={!!open}
                    onOk={handleOk}
                    onCancel={onClose}
                    confirmLoading={loading}
                    maskClosable={false}
                    getContainer={() => common_modal as HTMLElement}
                    {...args}
                >
                    <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} {...formArgs}>
                        <Form.Item name={"id"} hidden={true} />
                        {typeof content === "function" ? content(form) : content}
                    </Form>
                </Modal>,
                common_modal
            );
        if (!open) {
            unmount && unmount();
            setTimeout(() => {
                ReactDOM.render(<div/>, common_modal);
            }, 500);
        }
    }, [customRender, loading, open, form, ...deps]);

    return {
        setOpen,
        form,
        getValues: () => form.getFieldsValue(),
    };
}

export default UseFormModal;
