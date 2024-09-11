/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 10.4.28-MariaDB : Database - product_panal
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`product_panal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `categories` */

insert  into `categories`(`id`,`name`,`created_at`,`updated_at`) values (1,'Electronics','0000-00-00 00:00:00','0000-00-00 00:00:00');
insert  into `categories`(`id`,`name`,`created_at`,`updated_at`) values (2,'Furniture','0000-00-00 00:00:00','0000-00-00 00:00:00');
insert  into `categories`(`id`,`name`,`created_at`,`updated_at`) values (3,'Clothing','0000-00-00 00:00:00','0000-00-00 00:00:00');
insert  into `categories`(`id`,`name`,`created_at`,`updated_at`) values (4,'Books','0000-00-00 00:00:00','0000-00-00 00:00:00');
insert  into `categories`(`id`,`name`,`created_at`,`updated_at`) values (5,'Toys','0000-00-00 00:00:00','0000-00-00 00:00:00');

/*Table structure for table `productcategory` */

DROP TABLE IF EXISTS `productcategory`;

CREATE TABLE `productcategory` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `productcategory_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productcategory_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `productcategory` */

insert  into `productcategory`(`created_at`,`updated_at`,`product_id`,`category_id`) values ('0000-00-00 00:00:00','0000-00-00 00:00:00',1,1);
insert  into `productcategory`(`created_at`,`updated_at`,`product_id`,`category_id`) values ('2024-09-11 06:19:01','2024-09-11 06:19:01',1,2);
insert  into `productcategory`(`created_at`,`updated_at`,`product_id`,`category_id`) values ('2024-09-11 06:20:55','2024-09-11 06:20:55',2,1);
insert  into `productcategory`(`created_at`,`updated_at`,`product_id`,`category_id`) values ('2024-09-11 06:21:37','2024-09-11 06:21:37',3,3);

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `members` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  `tag` text DEFAULT NULL,
  `next_meeting` date DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`description`,`brand`,`members`,`category`,`tag`,`next_meeting`,`created_at`,`updated_at`) values (1,'Sony 4K Ultra HD TV','Sony','[1]','[1]','[1]','2024-09-11','2024-09-11 06:16:56','2024-09-11 06:19:01');
insert  into `products`(`id`,`description`,`brand`,`members`,`category`,`tag`,`next_meeting`,`created_at`,`updated_at`) values (2,'Samsung Galaxy S21','Samsung','[1]','[1]','[2]','2024-09-12','2024-09-11 06:20:55','2024-09-11 06:20:55');
insert  into `products`(`id`,`description`,`brand`,`members`,`category`,`tag`,`next_meeting`,`created_at`,`updated_at`) values (3,'KEA Billy Bookcase','IKEA','[1]','[3]','[2]','2024-09-11','2024-09-11 06:21:37','2024-09-11 06:21:37');

/*Table structure for table `producttag` */

DROP TABLE IF EXISTS `producttag`;

CREATE TABLE `producttag` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `product_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `producttag_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `producttag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `producttag` */

insert  into `producttag`(`created_at`,`updated_at`,`product_id`,`tag_id`) values ('0000-00-00 00:00:00','0000-00-00 00:00:00',1,1);
insert  into `producttag`(`created_at`,`updated_at`,`product_id`,`tag_id`) values ('2024-09-11 06:20:55','2024-09-11 06:20:55',2,2);
insert  into `producttag`(`created_at`,`updated_at`,`product_id`,`tag_id`) values ('2024-09-11 06:21:37','2024-09-11 06:21:37',3,2);

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `roles` */

insert  into `roles`(`id`,`name`,`createdAt`,`updatedAt`) values (1,'admin','0000-00-00 00:00:00','0000-00-00 00:00:00');

/*Table structure for table `tags` */

DROP TABLE IF EXISTS `tags`;

CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tags` */

insert  into `tags`(`id`,`name`,`created_at`,`updated_at`) values (1,'New','0000-00-00 00:00:00','0000-00-00 00:00:00');
insert  into `tags`(`id`,`name`,`created_at`,`updated_at`) values (2,'Sale','0000-00-00 00:00:00','0000-00-00 00:00:00');
insert  into `tags`(`id`,`name`,`created_at`,`updated_at`) values (3,'Popular','0000-00-00 00:00:00','0000-00-00 00:00:00');
insert  into `tags`(`id`,`name`,`created_at`,`updated_at`) values (4,'Limited Edition','0000-00-00 00:00:00','0000-00-00 00:00:00');
insert  into `tags`(`id`,`name`,`created_at`,`updated_at`) values (5,'Trending','0000-00-00 00:00:00','0000-00-00 00:00:00');

/*Table structure for table `user_roles` */

DROP TABLE IF EXISTS `user_roles`;

CREATE TABLE `user_roles` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`roleId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `user_roles` */

insert  into `user_roles`(`createdAt`,`updatedAt`,`roleId`,`userId`) values ('0000-00-00 00:00:00','0000-00-00 00:00:00',1,1);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'active',
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `users_username` (`username`),
  UNIQUE KEY `users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`email`,`password`,`first_name`,`last_name`,`status`,`profile_picture`,`created_at`,`updated_at`) values (1,'admin','admin1@test.com','$2a$08$OC6OifeHwtJBkl1wSS6i1e1iGHK8TzflaKOocM/uo7ZuDqvU7WBOy','test','com','active','profile_picture-1725979772228-554086532.jpg','0000-00-00 00:00:00','2024-09-10 14:49:32');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
