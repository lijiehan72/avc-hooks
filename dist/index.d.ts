import React from 'react';
import cacheXHR from './request/cacheXHR';
import useFormModal from './antd-hook/useFormModal';
interface Props {
    text: string;
}
export declare const ExampleComponent: ({ text }: Props) => React.JSX.Element;
export { cacheXHR as CacheRequest, useFormModal, };
