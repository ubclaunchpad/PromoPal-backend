--
-- PostgreSQL database dump
--

-- Dumped from database version 12.4 (Debian 12.4-1.pgdg100+1)
-- Dumped by pg_dump version 12.4 (Debian 12.4-1.pgdg100+1)

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

--
-- Name: foodies; Type: DATABASE; Schema: -; Owner: admin
--

CREATE DATABASE foodies WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE foodies OWNER TO admin;

\connect foodies

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: discount; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.discount (
    discount_id integer NOT NULL,
    discount_type character varying(20),
    discount_value integer
);


ALTER TABLE public.discount OWNER TO admin;

--
-- Name: promotion; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.promotion (
    promotion_id integer NOT NULL,
    restaurant_id integer,
    discount integer,
    name character varying(50),
    description character varying(100),
    date_added timestamp with time zone,
    end_date date,
    price_range character varying(20)
);


ALTER TABLE public.promotion OWNER TO admin;

--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.restaurant (
    restaurant_id integer NOT NULL,
    name character varying(50),
    address character varying(50)
);


ALTER TABLE public.restaurant OWNER TO admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(20),
    last_name character varying(20),
    email character varying(30),
    username character varying(20) NOT NULL,
    password character varying(20) NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: discount discount_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (discount_id);


--
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (promotion_id);


--
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (restaurant_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: promotion promotion_discount_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_discount_fkey FOREIGN KEY (discount) REFERENCES public.discount(discount_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion promotion_restaurant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(restaurant_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

