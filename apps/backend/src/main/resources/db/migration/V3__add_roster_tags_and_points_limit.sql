ALTER TABLE rosters
    ADD COLUMN points_limit INT NULL;

ALTER TABLE rosters
    ADD CONSTRAINT chk_rosters_points_limit
        CHECK (points_limit IS NULL OR points_limit > 0);

CREATE TABLE roster_tags
(
    roster_id BIGINT      NOT NULL,
    tag       VARCHAR(64) NOT NULL,

    PRIMARY KEY (roster_id, tag),

    CONSTRAINT fk_roster_tags_roster
        FOREIGN KEY (roster_id)
            REFERENCES rosters (id)
            ON DELETE CASCADE
);

CREATE INDEX idx_roster_tags_tag
    ON roster_tags (tag);