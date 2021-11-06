const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  'PRETHREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'PRETHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'PRETHREAD.TITLE_LIMIT_CHAR': new InvariantError('tidak dapat membuat thread baru karena karakter title melebihi batas limit'),

  'POSTTHREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan id, owner, dan title'),
  'POSTTHREAD.TITLE_LIMIT_CHAR': new InvariantError('tidak dapat menghasilkan thread baru karena karakter title melebihi batas limit'),
  'POSTTHREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('id, owner, dan title harus string'),

  'ADD_THREAD_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN': new InvariantError('harus mengirimkan token access'),
  'ADD_THREAD_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data token tidak sesuai'),

  'PRECOMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
  'PRECOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),

  'POSTCOMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan id, owner, dan content'),
  'POSTCOMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('id, owner, dan content harus string'),

  'ADD_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN': new InvariantError('harus mengirimkan token access'),
  'ADD_COMMENT_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data token tidak sesuai'),

  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN': new InvariantError('harus mengirimkan token access'),
  'DELETE_COMMENT_USE_CASE.AUTH_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data token tidak sesuai'),
};

module.exports = DomainErrorTranslator;
