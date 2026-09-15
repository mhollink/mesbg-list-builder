CREATE TABLE users
(
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    keycloak_subject VARCHAR(255) NOT NULL,
    email            VARCHAR(320) NOT NULL,
    created_at       TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    CONSTRAINT uk_users_keycloak_subject UNIQUE (keycloak_subject)
);