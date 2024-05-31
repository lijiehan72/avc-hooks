import React from 'react';
import type { FormProps } from 'antd';
import { FormInstance } from 'antd';
interface FormValues {
    id?: number;
    [key: string]: any;
}
interface UseFormModalProps {
    title: React.ReactNode;
    content: React.ReactNode | ((form: FormInstance) => React.ReactNode);
    mounted?: (data: boolean | FormValues, form: FormInstance) => void;
    unmount?: () => void;
    onOk: (values: FormValues) => Promise<{
        status: boolean;
        message?: string;
    }>;
    formArgs?: FormProps;
    [key: string]: any;
}
declare function UseFormModal({ title, content, mounted, unmount, onOk, formArgs, ...args }: UseFormModalProps, deps?: React.DependencyList): {
    setOpen: React.Dispatch<React.SetStateAction<boolean | FormValues>>;
    form: FormInstance<any>;
    getValues: () => FormValues;
};
export default UseFormModal;
