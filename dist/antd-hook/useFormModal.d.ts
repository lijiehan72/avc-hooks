import React from 'react';
import type { FormProps, ModalProps } from 'antd';
import { FormInstance } from 'antd';
interface FormValues {
    id?: number;
    [key: string]: any;
}
export declare type OnOkResult = {
    status: boolean;
    message?: string;
};
export declare type UseFormModalReturnType = {
    setOpen: (value: boolean | FormValues) => void;
    form: FormInstance<FormValues>;
    getValues: () => FormValues;
};
interface UseFormModalProps {
    title: React.ReactNode;
    content: React.ReactNode | ((form: FormInstance) => React.ReactNode);
    mounted?: (data: boolean | FormValues, form: FormInstance) => void;
    unmount?: () => void;
    onOk: (values: FormValues) => Promise<OnOkResult>;
    formArgs?: FormProps;
    args?: ModalProps;
}
declare function UseFormModal({ title, content, mounted, unmount, onOk, formArgs, ...args }: UseFormModalProps, deps?: React.DependencyList): UseFormModalReturnType;
export default UseFormModal;
