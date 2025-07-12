function getBaseURL() {
  if (window.location.hostname === 'casebook.so') {
    return `${window.location.protocol}//casebook.so:8080`;
  }
  if (process.env.NODE_ENV !== 'production') {
    return `${window.location.protocol}//localhost:8080`;
  }

  return '';
}

function dummy() {
  return null;
}

export { getBaseURL, dummy };
