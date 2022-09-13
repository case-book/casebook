function getBaseURL() {
  if (window.location.hostname === 'mindplates.com') {
    return `${window.location.protocol}//mindplates.com:8080`;
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
