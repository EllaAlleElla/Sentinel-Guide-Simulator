// 能力评级

// 获取百分比
setup.getPercent = function(name, value) {
    var limits = setup.statLimits[name] || [0, 100];
    var max = limits[1];
    return Math.floor(value / max * 100);
};

// 需要评级的属性白名单
setup.rankableStats = [
  "Appearance",
  "Empathy",
  "Negotiation",
  "Willpower",
  "Resilience",
  "Intelligence",
  "Perception",
  "Apitude",
  "Build",
  "Endurance",
  "Speed",
  "Strength",
  "SpiritualPowerLimit",
  "PsychicBondSkillLevel",
  "GunSkillLevel",
  "FightSkillLevel",
  "StrategySkillLevel",
  "ScoutingSkillLevel",
  "RescueSkillLevel",
  "CommunicateSkillLevel",
  "CalmSkillLevel"
];

// 根据百分比获取评级
setup.getRank = function(percent) {
    if (percent >= 80) return "S";
    if (percent >= 60) return "A";
    if (percent >= 40) return "B";
    if (percent >= 20) return "C";
    return "D";
};

// 获取到下一级的进度
setup.getRankProgress = function(percent) {
    var thresholds = [0, 20, 40, 60, 80, 100];
    for (var i = 1; i < thresholds.length; i++) {
        if (percent < thresholds[i]) {
            var min = thresholds[i - 1];
            var max = thresholds[i];
            return Math.floor((percent - min) / (max - min) * 100);
        }
    }
    return 100;
};

// 获取评级颜色
setup.getRankColor = function(percent) {
    if (percent >= 80) return "gold";
    if (percent >= 60) return "green";
    if (percent >= 40) return "blue";
    if (percent >= 20) return "purple";
    return "gray";
};

setup.getPlayerRank = function() {
    var s = State.variables.rankCount["S"];
    var a = State.variables.rankCount["A"];
    var b = State.variables.rankCount["B"];
    
    if (s >= 5) return "S";
    if (s >= 3 || a >= 5) return "A";
    if (a >= 3 || b >= 5) return "B";
    if (b >= 3) return "C";
    return "D";
};


// 更新玩家评级
setup.calculateFinalRank = function(counts) {
    // --- 第一优先级：特质检测 ---
    // 从 SugarCube 的变量中获取玩家当前的特质列表
    var gainedTraits = State.variables.GainedTraits;
    
    // 如果特质列表存在且长度大于 0，直接判定为 S 级
    if (gainedTraits && gainedTraits.length > 0) {
        return "S";
    }

    // --- 第二优先级：分数与硬性指标判定 ---
    // 1. 定义每个等级的分值
    var weights = {
        "S": 10,
        "A": 5,
        "B": 3,
        "C": 1,
        "D": 0
    };

    // 2. 计算总分
    var totalScore = 0;
    for (var r in counts) {
        totalScore += (counts[r] * (weights[r] || 0));
    }

    // 3. 根据总分和硬性单项指标判定最终级别
    
    // 判定 S 级：总分满 30 且 至少有一个单项是 S
    if (totalScore >= 30 && counts["S"] > 0) {
        return "S";
    }
    
    // 判定 A 级：总分满 20 且 至少有一个 A (或更高级的 S)
    if (totalScore >= 20 && (counts["A"] > 0 || counts["S"] > 0)) {
        return "A";
    }
    
    // 判定 B 级：总分满 12
    if (totalScore >= 12) {
        return "B";
    }
    
    // 判定 C 级：总分满 5
    if (totalScore >= 5) {
        return "C";
    }
    
    // 默认 D 级
    return "D";
};