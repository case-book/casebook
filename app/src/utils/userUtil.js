import { USER_ASSIGNED_OPERATIONS } from '@/constants/constants';

function getUserText(users, type, value) {
  if (type === 'tag') {
    return value;
  }

  if (type === 'operation' && value === 'SEQ') {
    return USER_ASSIGNED_OPERATIONS.SEQ;
  }

  if (type === 'operation' && value === 'RND') {
    return USER_ASSIGNED_OPERATIONS.RND;
  }

  if (value) {
    const currentUser = users.find(user => user.id === Number(value));
    return currentUser?.name;
  }

  return '';
}

function convertUser(info) {
  const result = { ...info };
  if (info.avatarInfo) {
    try {
      result.avatarInfo = JSON.parse(result.avatarInfo);
    } catch (e) {
      //
    }
  }

  return result;
}

export { getUserText, convertUser };
