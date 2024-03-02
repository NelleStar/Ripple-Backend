\echo 'Delete and recreate ripple db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE ripple;
CREATE DATABASE ripple;
\connect ripple

\i ripple-schema.sql
\i ripple-seed.sql

\echo 'Delete and recreate ripple_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE ripple_test;
CREATE DATABASE ripple_test;
\connect ripple_test

\i ripple-schema.sql