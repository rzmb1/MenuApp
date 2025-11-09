import React from 'react';
import ErrorPage from './ErrorPage';

export default function PageForbidden() {
  return (
    <ErrorPage errorCode="403" message="Forbidden" description="Du hast keine Berechtigung auf diese Seite zuzugreifen"/>
  )
}
