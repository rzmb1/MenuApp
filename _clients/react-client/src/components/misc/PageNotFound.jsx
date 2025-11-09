import React from 'react'
import ErrorPage from './ErrorPage'

export default function PageNotFound() {
  return (
    <ErrorPage errorCode="404" message="Page not Found" description="Die Seite nach der du suchst existiert nicht oder wurde unbennant"/>
  )
}
