# DATABASE UPDATES

1. CREATE ROLES TABLE

```bash
CREATE TABLE `roles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(45),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

```

2. CREATE USERS TABLE

```bash
CREATE TABLE `users` (
  `id` varchar(45) NOT NULL,
  `email` varchar(100) ,
  `password` varchar(45) ,
  `salt` varchar(45) ,
  `first_name` varchar(45) ,
  `last_name` varchar(45) ,
  `dob` varchar(45) ,
  `mobile_no` varchar(45) ,
  `gender` varchar(45) ,
  `avatar_image_url` varchar(45) ,
  `lat` varchar(45) ,
  `long` varchar(45) ,
  `address` varchar(45) ,
  `role_id` int(10) ,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

3. CREATE TOKENS TABLE

```bash
CREATE TABLE `tokens` (
  `id` int(10)  NOT NULL AUTO_INCREMENT,
  `ip` varchar(45) ,
  `user_id` varchar(45) ,
  `token` varchar(255),
  `type` varchar(45),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES users(`id`) ON DELETE CASCADE
  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```


## Insert roles

```bash
INSERT INTO roles (role_name) VALUES ("super admin")
INSERT INTO roles (role_name) VALUES ("admin")
INSERT INTO roles (role_name) VALUES ("service provider")
INSERT INTO roles (role_name) VALUES ("user")
```

