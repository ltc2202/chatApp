const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Harry',
      room: 'Node course'
    }, {
      id: '2',
      name: 'Mike',
      room: 'React course'
    }, {
      id: '3',
      name: 'Ron',
      room: 'Node course'
    }];
  });

  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: '123',
      name: 'Harry',
      room: 'football room'
    };
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    var user = users.removeUser('1');
    expect(user).not.toEqual(users.users[0]);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var user = users.removeUser('0');
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    var user = users.getUser('1');
    expect(user).toEqual(users.users[0]);
  });

  it('should not find user', () => {
    var user = users.getUser('0');
    expect(user).toBeFalsy();
  });

  it('should return names for node course', () => {
    var userList = users.getUserList('Node course');
    expect(userList).toEqual(['Harry', 'Ron']);
  });

  it('should return names for react course', () => {
    var userList = users.getUserList('React course');
    expect(userList).toEqual(['Mike']);
  });
});
