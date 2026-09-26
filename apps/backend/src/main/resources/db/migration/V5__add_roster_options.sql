CREATE TABLE roster_options
(
    roster_id BIGINT       NOT NULL,
    option_id VARCHAR(255) NOT NULL,

    PRIMARY KEY (roster_id, option_id),

    CONSTRAINT fk_roster_options_roster
        FOREIGN KEY (roster_id)
            REFERENCES rosters (id)
            ON DELETE CASCADE
);