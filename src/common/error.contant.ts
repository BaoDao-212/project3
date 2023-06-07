/**
 * Unified error code definitions
 */
export const ErrorCodeMap = {
  // 10000 - 99999 Business operation errors
  10000: 'Parameter validation exception',
  10001: 'System user already exists',
  10002: 'Incorrect verification code entered',
  10003: 'Incorrect username or password',
  10004: 'Node route already exists',
  10005: 'Permission must include parent node',
  10006:
    'Illegal operation: the node only supports directory-type parent nodes',
  10007: 'Illegal operation: node type cannot be directly converted',
  10008:
    'This role has associated users, please delete the associated users first',
  10009:
    'This department has associated users, please delete the associated users first',
  10010:
    'This department has associated roles, please delete the associated roles first',
  10015:
    'This department has child departments, please delete the child departments first',
  10011: 'The old password does not match the original password',
  10012: 'To log out yourself, click "Logout" in the upper right corner',
  10013: 'Unable to log out this user',
  10014: 'Parent menu does not exist',
  10016: 'Operation not allowed on built-in system functions',
  10017: 'User does not exist',
  10018: 'Unable to find the department to which the current user belongs',
  10019: 'Department does not exist',
  10020: 'Task does not exist',
  10021: 'Parameter configuration key-value pair already exists',
  10101: 'Unsafe task, ensure that the execution is annotated with @Mission',
  10102: 'The task being executed does not exist',

  // Token-related
  11001: 'Invalid login or unauthorized access',
  11002: 'Login session has expired',
  11003: 'Unauthorized, please contact the administrator to request permission',

  // OSS-related
  20001: 'The file or directory being created already exists',
  20002: 'No action required',
  20003: 'Exceeded the maximum supported processing quantity',
} as const;

export type ErrorCodeMapType = keyof typeof ErrorCodeMap;
