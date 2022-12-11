"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  db.runSql(`
  CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    year varchar
  );
  
  CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    termId int REFERENCES terms (id)
  );
  
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name varchar,
    email varchar UNIQUE,
    passwordKey varchar,
    scope bool DEFAULT false
  );
  
  CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    description varchar NOT NULL,
    isStarred bool DEFAULT false,
    isReviewed bool DEFAULT false,
    createdOn timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    topicId int REFERENCES topics (id),
    userId int REFERENCES users (id)
  );
  
  CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    description varchar NOT NULL,
    isStarred bool DEFAULT false,
    isReviewed bool DEFAULT false,
    createdOn timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    questionId int REFERENCES questions (id),
    userId int REFERENCES users (id)
  );
  `);
  return null;
};
exports.down = function (db) {
  db.runSql(`
  drop table answers;  
  drop table questions;  
  drop table users;     
  drop table topics;  
  drop table terms;
  `);
  return null;
};

exports._meta = {
  version: 1,
};
