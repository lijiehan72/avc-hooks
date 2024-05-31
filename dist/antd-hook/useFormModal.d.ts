import React from 'react';
import { FormInstance } from 'antd';
interface FormValues {
    id?: number;
}
interface UseFormModalProps {
    title: React.ReactNode;
    content: React.ReactNode | ((form: FormInstance) => React.ReactNode);
    mounted?: (data: any, form: FormInstance) => void;
    unmount?: () => void;
    onOk: (values: FormValues) => Promise<{
        status: boolean;
        message?: string;
    }>;
    formArgs?: Record<string, any>;
    customRender?: boolean;
    [key: string]: any;
}
declare function UseFormModal({ title, content, mounted, unmount, onOk, formArgs, customRender, ...args }: UseFormModalProps, deps?: React.DependencyList): {
    setOpen: React.Dispatch<React.SetStateAction<boolean | Record<string, any>>>;
    form: FormInstance<any>;
    getValues: () => any;
};
export default UseFormModal;
