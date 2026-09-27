'use client'

import { Provider } from 'react-redux'
import store from '@/store/store'
import '@/i18n/i18n'

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
