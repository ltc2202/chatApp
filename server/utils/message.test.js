var expect = require('expect');

var {generateMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Harry';
    var text = 'Hey';
    var res = generateMessage(from,text);
    expect(res).toMatchObject({from,text});
    expect(typeof res.createdAt).toBe('number');
  });
});
