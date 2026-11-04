package com.mesbg.listbuilder.armies.roster.service;

import com.mesbg.listbuilder.armies.roster.persistence.RosterUnitRepository;
import com.mesbg.listbuilder.armies.roster.persistence.model.RosterUnitEntity;
import com.mesbg.listbuilder.armies.roster.persistence.model.WarbandEntity;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
class FollowerLoadoutReconciler {

  private final RosterUnitRepository rosterUnitRepository;

  List<RosterUnitEntity> reconcile(
      WarbandEntity warband, String profileId, Map<Set<String>, Integer> desired) {

    var candidates = findCandidates(warband, profileId, desired.keySet());
    var result = new ArrayList<RosterUnitEntity>();

    int nextIndex =
        warband.getUnits().stream().mapToInt(RosterUnitEntity::getSortIndex).max().orElse(-1) + 1;

    for (var entry : desired.entrySet()) {
      var options = entry.getKey();
      var quantity = entry.getValue();

      var existing = candidates.take(options);

      if (existing != null) {
        result.add(update(existing, options, quantity));
      } else {
        result.add(create(warband, profileId, options, quantity, nextIndex++));
      }
    }

    warband.getUnits().removeAll(candidates.remaining());

    return result;
  }

  private LoadoutCandidates findCandidates(
      WarbandEntity warband, String profileId, Set<Set<String>> desiredOptions) {

    var exact = new HashMap<Set<String>, RosterUnitEntity>();
    Deque<RosterUnitEntity> reusable = new ArrayDeque<>();

    warband.getUnits().stream()
        .filter(unit -> !unit.isLeader())
        .filter(unit -> profileId.equals(unit.getArmyListProfileId()))
        .sorted(Comparator.comparingInt(RosterUnitEntity::getSortIndex))
        .forEach(
            unit -> {
              var options = Set.copyOf(unit.getOptionIds());

              if (desiredOptions.contains(options) && !exact.containsKey(options)) {
                exact.put(options, unit);
              } else {
                reusable.addLast(unit);
              }
            });

    return new LoadoutCandidates(exact, reusable);
  }

  private RosterUnitEntity update(RosterUnitEntity unit, Set<String> options, int quantity) {

    unit.setQuantity(quantity);

    if (!unit.getOptionIds().equals(options)) {
      unit.getOptionIds().clear();
      unit.getOptionIds().addAll(options);
    }

    return unit;
  }

  private RosterUnitEntity create(
      WarbandEntity warband, String profileId, Set<String> options, int quantity, int sortIndex) {

    var unit = new RosterUnitEntity(warband, profileId, quantity, false, sortIndex);

    unit.getOptionIds().addAll(options);
    warband.getUnits().add(unit);

    return rosterUnitRepository.save(unit);
  }

  private record LoadoutCandidates(
      Map<Set<String>, RosterUnitEntity> exact, Deque<RosterUnitEntity> reusable) {

    RosterUnitEntity take(Set<String> options) {
      var match = exact.remove(options);

      return match != null ? match : reusable.pollFirst();
    }

    Collection<RosterUnitEntity> remaining() {
      return reusable;
    }
  }
}
