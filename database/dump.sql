--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10
-- Dumped by pg_dump version 10.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.photos DROP CONSTRAINT photos_pkey;
ALTER TABLE ONLY public.likes DROP CONSTRAINT "likes_userId_photoId_key";
ALTER TABLE ONLY public.follows DROP CONSTRAINT "follows_followerId_followingId_key";
ALTER TABLE public.users ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE public.photos ALTER COLUMN "photoId" DROP DEFAULT;
ALTER TABLE public.comments ALTER COLUMN "commentId" DROP DEFAULT;
ALTER TABLE public.bookmarks ALTER COLUMN "bookmarkId" DROP DEFAULT;
DROP SEQUENCE public."users_userId_seq";
DROP TABLE public.users;
DROP SEQUENCE public."photos_photoId_seq";
DROP TABLE public.photos;
DROP TABLE public.likes;
DROP TABLE public.follows;
DROP SEQUENCE public."comments_commentId_seq";
DROP TABLE public.comments;
DROP SEQUENCE public."bookmarks_bookmarkId_seq";
DROP TABLE public.bookmarks;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmarks (
    "bookmarkId" integer NOT NULL,
    "userId" integer NOT NULL,
    "photoId" integer NOT NULL
);


--
-- Name: bookmarks_bookmarkId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."bookmarks_bookmarkId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookmarks_bookmarkId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."bookmarks_bookmarkId_seq" OWNED BY public.bookmarks."bookmarkId";


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    "userId" integer NOT NULL,
    "photoId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL,
    content text NOT NULL,
    "commentId" integer NOT NULL
);


--
-- Name: comments_commentId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."comments_commentId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_commentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."comments_commentId_seq" OWNED BY public.comments."commentId";


--
-- Name: follows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follows (
    "followerId" integer NOT NULL,
    "followingId" integer NOT NULL
);


--
-- Name: likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.likes (
    "userId" integer NOT NULL,
    "photoId" integer NOT NULL
);


--
-- Name: photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.photos (
    "photoId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT now() NOT NULL,
    filename text NOT NULL,
    location character varying(50)
);


--
-- Name: photos_photoId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."photos_photoId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photos_photoId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."photos_photoId_seq" OWNED BY public.photos."photoId";


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    "userId" integer NOT NULL,
    username text NOT NULL
);


--
-- Name: users_userId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."users_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."users_userId_seq" OWNED BY public.users."userId";


--
-- Name: bookmarks bookmarkId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN "bookmarkId" SET DEFAULT nextval('public."bookmarks_bookmarkId_seq"'::regclass);


--
-- Name: comments commentId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN "commentId" SET DEFAULT nextval('public."comments_commentId_seq"'::regclass);


--
-- Name: photos photoId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photos ALTER COLUMN "photoId" SET DEFAULT nextval('public."photos_photoId_seq"'::regclass);


--
-- Name: users userId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN "userId" SET DEFAULT nextval('public."users_userId_seq"'::regclass);


--
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookmarks ("bookmarkId", "userId", "photoId") FROM stdin;
2	3	2
3	4	4
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comments ("userId", "photoId", "createdAt", content, "commentId") FROM stdin;
3	5	2019-10-23 23:17:24.853386+00	Your mom likes turtles...	3
4	5	2019-10-23 23:18:11.878381+00	Shut up, all of you!	4
2	5	2019-10-23 23:28:49.620328+00	Some turtles can live for over 100 years.	5
1	5	2019-10-23 23:34:27.056644+00	That's amazing!!!	7
1	5	2019-10-23 23:08:54.014864+00	I like turtles.	2
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follows ("followerId", "followingId") FROM stdin;
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.likes ("userId", "photoId") FROM stdin;
3	3
1	3
1	5
2	5
3	5
4	4
\.


--
-- Data for Name: photos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.photos ("photoId", "userId", "createdAt", filename, location) FROM stdin;
2	1	2019-10-23 19:37:20.781836+00	d6f1538e-38a5-4d17-bd72-9543f7429a15.jpg	LearningFuze
3	2	2019-10-23 19:38:16.986706+00	2fd5f68b-bad1-42c1-89b2-7afab0a98910.jpg	Starbucks Irvine Spectrum
4	3	2019-10-23 19:38:38.570451+00	43be2e39-9ac4-4753-b47a-558c7e9f517c.jpg	Your moms house
5	1	2019-10-23 19:42:08.989278+00	15d79e21-254e-4fa9-ba9d-6cde02b8b592.jpg	WeWork Antarctica
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users ("userId", username) FROM stdin;
1	thebearingedge
2	TimelikeClosure
3	Zhiwutian
4	scbowler
\.


--
-- Name: bookmarks_bookmarkId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."bookmarks_bookmarkId_seq"', 3, true);


--
-- Name: comments_commentId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."comments_commentId_seq"', 7, true);


--
-- Name: photos_photoId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."photos_photoId_seq"', 5, true);


--
-- Name: users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."users_userId_seq"', 4, true);


--
-- Name: follows follows_followerId_followingId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT "follows_followerId_followingId_key" UNIQUE ("followerId", "followingId");


--
-- Name: likes likes_userId_photoId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT "likes_userId_photoId_key" UNIQUE ("userId", "photoId");


--
-- Name: photos photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photos
    ADD CONSTRAINT photos_pkey PRIMARY KEY ("photoId");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("userId");


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

