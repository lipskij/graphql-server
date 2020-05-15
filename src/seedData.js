import * as data from './data';
import * as tables from './tables';
import * as database from './database';
// import { query } from 'express';

const sequencePromises = function (promises) {
  return promises.reduce((promise, promiseFunction) => {
    return promise.then(() => {
      return promiseFunction();
    });
  }, Promise.resolve());
};

const createDatabase = () => {
  let promises = [tables.users, tables.userFriends, tables.posts].map((table) => {
    return () => database.getSql(table.create().toQuery());
  });
  return sequencePromises(promises);
};

const insertData = () => {
  let { users, posts, userFriends } = data;

  let queries = [
    tables.users.insert(users).toQuery(),
    tables.posts.insert(posts).toQuery(),
    tables.userFriends.insert(userFriends).toQuery(),
  ];

  let promises = queries.map((query) => {
    return () => database.getSql(query);
  });
  return sequencePromises(promises);
};

createDatabase().then(() => {
  return insertData();
}).then(() => {
  console.log({ done: true });
});