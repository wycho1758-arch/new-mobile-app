CREATE TABLE IF NOT EXISTS "counter_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
