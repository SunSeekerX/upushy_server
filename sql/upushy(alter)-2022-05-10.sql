ALTER TABLE `ssx_uni_pushy`.`app_user` 
DROP INDEX `IDX_3fa909d0e37c531ebc23770339`;

ALTER TABLE `ssx_uni_pushy_dev`.`app_user` 
MODIFY COLUMN `email` varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '邮箱' AFTER `password`;

ALTER TABLE `ssx_uni_pushy_dev`.`app_user` 
MODIFY COLUMN `nickname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '昵称' AFTER `email`;