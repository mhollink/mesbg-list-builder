package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.armies.roster.persistence.model.RosterEntity;
import com.mesbg.listbuilder.armies.roster.service.statistics.RosterStatistics;

public record RosterSnapshot(RosterEntity roster, RosterStatistics statistics) {}
