import React from 'react'
import cacheXHR from './request/cacheXHR'
import styles from './styles.module.css'
// @ts-ignore
import useFormModal from './antd-hook/useFormModal'

interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
}
export {
    cacheXHR as CacheRequest,
    useFormModal,
}