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

/**
 modified - insert statement - removed id from Insert,
 id is going to be created by SQLs bcoz they are PRIMARY KEYS in SERIAL order as per our schema

 updated isReviewed column with true for testing
*/

exports.up = function (db) {
  db.runSql(`

  INSERT INTO users (name,email,scope,passwordKey) values 
  ('IntructorGadget', '12345@DI.com', true, '$2b$12$PxvqEQWOjsWZBiwS7B3ogeD7t.iE1isip.U2bnrkrYvohUTC76Jkm'), 
  ('StudentEmptyBrain', '67890@DI.com', false, '$2b$12$z4.NMZK.gTI5Qbv3XTjgVefQ.qlWO6u3.GvlgOSGy7Kj/h.aK8JKG'); 


  INSERT INTO terms (name,year) values 
  ('Client Side', 'Year 1'), 
  ('Server Side', 'Year 1'), 
  ('Full Stack', 'Year 1'), 
  ('Agile Dev-ops', 'Year 1'), 
  ('App sec', 'Year 2'), 
  ('Mobile app development', 'Year 2'), 
  ('Machine learning intro', 'Year 2'), 
  ('Capstone', 'Year 2');

  
  INSERT INTO topics (name,termid) values 
  ('HTML',1),
  ('CSS',2),
  ('VSCode',3),
  ('Github',4),
  ('FAQ',5),
  ('Security',6),
  ('React native',7),
  ('Python',8),    
  ('Project1',1),
  ('Project2',2),
  ('Project3',3),
  ('Project4',4),
  ('Project5',5),
  ('Project6',6),
  ('Project7',7),
  ('Project8',8);
   
  
  INSERT INTO questions (description,topicid) values 
  ('What is HTML?',1),
  ('What is CSS?',2),
  ('How do i pull a branch?',3),
  ('How do i resolve a merge conflict?',4),
  ('When do i run npm Install?',5),
  ('Is it safe to store encrypted key into DB?',6),
  ('soluta repellat?',7),
  ('quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti?',8),
  ('How do i pull a branch?',9),
  ('qui doloremque soluta sit?',10),
  ('internos culpa eum repellat officiis ad ullam?',11),
  ('molestias voluptatem qui doloremque soluta?',12),
  ('Et eaque galisum ex nisi libero ad soluta?',13),
  ('porro et tenetur repellat?',14),
  ('soluta repellat a internos culpa?',15),
  ('molestias voluptatem qui doloremque soluta?',16),
  ('quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti?',1),
  ('Aut quibusdam incidunt ea error aliquam 33 atque odio?',2),
  ('Et eaque galisum ex nisi libero ad soluta?',3),
  ('porro et tenetur repellat?',4),
  ('soluta repellat a internos culpa?',5),
  ('molestias voluptatem qui doloremque soluta?',6),
  ('quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti?',7),
  ('Aut quibusdam incidunt ea error aliquam 33 atque odio?',8),
  ('Et eaque galisum ex nisi libero ad soluta?',9),
  ('porro et tenetur repellat?',10),
  ('soluta repellat a internos culpa?',11),
  ('molestias voluptatem qui doloremque soluta?',12),
  ('Et eaque galisum ex nisi libero ad soluta?',13),
  ('porro et tenetur repellat?',14),
  ('soluta repellat a internos culpa?',15),
  ('molestias voluptatem qui doloremque soluta?',16);

     
   INSERT INTO answers (questionid, description) values 
  (1, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (1, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (2, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (2, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (3, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (3, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (4, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (4, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (5, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (5, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (6, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (6, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (7, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (7, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (8, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (8, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (9, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (9, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (10, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (10, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (11, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (11, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (12, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (12, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (13, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (13, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (14, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (14, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (15, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (15, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (16, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (16, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (17, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (17, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (18, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (18, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (19, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (19, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (20, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (20, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (21, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (21, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (22, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (22, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (23, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (23, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (24, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (24, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (25, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (25, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (26, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (26, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (27, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (27, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (28, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (28, 'Lorem ipsum dolor sit amet. Et molestias voluptatem qui doloremque soluta sit culpa porro et tenetur repellat vel beatae quas id reprehenderit esse.'),
  (29, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (29, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (30, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (30, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (31, 'Aut quibusdam incidunt ea error aliquam 33 atque odio At corrupti Quis et recusandae impedit sit exercitationem distinctio.'),
  (31, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.'),
  (32, 'Ut harum facilis quo adipisci temporibus 33 numquam illum sed galisum eius quo veritatis nemo. Id illo fugit et laboriosam repudiandae ut omnis deleniti.') ,
  (32, 'Et eaque galisum ex nisi libero ad soluta repellat a internos culpa eum repellat officiis ad ullam consequatur.');


  update questions 
  SET isReviewed = true
  where id > 5;

  update answers 
  SET isReviewed = true
  where questionid > 5;
`);
  return null;
};

exports.down = function (db) {
  db.runSql(`
  delete from answers;  
  delete from questions;  
  delete from users;     
  delete from topics;  
  delete from terms;
  `);
  return null;
};

exports._meta = {
  version: 1,
};
