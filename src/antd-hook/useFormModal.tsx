import React, { useCallback, useEffect, useId, useMemo, useState } from 'react'
import type { FormProps,ModalProps } from 'antd'
import { Form, FormInstance, message, Modal } from 'antd'
import _ from 'lodash'
import { createRoot } from 'react-dom/client'

interface FormValues {
    id?: number;
    [key: string]: any;
}
export type OnOkResult = {
    status: boolean;
    message?: string;
};
export type UseFormModalReturnType = {
    setOpen: (value: boolean | FormValues) => void;
    form: FormInstance<FormValues>;
    getValues: () => FormValues;
};
interface UseFormModalProps {
    title: React.ReactNode; // 标题
    content: React.ReactNode | ((form: FormInstance) => React.ReactNode); // 表单内容
    mounted?: (data: boolean | FormValues, form: FormInstance) => void; // 页面加载完成
    unmount?: () => void; // 弹窗卸载之前执行
    onOk: (values: FormValues) => Promise<OnOkResult>; // 点击确认按钮后的回调
    formArgs?: FormProps;
    args?:ModalProps;
}

function UseFormModal({
                          title,
                          content,
                          mounted,
                          unmount,
                          onOk,
                          formArgs = {},
                          ...args
                      }: UseFormModalProps, deps: React.DependencyList = []):UseFormModalReturnType {

    const [open, setOpen] = useState<boolean | FormValues>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [form] = Form.useForm();
    const mid = useId()
    const container = useMemo(()=>{
        let common_modal = document.getElementById('_common_modal'+mid);
        if (!common_modal) {
            common_modal = document.createElement('div')
            common_modal.id = '_common_modal'+mid
            document.body.appendChild(common_modal)
        }
        console.log(111)
        return createRoot(common_modal)
    },[mid])
    const handleOk = useCallback(async () => {
        try {
            const values = await form.validateFields()
            if (values.id === undefined) {
                delete values.id
            }
            setLoading(true)
            const valueBk = _.cloneDeep(values)
            const result = await onOk(valueBk)
            if (result.status) {
                onClose()
                result.message && message.success(result.message)
            } else {
                message.error(result.message)
                setLoading(false)
            }
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }, [onOk, form])

    const onClose = useCallback(() => {
        setOpen(false)
        setLoading(false)
        form.resetFields()
        unmount && unmount()
    }, [unmount])

    useEffect(() => {
        if (open === true) return
        if (open && typeof open === 'object') {
            mounted ? mounted(open, form) : form.setFieldsValue(open)
        }
    }, [open, form, mounted])

    useEffect(() => {
        container.render(
            <Modal
                title={title}
                open={!!open}
                onOk={handleOk}
                onCancel={onClose}
                confirmLoading={loading}
                maskClosable={false}
                getContainer={() => document.getElementById('_common_modal'+mid) as HTMLElement}
                {...args}
            >
                <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} {...formArgs}>
                    <Form.Item name={'id'} label={"id"} hidden={true} ><div /></Form.Item>
                    {typeof content === 'function' ? content(form) : content}
                </Form>
            </Modal>
        )
        if (!open) {
            unmount && unmount()
            setTimeout(() => {
                container.render(<div />)
            }, 500)
        }
    }, [loading, mid,open, form, ...deps])

    return {
        setOpen,
        form,
        getValues: (): FormValues => form.getFieldsValue()
    }
}

export default UseFormModal
