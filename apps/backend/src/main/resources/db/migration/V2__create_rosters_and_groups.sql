CREATE TABLE roster_groups
(
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    user_id         BIGINT       NOT NULL,
    parent_group_id BIGINT       NULL,
    name            VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    CONSTRAINT fk_roster_groups_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_roster_groups_parent
        FOREIGN KEY (parent_group_id) REFERENCES roster_groups (id)
        ON DELETE RESTRICT,

    INDEX idx_roster_groups_user_parent (user_id, parent_group_id),
    INDEX idx_roster_groups_parent (parent_group_id)
);

CREATE TABLE rosters
(
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    user_id         BIGINT       NOT NULL,
    group_id        BIGINT       NULL,
    general_unit_id BIGINT       NULL,
    name            VARCHAR(255) NOT NULL,
    army_list_id    VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    CONSTRAINT fk_rosters_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_rosters_group
        FOREIGN KEY (group_id) REFERENCES roster_groups (id)
        ON DELETE RESTRICT,

    INDEX idx_rosters_user_group (user_id, group_id),
    INDEX idx_rosters_group (group_id)
);

CREATE TABLE warbands
(
    id         BIGINT NOT NULL AUTO_INCREMENT,
    roster_id  BIGINT NOT NULL,
    sort_index INT    NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    CONSTRAINT fk_warbands_roster
        FOREIGN KEY (roster_id) REFERENCES rosters (id)
        ON DELETE CASCADE,

    INDEX idx_warbands_roster_sort (roster_id, sort_index)
);

CREATE TABLE roster_units
(
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    warband_id BIGINT       NOT NULL,
    profile_id VARCHAR(255) NOT NULL,
    quantity   INT          NOT NULL,
    is_leader  BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_index INT          NOT NULL DEFAULT 0,

    PRIMARY KEY (id),
    CONSTRAINT fk_roster_units_warband
        FOREIGN KEY (warband_id) REFERENCES warbands (id)
        ON DELETE CASCADE,
    CONSTRAINT ck_roster_units_quantity
        CHECK (quantity >= 1),
    CONSTRAINT ck_roster_units_leader_quantity
        CHECK (is_leader = FALSE OR quantity = 1),

    INDEX idx_roster_units_warband_sort (warband_id, sort_index)
);

CREATE TABLE roster_unit_options
(
    unit_id   BIGINT       NOT NULL,
    option_id VARCHAR(255) NOT NULL,

    PRIMARY KEY (unit_id, option_id),
    CONSTRAINT fk_roster_unit_options_unit
        FOREIGN KEY (unit_id) REFERENCES roster_units (id)
        ON DELETE CASCADE
);

ALTER TABLE rosters
    ADD CONSTRAINT fk_rosters_general_unit
        FOREIGN KEY (general_unit_id) REFERENCES roster_units (id)
        ON DELETE SET NULL;

CREATE INDEX idx_rosters_general_unit
    ON rosters (general_unit_id);
