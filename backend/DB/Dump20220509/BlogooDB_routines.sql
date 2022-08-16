-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: xerxes.cfhinzrtpqwd.us-east-2.rds.amazonaws.com    Database: BlogooDB
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Dumping events for database 'BlogooDB'
--

--
-- Dumping routines for database 'BlogooDB'
--
/*!50003 DROP PROCEDURE IF EXISTS `AddPostInteraction` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `AddPostInteraction`(
	vuser_id varchar(64),
    vpost_id int,
    vpost_interaction_type int
)
BEGIN
	if exists(select * from PostInteraction where user_id = vuser_id and post_id = vpost_id) THEN
		if vpost_interaction_type != -1 THEN
			update PostInteraction
            set interaction_type_id = vpost_interaction_type
			where user_id = vuser_id and post_id = vpost_id; 
		else
			delete from PostInteraction
            where user_id = vuser_id and post_id = vpost_id;
        end if;
	else
		if vpost_interaction_type != -1 THEN
			insert into PostInteraction (user_id, post_id, interaction_type_id)
            values (vuser_id, vpost_id, vpost_interaction_type);
        end if;
    end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `ApproveDisapproveCCR` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `ApproveDisapproveCCR`(
	in vrequester_id varchar(64),
    in vccr_id int,
    in vapproved tinyint,
    in vapproval_details varchar(256),
    out error_details varchar(64)
)
BEGIN
	if exists(select * from Moderators where user_id = vrequester_id and category_id = (select parent_category_id from CategoryCreationRequests where ccr_id = vccr_id)) THEN
    
		if (select approved from CategoryCreationRequests where ccr_id = vccr_id) is null then
			UPDATE CategoryCreationRequests
			set approved = vapproved, approval_date = current_timestamp(), approval_details = vapproval_details
			where ccr_id = vccr_id;
			
			set error_details = null;
		else
			set error_details = "Category creation request has already been approved or dissaproved.";
		end if;
	else
		set error_details = "User is not a moderator of the category the category creation request is a part of.";
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CategoriesMainPage` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `CategoriesMainPage`(
	vrequester_id varchar(64)
)
BEGIN
	SET SQL_SAFE_UPDATES = 0;
    
	drop table if exists t_subs;
	drop table if exists t_cats;
	drop table if exists t_mods;

	/* user subscriptions */
    create temporary table t_subs (
	select 
    s.category_id,
    c.parent_category_id, 
    c.category_name, 
    c.category_pfp_url,
    c.category_desc
    from Subscribers s
    inner join Categories c on c.category_id = s.category_id
    where s.user_id = vrequester_id
    );
    
	alter table t_subs add column subscribers int;
    update t_subs t_s
    set subscribers = (select count(*) from Subscribers where category_id = t_s.category_id);
    
    select * from t_subs;

    /* user category moderator */
	create temporary table t_mods(
    select 
    m.category_id,
    c.parent_category_id, 
    c.category_name, 
    c.category_pfp_url,
    c.category_desc
    from Moderators m
    inner join Categories c on c.category_id = m.category_id
    where m.user_id = vrequester_id
    );
    
    alter table t_mods add column subscribers int;
    update t_mods t_s
    set subscribers = (select count(*) from Subscribers where category_id = t_s.category_id);
    
    select * from t_mods;
    
    /* get the parent category of all categories */
    create temporary table t_cats(
		select * from Categories
		where parent_category_id is null
    );
    
    alter table t_cats add column subscribers int;
    update t_cats t_s
    set subscribers = (select count(*) from Subscribers where category_id = t_s.category_id);
    
    select * from t_cats;
    
    /* get the requests to create a category */
    select * from CategoryCreationRequests
    where approved = 1 or approved = null;
    
	SET SQL_SAFE_UPDATES = 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateCategoryCreationRequest` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `CreateCategoryCreationRequest`(
	vrequester_id varchar(64),
    vparent_cat_id int,
    vnew_cat_name varchar(64),
    vnew_cat_desc varchar(256),
    vrequest_details varchar(64),
	out error_details varchar(64)
)
BEGIN
	
    select if(count(*) > 0, "Category name is currently claimed by another request", null)
    into error_details
    from CategoryCreationRequests
    where lower(category_name) = lower(vnew_cat_name) and approved = null;

	select if(count(*) > 0, "Category already exists", null)
    into error_details
    from Categories
    where lower(category_name) = lower(vnew_cat_name);
    
    IF error_details is null THEN
		INSERT INTO CategoryCreationRequests (requester_user_id, parent_category_id, category_name, category_desc, request_details, request_date)
		VALUES (vrequester_id, vparent_cat_id, vnew_cat_name, vnew_cat_desc, vrequest_details, current_timestamp());
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreatePost` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `CreatePost`(
vuser_id varchar(64),
vtitle varchar(255),
vbody mediumtext,
vreply_post_id int,
vcategory_id int
)
BEGIN
    INSERT INTO Posts (user_id, title, body, date_posted, reply_post_id, category_id)
    VALUES (vuser_id, vtitle, vbody, current_timestamp(), vreply_post_id, vcategory_id);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `CreateUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `CreateUser`(
v_user_id varchar(64),
v_first_name varchar(255),
v_last_name varchar(255),
v_email_address varchar(255),
v_pfp_url mediumtext
)
BEGIN

insert into Users(user_id, 
				first_name, 
				last_name, 
				email_address, 
				pfp_url, 
				date_created,
                date_last_login)
values (v_user_id, 
		v_first_name, 
		v_last_name, 
		v_email_address, 
		v_pfp_url, 
        current_date(),
		current_date());

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `FollowUnfollowUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `FollowUnfollowUser`(
vuser_id varchar(64),
vfollow_user_id varchar(64),
vfollow tinyint
)
BEGIN
	if exists(select * from Followers where user_id = vuser_id and follow_user_id = vfollow_user_id) then
		if vfollow = 0 then
			delete from Followers
			where user_id = vuser_id 
			and follow_user_id = vfollow_user_id;
		end if;
	else
		if vfollow = 1 then
			insert into Followers(user_id, follow_user_id)
			values(vuser_id, vfollow_user_id);
		end if;
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetCategory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetCategory`(
	vcategory_id int,
    vrequester_id varchar(64)
)
BEGIN
	DROP TABLE IF EXISTS t_posts;
	DROP TABLE IF EXISTS t_cat;
    
    create temporary table t_cat(
		select c1.category_id, 
		c1.parent_category_id, 
		c1.category_name, 
		c1.category_pfp_url, 
		c1.category_desc, 
		c1.date_created,
		c2.category_name as `parent_category_name`, 
		c2.category_pfp_url as `parent_category_pfp_url`, 
		c2.category_desc as `parent_category_desc`,
		if(count(m.user_id) > 0,1,0) as `is_moderator`,
		if(count(s2.user_id) > 0,1,0) as `requester_subscribed`
		from Categories c1
		left join Categories c2 on c1.parent_category_id = c2.category_id
		left join Subscribers s2 on s2.category_id = c1.category_id and s2.user_id = vrequester_id
		left join Moderators m on (m.user_id = vrequester_id and m.category_id = vcategory_id)
		where c1.category_id = vcategory_id
    );
    
    alter table t_cat add column `subscribers` int;
    
	SET SQL_SAFE_UPDATES = 0;
    update t_cat
    set subscribers = (select count(*) from Subscribers where category_id = vcategory_id);
	SET SQL_SAFE_UPDATES = 1;
    
    select * from t_cat;
	
    select m.user_id,
			u.first_name,
            u.last_name,
            u.username,
            u.pfp_url
    from Moderators m
    inner join Users u on u.user_id = m.user_id
    where category_id = vcategory_id;
    
    select * from CategoryRules
    where category_id = vcategory_id;
    
    create temporary table t_posts(
		select 
        p.post_id, 
        p.user_id, 
        p.title, 
        p.body, 
        p.date_posted, 
        p.is_deleted, 
        p.reply_post_id, 
        p.category_id,
        u.first_name,
        u.last_name,
        u.pfp_url,
        u.username
        from Posts p
        inner join Users u on u.user_id = p.user_id
		where p.category_id = vcategory_id and p.reply_post_id is null
    );
    
	alter table t_posts add likes int;
	alter table t_posts add dislikes int;

	alter table t_posts add liked int;
	alter table t_posts add disliked int;

	alter table t_posts add num_of_comments int;
	
    SET SQL_SAFE_UPDATES = 0;
    update t_posts
	set 
    likes = (select count(*) from PostInteraction 
                where post_id = t_posts.post_id and interaction_type_id = 1),
	dislikes = (select count(*) from PostInteraction 
                where post_id = t_posts.post_id and interaction_type_id = 2),
	liked = (select count(*) from PostInteraction 
			where post_id = t_posts.post_id 
			and interaction_type_id = 1 
			and user_id = vrequester_id),
	disliked = (select count(*) from PostInteraction 
				where post_id = t_posts.post_id 
				and interaction_type_id = 2 
				and user_id = vrequester_id),
	num_of_comments = (with recursive cte (id) as (
							  select     post_id
							  from       Posts
							  where      reply_post_id = t_posts.post_id
							  union all
							  select     p.post_id
							  from       Posts p
							  inner join cte 
							  on p.reply_post_id = cte.id
							)
							select count(*) from cte);
	SET SQL_SAFE_UPDATES = 1;
    
    select * from t_posts
	order by date_posted desc;

    select * 
    from Categories
    where parent_category_id = vcategory_id;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetCategoryID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetCategoryID`(
	in vcategory_name varchar(255),
    out vcategory_id int
)
BEGIN
	select category_id into vcategory_id
    from Categories 
    where LOWER(category_name) = LOWER(vcategory_name);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetMinifiedUserProfile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetMinifiedUserProfile`(
	vuser_id varchar(64)
)
BEGIN
	select user_id, first_name, username, pfp_url
    from Users
    where user_id = vuser_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetModeratorPage` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetModeratorPage`(
	vrequester_id varchar(64),
    vcategory_id varchar(64),
    out error_details varchar(64)
)
BEGIN
	set error_details = null;
    
	if exists(select * from Moderators where user_id = vrequester_id and category_id = vcategory_id) THEN
		select 
        ccr.ccr_id, 
        ccr.requester_user_id, 
        ccr.parent_category_id, 
        ccr.category_name, 
        ccr.category_desc, 
        ccr.request_details, 
        ccr.approved, 
        ccr.approval_date, 
        ccr.approval_details, 
        ccr.request_date,
        u.first_name,
        u.last_name,
        u.username,
        u.pfp_url
        from CategoryCreationRequests ccr
        inner join Users u on u.user_id = ccr.requester_user_id 
        where ccr.parent_category_id = vcategory_id;
		
        select
        cr.cat_report_id, 
        cr.reporter_user_id, 
        cr.rule_id, 
        cr.post_id, 
        cr.report_details, 
        cr.report_date, 
        cr.approved, 
        cr.approval_date,
		u.first_name,
        u.last_name,
        u.username,
        u.username,
        u.pfp_url,
        p.body,
        p.category_id,
        r.rule_details
        from CategoryReports cr
		inner join Users u on u.user_id  = cr.reporter_user_id
		inner join Posts p on p.post_id = cr.post_id
        inner join CategoryRules r on r.rule_id = cr.rule_id
        where p.category_id = vcategory_id;
        
        select
        mr.mod_request_id, 
        mr.requester_id, 
        mr.category_id, 
        mr.request_details, 
        mr.approved, 
        mr.approval_date, 
        mr.request_date,
        u.first_name,
        u.last_name,
        u.username,
        u.username,
        u.pfp_url
        from ModeratorRequests mr
		inner join Users u on u.user_id  = mr.requester_id
		where mr.category_id = vcategory_id;
        
        select
        cus.category_user_suspension_id, 
        cus.cat_report_id, 
        cus.user_id, 
        cus.category_id, 
        cus.suspend_date, 
        cus.suspend_end_date, 
        cus.reason_details,
        u.first_name,
        u.last_name,
        u.username,
        u.username,
        u.pfp_url
        from CategoryUserSuspensions cus
		inner join Users u on u.user_id  = cus.user_id
        where cus.category_id = vcategory_id;
		
	ELSE
		if exists(select * from Categories where category_id = vcategory_id) THEN
			set error_details = "You are not a moderator of this community.";
		ELSE
			SET error_details = "This category does not exist";
		END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetPostComments` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetPostComments`(
	vpost_id int,
    vrequester_user_id varchar(64)
)
BEGIN
	SET SQL_SAFE_UPDATES = 0;

	drop table if exists t_comments;
    
    create temporary table t_comments(
		select p.post_id,
			p.user_id,
			p.title, 
			p.body, 
			p.date_posted, 
			p.is_deleted, 
			p.reply_post_id, 
			p.category_id,
			u.username,
			u.first_name,
			u.last_name,
			u.pfp_url
		from Posts p
		inner join Users u on u.user_id = p.user_id
		where p.reply_post_id = vpost_id
    );
    
alter table t_comments add likes int;
alter table t_comments add dislikes int;

alter table t_comments add liked int;
alter table t_comments add disliked int;

alter table t_comments add num_of_comments int;

update t_comments
set likes = (select count(*) from PostInteraction 
                where post_id = t_comments.post_id and interaction_type_id = 1),
	dislikes = (select count(*) from PostInteraction 
                where post_id = t_comments.post_id and interaction_type_id = 2),
	liked = (select count(*) from PostInteraction 
			where post_id = t_comments.post_id 
			and interaction_type_id = 1 
			and user_id = vrequester_user_id),
	disliked = (select count(*) from PostInteraction 
				where post_id = t_comments.post_id 
				and interaction_type_id = 2 
				and user_id = vrequester_user_id),
	num_of_comments = (with recursive cte (id) as (
							  select     post_id
							  from       Posts
							  where      reply_post_id = t_comments.post_id
							  union all
							  select     p.post_id
							  from       Posts p
							  inner join cte 
							  on p.reply_post_id = cte.id
							)
							select count(*) from cte);
	
SET SQL_SAFE_UPDATES = 1;

 select 
		tp.post_id, 
		tp.user_id, 
		tp.title, 
		tp.body, 
		tp.date_posted, 
		tp.is_deleted, 
		tp.reply_post_id, 
		tp.category_id, 
		tp.likes, 
		tp.dislikes, 
		tp.liked, 
		tp.disliked, 
		tp.num_of_comments,
		u.username,
		u.first_name,
		u.last_name,
		u.pfp_url,
        c.category_name,
        c.category_pfp_url
    from t_comments tp
    inner join Users u on tp.user_id = u.user_id
    inner join Categories c on tp.category_id = c.category_id
    order by tp.date_posted desc;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetPostThread` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetPostThread`(
	in vpost_id int,
    in vrequester_user_id varchar(64)
)
BEGIN
	DECLARE thread_not_found bool default true;
    DECLARE curr_reply_post_id int;
    
	SET SQL_SAFE_UPDATES = 0;
    
	DROP TABLE IF EXISTS t_post_thread;

	CREATE TEMPORARY TABLE t_post_thread(
		select * from Posts where post_id = vpost_id
    );

	WHILE(thread_not_found) DO
		
        set curr_reply_post_id = (select min(post_id) from t_post_thread);
        set curr_reply_post_id = (select reply_post_id from t_post_thread where post_id = curr_reply_post_id);
                
        IF curr_reply_post_id is not null THEN
			INSERT INTO t_post_thread 
			SELECT * FROM Posts 
			WHERE post_id = curr_reply_post_id;
		ELSE
			SET thread_not_found = false;
		END IF;
                        
    END WHILE;
    
    alter table t_post_thread add likes int;
	alter table t_post_thread add dislikes int;

	alter table t_post_thread add liked int;
	alter table t_post_thread add disliked int;

	alter table t_post_thread add num_of_comments int;
    
    update t_post_thread
	set 
    likes = (select count(*) from PostInteraction 
                where post_id = t_post_thread.post_id and interaction_type_id = 1),
	dislikes = (select count(*) from PostInteraction 
                where post_id = t_post_thread.post_id and interaction_type_id = 2),
	liked = (select count(*) from PostInteraction 
			where post_id = t_post_thread.post_id 
			and interaction_type_id = 1 
			and user_id = vrequester_user_id),
	disliked = (select count(*) from PostInteraction 
				where post_id = t_post_thread.post_id 
				and interaction_type_id = 2 
				and user_id = vrequester_user_id),
	num_of_comments = (with recursive cte (id) as (
							  select     post_id
							  from       Posts
							  where      reply_post_id = t_post_thread.post_id
							  union all
							  select     p.post_id
							  from       Posts p
							  inner join cte 
							  on p.reply_post_id = cte.id
							)
							select count(*) from cte);
	SET SQL_SAFE_UPDATES = 1;

    select 
		tp.post_id, 
		tp.user_id, 
		tp.title, 
		tp.body, 
		tp.date_posted, 
		tp.is_deleted, 
		tp.reply_post_id, 
		tp.category_id, 
		tp.likes, 
		tp.dislikes, 
		tp.liked, 
		tp.disliked, 
		tp.num_of_comments,
		u.username,
		u.first_name,
		u.last_name,
		u.pfp_url,
        c.category_name,
        c.category_pfp_url
    from t_post_thread tp
    inner join Users u on tp.user_id = u.user_id
    inner join Categories c on tp.category_id = c.category_id
    order by tp.post_id asc;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserFollowers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetUserFollowers`(
vuser_id varchar(64),
vrequester_user_id varchar(64)
)
BEGIN
	SET SQL_SAFE_UPDATES = 0;
	
    drop table if exists t_followers;
    
	create temporary table t_followers(
		select u.user_id,
				u.username,
				u.first_name,
				u.last_name,
				u.pfp_url,
				u.bio
		from Followers f
		inner join Users u on u.user_id = f.user_id
		where f.follow_user_id = vuser_id
    );
    
    alter table t_followers add column requester_follows bool;
	alter table t_followers add column OwnAccount bool;

    update t_followers t_f
    set requester_follows = (select count(*) from Followers where follow_user_id = t_f.user_id and user_id = vrequester_user_id),
		OwnAccount = (if(t_f.user_id = vrequester_user_id, 1, 0));
	
	SET SQL_SAFE_UPDATES = 1;
	
    select * from t_followers;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserFollowing` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetUserFollowing`(
vuser_id varchar(64),
vrequester_user_id varchar(64)
)
BEGIN
	SET SQL_SAFE_UPDATES = 0;
	
    drop table if exists t_followers;
    
	create temporary table t_followers(
		select u.user_id,
				u.username,
				u.first_name,
				u.last_name,
				u.pfp_url,
				u.bio
		from Followers f
		inner join Users u on u.user_id = f.follow_user_id
		where f.user_id = vuser_id
    );
    
    alter table t_followers add column requester_follows bool;
	alter table t_followers add column OwnAccount bool;

    update t_followers t_f
    set requester_follows = (select count(*) from Followers where follow_user_id = t_f.user_id and user_id = vrequester_user_id),
		OwnAccount = (if(t_f.user_id = vrequester_user_id, 1, 0));
	
	SET SQL_SAFE_UPDATES = 1;
	
    select * from t_followers;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetUserID`(
 in vusername varchar(255),
 out vuser_id varchar(64)
)
BEGIN
	select user_id 
    into vuser_id
    from Users
    where username = vusername;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserPosts` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetUserPosts`(
v_user_id varchar(64),
v_requester_user_id varchar(64)
)
BEGIN
SET SQL_SAFE_UPDATES = 0;

drop table if exists t1;

create temporary table t1(											
select p.post_id,
p.user_id,
p.title, 
p.body, 
p.date_posted, 
p.is_deleted, 
p.reply_post_id, 
p.category_id,
u.username,
u.first_name,
u.last_name,
u.pfp_url
from Posts p
inner join Users u on u.user_id = p.user_id
where p.user_id = v_user_id);

alter table t1 add likes int;
alter table t1 add dislikes int;

alter table t1 add liked int;
alter table t1 add disliked int;

alter table t1 add num_of_comments int;

update t1
set likes = (select count(*) from PostInteraction 
                where post_id = t1.post_id and interaction_type_id = 1),
	dislikes = (select count(*) from PostInteraction 
                where post_id = t1.post_id and interaction_type_id = 2),
	liked = (select count(*) from PostInteraction 
			where post_id = t1.post_id 
			and interaction_type_id = 1 
			and user_id = v_requester_user_id),
	disliked = (select count(*) from PostInteraction 
				where post_id = t1.post_id 
				and interaction_type_id = 2 
				and user_id = v_requester_user_id),
	num_of_comments = (with recursive cte (id) as (
							  select     post_id
							  from       Posts
							  where      reply_post_id = t1.post_id
							  union all
							  select     p.post_id
							  from       Posts p
							  inner join cte 
							  on p.reply_post_id = cte.id
							)
							select count(*) from cte);
	

select * from t1
order by date_posted desc;

SET SQL_SAFE_UPDATES = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetUserProfile` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `GetUserProfile`(
vuser_id varchar(64),
vrequester_user_id varchar(64)
)
BEGIN
SET SQL_SAFE_UPDATES = 0;

drop table if exists t_user;

create temporary table t_user(
select * from Users
where user_id = vuser_id
);

alter table t_user add column `following` int;
alter table t_user add column `followers` int;
alter table t_user add column `requester_follows` int;
alter table t_user add column `own_account` int;

update t_user 
set `following` = (select count(*) from Followers 
					where user_id = vuser_id),
	`followers` = (select count(*) from Followers 
					where follow_user_id = vuser_id),
    `requester_follows` = (select count(*) from Followers 
							where user_id = vrequester_user_id 
								and follow_user_id = vuser_id),
	`own_account` = (select if(vuser_id = vrequester_user_id, 1, 0));

SET SQL_SAFE_UPDATES = 1;

select * from t_user;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SubscribeUnsubscribeCategory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `SubscribeUnsubscribeCategory`(
vuser_id varchar(64),
vcategory_id int,
vsubscribe tinyint
)
BEGIN
	if exists(select * from Subscribers where user_id = vuser_id and category_id = vcategory_id) then
		if vsubscribe = 0 then
			delete from Subscribers
			where user_id = vuser_id 
			and category_id = vcategory_id;
		end if;
	else
		if vsubscribe = 1 then
			insert into Subscribers(user_id, category_id)
			values(vuser_id, vcategory_id);
		end if;
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `UpdateUser`(
	v_user_id varchar(64),
	v_username varchar(255),
	v_first_name varchar(255),
	v_last_name varchar(255),
	v_email_address varchar(255),
	v_pfp_url mediumtext,
    v_location varchar(255),
    v_bio varchar(255),
    v_facebook_url mediumtext,
    v_youtube_url mediumtext,
    v_instagram_url mediumtext,
    v_website_url mediumtext
)
BEGIN
	update Users
    set username = ifnull(v_username, username), 
		first_name = ifnull(v_first_name, first_name), 
		last_name = ifnull(v_last_name, last_name),
		email_address = ifnull(v_email_address, email_address),
		pfp_url = ifnull(v_pfp_url, pfp_url),
        location = ifnull(v_location, location),
		bio = ifnull(v_bio, bio),
		facebook_url = ifnull(v_facebook_url, facebook_url),
		youtube_url = ifnull(v_youtube_url, youtube_url),
		instagram_url = ifnull(v_instagram_url, instagram_url),
		website_url = ifnull(v_website_url, website_url)
	where user_id = v_user_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateUserLastLogin` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `UpdateUserLastLogin`(
	v_user_id varchar(64)
)
BEGIN
	update Users 
    set date_last_login = current_date()
    where user_id = v_user_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UsernameNullCheck` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `UsernameNullCheck`(
	in v_user_id varchar(64),
    out vusername varchar(255)
)
BEGIN
	select username 
	into vusername
    from Users
    where user_id = v_user_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-09 20:12:05
