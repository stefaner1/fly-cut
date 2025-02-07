const errorCode = {
  200: 'Server responded successfully.',
  201: 'Data modified successfully.',
  202: 'Request has been queued in the background.',
  204: 'Data deleted successfully.',
  400: 'Request error',
  401: 'Unauthorized, please login',
  403: 'Access denied',
  404: 'Request URL error',
  405: 'Request method not allowed.',
  406: 'Invalid request format.',
  408: 'Request timeout',
  410: 'Requested resource has been deleted',
  500: 'Internal server error',
  501: 'Service not implemented',
  502: 'Gateway error',
  503: 'Service unavailable, server under maintenance',
  504: 'Gateway timeout',
  505: 'HTTP version not supported'
};

export default errorCode;
