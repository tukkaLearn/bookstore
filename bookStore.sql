drop database if exists book;
create database if not exists book;

use book;

create table if not exists book_stores(
 book_id  int primary key auto_increment,
 book_name varchar(20) not Null ,
 book_author varchar(20) default Null,
 book_image longtext default null,
 book_price int not null,
 book_description longtext default null,
 book_rating decimal(10,2) default 0.0,
 created_at timestamp default now()
);




create table if not exists book_readers(
 reader_id int primary key not null auto_increment,
 reader_user_name varchar(10) unique not null,
 reader_password text not null,
 reader_name varchar(20) not Null ,
 reader_location varchar(20) default null,
 reader_avatar longtext default null,
 book_id  int  null,
 reader_role ENUM('reader', 'admin')
    NOT NULL DEFAULT 'reader',
 created_at timestamp default now(),
 foreign key (book_id)  References book_stores(book_id)
);

CREATE TABLE reader_saved_books (
    reader_id INT NOT NULL,
    book_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (reader_id, book_id),
    FOREIGN KEY (reader_id)
        REFERENCES book_readers(reader_id),
    FOREIGN KEY (book_id)
        REFERENCES book_stores(book_id)
);

create table if not exists comments(
 comment_id INT PRIMARY KEY AUTO_INCREMENT,
 reader_id int not null,
 book_id  int not null,
 isAdmin varchar(8) default 'false',
 description longtext default null,
 created_at timestamp default now(),
 foreign key (book_id)  References book_stores(book_id),
 foreign key (reader_id)  References book_readers(reader_id)
);







USE book;


INSERT INTO book_stores
(book_id, book_name, book_author, book_image, book_price, book_description, book_rating)
VALUES
(1, 'Wings of Fire', 'A P J Abdul Kalam',
 'https://placehold.co/400x600?text=Wings+of+Fire',
 250, 'Autobiography of Dr APJ Abdul Kalam.', 4.80),

(2, 'Godan', 'Munshi Premchand',
 'https://placehold.co/400x600?text=Godan',
 180, 'A classic Hindi novel about rural Indian life.', 4.60),

(3, 'The Guide', 'R K Narayan',
 'https://placehold.co/400x600?text=The+Guide',
 220, 'A novel set in the fictional town of Malgudi.', 4.30),

(4, 'Ignited Minds', 'A P J Abdul Kalam',
 'https://placehold.co/400x600?text=Ignited+Minds',
 200, 'A book encouraging young Indians to dream big.', 4.70),

(5, 'Malgudi Days', 'R K Narayan',
 'https://placehold.co/400x600?text=Malgudi+Days',
 190, 'A collection of stories about everyday Indian life.', 4.50),

(6, 'Train to Pakistan', 'Khushwant Singh',
 'https://placehold.co/400x600?text=Train+to+Pakistan',
 280, 'A historical novel set during the Partition of India.', 4.40),

(7, 'The Alchemist', 'Paulo Coelho',
 'https://placehold.co/400x600?text=The+Alchemist',
 300, 'A young shepherd travels in search of his dream.', 4.60),

(8, 'Rich Dad Poor Dad', 'Robert Kiyosaki',
 'https://placehold.co/400x600?text=Rich+Dad+Poor+Dad',
 350, 'A popular book about money and financial education.', 4.20);



INSERT INTO book_readers
(reader_id, reader_user_name, reader_password, reader_name,
 reader_location, reader_avatar, book_id, reader_role)
VALUES
(1, 'rahul123',
 '$2b$10$LTc28F14Ghw/jTSDBQJOBu4IQ3esbVYx31t7sqeKMLgpl1epXfafq',
 'Rahul Sharma', 'Lucknow',
 'https://i.pravatar.cc/150?img=12', 1, 'admin'),

(2, 'priya123',
 '$2b$10$LTc28F14Ghw/jTSDBQJOBu4IQ3esbVYx31t7sqeKMLgpl1epXfafq',
 'Priya Verma', 'Delhi',
 'https://i.pravatar.cc/150?img=47', 2, 'reader'),

(3, 'amit456',
 '$2b$10$LTc28F14Ghw/jTSDBQJOBu4IQ3esbVYx31t7sqeKMLgpl1epXfafq',
 'Amit Patel', 'Ahmedabad',
 'https://i.pravatar.cc/150?img=11', 4, 'reader'),

(4, 'neha789',
 '$2b$10$LTc28F14Ghw/jTSDBQJOBu4IQ3esbVYx31t7sqeKMLgpl1epXfafq',
 'Neha Singh', 'Jaipur',
 'https://i.pravatar.cc/150?img=44', 5, 'reader'),

(5, 'arjun101',
 '$2b$10$LTc28F14Ghw/jTSDBQJOBu4IQ3esbVYx31t7sqeKMLgpl1epXfafq',
 'Arjun Kumar', 'Patna',
 'https://i.pravatar.cc/150?img=13', NULL, 'reader');




INSERT INTO reader_saved_books (reader_id, book_id)
VALUES
(2, 1),
(2, 3),
(2, 5),
(3, 2),
(3, 4),
(4, 1),
(4, 6),
(5, 7),
(5, 8);



INSERT INTO comments (reader_id, book_id, isAdmin, description)
VALUES
(1, 1, 'true',
 'This book is very inspiring. Dr Kalam is a role model for every Indian.'),

(2, 1, 'false',
 'I really enjoyed reading about his journey from Rameswaram.'),

(2, 3, 'false',
 'The story is interesting and the writing style is simple.'),

(3, 4, 'false',
 'A great book for students who want to achieve something big.'),

(4, 5, 'false',
 'These stories remind me of the simplicity of Indian life.'),

(5, 6, 'false',
 'A powerful story that helps readers understand the history of Partition.'),

(3, 7, 'false',
 'This book teaches us to follow our dreams and never give up.'),

(1, 8, 'true',
 'A useful introduction to financial education and money management.');









