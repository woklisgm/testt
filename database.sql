create TABLE person(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  surname VARCHAR(255)
);

create TABLE symbol(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

create TABLE price(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  lastPrice VARCHAR(255),
  indexPrice VARCHAR(255),
  markPrice VARCHAR(255),
  recordDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create TABLE price(id SERIAL PRIMARY KEY, name VARCHAR(255), lastPrice VARCHAR(255), indexPrice VARCHAR(255), markPrice VARCHAR(255), recordDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

create TABLE post(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content VARCHAR(255),
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES person (id)
);
