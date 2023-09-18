function convertProject(project) {
  const result = { ...project };
  if (result.users) {
    result.users = result.users.map(user => {
      let avatarInfo = null;
      if (user.avatarInfo) {
        try {
          avatarInfo = JSON.parse(user.avatarInfo);
        } catch (e) {
          //
        }
      }

      return {
        ...user,
        avatarInfo,
      };
    });
  }

  return result;
}

function dummy() {}

export { dummy, convertProject };
