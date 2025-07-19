CREATE TABLE "blog_post" (
	"serial" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"link" varchar NOT NULL,
	"reactionCount" varchar,
	"commentCount" varchar,
	"readTime" varchar,
	"tags" text[],
	"comments" text[],
	"scraped_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp NOT NULL,
	"post_hash" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clustered_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_post_id" integer NOT NULL,
	"cluster_type" varchar NOT NULL,
	"cluster_label" varchar NOT NULL,
	"cluster_tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clustered_post" ADD CONSTRAINT "clustered_post_blog_post_id_blog_post_serial_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_post"("serial") ON DELETE cascade ON UPDATE no action;