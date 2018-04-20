// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('antd-pro-authority') || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', authority);
}
export function setToken(token) {
  
  return localStorage.setItem('antd-pro-token', token);
}
export function getToken(token) {
  
  return localStorage.getItem('antd-pro-token');
}