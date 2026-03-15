import { useEffect } from 'react'

const SITE_NAME = 'Khoury Cyber Guide'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    return () => {
      document.title = SITE_NAME
    }
  }, [title])
}
