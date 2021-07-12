CREATE TABLE `wanneer-naar-terschelling`.vacations (
  uuid binary(16) NOT NULL,
  title varchar(255) NOT NULL,
  end timestamp NOT NULL,
  start timestamp NOT NULL,
  holst tinyint(1) DEFAULT '0',
  other tinyint(1) DEFAULT '0',
  hartman tinyint(1) DEFAULT '0',
  steenmeijer tinyint(1) DEFAULT '0',
  created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	PRIMARY KEY (uuid),
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;