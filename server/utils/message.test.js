var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Harry';
    var text = 'Hey';
    var res = generateMessage(from,text);
    expect(res).toMatchObject({from,text});
    expect(typeof res.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'Harry';
    var latitude = 20;
    var longitude = 30;
    var url = 'https://www.google.com/maps?q=20,30';
    var message = generateLocationMessage(from, latitude, longitude);
    expect(message).toMatchObject({from,url});
    expect(typeof message.createdAt).toBe('number');
  });
});
