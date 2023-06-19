-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Июн 20 2023 г., 00:37
-- Версия сервера: 10.4.28-MariaDB
-- Версия PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ilyaizr_maps`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cities`
--

CREATE TABLE `cities` (
  `code` varchar(18) NOT NULL,
  `rating` decimal(6,5) NOT NULL,
  `amount` mediumint(9) NOT NULL,
  `lat` decimal(8,5) NOT NULL,
  `lng` decimal(8,5) NOT NULL,
  `en` varchar(200) NOT NULL,
  `ru` varchar(200) NOT NULL,
  `geometry` multipolygon NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `cities`
--

-- --------------------------------------------------------

--
-- Структура таблицы `feedback`
--

CREATE TABLE `feedback` (
  `comment` text NOT NULL,
  `date` int(11) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Дамп данных таблицы `feedback`
--

-- --------------------------------------------------------

--
-- Структура таблицы `friends`
--

CREATE TABLE `friends` (
  `id1` varchar(70) NOT NULL,
  `id2` varchar(70) NOT NULL,
  `status1` tinyint(1) NOT NULL,
  `status2` tinyint(1) NOT NULL,
  `timestamp` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `friends`
--


-- --------------------------------------------------------

--
-- Структура таблицы `places`
--

CREATE TABLE `places` (
  `rating` decimal(6,5) NOT NULL,
  `amount` int(11) NOT NULL,
  `x` mediumint(9) NOT NULL,
  `y` mediumint(9) NOT NULL,
  `lng` decimal(9,6) NOT NULL,
  `lat` decimal(9,6) NOT NULL,
  `polygon` multipolygon NOT NULL,
  `id` varchar(24) NOT NULL,
  `name` varchar(320) NOT NULL,
  `iso_3166_2` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `places`
--

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `targetId` varchar(24) NOT NULL,
  `author` varchar(32) NOT NULL,
  `grade` tinyint(4) NOT NULL,
  `comment` text NOT NULL,
  `timestamp` bigint(11) NOT NULL,
  `anonId` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `reviews`
--


-- --------------------------------------------------------

--
-- Структура таблицы `tags`
--

CREATE TABLE `tags` (
  `tagPlace` varchar(100) NOT NULL,
  `tag` varchar(80) NOT NULL,
  `placeId` varchar(24) NOT NULL,
  `amount` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `tags`
--


-- --------------------------------------------------------

--
-- Структура таблицы `tagsindex`
--

CREATE TABLE `tagsindex` (
  `tag` varchar(180) NOT NULL,
  `amount` mediumint(9) NOT NULL,
  `created` bigint(20) NOT NULL,
  `creator` varchar(70) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `tagsindex`
--


-- --------------------------------------------------------

--
-- Структура таблицы `users`
-- dont forget to hash pwords
--

CREATE TABLE `users` (
  `id` varchar(70) NOT NULL,
  `login` tinytext NOT NULL,
  `pword` tinytext NOT NULL,
  `name` tinytext NOT NULL,
  `commentsn` mediumint(9) NOT NULL DEFAULT 0,
  `level` tinyint(4) NOT NULL DEFAULT 1,
  `avatar` varchar(511) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

-- --------------------------------------------------------

--
-- Структура таблицы `visits`
--

CREATE TABLE `visits` (
  `time` bigint(20) NOT NULL,
  `amount` mediumint(9) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `info` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `visits`
--


--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`code`);

--
-- Индексы таблицы `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD UNIQUE KEY `uq_target_author_anonId` (`targetId`,`author`,`anonId`);

--
-- Индексы таблицы `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tagPlace`);

--
-- Индексы таблицы `tagsindex`
--
ALTER TABLE `tagsindex`
  ADD PRIMARY KEY (`tag`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`ip`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
