CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"color" varchar(6) NOT NULL,
	"text_color" varchar(6) DEFAULT 'FFFFFF' NOT NULL,
	"description" text,
	"topic_id" integer,
	"topic_count" integer DEFAULT 0 NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"parent_category_id" integer,
	"uploaded_logo_id" integer,
	"uploaded_background_id" integer,
	"read_restricted" boolean DEFAULT false NOT NULL,
	"auto_close_hours" integer,
	"auto_close_based" integer DEFAULT 3 NOT NULL,
	"allow_badges" boolean DEFAULT true NOT NULL,
	"topic_featured_link_allowed" boolean DEFAULT true NOT NULL,
	"show_subcategory_list" boolean DEFAULT false NOT NULL,
	"num_featured_topics" integer DEFAULT 3 NOT NULL,
	"default_view" varchar(50) DEFAULT 'latest',
	"subcategory_list_style" varchar(50) DEFAULT 'rows_with_featured_topics' NOT NULL,
	"default_top_period" varchar(20) DEFAULT 'all',
	"mailing_list_mode" boolean DEFAULT false NOT NULL,
	"minimum_required_tags" integer DEFAULT 0 NOT NULL,
	"navigate_to_first_post_after_read" boolean DEFAULT false NOT NULL,
	"sort_order" varchar(50),
	"sort_ascending" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "category_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"permission_type" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"notification_level" integer DEFAULT 1 NOT NULL,
	"last_seen_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_histories" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"acting_user_id" integer NOT NULL,
	"target_user_id" integer,
	"action" integer NOT NULL,
	"subject" varchar(255),
	"prev_value" text,
	"new_value" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_mentions" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"owner" boolean DEFAULT false NOT NULL,
	"notification_level" integer DEFAULT 2 NOT NULL,
	"first_unread_pm_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"bio_raw" text,
	"bio_cooked" text,
	"visibility" integer DEFAULT 0 NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"allow_membership_requests" boolean DEFAULT false NOT NULL,
	"membership_request_template" text,
	"full_name" varchar(255),
	"user_count" integer DEFAULT 0 NOT NULL,
	"mentionable_level" integer DEFAULT 0 NOT NULL,
	"messagable_level" integer DEFAULT 0 NOT NULL,
	"flair_url" varchar(500),
	"flair_bg_color" varchar(6),
	"flair_color" varchar(6),
	"primary_group" boolean DEFAULT false NOT NULL,
	"title" varchar(255),
	"grant_trust_level" integer,
	"incoming_email" varchar(255),
	"has_messages" boolean DEFAULT false NOT NULL,
	"publish_read_state" boolean DEFAULT false NOT NULL,
	"members_visibility_level" integer DEFAULT 0 NOT NULL,
	"can_admin_group" boolean DEFAULT false NOT NULL,
	"default_notification_level" integer DEFAULT 3 NOT NULL,
	"automatic_membership_email_domains" text,
	"automatic_membership_retroactive" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"badge_type_id" integer NOT NULL,
	"grant_count" integer DEFAULT 0 NOT NULL,
	"allow_title" integer DEFAULT 0 NOT NULL,
	"multiple" integer DEFAULT 0 NOT NULL,
	"icon" varchar(100),
	"listable" integer DEFAULT 1 NOT NULL,
	"target_posts" integer DEFAULT 0 NOT NULL,
	"enabled" integer DEFAULT 1 NOT NULL,
	"auto_revoke" integer DEFAULT 1 NOT NULL,
	"badge_grouping_id" integer DEFAULT 5 NOT NULL,
	"system" integer DEFAULT 0 NOT NULL,
	"image_url" varchar(500),
	"long_description" varchar(2000),
	"show_posts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"value" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "permission_types_name_unique" UNIQUE("name"),
	CONSTRAINT "permission_types_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "post_action_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"is_flag" integer DEFAULT 0 NOT NULL,
	"icon" varchar(100),
	"position" integer DEFAULT 0 NOT NULL,
	"score_bonus" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_action_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "post_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"post_action_type_id" integer NOT NULL,
	"deleted_at" timestamp,
	"deleted_by_id" integer,
	"related_post_id" integer,
	"staff_took_action" boolean DEFAULT false NOT NULL,
	"deferred_by_id" integer,
	"deferred_at" timestamp,
	"agreed_at" timestamp,
	"agreed_by_id" integer,
	"disagreed_at" timestamp,
	"disagreed_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_revisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer,
	"number" integer NOT NULL,
	"modifications" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"topic_id" integer NOT NULL,
	"post_number" integer NOT NULL,
	"raw" text NOT NULL,
	"cooked" text NOT NULL,
	"reply_to_post_number" integer,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"quote_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"reads" integer DEFAULT 0 NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"hidden" boolean DEFAULT false NOT NULL,
	"hidden_at" timestamp,
	"hidden_reason_id" integer,
	"wiki" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"last_version_at" timestamp,
	"deleted_at" timestamp,
	"deleted_by_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag_group_memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_id" integer NOT NULL,
	"tag_group_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"parent_tag_id" integer,
	"one_per_topic" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"notification_level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"topic_count" integer DEFAULT 0 NOT NULL,
	"pm_topic_count" integer DEFAULT 0 NOT NULL,
	"target_tag_id" integer,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "topic_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"topic_id" integer NOT NULL,
	"posted" boolean DEFAULT false NOT NULL,
	"last_read_post_number" integer DEFAULT 0 NOT NULL,
	"highest_seen_post_number" integer DEFAULT 0 NOT NULL,
	"last_visited_at" timestamp,
	"first_visited_at" timestamp,
	"notification_level" integer DEFAULT 1 NOT NULL,
	"notifications_changed" boolean DEFAULT false NOT NULL,
	"notifications_reason_id" integer,
	"liked" boolean DEFAULT false NOT NULL,
	"bookmarked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"user_id" integer NOT NULL,
	"category_id" integer,
	"views" integer DEFAULT 0 NOT NULL,
	"posts_count" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"highest_post_number" integer DEFAULT 0 NOT NULL,
	"last_posted_at" timestamp,
	"last_reply_at" timestamp,
	"bumped_at" timestamp,
	"pinned" boolean DEFAULT false NOT NULL,
	"pinned_at" timestamp,
	"pinned_globally" boolean DEFAULT false NOT NULL,
	"pinned_until" timestamp,
	"visible" boolean DEFAULT true NOT NULL,
	"closed" boolean DEFAULT false NOT NULL,
	"closed_at" timestamp,
	"archived" boolean DEFAULT false NOT NULL,
	"archived_at" timestamp,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "trust_level_grants" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"trust_level" integer NOT NULL,
	"granted_by_id" integer,
	"reason" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_action_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_action_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"badge_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"granted_by_id" integer,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"post_id" integer,
	"notification_id" integer,
	"seq" integer DEFAULT 0 NOT NULL,
	"featured" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"primary" boolean DEFAULT false NOT NULL,
	"confirmed" boolean DEFAULT false NOT NULL,
	"confirmed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_emails_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"location" varchar(255),
	"website" varchar(500),
	"bio_raw" text,
	"bio_cooked" text,
	"avatar_url" varchar(500),
	"profile_background_url" varchar(500),
	"card_background_url" varchar(500),
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	"moderator" boolean DEFAULT false NOT NULL,
	"trust_level" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"suspended" boolean DEFAULT false NOT NULL,
	"silenced" boolean DEFAULT false NOT NULL,
	"suspended_at" timestamp,
	"suspended_till" timestamp,
	"silenced_till" timestamp,
	"last_seen_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_category_id_categories_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_groups" ADD CONSTRAINT "category_groups_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_groups" ADD CONSTRAINT "category_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_users" ADD CONSTRAINT "category_users_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_users" ADD CONSTRAINT "category_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_histories" ADD CONSTRAINT "group_histories_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_histories" ADD CONSTRAINT "group_histories_acting_user_id_users_id_fk" FOREIGN KEY ("acting_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_histories" ADD CONSTRAINT "group_histories_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_mentions" ADD CONSTRAINT "group_mentions_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_users" ADD CONSTRAINT "group_users_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_users" ADD CONSTRAINT "group_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_tags" ADD CONSTRAINT "category_tags_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_tags" ADD CONSTRAINT "category_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_actions" ADD CONSTRAINT "post_actions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_actions" ADD CONSTRAINT "post_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_revisions" ADD CONSTRAINT "post_revisions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_revisions" ADD CONSTRAINT "post_revisions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_group_memberships" ADD CONSTRAINT "tag_group_memberships_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_group_memberships" ADD CONSTRAINT "tag_group_memberships_tag_group_id_tag_groups_id_fk" FOREIGN KEY ("tag_group_id") REFERENCES "public"."tag_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_users" ADD CONSTRAINT "tag_users_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag_users" ADD CONSTRAINT "tag_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_tags" ADD CONSTRAINT "topic_tags_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_tags" ADD CONSTRAINT "topic_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_users" ADD CONSTRAINT "topic_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic_users" ADD CONSTRAINT "topic_users_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_emails" ADD CONSTRAINT "user_emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "categories_parent_category_id_idx" ON "categories" USING btree ("parent_category_id");--> statement-breakpoint
CREATE INDEX "categories_position_idx" ON "categories" USING btree ("position");--> statement-breakpoint
CREATE INDEX "category_groups_category_id_group_id_idx" ON "category_groups" USING btree ("category_id","group_id");--> statement-breakpoint
CREATE INDEX "category_groups_group_id_idx" ON "category_groups" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "category_users_category_id_user_id_idx" ON "category_users" USING btree ("category_id","user_id");--> statement-breakpoint
CREATE INDEX "category_users_user_id_idx" ON "category_users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "category_users_notification_level_idx" ON "category_users" USING btree ("notification_level");--> statement-breakpoint
CREATE INDEX "group_histories_group_id_idx" ON "group_histories" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "group_histories_acting_user_id_idx" ON "group_histories" USING btree ("acting_user_id");--> statement-breakpoint
CREATE INDEX "group_histories_target_user_id_idx" ON "group_histories" USING btree ("target_user_id");--> statement-breakpoint
CREATE INDEX "group_histories_action_idx" ON "group_histories" USING btree ("action");--> statement-breakpoint
CREATE INDEX "group_mentions_post_id_group_id_idx" ON "group_mentions" USING btree ("post_id","group_id");--> statement-breakpoint
CREATE INDEX "group_mentions_group_id_idx" ON "group_mentions" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "group_users_group_id_user_id_idx" ON "group_users" USING btree ("group_id","user_id");--> statement-breakpoint
CREATE INDEX "group_users_user_id_idx" ON "group_users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "group_users_owner_idx" ON "group_users" USING btree ("owner");--> statement-breakpoint
CREATE INDEX "groups_name_idx" ON "groups" USING btree ("name");--> statement-breakpoint
CREATE INDEX "groups_public_idx" ON "groups" USING btree ("public");--> statement-breakpoint
CREATE INDEX "groups_visibility_idx" ON "groups" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "badges_name_idx" ON "badges" USING btree ("name");--> statement-breakpoint
CREATE INDEX "badges_badge_type_id_idx" ON "badges" USING btree ("badge_type_id");--> statement-breakpoint
CREATE INDEX "badges_enabled_idx" ON "badges" USING btree ("enabled");--> statement-breakpoint
CREATE INDEX "category_tags_category_id_tag_id_idx" ON "category_tags" USING btree ("category_id","tag_id");--> statement-breakpoint
CREATE INDEX "category_tags_tag_id_idx" ON "category_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "permission_types_name_idx" ON "permission_types" USING btree ("name");--> statement-breakpoint
CREATE INDEX "permission_types_value_idx" ON "permission_types" USING btree ("value");--> statement-breakpoint
CREATE INDEX "post_action_types_name_idx" ON "post_action_types" USING btree ("name");--> statement-breakpoint
CREATE INDEX "post_action_types_is_flag_idx" ON "post_action_types" USING btree ("is_flag");--> statement-breakpoint
CREATE INDEX "post_action_types_position_idx" ON "post_action_types" USING btree ("position");--> statement-breakpoint
CREATE INDEX "post_actions_post_id_idx" ON "post_actions" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_actions_user_id_idx" ON "post_actions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "post_actions_post_id_user_id_type_idx" ON "post_actions" USING btree ("post_id","user_id","post_action_type_id");--> statement-breakpoint
CREATE INDEX "post_revisions_post_id_idx" ON "post_revisions" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_revisions_post_id_number_idx" ON "post_revisions" USING btree ("post_id","number");--> statement-breakpoint
CREATE INDEX "post_revisions_created_at_idx" ON "post_revisions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "posts_user_id_idx" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "posts_topic_id_idx" ON "posts" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "posts_topic_id_post_number_idx" ON "posts" USING btree ("topic_id","post_number");--> statement-breakpoint
CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "posts_hidden_idx" ON "posts" USING btree ("hidden");--> statement-breakpoint
CREATE INDEX "tag_group_memberships_tag_id_group_id_idx" ON "tag_group_memberships" USING btree ("tag_id","tag_group_id");--> statement-breakpoint
CREATE INDEX "tag_group_memberships_tag_group_id_idx" ON "tag_group_memberships" USING btree ("tag_group_id");--> statement-breakpoint
CREATE INDEX "tag_groups_name_idx" ON "tag_groups" USING btree ("name");--> statement-breakpoint
CREATE INDEX "tag_users_tag_id_user_id_idx" ON "tag_users" USING btree ("tag_id","user_id");--> statement-breakpoint
CREATE INDEX "tag_users_user_id_idx" ON "tag_users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "tags_topic_count_idx" ON "tags" USING btree ("topic_count");--> statement-breakpoint
CREATE INDEX "topic_tags_topic_id_tag_id_idx" ON "topic_tags" USING btree ("topic_id","tag_id");--> statement-breakpoint
CREATE INDEX "topic_tags_tag_id_idx" ON "topic_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "topic_tags_topic_id_idx" ON "topic_tags" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "topic_users_user_id_topic_id_idx" ON "topic_users" USING btree ("user_id","topic_id");--> statement-breakpoint
CREATE INDEX "topic_users_topic_id_idx" ON "topic_users" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "topic_users_notification_level_idx" ON "topic_users" USING btree ("notification_level");--> statement-breakpoint
CREATE INDEX "topics_slug_idx" ON "topics" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "topics_user_id_idx" ON "topics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "topics_category_id_idx" ON "topics" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "topics_bumped_at_idx" ON "topics" USING btree ("bumped_at");--> statement-breakpoint
CREATE INDEX "topics_last_posted_at_idx" ON "topics" USING btree ("last_posted_at");--> statement-breakpoint
CREATE INDEX "topics_pinned_idx" ON "topics" USING btree ("pinned");--> statement-breakpoint
CREATE INDEX "topics_visible_idx" ON "topics" USING btree ("visible");--> statement-breakpoint
CREATE INDEX "trust_level_grants_user_id_idx" ON "trust_level_grants" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "trust_level_grants_trust_level_idx" ON "trust_level_grants" USING btree ("trust_level");--> statement-breakpoint
CREATE INDEX "trust_level_grants_granted_by_id_idx" ON "trust_level_grants" USING btree ("granted_by_id");--> statement-breakpoint
CREATE INDEX "user_action_types_name_idx" ON "user_action_types" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_badges_user_id_badge_id_idx" ON "user_badges" USING btree ("user_id","badge_id");--> statement-breakpoint
CREATE INDEX "user_badges_badge_id_idx" ON "user_badges" USING btree ("badge_id");--> statement-breakpoint
CREATE INDEX "user_badges_user_id_idx" ON "user_badges" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_badges_featured_idx" ON "user_badges" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "user_emails_user_id_idx" ON "user_emails" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_emails_email_idx" ON "user_emails" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_profiles_user_id_idx" ON "user_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_active_idx" ON "users" USING btree ("active");--> statement-breakpoint
CREATE INDEX "users_last_seen_at_idx" ON "users" USING btree ("last_seen_at");