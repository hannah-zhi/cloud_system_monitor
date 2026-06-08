const riskMeta = {
  high: { label: "高风险", className: "high", tone: "tone-danger", color: "#ff3d59", order: 0 },
  mid: { label: "中风险", className: "mid", tone: "tone-warn", color: "#f4a51c", order: 1 },
  low: { label: "低风险", className: "low", tone: "tone-ok", color: "#13c781", order: 2 },
  healthy: { label: "健康", className: "healthy", tone: "tone-blue", color: "#1689ff", order: 3 },
};

const commMeta = {
  ok: { label: "通讯正常", tone: "tone-ok", color: "#13c781" },
  partial: { label: "部分通讯中断", tone: "tone-warn", color: "#f4a51c" },
  down: { label: "通讯中断", tone: "tone-danger", color: "#ff3d59" },
  offline: { label: "离线", tone: "tone-muted", color: "#7c8799" },
};

const stationAlarmMeta = {
  alarm: { label: "告警", color: "#f4a51c", className: "alarm" },
  fault: { label: "故障", color: "#ff3d59", className: "fault" },
  none: { label: "无告警", color: "#7c8799", className: "none" },
};

const stationNames = [
  "远景乌兰察布关键节点电站",
  "枣庄市峄城石膏矿沉陷区",
  "华润电力罗山",
  "新干县盐化",
  "华润电力蒲川",
  "龙泉甘肃张掖",
  "淮阳县聚能50MW风电项目",
  "渝水区江口",
  "青海共和塔拉滩",
  "怀仁金沙滩",
  "准格尔旗纳日松",
  "嘉峪关镜铁山",
  "鄂尔多斯达拉特",
  "张北柔直配储",
  "酒泉肃北马鬃山",
  "盐城大丰沿海",
  "乌兰察布后旗",
  "榆林靖边风光储",
  "通辽霍林郭勒",
  "阿拉善腾格里",
];

const stationTypeLabels = ["配套储能", "独立储能", "工商业储能"];
const alarmSourceLabels = ["云端预警", "站端预警", "设备告警"];
const homeAlarmSourceLabels = ["云端预警", "站端预警", "设备告警", "数据告警"];
const alarmOverviewDonutOptions = {
  radius: 48,
  lineWidth: 28,
  font: "18px Microsoft YaHei",
  centerYOffset: 6,
};

const state = {
  stations: [],
  filtered: [],
  alarms: [],
  allAlarms: [],
  homeDataAlarms: [],
  activeAlarmType: "all",
  activeAlarmDays: "all",
  alarmStartDate: "",
  alarmEndDate: "",
  sosMin: 0,
  sosMax: 100,
  detailAlarmType: "all",
  detailAlarmDays: "all",
  detailAlarmStartDate: "",
  detailAlarmEndDate: "",
  activePage: "overview",
  selectedAlarm: null,
  selectedAlarmGroup: null,
  activeModalAlarmId: null,
  alarmProcessMode: null,
  alarmProcessBatch: false,
  alarmProcessBatchGroups: [],
  detailAlarmSelectedIds: new Set(),
  detailAlarmSelectionMode: false,
  detailAlarmContextId: null,
  riskTrendRange: 7,
  riskBarHitboxes: [],
  riskTrendHitboxes: [],
  riskBarHoverId: null,
  riskTrendHover: null,
  overviewPowerHitboxes: [],
  overviewPowerHover: null,
  overviewPowerHighlight: null,
  overviewChargeHitboxes: [],
  overviewChargeHover: null,
  overviewChargeHighlight: null,
  subsystemDiagnosisTrendHitboxes: [],
  subsystemDiagnosisTrendHover: null,
  subsystemDiagnosisTrendSeries: new Set(["charge", "discharge"]),
  subsystemDiagnosisTrendHighlight: null,
  subsystemDiagnosisStartDate: "2025-05-01",
  subsystemDiagnosisEndDate: "2025-05-15",
  partAnalysisHitboxes: [],
  partAnalysisHover: null,
  overviewPowerStartDate: "2026-02-03",
  overviewPowerEndDate: "2026-02-13",
  overviewChargeStartDate: "2026-02-03",
  overviewChargeEndDate: "2026-02-13",
  riskBarSort: "sosAsc",
  alarmTrendHitboxes: [],
  detailBoxHitboxes: [],
  detailTrendHitboxes: [],
  detailTrendHover: null,
  detailBarHitboxes: [],
  detailBarHoverName: null,
  detailSubsystems: [],
  detailTableSort: { key: "score", direction: "asc" },
  alarmDetailSelections: {
    code: new Set(),
    level: new Set(),
    module: new Set(),
    name: new Set(),
    station: new Set(),
    location: new Set(),
    status: new Set(),
    source: new Set(),
  },
  activeFilter: "all",
  activeAlarmSource: "all",
  activeHomeAlarmCategory: "all",
  activeHomeAlarmSubfilter: "all",
  detailAlarmSource: "all",
  detailAlarmCategory: "all",
  detailAlarmSubfilter: "all",
  overviewSortMode: "sosAsc",
  chargeStatWindow: "day",
  cardsCollapsed: false,
  selectedStationIds: new Set(),
  selectedStation: null,
  selectedSubsystemNo: null,
  subsystemPageMode: "overview",
  subsystemPartFilter: null,
  detailTab: "overview",
  trendRange: 7,
  sortSubsystemMode: "idAsc",
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  state.stations = createStations();
  state.allAlarms = createAlarms(state.stations);
  state.homeDataAlarms = createDataAlarms(state.stations);
  renderAlarmDetailFilters();
  renderFilters();
  applyFilters();
  bindEvents();
  openPageFromUrl();
  openStationFromUrl();
  tickClock();
  setInterval(tickClock, 1000);
});

function bindElements() {
  [
    "stationGrid",
    "searchInput",
    "stationPickerMenu",
    "stationPickerList",
    "stationSelector",
    "overviewSortControl",
    "overviewSortButton",
    "overviewSortMenu",
    "overviewSortSelect",
    "overviewSortLabel",
    "sosMinInput",
    "sosMaxInput",
    "sosMinRange",
    "sosMaxRange",
    "sosRangeFill",
    "statusFilters",
    "selectedCount",
    "resultText",
    "collapseCardsBtn",
    "clearFilterBtn",
    "pageTabs",
    "listView",
    "riskView",
    "alarmDetailView",
    "detailView",
    "backBtn",
    "detailTitle",
    "detailSectionTabs",
    "detailOverviewTab",
    "detailDiagnosisTab",
    "detailHealthTab",
    "stationOverviewPanel",
    "overviewPowerCanvas",
    "overviewPowerTooltip",
    "overviewChargeCanvas",
    "overviewChargeTooltip",
    "detailComm",
    "detailRisk",
    "detailSos",
    "detailAlarmSubtitle",
    "detailAlarmTabs",
    "detailAlarmTimeButtons",
    "detailAlarmStartDate",
    "detailAlarmEndDate",
    "detailAlarmList",
    "detailAlarmCountAll",
    "detailAlarmCountLevel1",
    "detailAlarmCountLevel2",
    "detailAlarmCountLevel3",
    "detailAlarmCloudCount",
    "detailAlarmStationCount",
    "gauge",
    "gaugeValue",
    "gaugeLabel",
    "rangeButtons",
    "subsystemSortBtn",
    "alertTable",
    "detailTrendChart",
    "detailTrendTooltip",
    "detailBarsViewport",
    "detailBarsTooltip",
    "donutLegend",
    "alarmTabs",
    "alarmList",
    "alarmTimeButtons",
    "alarmStartDate",
    "alarmEndDate",
    "alarmCountAll",
    "alarmCountLevel1",
    "alarmCountLevel2",
    "alarmCountLevel3",
    "alarmCloudCount",
    "alarmStationCount",
    "alarmDetailJump",
    "riskAvgSos",
    "riskAvgGauge",
    "riskTopList",
    "riskTrendButtons",
    "riskBarSort",
    "riskBarsViewport",
    "riskBarsTooltip",
    "riskTrendChart",
    "riskTrendTooltip",
    "riskPieLegend",
    "riskAlarmPieLegend",
    "riskAlarmSourcePieLegend",
    "riskModuleLegend",
    "riskAlarmNameTopList",
    "alarmDetailName",
    "alarmDetailCode",
    "alarmDetailStation",
    "alarmDetailLocation",
    "alarmDetailStatus",
    "alarmDetailLevel",
    "alarmDetailModule",
    "alarmDetailSource",
    "alarmDetailStart",
    "alarmDetailEnd",
    "alarmDetailReset",
    "alarmDetailCount",
    "alarmDetailTable",
    "alarmRowContextMenu",
    "alarmMultiSelectBtn",
    "alarmBatchBar",
    "alarmBatchCount",
    "alarmBatchAction",
    "alarmBatchCancel",
    "alarmSelectionToast",
    "alarmInspectorBody",
    "alarmDetailModal",
    "alarmModalMask",
    "alarmModalClose",
    "alarmTrendChart",
    "alarmTrendTooltip",
    "alarmProcessBtn",
    "alarmAnalysisBtn",
    "alarmProcessModal",
    "alarmProcessModalMask",
    "alarmProcessModalClose",
    "alarmProcessPanel",
    "boxChartWrap",
    "boxTooltip",
    "clock",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
  els.trendCanvas = document.getElementById("trendCanvas");
  els.donutCanvas = document.getElementById("donutCanvas");
  els.barCanvas = document.getElementById("barCanvas");
  els.boxCanvas = document.getElementById("boxCanvas");
  els.gaugeCanvas = document.getElementById("gaugeCanvas");
  els.riskBarsCanvas = document.getElementById("riskBarsCanvas");
  els.riskAvgGaugeCanvas = document.getElementById("riskAvgGaugeCanvas");
  els.riskPieCanvas = document.getElementById("riskPieCanvas");
  els.riskTrendCanvas = document.getElementById("riskTrendCanvas");
  els.riskAlarmPieCanvas = document.getElementById("riskAlarmPieCanvas");
  els.riskAlarmSourcePieCanvas = document.getElementById("riskAlarmSourcePieCanvas");
  els.riskModuleCanvas = document.getElementById("riskModuleCanvas");
  els.alarmTrendCanvas = document.getElementById("alarmTrendCanvas");
}

function bindEvents() {
  els.pageTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button) return;
    showPage(button.dataset.page);
  });
  document.querySelectorAll(".nav-toggle, .nav-subtoggle").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.toggleTarget;
      if (!targetId) return;
      const group = button.closest(".nav-group, .nav-subgroup");
      if (!group) return;
      group.classList.toggle("is-open");
      button.setAttribute("aria-expanded", group.classList.contains("is-open") ? "true" : "false");
    });
  });
  els.searchInput.addEventListener("input", applyFilters);
  els.overviewSortSelect?.addEventListener("change", () => {
    state.overviewSortMode = els.overviewSortSelect.value;
    syncOverviewSortControl();
    applyFilters();
  });
  els.overviewSortControl?.addEventListener("click", (event) => {
    if (event.target.closest(".overview-sort-menu")) return;
    event.stopPropagation();
    toggleOverviewSortMenu();
  });
  els.overviewSortMenu?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-sort-value]");
    if (!button) return;
    setOverviewSortMode(button.dataset.sortValue);
    closeOverviewSortMenu();
    applyFilters();
  });
  els.searchInput.addEventListener("focus", () => {
    openStationPicker();
    renderStationPicker();
  });
  document.addEventListener("click", (event) => {
    if (!els.stationSelector.contains(event.target) && !els.stationPickerMenu.contains(event.target)) {
      closeStationPicker();
    }
    if (!els.overviewSortControl?.contains(event.target)) {
      closeOverviewSortMenu();
    }
    hideAlarmRowContextMenu();
  });
  window.addEventListener("resize", positionStationPicker);
  window.addEventListener("scroll", positionStationPicker, true);
  bindSosRangeEvents();
  els.collapseCardsBtn?.addEventListener("click", () => {
    state.cardsCollapsed = !state.cardsCollapsed;
    els.collapseCardsBtn.textContent = state.cardsCollapsed ? "展开" : "收起";
    els.collapseCardsBtn.setAttribute("aria-pressed", String(state.cardsCollapsed));
    renderStations(state.filtered);
  });
  els.clearFilterBtn.addEventListener("click", () => {
    state.activeFilter = "all";
    state.activeAlarmSource = "all";
    state.activeHomeAlarmCategory = "all";
    state.activeHomeAlarmSubfilter = "all";
    state.selectedStationIds.clear();
    setSosRange(0, 100, false);
    els.searchInput.value = "";
    applyFilters();
    renderFilters();
    renderStationPicker();
  });
  els.alarmTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-type]");
    if (!button) return;
    state.activeAlarmType = button.dataset.type;
    els.alarmTabs.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderAlarms();
  });
  els.alarmDetailJump?.addEventListener("click", () => showPage("alarm"));
  els.alarmTimeButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-days]");
    if (!button) return;
    state.activeAlarmDays = button.dataset.days;
    state.alarmStartDate = "";
    state.alarmEndDate = "";
    els.alarmStartDate.value = "";
    els.alarmEndDate.value = "";
    els.alarmTimeButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderAlarms();
  });
  [els.alarmStartDate, els.alarmEndDate].forEach((input) => {
    input.addEventListener("change", () => {
      state.activeAlarmDays = "custom";
      state.alarmStartDate = els.alarmStartDate.value;
      state.alarmEndDate = els.alarmEndDate.value;
      els.alarmTimeButtons.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      renderAlarms();
    });
  });
  els.detailAlarmTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-type]");
    if (!button) return;
    if (state.subsystemPageMode === "diagnosis" && state.selectedSubsystemNo) {
      state.detailAlarmCategory = "warning";
      state.detailAlarmSubfilter = button.dataset.type === "all" ? "all" : button.dataset.type;
    } else {
      state.detailAlarmType = button.dataset.type;
    }
    els.detailAlarmTabs.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    if (state.selectedStation) renderDetailAlarms(state.selectedStation);
  });
  els.detailAlarmTimeButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-days]");
    if (!button) return;
    state.detailAlarmDays = button.dataset.days;
    state.detailAlarmStartDate = "";
    state.detailAlarmEndDate = "";
    els.detailAlarmStartDate.value = "";
    els.detailAlarmEndDate.value = "";
    els.detailAlarmTimeButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    if (state.selectedStation) renderDetailAlarms(state.selectedStation);
  });
  [els.detailAlarmStartDate, els.detailAlarmEndDate].forEach((input) => {
    input.addEventListener("change", () => {
      state.detailAlarmDays = "custom";
      state.detailAlarmStartDate = els.detailAlarmStartDate.value;
      state.detailAlarmEndDate = els.detailAlarmEndDate.value;
      els.detailAlarmTimeButtons.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      if (state.selectedStation) renderDetailAlarms(state.selectedStation);
    });
  });
  [els.alarmDetailStart, els.alarmDetailEnd].forEach((input) => {
    input.addEventListener("input", renderAlarmDetailPage);
    input.addEventListener("change", renderAlarmDetailPage);
  });
  els.alarmDetailReset.addEventListener("click", () => {
    Object.values(state.alarmDetailSelections).forEach((set) => set.clear());
    els.alarmDetailStart.value = "";
    els.alarmDetailEnd.value = "";
    state.selectedAlarm = null;
    state.detailAlarmSelectedIds.clear();
    state.detailAlarmSelectionMode = false;
    renderAlarmDetailFilters();
    renderAlarmDetailPage();
  });
  els.alarmMultiSelectBtn?.addEventListener("click", enableAlarmSelectionMode);
  els.alarmBatchAction?.addEventListener("click", handleBatchAlarmProcess);
  els.alarmBatchCancel?.addEventListener("click", cancelAlarmSelectionMode);
  els.alarmModalClose.addEventListener("click", closeAlarmModal);
  els.alarmModalMask.addEventListener("click", closeAlarmModal);
  els.alarmProcessModalClose?.addEventListener("click", closeAlarmProcessModal);
  els.alarmProcessModalMask?.addEventListener("click", closeAlarmProcessModal);
  els.alarmProcessBtn?.addEventListener("click", () => {
    const latest = state.selectedAlarmGroup?.latest;
    state.alarmProcessMode = latest?.srCloseReason || latest?.pendingRootCause
      ? "srResult"
      : state.selectedAlarmGroup?.srCompleted
        ? "srClose"
        : state.selectedAlarmGroup?.srIssued
          ? "srSubmitted"
          : "choose";
    renderAlarmProcessPanel();
  });
  els.alarmAnalysisBtn?.addEventListener("click", () => {});
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (els.alarmProcessModal?.classList.contains("show")) closeAlarmProcessModal();
      else closeAlarmModal();
    }
  });
  els.alarmTrendCanvas.addEventListener("mousemove", handleAlarmTrendHover);
  els.alarmTrendCanvas.addEventListener("mouseleave", () => {
    els.alarmTrendTooltip.classList.remove("show");
  });
  els.boxCanvas.addEventListener("mousemove", handleBoxHover);
  els.boxCanvas.addEventListener("mouseleave", () => {
    els.boxTooltip.classList.remove("show");
  });
  els.trendCanvas.addEventListener("mousemove", handleDetailTrendHover);
  els.trendCanvas.addEventListener("mouseleave", () => {
    state.detailTrendHover = null;
    if (state.selectedStation) renderTrend(state.selectedStation, state.trendRange);
    els.detailTrendTooltip.classList.remove("show");
  });
  els.barCanvas.addEventListener("mousemove", handleDetailBarHover);
  els.barCanvas.addEventListener("mouseleave", () => {
    state.detailBarHoverName = null;
    if (state.selectedStation) renderBars(state.detailSubsystems);
    els.detailBarsTooltip.classList.remove("show");
  });
  document.querySelectorAll(".table-sort-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sortKey;
      state.detailTableSort = {
        key,
        direction: state.detailTableSort.key === key && state.detailTableSort.direction === "asc" ? "desc" : "asc",
      };
      if (state.selectedStation) renderTable();
    });
  });
  els.riskTrendButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-range]");
    if (!button) return;
    state.riskTrendRange = Number(button.dataset.range);
    els.riskTrendButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderRiskView();
  });
  els.riskBarsCanvas.addEventListener("mousemove", handleRiskBarHover);
  els.riskBarsCanvas.addEventListener("mouseleave", () => {
    state.riskBarHoverId = null;
    renderSafely(() => renderRiskBars(state.stations));
    els.riskBarsTooltip.classList.remove("show");
  });
  els.riskTrendCanvas.addEventListener("mousemove", handleRiskTrendHover);
  els.riskTrendCanvas.addEventListener("mouseleave", () => {
    state.riskTrendHover = null;
    renderSafely(() => renderRiskTrend(state.stations, state.riskTrendRange));
    els.riskTrendTooltip.classList.remove("show");
  });
  window.addEventListener("resize", syncDetailAlarmPanelHeight);
  els.stationOverviewPanel?.addEventListener("mousemove", handleOverviewChartHover);
  els.stationOverviewPanel?.addEventListener("mouseleave", (event) => {
    if (!event.relatedTarget || !els.stationOverviewPanel.contains(event.relatedTarget)) {
      state.overviewPowerHover = null;
      state.overviewChargeHover = null;
      state.subsystemDiagnosisTrendHover = null;
      state.partAnalysisHover = null;
      els.overviewPowerTooltip?.classList.remove("show");
      els.overviewChargeTooltip?.classList.remove("show");
      document.getElementById("subsystemDiagnosisTrendTooltip")?.classList.remove("show");
      document.getElementById("partAnalysisTooltip")?.classList.remove("show");
      if (state.selectedStation && state.selectedSubsystemNo && state.subsystemPageMode === "diagnosis") {
        const snapshot = subsystemSnapshot(state.selectedStation, state.selectedSubsystemNo);
        renderSubsystemDiagnosisTrend(snapshot);
        renderPartAnalysisCharts(snapshot);
      } else if (state.selectedStation) renderOverviewCharts(overviewChartStation());
    }
  });
  els.stationOverviewPanel?.addEventListener("click", handleOverviewDateClick);
  els.stationOverviewPanel?.addEventListener("change", handleOverviewDateChange);
  els.riskBarSort.addEventListener("change", () => {
    state.riskBarSort = els.riskBarSort.value;
    state.riskBarHoverId = null;
    renderRiskBars(state.stations);
  });
  els.backBtn.addEventListener("click", handleDetailBack);
  els.detailSectionTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-detail-tab]");
    if (!button) return;
    showDetailTab(button.dataset.detailTab);
  });
  els.rangeButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-range]");
    if (!button || !state.selectedStation) return;
    state.trendRange = Number(button.dataset.range);
    els.rangeButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderTrend(state.selectedStation, state.trendRange);
  });
  els.subsystemSortBtn.addEventListener("change", () => {
    if (!state.selectedStation) return;
    state.sortSubsystemMode = els.subsystemSortBtn.value;
    state.detailBarHoverName = null;
    renderBars(state.detailSubsystems);
  });
  window.addEventListener("resize", () => {
    renderStorageBundleLines();
    if (state.selectedStation) renderDetailCharts(state.selectedStation);
    if (state.activePage === "risk") renderRiskView();
  });
}

function createStations(count = 110) {
  const configuredStations = Array.isArray(window.SITE_CONFIG_STATIONS) ? window.SITE_CONFIG_STATIONS : null;
  if (configuredStations?.length) {
    return configuredStations.map((item, index) => createStationFromConfig(item, index, configuredStations.length));
  }
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const name = stationNames[index % stationNames.length];
    const sos = scoreFor(n);
    const risk = getRisk(sos);
    const comm = communicationStateForIndex(n);
    const run = operationStateForIndex(n, comm);
    const rated = round(1 + ((n * 7) % 18) * 0.55, 2);
    const ratedEnergy = round(rated * (1.75 + (n % 6) * 0.18), 2);
    const active = run === "充电" || run === "放电" ? round(rated * (0.32 + ((n % 9) / 16)), 2) : 0;
    const energy = round(0.35 + ((n * 19) % 112) / 10, 2);
    const soc = round(Math.min(99.6, Math.max(3.8, (energy / Math.max(rated, 1)) * 18 + ((n * 3) % 34))), 2);
    return {
      id: `K-${String(n).padStart(4, "0")}`,
      name: `${name}${n % 3 === 0 ? "项目" : ""}`,
      sos,
      risk,
      comm,
      run,
      rated,
      ratedEnergy,
      active,
      energy,
      soc,
      subsystemCount: 12 + (n % 9) * 2,
      stationType: stationTypeForIndex(index, count),
      alarms: Math.max(0, riskMeta[risk].order === 3 ? n % 2 : 3 + (n % 9)),
    };
  });
}

function createStationFromConfig(item, index, total) {
  const n = index + 1;
  const sos = scoreFor(n);
  const risk = getRisk(sos);
  const comm = communicationStateForIndex(n);
  const run = operationStateForIndex(n, comm);
  const rated = Number(item.ratedCapacity);
  const ratedEnergy = Number(item.ratedEnergy);
  const subsystemCount = Number(item.subsystemCount);
  return {
    id: item.projectNo,
    name: item.projectName,
    sos,
    risk,
    comm,
    run,
    rated,
    ratedEnergy,
    active: run === "充电" || run === "放电" ? round(rated * (0.32 + ((n % 9) / 16)), 2) : 0,
    energy: round(ratedEnergy * Math.min(0.98, 0.32 + ((n * 7) % 58) / 100), 2),
    soc: round(Math.min(99.6, Math.max(3.8, 18 + ((n * 11) % 78))), 2),
    subsystemCount,
    stationType: stationTypeForIndex(index, total),
    alarms: Math.max(0, riskMeta[risk].order === 3 ? n % 2 : 3 + (n % 9)),
  };
}

function stationTypeForIndex(index, total) {
  const pairedLimit = Math.round(total * 0.85);
  const independentLimit = pairedLimit + Math.round(total * 0.1);
  if (index < pairedLimit) return stationTypeLabels[0];
  if (index < independentLimit) return stationTypeLabels[1];
  return stationTypeLabels[2];
}

function communicationStateForIndex(n) {
  if (n % 2 === 0 || n % 23 === 0 || n % 41 === 0) return "offline";
  if (n % 13 === 0 || n % 17 === 0) return "down";
  if (n % 7 === 0 || n % 11 === 0) return "partial";
  return "ok";
}

function operationStateForIndex(n, comm) {
  if (comm === "offline") return "";
  if (n % 19 === 0 || (comm === "down" && n % 2 === 0)) return "停机";
  if (n % 7 === 0) return "充电";
  if (n % 5 === 0) return "待机";
  return "放电";
}

function createAlarms(stations) {
  if (!stations.length) return [];
  const templates = Array.isArray(window.RISK_LIST_TEMPLATES) ? window.RISK_LIST_TEMPLATES : [];
  const alarmTotal = 273;
  const alarms = Array.from({ length: alarmTotal }, (_, index) => {
      const station = stations[(index * 37) % stations.length];
      const template = pickRiskTemplate(templates, index);
      const type = levelToType(template.level);
      const date = new Date(2026, 3, 15 - (index % 45), 11 - (index % 3), 21 + (index % 36));
      const eventDate = new Date(date.getTime() - (8 + (index % 22)) * 60 * 1000);
      return {
        id: `${station.id}-${index}`,
        stationId: station.id,
        stationName: station.name,
        title: template.name,
        module: template.module,
        type,
        level: template.level,
        location: createAlarmLocation(template.locationFormat, station, index),
        source: alarmSourceForIndex(index, station),
        dateISO: formatDateInput(date),
        eventTime: formatFullDateTime(eventDate),
        warningTime: formatFullDateTime(date),
        time: `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
        status: "待处理",
        srIssued: false,
        srCompleted: false,
        srNo: "",
        workOrderNo: "",
        closeReason: "",
        closeRemark: "",
      };
    });

  const pairGroups = Math.min(20, Math.floor(alarms.length / 2));
  for (let i = 0; i < pairGroups; i += 1) {
    const firstIndex = i * 2;
    const secondIndex = firstIndex + 1;
    const first = alarms[firstIndex];
    const second = alarms[secondIndex];
    const pairId = `pair-${i + 1}`;
    const cloudWarningDate = new Date(2026, 3, 15 - ((i * 3) % 28), 9 + (i % 7), 8 + ((i * 11) % 40), 0);
    const cloudEventDate = new Date(cloudWarningDate.getTime() - (22 + (i % 6) * 7) * 60 * 1000);
    const stationWarningDate = new Date(cloudWarningDate.getTime() + (85 + (i % 5) * 17) * 60 * 1000);
    const stationEventDate = new Date(stationWarningDate.getTime() - (14 + (i % 4) * 9) * 60 * 1000);
    const shared = {
      stationId: first.stationId,
      stationName: first.stationName,
      title: first.title,
      module: first.module,
      type: first.type,
      level: first.level,
      location: first.location,
    };
    alarms[firstIndex] = {
      ...first,
      ...shared,
      source: alarmSourceLabels[0],
      dateISO: formatDateInput(cloudWarningDate),
      eventTime: formatFullDateTime(cloudEventDate),
      warningTime: formatFullDateTime(cloudWarningDate),
      time: `${String(cloudWarningDate.getMonth() + 1).padStart(2, "0")}-${String(cloudWarningDate.getDate()).padStart(2, "0")} ${String(cloudWarningDate.getHours()).padStart(2, "0")}:${String(cloudWarningDate.getMinutes()).padStart(2, "0")}`,
      linkGroupId: pairId,
      linkedAlarmId: second.id,
    };
    alarms[secondIndex] = {
      ...second,
      ...shared,
      source: alarmSourceLabels[1],
      dateISO: formatDateInput(stationWarningDate),
      eventTime: formatFullDateTime(stationEventDate),
      warningTime: formatFullDateTime(stationWarningDate),
      time: `${String(stationWarningDate.getMonth() + 1).padStart(2, "0")}-${String(stationWarningDate.getDate()).padStart(2, "0")} ${String(stationWarningDate.getHours()).padStart(2, "0")}:${String(stationWarningDate.getMinutes()).padStart(2, "0")}`,
      linkGroupId: pairId,
      linkedAlarmId: first.id,
    };
  }

  const historyLevels = [
    { level: "二级", type: "level2", minutes: 80 },
    { level: "三级", type: "level3", minutes: 155 },
    { level: "一级", type: "level1", minutes: 230 },
  ];
  const historyGroupCount = Math.min(5, pairGroups);
  for (let i = 0; i < historyGroupCount; i += 1) {
    [i * 2, i * 2 + 1].forEach((baseIndex) => {
      const base = alarms[baseIndex];
      historyLevels.forEach((history, historyIndex) => {
        const warningDate = new Date(alarmTimestamp(base) - history.minutes * 60 * 1000);
        const eventDate = new Date(warningDate.getTime() - (16 + historyIndex * 9) * 60 * 1000);
        alarms.push({
          ...base,
          id: `${base.id}-history-${historyIndex + 1}`,
          level: history.level,
          type: history.type,
          dateISO: formatDateInput(warningDate),
          eventTime: formatFullDateTime(eventDate),
          warningTime: formatFullDateTime(warningDate),
          time: `${String(warningDate.getMonth() + 1).padStart(2, "0")}-${String(warningDate.getDate()).padStart(2, "0")} ${String(warningDate.getHours()).padStart(2, "0")}:${String(warningDate.getMinutes()).padStart(2, "0")}`,
          status: "待处理",
          srIssued: false,
          srCompleted: false,
          srNo: "",
          closeReason: "",
          closeRemark: "",
        });
      });
    });
  }

  const stationHandledGroupIds = new Set();
  alarms.forEach((alarm) => {
    if (alarm.source === alarmSourceLabels[1] && alarm.linkGroupId && alarm.stationId !== "K-0005") {
      const index = Number(alarm.linkGroupId.replace("pair-", ""));
      if (Number.isFinite(index) && index % 4 === 1) stationHandledGroupIds.add(alarm.linkGroupId);
    }
  });
  alarms.forEach((alarm) => {
    const shouldMarkStandalone =
      alarm.source === alarmSourceLabels[1] &&
      alarm.stationId !== "K-0005" &&
      !alarm.linkGroupId &&
      Number(alarm.id.split("-").pop()) % 11 === 0;
    if ((alarm.source === alarmSourceLabels[1] && stationHandledGroupIds.has(alarm.linkGroupId)) || shouldMarkStandalone) {
      const closedAt = alarm.closedAt || formatFullDateTime(new Date(alarmTimestamp(alarm) + 46 * 60 * 1000));
      Object.assign(alarm, {
        status: "关闭-正确-类型准确",
        srCloseReason: "预警正确",
        srTypeAccuracy: "类型准确",
        closedAt,
        stationHandled: true,
        stationAction: "站端已完成现场复核，执行端子紧固、线束复插、BMS采样通道复测，并同步复核云端诊断结果。",
        stationConclusion: "站端排查确认现场异常已消除，复测数据恢复稳定；关联云端预警同步关闭，无需再次下发处理。",
      });
    }
  });

  addDeviceAlarmSamples(alarms, stations, templates);
  return alarms.sort((a, b) => alarmOrder(a.type) - alarmOrder(b.type));
}

function alarmSourceForIndex(index, station) {
  if (index % 11 === 0 && station?.comm !== "offline") return alarmSourceLabels[2];
  if (index % 4 === 0) return alarmSourceLabels[1];
  return alarmSourceLabels[0];
}

function addDeviceAlarmSamples(alarms, stations, templates) {
  const targets = stations
    .filter((station) => station.comm !== "offline")
    .filter((station, index) => index % 9 === 0)
    .slice(0, 8);
  targets.forEach((station, index) => {
    const template = pickRiskTemplate(templates, index + 35);
    const warningDate = new Date(2026, 3, 15 - (index % 12), 10 + (index % 5), 17 + index);
    const eventDate = new Date(warningDate.getTime() - (18 + index * 3) * 60 * 1000);
    alarms.push({
      id: `${station.id}-device-alarm-${index * 2 + 1}`,
      stationId: station.id,
      stationName: station.name,
      title: template.name,
      module: template.module,
      type: "level2",
      level: "二级",
      location: createAlarmLocation(template.locationFormat, station, index),
      source: alarmSourceLabels[2],
      dateISO: formatDateInput(warningDate),
      eventTime: formatFullDateTime(eventDate),
      warningTime: formatFullDateTime(warningDate),
      time: `${String(warningDate.getMonth() + 1).padStart(2, "0")}-${String(warningDate.getDate()).padStart(2, "0")} ${String(warningDate.getHours()).padStart(2, "0")}:${String(warningDate.getMinutes()).padStart(2, "0")}`,
      status: "待处理",
      srIssued: false,
      srCompleted: false,
      srNo: "",
      workOrderNo: "",
      closeReason: "",
      closeRemark: "",
    });
  });
}

function createDataAlarms(stations) {
  const templates = [
    { title: "数据采集链路中断", level: "一级", type: "level1", module: "数据系统", location: "采集网关-遥测通道" },
    { title: "SOC数据长时间未刷新", level: "二级", type: "level2", module: "数据系统", location: "BMS数据接入-SOC点位" },
    { title: "功率曲线数据跳变", level: "二级", type: "level2", module: "数据系统", location: "PCS遥测-有功功率点位" },
    { title: "电量统计数据缺失", level: "三级", type: "level3", module: "数据系统", location: "日统计任务-充放电电量" },
    { title: "设备编码映射异常", level: "三级", type: "level3", module: "数据系统", location: "主数据映射-设备台账" },
  ];
  return stations
    .filter((station, index) => index % 6 === 0 || station.comm === "offline")
    .slice(0, 34)
    .map((station, index) => {
      const template = templates[index % templates.length];
      const warningDate = new Date(2026, 3, 15 - (index % 28), 10 - (index % 4), 8 + (index * 7) % 50);
      const eventDate = new Date(warningDate.getTime() - (12 + (index % 18)) * 60 * 1000);
      return {
        id: `${station.id}-data-${index + 1}`,
        stationId: station.id,
        stationName: station.name,
        title: template.title,
        module: template.module,
        type: template.type,
        level: template.level,
        location: template.location,
        source: "数据告警",
        dateISO: formatDateInput(warningDate),
        eventTime: formatFullDateTime(eventDate),
        warningTime: formatFullDateTime(warningDate),
        time: `${String(warningDate.getMonth() + 1).padStart(2, "0")}-${String(warningDate.getDate()).padStart(2, "0")} ${String(warningDate.getHours()).padStart(2, "0")}:${String(warningDate.getMinutes()).padStart(2, "0")}`,
        status: "待处理",
        srIssued: false,
        srCompleted: false,
        srNo: "",
      };
    });
}

function formatFullDateTime(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function scoreFor(n) {
  const wobble = Math.sin(n * 1.17) * 2.2;
  if (n % 17 === 0) return round(50 + (n % 6) + wobble, 2);
  if ((n % 7 === 0 && n !== 154) || n === 1) return 100;
  if (n % 5 === 0 || n % 11 === 0) return round(66 + (n % 10) + wobble, 2);
  return round(Math.min(99.2, 82 + (n % 7) + wobble), 2);
}

function getRisk(score) {
  if (score < 60) return "high";
  if (score < 80) return "mid";
  if (score === 100) return "healthy";
  return "low";
}

function renderFilters() {
  const counts = summarize(state.stations);
  const filters = [
    {
      title: "SOS",
      entries: ["high", "mid", "low", "healthy"].map((key) => ({
        key: `risk:${key}`,
        label: riskMeta[key].label,
        count: counts.risk[key],
        color: riskMeta[key].color,
      })),
    },
    {
      title: "场站预警分布",
      entries: [
        { key: "alarm:level1", label: "一级", count: counts.alarm.level1, color: "#ff3d59" },
        { key: "alarm:level2", label: "二级", count: counts.alarm.level2, color: "#f4a51c" },
        { key: "alarm:level3", label: "三级", count: counts.alarm.level3, color: "#13c781" },
        { key: "alarm:none", label: "无预警", count: counts.alarm.none, color: "#1689ff" },
      ],
    },
    {
      title: "场站告警分布",
      entries: ["fault", "alarm", "none"].map((key) => ({
        key: `stationAlarm:${key}`,
        label: stationAlarmMeta[key].label,
        count: counts.stationAlarm[key],
        color: stationAlarmMeta[key].color,
      })),
    },
    {
      title: "通讯状态",
      entries: ["ok", "partial", "down", "offline"].map((key) => ({
        key: `comm:${key}`,
        label: commMeta[key].label,
        count: counts.comm[key],
        color: commMeta[key].color,
      })),
    },
  ];
  els.statusFilters.innerHTML = filters.map(renderOverviewFilterDonut).join("");
  els.statusFilters.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = state.activeFilter === button.dataset.filter ? "all" : button.dataset.filter;
      renderFilters();
      applyFilters();
    });
  });
}

function renderOverviewFilterDonut(group) {
  const total = group.entries.reduce((sum, item) => sum + item.count, 0) || 1;
  let start = -90;
  const cx = 42;
  const cy = 42;
  const outer = 34;
  const inner = 21;
  const slices = group.entries
    .map((item) => {
      if (!item.count) return "";
      const angle = Math.max(0.6, (item.count / total) * 360);
      const path = donutSlicePath(cx, cy, outer, inner, start, start + angle);
      start += angle;
      return `<path class="overview-donut-slice ${state.activeFilter === item.key ? "active" : ""}" d="${path}" fill="${item.color}" data-filter="${item.key}"><title>${item.label} ${item.count}</title></path>`;
    })
    .join("");
  return `
    <article class="overview-donut-card">
      <h3>${group.title}</h3>
      <div class="overview-donut-content">
        <svg class="overview-filter-donut" viewBox="0 0 84 84" role="img" aria-label="${group.title}">
          <circle cx="${cx}" cy="${cy}" r="${outer}" fill="none" stroke="rgba(58,64,82,0.72)" stroke-width="${outer - inner}"></circle>
          ${slices}
          <circle cx="${cx}" cy="${cy}" r="${inner - 1}" fill="rgba(20,22,31,0.98)"></circle>
          <text x="${cx}" y="${cy + 4}" text-anchor="middle">${total}</text>
        </svg>
        <div class="overview-donut-legend">
          ${group.entries
            .map(
              (item) => `
              <button class="${state.activeFilter === item.key ? "active" : ""}" data-filter="${item.key}" type="button">
                <span style="--legend-color:${item.color}">${item.label}</span><strong>${item.count}</strong>
              </button>`
            )
            .join("")}
        </div>
      </div>
    </article>`;
}

function donutSlicePath(cx, cy, outer, inner, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outer, endAngle);
  const endOuter = polarToCartesian(cx, cy, outer, startAngle);
  const startInner = polarToCartesian(cx, cy, inner, startAngle);
  const endInner = polarToCartesian(cx, cy, inner, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outer} ${outer} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${inner} ${inner} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
  return {
    x: round(cx + radius * Math.cos(angleInRadians), 3),
    y: round(cy + radius * Math.sin(angleInRadians), 3),
  };
}

function summarize(stations) {
  const counts = {
    comm: { ok: 0, partial: 0, down: 0, offline: 0 },
    risk: { high: 0, mid: 0, low: 0, healthy: 0 },
    alarm: { level1: 0, level2: 0, level3: 0, none: 0 },
    stationAlarm: { fault: 0, alarm: 0, none: 0 },
  };
  stations.forEach((station) => {
    counts.comm[station.comm] += 1;
    counts.risk[station.risk] += 1;
    counts.alarm[highestAlarmTypeForStation(station)] += 1;
    const severity = stationAlarmSeverity(station);
    counts.stationAlarm[severity] += 1;
  });
  return counts;
}

function highestAlarmTypeForStation(station) {
  const stationAlarms = state.allAlarms.filter((alarm) => alarm.stationId === station.id && homeVisibleAlarm(alarm) && homeAlarmCategory(alarm) === "warning");
  if (!stationAlarms.length) return "none";
  return stationAlarms.sort((a, b) => alarmOrder(a.type) - alarmOrder(b.type))[0].type;
}

function homeVisibleAlarm(alarm) {
  if (alarm.source === "站端预警") return false;
  return alarmAllowedByStationComm(alarm);
}

function alarmAllowedByStationComm(alarm) {
  const station = stationById(alarm.stationId);
  if (station?.comm === "offline") {
    return homeAlarmCategory(alarm) !== "alarm";
  }
  return true;
}

function stationById(stationId) {
  return state.stations.find((station) => station.id === stationId);
}

function homeAlarmCategory(alarm) {
  if (alarm.source === "数据告警") return "data";
  if (alarm.source === "设备告警") return "alarm";
  return "warning";
}

function homeDeviceAlarmSeverity(alarm) {
  if (homeAlarmCategory(alarm) !== "alarm") return "none";
  const idTail = Number(String(alarm.id).split("-").pop());
  return alarm.type === "level1" || (Number.isFinite(idTail) && idTail % 2 === 0) ? "fault" : "alarm";
}

function homeAlarmDisplayLabel(alarm) {
  const category = homeAlarmCategory(alarm);
  if (category === "data") return "数据";
  if (category === "warning") return "预警";
  return homeDeviceAlarmSeverity(alarm) === "fault" ? "故障" : "告警";
}

function alarmManagementTypeLabel(alarm) {
  return homeAlarmCategory(alarm) === "alarm" ? "告警" : "预警";
}

function alarmManagementLevelLabel(alarm) {
  if (homeAlarmCategory(alarm) === "alarm") return homeDeviceAlarmSeverity(alarm) === "fault" ? "故障" : "告警";
  return alarm.level;
}

function alarmManagementLevelClass(alarm) {
  if (homeAlarmCategory(alarm) === "alarm") return `alarm-device-${homeDeviceAlarmSeverity(alarm)}`;
  return `alarm-${alarm.type}`;
}

function homeAlarmRightLabel(alarm) {
  const category = homeAlarmCategory(alarm);
  if (category === "data") return "数据";
  if (category === "alarm") return "告警";
  return "预警";
}

function homeAlarmLeftTags(alarm) {
  const category = homeAlarmCategory(alarm);
  const status = homeAlarmStatusTag(alarm);
  if (category === "data") return `<span>${alarm.module}</span>${status}`;
  if (category === "alarm") {
    const severity = homeDeviceAlarmSeverity(alarm);
    return `<span class="alarm-level alarm-device-${severity}">${severity === "fault" ? "故障" : "告警"}</span><span>${alarm.module}</span>${status}`;
  }
  return `<span class="alarm-level">${alarm.level}</span><span>${alarm.module}</span>${status}`;
}

function homeAlarmStatusTag(alarm) {
  const status = alarmManagementStatusForAlarm(alarm);
  return status ? `<span class="alarm-card-status ${statusClass(status)}">${status}</span>` : "";
}

function alarmManagementStatusForAlarm(alarm) {
  const exact = state.allAlarms?.find((item) => item.id === alarm.id);
  if (exact?.status) return exact.status;
  if (alarm.linkGroupId) {
    const linked = state.allAlarms?.find((item) => item.linkGroupId === alarm.linkGroupId && item.status);
    if (linked?.status) return linked.status;
  }
  return alarm.status || "";
}

function homeAlarmPillClass(alarm) {
  const category = homeAlarmCategory(alarm);
  if (category === "alarm") return "alarm";
  return category;
}

function homeAlarmTypeMatch(alarm, activeType) {
  if (activeType === "all") return true;
  if (activeType === "data") return homeAlarmCategory(alarm) === "data";
  if (homeAlarmCategory(alarm) !== "warning") return false;
  return alarm.type === activeType;
}

function homeAlarmSubfilterMatch(alarm, subfilter) {
  if (!subfilter || subfilter === "all") return true;
  if (subfilter === "level1" || subfilter === "level2" || subfilter === "level3") {
    return homeAlarmCategory(alarm) === "warning" && alarm.type === subfilter;
  }
  if (subfilter === "fault" || subfilter === "alarm") {
    return homeAlarmCategory(alarm) === "alarm" && homeDeviceAlarmSeverity(alarm) === subfilter;
  }
  return true;
}

function stationAlarmSeverity(station) {
  const stationAlarms = [...state.allAlarms, ...state.homeDataAlarms].filter((alarm) => alarm.stationId === station.id && homeVisibleAlarm(alarm));
  if (stationAlarms.some((alarm) => homeDeviceAlarmSeverity(alarm) === "fault")) return "fault";
  if (stationAlarms.some((alarm) => homeDeviceAlarmSeverity(alarm) === "alarm")) return "alarm";
  return "none";
}

function applyFilters() {
  const keyword = els.searchInput.value.trim().toLowerCase();
  const [filterType, filterValue] = state.activeFilter.split(":");
  let filtered = state.stations.filter((station) => {
    const matchSelected = !state.selectedStationIds.size || state.selectedStationIds.has(station.id);
    const matchKeyword = state.selectedStationIds.size || !keyword || `${station.id}${station.name}`.toLowerCase().includes(keyword);
    const matchFilter =
      state.activeFilter === "all" ||
      (filterType === "comm" && station.comm === filterValue) ||
      (filterType === "risk" && station.risk === filterValue) ||
      (filterType === "alarm" && highestAlarmTypeForStation(station) === filterValue) ||
      (filterType === "stationAlarm" && stationAlarmSeverity(station) === filterValue);
    return matchSelected && matchKeyword && matchFilter;
  });

  filtered = sortOverviewStations(filtered);

  state.filtered = filtered;
  renderStations(filtered);
  state.alarms = filterAlarmsByStations(filtered, [...state.allAlarms, ...state.homeDataAlarms]);
  renderAlarms();
  if (state.activePage === "risk") renderRiskView();
  if (state.activePage === "alarm") {
    renderAlarmOverview();
    renderAlarmDetailPage();
  }
  renderStationPicker();
}

function sortOverviewStations(stations) {
  return [...stations].sort((a, b) => {
    if (state.overviewSortMode === "sosDesc") return b.sos - a.sos || a.id.localeCompare(b.id, "zh-CN");
    if (state.overviewSortMode === "idAsc") return a.id.localeCompare(b.id, "zh-CN");
    if (state.overviewSortMode === "idDesc") return b.id.localeCompare(a.id, "zh-CN");
    return a.sos - b.sos || a.id.localeCompare(b.id, "zh-CN");
  });
}

function showPage(page) {
  state.activePage = page;
  state.selectedStation = null;
  state.selectedSubsystemNo = null;
  state.subsystemPageMode = "overview";
  state.subsystemPartFilter = null;
  els.detailView.classList.remove("active-view");
  els.listView.classList.toggle("active-view", page === "overview");
  els.riskView.classList.toggle("active-view", page === "risk");
  els.alarmDetailView.classList.toggle("active-view", page === "alarm");
  els.pageTabs?.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page);
  });
  if (page === "risk") renderRiskView();
  if (page === "alarm") {
    renderAlarmOverview();
    renderAlarmDetailPage();
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("station");
  url.searchParams.set("page", page);
  window.history.replaceState({}, "", url);
}

function filterAlarmsByStations(stations, alarms = state.allAlarms) {
  if (!stations.length) return [];
  const stationIds = new Set(stations.map((station) => station.id));
  return alarms.filter((alarm) => stationIds.has(alarm.stationId));
}

function renderStations(stations) {
  els.selectedCount.textContent = state.selectedStationIds.size || stations.length;
  els.resultText.textContent = `共 ${stations.length} 个场站`;
  els.stationGrid.classList.toggle("cards-collapsed", state.cardsCollapsed);
  if (!stations.length) {
    els.stationGrid.innerHTML = `<div class="empty">未找到匹配场站</div>`;
    return;
  }
  els.stationGrid.innerHTML = stations.map(createStationCard).join("");
  els.stationGrid.querySelectorAll(".station-card").forEach((card) => {
    card.addEventListener("click", () => showDetail(card.dataset.id));
  });
}

function createStationCard(station) {
  const commClass = commStatusClass(station.comm);
  const comm = commMeta[station.comm];
  const risk = riskMeta[station.risk];
  const sopSoe = formatSopSoe(station);
  const healthScore = stationHealthScore(station);
  const alarmSeverity = stationAlarmSeverity(station);
  const cardStateLabel = stationCardStateLabel(station, alarmSeverity);
  const stateClass = operationStateClass(cardStateLabel);
  const operationTag = cardStateLabel ? `<span class="operation-tag ${stateClass}">${cardStateLabel}</span>` : "";
  const sosPercent = Math.max(0, Math.min(100, Number(station.sos || 0)));
  const healthPercent = Math.max(0, Math.min(100, healthScore));
  const collapsedClass = state.cardsCollapsed ? " is-collapsed" : "";
  const alarmClass = alarmSeverity === "none" ? "" : ` station-${stationAlarmMeta[alarmSeverity].className}`;
  return `
    <button class="station-card risk-${risk.className} ${commClass}${alarmClass}${collapsedClass}" data-id="${station.id}" type="button">
      <div class="card-head">
        ${operationTag}
        <span class="station-name" title="${station.id}${station.name}">${station.id}${station.name}</span>
        <span class="comm-dot ${commClass}" title="${comm.label}"></span>
      </div>
      <div class="card-sos-line" style="--sos-color:${risk.color};--sos-width:${sosPercent}%">
        <span>SOS</span><strong>${formatSosValue(station.sos)}</strong><i></i>
      </div>
      <div class="card-health-line" style="--health-width:${healthPercent}%">
        <span>健康度</span><strong>${formatNumeric(healthScore)}</strong><i></i>
      </div>
      <div class="metrics central-monitor-metrics">
        <div class="metric"><span>通讯状态</span><strong>${comm.label}</strong></div>
        <div class="metric"><span>额定能量/容量</span><strong>${station.rated}MW/${station.ratedEnergy}MWh</strong></div>
        <div class="metric"><span>子系统数量</span><strong>${station.subsystemCount}</strong></div>
        <div class="metric"><span>场站SOC</span><strong>${formatNumeric(station.soc)} <em>%</em></strong></div>
        <div class="metric metric-wide"><span>场站SOP/SOE</span><strong>${sopSoe}</strong></div>
      </div>
    </button>`;
}

function stationCardStateLabel(station, alarmSeverity) {
  if (alarmSeverity === "fault") return "故障";
  if (alarmSeverity === "alarm") return "告警";
  if (station.comm === "offline") return "";
  return station.run;
}

function operationStateClass(stateName) {
  const classMap = {
    充电: "is-charging",
    放电: "is-discharging",
    待机: "is-standby",
    停机: "is-stopped",
    离线: "is-offline",
    告警: "is-alarm",
    故障: "is-fault",
  };
  return classMap[stateName] || "is-standby";
}

function subsystemRunState(station, n, systemCount) {
  if (station.comm === "offline") return "离线";
  const primary = ["充电", "放电"].includes(station.run) ? station.run : station.run === "停机" ? "停机" : "待机";
  const standbyEvery = Math.max(6, Math.round(systemCount / 2));
  if ((n + stationIndexSeed(station)) % standbyEvery === 0 && primary !== "待机") return "待机";
  if ((n + stationIndexSeed(station)) % 17 === 0) return "停机";
  return primary;
}

function subsystemPowerByState(station, status, n) {
  const unitPower = Math.max(0.4, Number(station.rated || 0) / Math.max(1, Number(station.subsystemCount || 1)));
  if (status === "充电") return round(unitPower * (0.72 + (n % 4) * 0.06), 2);
  if (status === "放电") return round(-unitPower * (0.68 + (n % 5) * 0.05), 2);
  return 0;
}

function subsystemDisplayName(station, n) {
  return `${station.id}-#${n}子系统`;
}

function subsystemShortName(n) {
  return `#${n}子系统`;
}

function commStatusClass(commState) {
  const classMap = {
    ok: "comm-ok",
    partial: "comm-partial",
    down: "comm-down",
    offline: "comm-offline",
  };
  return classMap[commState] || "comm-ok";
}

function renderStationPicker() {
  if (!els.stationPickerList) return;
  const keyword = els.searchInput.value.trim().toLowerCase();
  const stations = state.stations
    .filter((station) => !keyword || `${station.id}${station.name}`.toLowerCase().includes(keyword))
    .slice(0, 40);
  const allItem = `
    <button class="selector-option" type="button" data-id="all">
      <span class="selector-check ${state.selectedStationIds.size ? "" : "checked"}"></span>
      <span>全部场站</span><strong>${state.stations.length}</strong>
    </button>`;
  els.stationPickerList.innerHTML =
    allItem +
    stations
      .map(
        (station) => `
        <button class="selector-option ${state.selectedStationIds.has(station.id) ? "selected" : ""}" type="button" data-id="${station.id}">
          <span class="selector-check ${state.selectedStationIds.has(station.id) ? "checked" : ""}"></span>
          <span>${station.id}${station.name}</span><strong>${riskMeta[station.risk].label}</strong>
        </button>`
      )
      .join("");
  els.stationPickerList.querySelectorAll(".selector-option").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      if (id === "all") {
        state.selectedStationIds.clear();
        els.searchInput.value = "";
      } else if (state.selectedStationIds.has(id)) {
        state.selectedStationIds.delete(id);
      } else {
        state.selectedStationIds.add(id);
      }
      applyFilters();
    });
  });
}

function openStationPicker() {
  els.stationSelector.classList.add("open");
  els.stationPickerMenu.classList.add("open");
  positionStationPicker();
}

function closeStationPicker() {
  els.stationSelector.classList.remove("open");
  els.stationPickerMenu.classList.remove("open");
}

function positionStationPicker() {
  if (!els.stationPickerMenu.classList.contains("open")) return;
  const rect = els.stationSelector.getBoundingClientRect();
  els.stationPickerMenu.style.left = `${Math.round(rect.left)}px`;
  els.stationPickerMenu.style.top = `${Math.round(rect.bottom + 6)}px`;
  els.stationPickerMenu.style.width = `${Math.round(rect.width)}px`;
}

function renderAlarms() {
  if (!els.alarmList) return;
  const rangeAlarms = filterAlarmsByTime(state.alarms).filter(homeVisibleAlarm);
  const categoryAlarms = rangeAlarms.filter((alarm) => state.activeHomeAlarmCategory === "all" || homeAlarmCategory(alarm) === state.activeHomeAlarmCategory);
  const alarms = categoryAlarms.filter((alarm) => homeAlarmSubfilterMatch(alarm, state.activeHomeAlarmSubfilter));
  els.alarmCountAll.textContent = rangeAlarms.length;
  els.alarmCountLevel1.textContent = rangeAlarms.filter((alarm) => homeAlarmCategory(alarm) === "warning" && alarm.type === "level1").length;
  els.alarmCountLevel2.textContent = rangeAlarms.filter((alarm) => homeAlarmCategory(alarm) === "warning" && alarm.type === "level2").length;
  els.alarmCountLevel3.textContent = rangeAlarms.filter((alarm) => homeAlarmCategory(alarm) === "data").length;
  renderHomeAlarmCategorySummary(els.alarmList.closest(".alarm-panel")?.querySelector(".alarm-source-summary"), rangeAlarms, {
    interactive: true,
    activeCategory: state.activeHomeAlarmCategory,
    activeSubfilter: state.activeHomeAlarmSubfilter,
    onChange: (category) => {
      state.activeHomeAlarmCategory = category;
      state.activeHomeAlarmSubfilter = "all";
      renderAlarms();
    },
    onSubChange: (category, subfilter) => {
      const wasActive = state.activeHomeAlarmCategory === category && state.activeHomeAlarmSubfilter === subfilter;
      state.activeHomeAlarmCategory = category;
      state.activeHomeAlarmSubfilter = wasActive ? "all" : subfilter;
      renderAlarms();
    },
  });
  els.alarmList.innerHTML = alarms
    .map(
      (alarm) => {
        const leftTags = homeAlarmLeftTags(alarm);
        return `
      <button class="alarm-item alarm-${alarm.type}" type="button" data-station="${alarm.stationId}" data-alarm-id="${alarm.id}">
        <div class="alarm-body">
          <div class="alarm-row">
            <div class="alarm-tags">
              ${leftTags}
            </div>
            <span class="alarm-source alarm-source-${homeAlarmPillClass(alarm)}">${homeAlarmRightLabel(alarm)}</span>
          </div>
          <strong>${alarm.title}</strong>
          <div class="alarm-meta">
            <span class="alarm-station-name">${alarm.stationId}${alarm.stationName}</span>
            <time>${alarm.time}</time>
          </div>
          <div class="alarm-location">预警位置：${alarm.location}</div>
        </div>
      </button>`;
      }
    )
    .join("");
  els.alarmList.querySelectorAll(".alarm-item").forEach((item) => {
    item.addEventListener("click", () => {
      const alarm = alarms.find((entry) => entry.id === item.dataset.alarmId);
      openAlarmModal(alarm);
    });
  });
}

function renderAlarmSourceSummary(container, alarms, sources = alarmSourceLabels, options = {}) {
  if (!container) return;
  const { interactive = false, activeSource = state.activeAlarmSource, onChange = null } = options;
  const counts = countAlarmSources(alarms, sources);
  container.innerHTML = sources
    .map((source) => {
      const active = activeSource === source ? " active" : "";
      const attrs = interactive ? ` role="button" tabindex="0" data-source="${source}"` : "";
      return `<div class="alarm-source-stat alarm-source-stat-${alarmSourceClass(source)}${active}"${attrs}><strong>${counts[source] || 0}</strong><span>${source}</span></div>`;
    })
    .join("");
  if (interactive) {
    container.querySelectorAll("[data-source]").forEach((item) => {
      const toggle = () => {
        const nextSource = activeSource === item.dataset.source ? "all" : item.dataset.source;
        if (onChange) {
          onChange(nextSource);
        } else {
          state.activeAlarmSource = nextSource;
          renderAlarms();
        }
      };
      item.addEventListener("click", toggle);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      });
    });
  }
}

function renderHomeAlarmCategorySummary(container, alarms, options = {}) {
  if (!container) return;
  const { interactive = false, activeCategory = "all", activeSubfilter = "all", onChange = null, onSubChange = null, warningOnly = false } = options;
  const entries = [
    {
      key: "warning",
      label: "预警",
      count: alarms.filter((alarm) => homeAlarmCategory(alarm) === "warning").length,
      subfilters: [
        { key: "level1", label: "一级", count: alarms.filter((alarm) => homeAlarmCategory(alarm) === "warning" && alarm.type === "level1").length },
        { key: "level2", label: "二级", count: alarms.filter((alarm) => homeAlarmCategory(alarm) === "warning" && alarm.type === "level2").length },
      ],
    },
    {
      key: "alarm",
      label: "告警",
      count: alarms.filter((alarm) => homeAlarmCategory(alarm) === "alarm").length,
      subfilters: [
        { key: "fault", label: "故障", count: alarms.filter((alarm) => homeAlarmCategory(alarm) === "alarm" && homeDeviceAlarmSeverity(alarm) === "fault").length },
        { key: "alarm", label: "告警", count: alarms.filter((alarm) => homeAlarmCategory(alarm) === "alarm" && homeDeviceAlarmSeverity(alarm) === "alarm").length },
      ],
    },
    { key: "data", label: "数据", count: alarms.filter((alarm) => homeAlarmCategory(alarm) === "data").length, subfilters: [] },
  ].filter((entry) => !warningOnly || entry.key === "warning");
  container.innerHTML = entries
    .map((entry) => {
      const active = activeCategory === entry.key ? " active" : "";
      const attrs = interactive ? ` role="button" tabindex="0" data-category="${entry.key}"` : "";
      const subfilters = entry.subfilters.length
        ? `<div class="alarm-source-subfilters">${entry.subfilters
            .map((item) => `<button class="${activeCategory === entry.key && activeSubfilter === item.key ? "active" : ""}" data-category="${entry.key}" data-subfilter="${item.key}" type="button"><span>${item.label}</span><em>${item.count}</em></button>`)
            .join("")}</div>`
        : "";
      return `<div class="alarm-source-stat alarm-source-stat-${entry.key}${active}"${attrs}><div class="alarm-source-main"><strong>${entry.count}</strong><span>${entry.label}</span></div>${subfilters}</div>`;
    })
    .join("");
  if (!interactive) return;
  container.querySelectorAll("[data-category]").forEach((item) => {
    const toggle = () => {
      const nextCategory = activeCategory === item.dataset.category ? "all" : item.dataset.category;
      if (onChange) onChange(nextCategory);
    };
    item.addEventListener("click", toggle);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
  container.querySelectorAll("[data-subfilter]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (onSubChange) onSubChange(button.dataset.category, button.dataset.subfilter);
    });
  });
}

function countAlarmSources(alarms, sources = alarmSourceLabels) {
  return sources.reduce((acc, source) => {
    acc[source] = alarms.filter((alarm) => alarm.source === source).length;
    return acc;
  }, {});
}

function setOverviewSortMode(value) {
  state.overviewSortMode = value || "sosAsc";
  if (els.overviewSortSelect) els.overviewSortSelect.value = state.overviewSortMode;
  syncOverviewSortControl();
}

function syncOverviewSortControl() {
  const label = els.overviewSortSelect?.selectedOptions[0]?.textContent || "SOS数值-从低到高";
  if (els.overviewSortLabel) els.overviewSortLabel.textContent = label;
  els.overviewSortMenu?.querySelectorAll("button[data-sort-value]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sortValue === state.overviewSortMode);
  });
}

function toggleOverviewSortMenu() {
  const isOpen = els.overviewSortControl?.classList.contains("open");
  if (isOpen) closeOverviewSortMenu();
  else openOverviewSortMenu();
}

function openOverviewSortMenu() {
  els.overviewSortControl?.classList.add("open");
  els.overviewSortButton?.setAttribute("aria-expanded", "true");
}

function closeOverviewSortMenu() {
  els.overviewSortControl?.classList.remove("open");
  els.overviewSortButton?.setAttribute("aria-expanded", "false");
}

function alarmSourceClass(source) {
  if (String(source).includes("数据")) return "data";
  if (String(source).includes("设备")) return "device";
  if (String(source).includes("站端告警")) return "station-alarm";
  if (String(source).includes("站端")) return "station";
  return "cloud";
}

function isCloudAlarmSource(source) {
  return String(source).includes("云端");
}

function isStationWarningSource(source) {
  return String(source).includes("站端预警");
}

function filterAlarmsByTime(alarms) {
  return filterAlarmsByWindow(alarms, state.activeAlarmDays, state.alarmStartDate, state.alarmEndDate);
}

function filterAlarmsByWindow(alarms, activeDays, startDate, endDate) {
  if (activeDays !== "custom") {
    if (activeDays === "all") return alarms;
    const days = Number(activeDays);
    const boundary = new Date(2026, 3, 15);
    boundary.setDate(boundary.getDate() - days + 1);
    return alarms.filter((alarm) => new Date(`${alarm.dateISO}T00:00:00`) >= boundary);
  }
  const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
  return alarms.filter((alarm) => {
    const date = new Date(`${alarm.dateISO}T12:00:00`);
    return (!start || date >= start) && (!end || date <= end);
  });
}

function renderRiskView() {
  const stations = state.stations;
  const avg = state.stations.reduce((sum, station) => sum + station.sos, 0) / Math.max(1, state.stations.length);
  els.riskAvgSos.textContent = formatSosValue(round(avg, 2));
  renderRiskAvgGauge(avg);
  renderSafely(() => renderRiskTopList(stations));
  renderSafely(() => renderRiskPie(stations));
  renderSafely(() => renderRiskTrend(stations, state.riskTrendRange));
  renderSafely(() => renderRiskBars(stations));
}

function renderSafely(renderFn) {
  try {
    renderFn();
  } catch (error) {
    console.error(error);
  }
}

function renderRiskTopList(stations) {
  const top = [...stations].sort((a, b) => a.sos - b.sos).slice(0, 5);
  els.riskTopList.innerHTML = top
    .map(
      (station, index) => `
      <button type="button" data-station="${station.id}">
        <span>${index + 1}</span>
        <div class="risk-top-main">
          <strong title="${station.id}${station.name}">${station.id}${station.name}</strong>
          <div class="risk-top-track"><i style="width:${station.sos}%;background:${riskMeta[station.risk].color}"></i></div>
        </div>
        <em class="${scoreClass(station.sos)}">${formatSosValue(station.sos)}</em>
      </button>`
    )
    .join("");
  els.riskTopList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => showDetail(button.dataset.station, "diagnosis"));
  });
}

function renderRiskAvgGauge(avg) {
  drawSosGauge(els.riskAvgGaugeCanvas, avg);
}

function drawSosGauge(canvasElement, value) {
  const canvas = setupCanvas(canvasElement);
  const ctx = canvas.getContext("2d");
  clear(ctx, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height - 18;
  const radius = Math.min(canvas.width * 0.45, 130);
  const start = Math.PI;
  const clampedValue = Math.max(0, Math.min(100, value));
  const activeEnd = start + (clampedValue / 100) * Math.PI;
  const totalTicks = 36;
  for (let i = 0; i < totalTicks; i += 1) {
    const tickStart = start + (i / (totalTicks - 1)) * Math.PI;
    const tickEnd = Math.min(start + Math.PI, start + ((i + 0.5) / (totalTicks - 1)) * Math.PI);
    const mid = (tickStart + tickEnd) / 2;
    const inner = radius - 23;
    const outer = radius;
    ctx.beginPath();
    ctx.lineWidth = 4.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = clampedValue >= 99.999 || mid <= activeEnd ? gaugeColor(i / (totalTicks - 1)) : "rgba(48, 52, 64, 0.8)";
    ctx.moveTo(centerX + Math.cos(tickStart) * inner, centerY + Math.sin(tickStart) * inner);
    ctx.lineTo(centerX + Math.cos(tickStart) * outer, centerY + Math.sin(tickStart) * outer);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(238, 247, 255, 0.42)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i += 1) {
    const angle = start + (i / 6) * Math.PI;
    const inner = radius - 48;
    const outer = radius - 40;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
    ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
    ctx.stroke();
  }
}

function gaugeColor(t) {
  const stops = [
    { t: 0, c: [255, 61, 89] },
    { t: 0.35, c: [244, 165, 28] },
    { t: 0.62, c: [216, 216, 15] },
    { t: 1, c: [19, 199, 129] },
  ];
  const next = stops.find((stop) => stop.t >= t) || stops[stops.length - 1];
  const prev = [...stops].reverse().find((stop) => stop.t <= t) || stops[0];
  const p = next.t === prev.t ? 0 : (t - prev.t) / (next.t - prev.t);
  const rgb = prev.c.map((value, index) => Math.round(value + (next.c[index] - value) * p));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function renderRiskBars(stations) {
  const data = sortRiskBarStations(stations);
  const pad = { left: 46, right: 20, top: 40, bottom: 54 };
  const gap = 7;
  const barWidth = 5;
  const desiredWidth = Math.max(1280, pad.left + pad.right + data.length * (barWidth + gap) + 18);
  els.riskBarsCanvas.style.width = `${desiredWidth}px`;
  const canvas = setupCanvas(els.riskBarsCanvas);
  const ctx = canvas.getContext("2d");
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  drawThreshold(ctx, pad, canvas.width, canvas.height, 60, "#ff3d59");
  drawThreshold(ctx, pad, canvas.width, canvas.height, 80, "#f4a51c");
  state.riskBarHitboxes = [];
  data.forEach((station, index) => {
    const x = pad.left + index * (barWidth + gap);
    const y = valueY(station.sos, pad, canvas.height);
    const h = canvas.height - pad.bottom - y;
    const isHover = state.riskBarHoverId === station.id;
    if (isHover) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(x - 2, pad.top, barWidth + 4, canvas.height - pad.top - pad.bottom);
    }
    const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - pad.bottom);
    gradient.addColorStop(0, riskMeta[station.risk].color);
    gradient.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, isHover ? barWidth + 2 : barWidth, h);
    ctx.shadowColor = riskMeta[station.risk].color;
    ctx.shadowBlur = isHover ? 16 : 5;
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, isHover ? barWidth + 2 : barWidth, Math.min(3, h));
    ctx.shadowBlur = 0;
    state.riskBarHitboxes.push({ x: x - 4, y, width: barWidth + 8, height: h, station });
    if (index % 10 === 0 || index === data.length - 1) {
      ctx.save();
      ctx.translate(x + barWidth / 2, canvas.height - 16);
      ctx.fillStyle = "#8f97a8";
      ctx.font = "11px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(station.id, 0, 0);
      ctx.restore();
    }
  });
}

function sortRiskBarStations(stations) {
  return [...stations].sort((a, b) => {
    if (state.riskBarSort === "idDesc") return b.id.localeCompare(a.id, "zh-CN");
    if (state.riskBarSort === "sosAsc") return a.sos - b.sos || a.id.localeCompare(b.id, "zh-CN");
    if (state.riskBarSort === "sosDesc") return b.sos - a.sos || a.id.localeCompare(b.id, "zh-CN");
    return a.id.localeCompare(b.id, "zh-CN");
  });
}

function renderRiskPie(stations) {
  const canvas = setupCanvas(els.riskPieCanvas);
  const ctx = canvas.getContext("2d");
  const counts = summarize(stations).risk;
  const entries = ["high", "mid", "low", "healthy"].map((key) => [key, counts[key]]);
  drawDonutChart(ctx, canvas, entries, (key) => riskMeta[key].color, {
    radius: 64,
    lineWidth: 32,
    font: "22px Microsoft YaHei",
    centerYOffset: 8,
  });
  els.riskPieLegend.innerHTML = entries
    .map(
      ([key, count]) => `
      <div class="legend-item" style="--legend-color:${riskMeta[key].color}">
        <span>${riskMeta[key].label}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function renderRiskAlarmPie(alarms) {
  const canvas = setupCanvas(els.riskAlarmPieCanvas);
  const ctx = canvas.getContext("2d");
  const alarmItems = alarms.filter((alarm) => homeAlarmCategory(alarm) === "alarm");
  const entries = [
    ["fault", alarmItems.filter((alarm) => homeDeviceAlarmSeverity(alarm) === "fault").length],
    ["alarm", alarmItems.filter((alarm) => homeDeviceAlarmSeverity(alarm) === "alarm").length],
  ];
  const colors = { fault: "#ff3d59", alarm: "#f4a51c" };
  const labels = { fault: "故障", alarm: "告警" };
  drawDonutChart(ctx, canvas, entries, (key) => colors[key], alarmOverviewDonutOptions);
  els.riskAlarmPieLegend.innerHTML = entries
    .map(
      ([key, count]) => `
      <div class="legend-item" style="--legend-color:${colors[key]}">
        <span>${labels[key]}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function sourceColor(source) {
  const key = alarmSourceClass(source);
  return {
    cloud: "#1689ff",
    station: "#13c781",
    "station-alarm": "#f4a51c",
    device: "#b95cff",
    data: "#ff8629",
  }[key] || "#8aa0bd";
}

function renderRiskAlarmSourcePie(alarms) {
  const canvas = setupCanvas(els.riskAlarmSourcePieCanvas);
  const ctx = canvas.getContext("2d");
  const warningItems = alarms.filter((alarm) => homeAlarmCategory(alarm) === "warning");
  const entries = [
    ["level1", warningItems.filter((alarm) => alarm.type === "level1").length],
    ["level2", warningItems.filter((alarm) => alarm.type === "level2").length],
    ["level3", warningItems.filter((alarm) => alarm.type === "level3").length],
  ];
  const colors = { level1: "#ff3d59", level2: "#f4a51c", level3: "#13c781" };
  const labels = { level1: "一级", level2: "二级", level3: "三级" };
  drawDonutChart(ctx, canvas, entries, (key) => colors[key], alarmOverviewDonutOptions);
  els.riskAlarmSourcePieLegend.innerHTML = entries
    .map(
      ([key, count]) => `
      <div class="legend-item" style="--legend-color:${colors[key]}">
        <span>${labels[key]}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function renderRiskTrend(stations, range) {
  const canvas = setupCanvas(els.riskTrendCanvas);
  const ctx = canvas.getContext("2d");
  const pad = { left: 46, right: 28, top: 42, bottom: 42 };
  const series = createRiskTrendSeries(stations, range);
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  drawThreshold(ctx, pad, canvas.width, canvas.height, 60, "#ff3d59");
  drawThreshold(ctx, pad, canvas.width, canvas.height, 80, "#f4a51c");
  state.riskTrendHitboxes = [];
  drawTrendGuide(ctx, pad, canvas, series);
  drawTrendLine(ctx, series.max, pad, canvas, "#13c781", "最大值", series.labels, "max");
  drawTrendLine(ctx, series.avg, pad, canvas, "#1689ff", "平均值", series.labels, "avg");
  drawTrendLine(ctx, series.min, pad, canvas, "#a66bff", "最小值", series.labels, "min");
  ctx.fillStyle = "#8f97a8";
  ctx.font = "12px Microsoft YaHei";
  ctx.textAlign = "center";
  const labelIndexes = getXAxisLabelIndexes(series.labels.length, range <= 7 ? 7 : range <= 15 ? 6 : 7);
  labelIndexes.forEach((index) => {
    const label = series.labels[index];
    const x = pad.left + (index / Math.max(1, range - 1)) * (canvas.width - pad.left - pad.right);
    ctx.textAlign = index === 0 ? "left" : index === series.labels.length - 1 ? "right" : "center";
    ctx.fillText(label, x, canvas.height - 12);
  });
  ctx.textAlign = "center";
}

function getXAxisLabelIndexes(length, maxLabels) {
  if (length <= 0) return [];
  if (length <= maxLabels) return Array.from({ length }, (_, index) => index);
  const indexes = new Set([0, length - 1]);
  const step = (length - 1) / Math.max(1, maxLabels - 1);
  for (let i = 1; i < maxLabels - 1; i += 1) {
    indexes.add(Math.round(i * step));
  }
  return [...indexes].sort((a, b) => a - b);
}

function drawTrendGuide(ctx, pad, canvas, series) {
  if (!state.riskTrendHover) return;
  const index = state.riskTrendHover.index;
  if (index < 0 || index >= series.labels.length) return;
  const x = pad.left + (index / Math.max(1, series.labels.length - 1)) * (canvas.width - pad.left - pad.right);
  ctx.save();
  ctx.strokeStyle = "rgba(238, 247, 255, 0.36)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x, pad.top);
  ctx.lineTo(x, canvas.height - pad.bottom);
  ctx.stroke();
  ctx.restore();
}

function createRiskTrendSeries(stations, range) {
  const labels = [];
  const avg = [];
  const max = [];
  const min = [];
  const endDate = new Date(2026, 3, 15);
  Array.from({ length: range }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - range + 1 + index);
    const values = stations.map((station, stationIndex) => {
      const drift = Math.sin((index + 1) * 0.82 + stationIndex * 0.31) * 2.6 + Math.cos(index * 0.45 + stationIndex * 0.13) * 0.9;
      return Math.max(35, Math.min(100, station.sos + drift));
    });
    labels.push(`${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`);
    avg.push(round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length), 2));
    max.push(round(Math.max(...values, 0), 2));
    min.push(round(Math.min(...values, 100), 2));
  });
  return { labels, avg, max, min };
}

function drawTrendLine(ctx, values, pad, canvas, color, label, labels = [], key = "") {
  const points = values.map((value, index) => ({
    x: pad.left + (index / Math.max(1, values.length - 1)) * (canvas.width - pad.left - pad.right),
    y: valueY(value, pad, canvas.height),
    value,
    index,
  }));
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = key === "avg" ? 2.4 : 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = key === "avg" ? 8 : 5;
  ctx.beginPath();
  points.forEach(({ x, y }, index) => {
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
  points.forEach(({ x, y, value, index }) => {
    const isHover = state.riskTrendHover && state.riskTrendHover.index === index;
    ctx.fillStyle = "#111622";
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 6.2 : 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = isHover ? 3 : 2;
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 6.2 : 4.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 3.3 : 2.1, 0, Math.PI * 2);
    ctx.fill();
    state.riskTrendHitboxes.push({ x, y, value, label, date: labels[index] || "", color, key, index });
  });
  ctx.restore();
}

function renderRiskModules(alarms) {
  const canvas = setupCanvas(els.riskModuleCanvas);
  const ctx = canvas.getContext("2d");
  const modules = ["电池系统", "电气系统", "环控系统", "消防系统"];
  const colors = ["#1689ff", "#13c781", "#f4a51c", "#ff3d59"];
  const entries = modules.map((module) => [module, alarms.filter((alarm) => alarm.module === module).length]);
  drawDonutChart(ctx, canvas, entries, (key) => colors[modules.indexOf(key)] || "#1689ff", alarmOverviewDonutOptions);
  els.riskModuleLegend.innerHTML = entries
    .map(
      ([module, count], index) => `
      <div class="legend-item" style="--legend-color:${colors[index]}">
        <span>${module}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function renderRiskAlarmNameTop(alarms) {
  const colorSet = ["#ff3d59", "#f4a51c", "#13c781", "#00d7ff", "#a66bff"];
  const counts = new Map();
  alarms.forEach((alarm) => counts.set(alarm.title, (counts.get(alarm.title) || 0) + 1));
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = Math.max(1, ...top.map(([, count]) => count));
  els.riskAlarmNameTopList.innerHTML = top
    .map(([name, count], index) => {
      const color = colorSet[index % colorSet.length];
      return `
        <div class="alarm-name-top-row" style="--top-color:${color}">
          <span>${index + 1}</span>
          <div class="alarm-name-top-main">
            <strong title="${name}">${name}</strong>
            <div class="alarm-name-top-track"><i style="width:${(count / max) * 100}%"></i></div>
          </div>
          <em>${count}</em>
        </div>`;
    })
    .join("");
}

function renderRiskBands(stations) {
  const canvas = setupCanvas(els.riskBandCanvas);
  const ctx = canvas.getContext("2d");
  const bands = [
    { label: "<60", count: stations.filter((station) => station.sos < 60).length, color: "#ff3d59" },
    { label: "60-79", count: stations.filter((station) => station.sos >= 60 && station.sos < 80).length, color: "#f4a51c" },
    { label: "80-89", count: stations.filter((station) => station.sos >= 80 && station.sos < 90).length, color: "#13c781" },
    { label: "90-99", count: stations.filter((station) => station.sos >= 90 && station.sos < 100).length, color: "#23b0ff" },
    { label: "100", count: stations.filter((station) => station.sos === 100).length, color: "#1689ff" },
  ];
  const max = Math.max(1, ...bands.map((band) => band.count));
  const pad = { left: 42, right: 24, top: 26, bottom: 42 };
  clear(ctx, canvas.width, canvas.height);
  bands.forEach((band, index) => {
    const slot = (canvas.width - pad.left - pad.right) / bands.length;
    const barWidth = Math.min(86, slot * 0.52);
    const x = pad.left + index * slot + (slot - barWidth) / 2;
    const h = (band.count / max) * (canvas.height - pad.top - pad.bottom);
    const y = canvas.height - pad.bottom - h;
    ctx.fillStyle = band.color;
    ctx.fillRect(x, y, barWidth, h);
    ctx.fillStyle = "#eef3fb";
    ctx.font = "18px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(String(band.count), x + barWidth / 2, y - 8);
    ctx.fillStyle = "#8f97a8";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText(band.label, x + barWidth / 2, canvas.height - 14);
  });
}

function drawMiniBrush(ctx, pad, width, height, data) {
  const y = height - 18;
  ctx.strokeStyle = "rgba(143, 151, 168, 0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  data.forEach((station, index) => {
    const x = pad.left + index * 12;
    const wave = y - 8 + Math.sin(index * 0.5) * 2 + (100 - station.sos) / 40;
    index === 0 ? ctx.moveTo(x, wave) : ctx.lineTo(x, wave);
  });
  ctx.stroke();
}

function handleRiskBarHover(event) {
  const rect = els.riskBarsCanvas.getBoundingClientRect();
  const scaleX = els.riskBarsCanvas.width / rect.width;
  const scaleY = els.riskBarsCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.riskBarHitboxes.find((box) => x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height);
  if (!hit) {
    if (state.riskBarHoverId) {
      state.riskBarHoverId = null;
      renderSafely(() => renderRiskBars(state.stations));
    }
    els.riskBarsTooltip.classList.remove("show");
    return;
  }
  if (state.riskBarHoverId !== hit.station.id) {
    state.riskBarHoverId = hit.station.id;
    renderSafely(() => renderRiskBars(state.stations));
  }
  els.riskBarsTooltip.innerHTML = `
    <strong>${hit.station.id}${hit.station.name}</strong>
    <span style="color:${riskMeta[hit.station.risk].color}">SOS ${formatSosValue(hit.station.sos)}</span>
  `;
  const viewportRect = els.riskBarsViewport.getBoundingClientRect();
  const tooltipWidth = 230;
  const rawLeft = event.clientX - viewportRect.left + els.riskBarsViewport.scrollLeft + 14;
  const minLeft = els.riskBarsViewport.scrollLeft + 8;
  const maxLeft = els.riskBarsViewport.scrollLeft + els.riskBarsViewport.clientWidth - tooltipWidth - 8;
  els.riskBarsTooltip.style.left = `${Math.max(minLeft, Math.min(maxLeft, rawLeft))}px`;
  els.riskBarsTooltip.style.top = `${event.clientY - viewportRect.top + 12}px`;
  els.riskBarsTooltip.classList.add("show");
}

function handleRiskTrendHover(event) {
  const rect = els.riskTrendCanvas.getBoundingClientRect();
  const scaleX = els.riskTrendCanvas.width / rect.width;
  const scaleY = els.riskTrendCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.riskTrendHitboxes
    .map((point) => ({ ...point, distance: Math.abs(point.x - x) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 12 || y < 20 || y > els.riskTrendCanvas.height - 12) {
    if (state.riskTrendHover) {
      state.riskTrendHover = null;
      renderSafely(() => renderRiskTrend(state.stations, state.riskTrendRange));
    }
    els.riskTrendTooltip.classList.remove("show");
    return;
  }
  if (!state.riskTrendHover || state.riskTrendHover.index !== hit.index) {
    state.riskTrendHover = { index: hit.index };
    renderSafely(() => renderRiskTrend(state.stations, state.riskTrendRange));
  }
  const rows = ["max", "avg", "min"]
    .map((key) => state.riskTrendHitboxes.find((point) => point.index === hit.index && point.key === key))
    .filter(Boolean);
  els.riskTrendTooltip.innerHTML = `
    <strong>${hit.date}</strong>
    ${rows
      .map(
        (row) => `
        <span style="color:${row.color}">${row.label} ${formatSosValue(row.value)}</span>`
      )
      .join("")}
  `;
  const box = els.riskTrendChart.getBoundingClientRect();
  const tooltipWidth = 210;
  const rawLeft = event.clientX - box.left + 14;
  const maxLeft = els.riskTrendChart.clientWidth - tooltipWidth - 8;
  els.riskTrendTooltip.style.left = `${Math.max(8, Math.min(maxLeft, rawLeft))}px`;
  els.riskTrendTooltip.style.top = `${event.clientY - box.top + 12}px`;
  els.riskTrendTooltip.classList.add("show");
}

function renderAlarmDetailFilters() {
  const alarms = alarmManagementItems();
  const statusOptions = uniqueSorted([
    "待处理",
    "排查中",
    "关闭-正确-类型准确",
    "关闭-正确-类型不准确",
    "关闭-正确-待补充根因",
    "关闭-错误-误报",
    "关闭-错误-数据异常",
    "关闭-错误-其他",
    ...alarms.map((alarm) => alarm.status),
  ]).filter((status) => status !== "关闭-站端已处理");
  const optionMap = {
    code: { el: els.alarmDetailCode, label: "全部编号", searchable: true, options: uniqueSorted(groupAlarmsForTable(alarms).map((group) => alarmCodeForGroup(group))) },
    level: { el: els.alarmDetailLevel, label: "全部等级", searchable: false, options: ["一级", "二级", "三级", "故障", "告警"] },
    status: { el: els.alarmDetailStatus, label: "全部状态", searchable: false, options: statusOptions },
    module: { el: els.alarmDetailModule, label: "全部模块", searchable: false, options: ["电池系统", "电气系统", "环控系统", "消防系统"] },
    name: { el: els.alarmDetailName, label: "全部预警/告警名称", searchable: true, options: uniqueSorted(alarms.map((alarm) => alarm.title)) },
    station: { el: els.alarmDetailStation, label: "全部场站", searchable: true, options: uniqueSorted(alarms.map((alarm) => `${alarm.stationId}${alarm.stationName}`)) },
    location: { el: els.alarmDetailLocation, label: "全部位置", searchable: true, options: uniqueSorted(alarms.map((alarm) => alarm.location)) },
    source: { el: els.alarmDetailSource, label: "全部类型", searchable: false, options: ["预警", "告警"] },
  };
  Object.entries(optionMap).forEach(([key, config]) => renderAlarmMultiSelect(key, config));
}

function alarmManagementItems() {
  return (state.allAlarms || []).filter((alarm) => homeVisibleAlarm(alarm) && homeAlarmCategory(alarm) !== "data");
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function renderAlarmMultiSelect(key, config) {
  if (!config.el) return;
  const selected = state.alarmDetailSelections[key];
  const title = selected.size ? `已选 ${selected.size}` : config.label;
  config.el.innerHTML = `
    <button class="alarm-multi-trigger combo-input" type="button"><span>${title}</span></button>
    <div class="alarm-multi-menu">
      ${config.searchable ? `<input class="alarm-multi-search" type="search" placeholder="搜索${config.label.replace("全部", "")}" />` : ""}
      <div class="alarm-multi-options">
        ${config.options.map((option) => `
          <label class="selector-option ${selected.has(option) ? "selected" : ""}" title="${option}">
            <input type="checkbox" value="${option}" ${selected.has(option) ? "checked" : ""} />
            <i class="selector-check ${selected.has(option) ? "checked" : ""}"></i>
            <span>${option}</span>
          </label>`).join("")}
      </div>
    </div>
  `;
  config.el.querySelector(".alarm-multi-trigger").addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelectorAll(".alarm-multi-select.open").forEach((item) => {
      if (item !== config.el) item.classList.remove("open");
    });
    config.el.classList.toggle("open");
  });
  config.el.querySelector(".alarm-multi-menu").addEventListener("click", (event) => event.stopPropagation());
  config.el.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      checkbox.checked ? selected.add(checkbox.value) : selected.delete(checkbox.value);
      renderAlarmMultiSelect(key, config);
      config.el.classList.add("open");
      renderAlarmDetailPage();
    });
  });
  const search = config.el.querySelector(".alarm-multi-search");
  if (search) {
    search.addEventListener("click", (event) => event.stopPropagation());
    search.addEventListener("input", () => {
      const keyword = search.value.trim().toLowerCase();
      config.el.querySelectorAll(".alarm-multi-options label").forEach((label) => {
        label.style.display = label.textContent.toLowerCase().includes(keyword) ? "" : "none";
      });
    });
  }
}

document.addEventListener("click", () => {
  document.querySelectorAll(".alarm-multi-select.open").forEach((item) => item.classList.remove("open"));
});

function renderAlarmDetailPage() {
  const alarms = filterAlarmDetailItems();
  const groups = groupAlarmsForTable(alarms);
  if (state.activePage === "alarm") {
    renderAlarmOverview(alarms);
  }
  const visibleIds = new Set(groups.map((group) => group.id));
  state.detailAlarmSelectedIds.forEach((id) => {
    if (!visibleIds.has(id)) state.detailAlarmSelectedIds.delete(id);
  });
  if (!groups.length) {
    state.detailAlarmSelectionMode = false;
  }
  els.alarmDetailCount.textContent = groups.length;
  els.alarmDetailTable.innerHTML = alarms
    .length
    ? groups
      .map((group, index) => {
        const alarm = group.latest;
        const typeLabel = alarmManagementTypeLabel(alarm);
        const alarmCode = alarmCodeForGroup(group);
        const checkCell = state.detailAlarmSelectionMode
          ? `<label class="alarm-row-check"><input type="checkbox" data-check-id="${group.id}" ${state.detailAlarmSelectedIds.has(group.id) ? "checked" : ""} /><i></i></label>`
          : "";
        return `
      <tr data-alarm-id="${group.id}" class="${state.detailAlarmSelectedIds.has(group.id) ? "selected" : ""}">
        <td class="alarm-select-cell">${checkCell}</td>
        <td class="alarm-index-cell"><div class="alarm-index-inner"><span class="alarm-row-index">${alarmCode}</span></div></td>
        <td class="alarm-level-cell">
          <div class="alarm-level-cell-inner">
            <span class="alarm-level-table ${alarmManagementLevelClass(alarm)}">${alarmManagementLevelLabel(alarm)}</span>
          </div>
        </td>
        <td>${alarm.title}</td>
        <td>${alarm.module}</td>
        <td>${alarm.stationId}${alarm.stationName}</td>
        <td>${alarm.location}</td>
        <td>${alarm.eventTime}</td>
        <td>${alarm.warningTime}</td>
        <td><div class="alarm-status-cell">${group.srCompleted ? '<span class="alarm-mail-badge" title="SR已返回">✉</span>' : ""}<span class="alarm-status-pill ${statusClass(alarm.status)}">${alarm.status}</span></div></td>
        <td><span class="alarm-source alarm-source-${homeAlarmPillClass(alarm)}">${typeLabel}</span></td>
      </tr>`;
      })
      .join("")
    : `<tr><td colspan="11">暂无匹配预警</td></tr>`;
  els.alarmDetailTable.querySelectorAll('input[data-check-id]').forEach((input) => {
    input.addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('change', () => {
      const groupId = input.dataset.checkId;
      if (input.checked) state.detailAlarmSelectedIds.add(groupId);
      else state.detailAlarmSelectedIds.delete(groupId);
      updateAlarmBatchBar();
      renderAlarmDetailPage();
    });
  });
  els.alarmDetailTable.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      const group = groups.find((item) => item.id === row.dataset.alarmId);
      if (!group) return;
      state.selectedAlarm = group.latest;
      if (state.detailAlarmSelectionMode) {
        if (state.detailAlarmSelectedIds.has(group.id)) state.detailAlarmSelectedIds.delete(group.id);
        else state.detailAlarmSelectedIds.add(group.id);
        updateAlarmBatchBar();
        renderAlarmDetailPage();
        return;
      }
      state.detailAlarmSelectedIds.clear();
      renderAlarmDetailPage();
      openAlarmModal(group);
    });
    row.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const group = groups.find((item) => item.id === row.dataset.alarmId);
      if (!group) return;
      state.detailAlarmContextId = group.id;
      state.selectedAlarm = group.latest;
      showAlarmRowContextMenu(event.clientX, event.clientY);
    });
  });
  if (!groups.length) {
    state.detailAlarmSelectedIds.clear();
    hideAlarmRowContextMenu();
  }
  if (!state.selectedAlarm || !alarms.some((alarm) => alarm.id === state.selectedAlarm.id)) {
    state.selectedAlarm = groups[0]?.latest || null;
  }
  updateAlarmBatchBar();
}

function updateAlarmBatchBar() {
  if (!els.alarmBatchBar || !els.alarmBatchCount || !els.alarmBatchAction) return;
  const count = state.detailAlarmSelectedIds.size;
  els.alarmBatchBar.classList.toggle('show', state.detailAlarmSelectionMode);
  els.alarmBatchCount.textContent = String(count);
  els.alarmBatchAction.disabled = count === 0;
}

function enableAlarmSelectionMode(event) {
  event.stopPropagation();
  hideAlarmRowContextMenu();
  state.detailAlarmSelectionMode = true;
  if (state.detailAlarmContextId) state.detailAlarmSelectedIds.add(state.detailAlarmContextId);
  updateAlarmBatchBar();
  renderAlarmDetailPage();
}

function cancelAlarmSelectionMode(event) {
  event?.stopPropagation();
  state.detailAlarmSelectionMode = false;
  state.detailAlarmSelectedIds.clear();
  hideAlarmRowContextMenu();
  updateAlarmBatchBar();
  renderAlarmDetailPage();
}

function selectedAlarmDetailGroups() {
  const groups = groupAlarmsForTable(filterAlarmDetailItems());
  return groups.filter((group) => state.detailAlarmSelectedIds.has(group.id));
}

function processAlarmGroups() {
  if (state.alarmProcessBatch) return state.alarmProcessBatchGroups.filter(Boolean);
  return state.selectedAlarmGroup ? [state.selectedAlarmGroup] : [];
}

function clearAlarmProcessBatch() {
  state.alarmProcessBatch = false;
  state.alarmProcessBatchGroups = [];
}

function clearAlarmBatchSelection() {
  state.detailAlarmSelectionMode = false;
  state.detailAlarmSelectedIds.clear();
  hideAlarmRowContextMenu();
  updateAlarmBatchBar();
  renderAlarmDetailPage();
}

function alarmBatchStatusValues(groups) {
  return [...new Set(groups.map((group) => group.latest?.status || ""))];
}

function showAlarmBatchStatusMismatch(groups) {
  if (!els.alarmProcessModal || !els.alarmProcessPanel) return;
  const statuses = alarmBatchStatusValues(groups).filter(Boolean).join("、");
  els.alarmProcessModal.classList.add("show");
  els.alarmProcessModal.setAttribute("aria-hidden", "false");
  els.alarmProcessPanel.classList.add("show");
  els.alarmProcessPanel.innerHTML = `
    <div class="process-head"><strong>无法批量处理</strong><span>仅支持对当前状态相同的预警/告警进行批量处理</span></div>
    <div class="sr-return-card">
      <span>当前选中条目的状态不一致：${statuses || "无状态"}。请重新选择状态相同的条目后再批量处理。</span>
      <button type="button" data-process-action="dismiss-batch-warning">知道了</button>
    </div>
  `;
  els.alarmProcessPanel.querySelector("[data-process-action='dismiss-batch-warning']")?.addEventListener("click", closeAlarmProcessModal);
}

function showAlarmRowContextMenu(clientX, clientY) {
  if (!els.alarmRowContextMenu) return;
  els.alarmRowContextMenu.classList.add("show");
  const menuWidth = 100;
  const menuHeight = 44;
  const left = Math.min(clientX, window.innerWidth - menuWidth - 12);
  const top = Math.min(clientY, window.innerHeight - menuHeight - 12);
  els.alarmRowContextMenu.style.left = `${Math.max(12, left)}px`;
  els.alarmRowContextMenu.style.top = `${Math.max(12, top)}px`;
}

function hideAlarmRowContextMenu() {
  if (!els.alarmRowContextMenu) return;
  els.alarmRowContextMenu.classList.remove("show");
}

function handleBatchAlarmProcess(event) {
  event.stopPropagation();
  hideAlarmRowContextMenu();
  const groups = selectedAlarmDetailGroups();
  if (!groups.length) return;
  if (alarmBatchStatusValues(groups).length > 1) {
    showAlarmBatchStatusMismatch(groups);
    return;
  }
  state.alarmProcessBatch = true;
  state.alarmProcessBatchGroups = groups;
  state.selectedAlarmGroup = groups[0];
  state.selectedAlarm = groups[0].latest;
  state.activeModalAlarmId = groups[0].latest.id;
  state.alarmProcessMode = "choose";
  renderAlarmProcessPanel();
}

function filterAlarmDetailItems() {
  const start = els.alarmDetailStart.value ? new Date(`${els.alarmDetailStart.value}T00:00:00`) : null;
  const end = els.alarmDetailEnd.value ? new Date(`${els.alarmDetailEnd.value}T23:59:59`) : null;
  const { code, level, module, name, station, location, status, source } = state.alarmDetailSelections;
  const filtered = alarmManagementItems().filter((alarm) => {
    const date = new Date(`${alarm.dateISO}T12:00:00`);
    const stationLabel = `${alarm.stationId}${alarm.stationName}`;
    return (
      (!module.size || module.has(alarm.module)) &&
      (!level.size || level.has(alarmManagementLevelLabel(alarm))) &&
      (!name.size || name.has(alarm.title)) &&
      (!station.size || station.has(stationLabel)) &&
      (!location.size || location.has(alarm.location)) &&
      (!status.size || status.has(alarm.status)) &&
      (!source.size || source.has(alarmManagementTypeLabel(alarm))) &&
      (!start || date >= start) &&
      (!end || date <= end)
    );
  });
  if (!code.size) return filtered;
  const selectedIds = new Set(
    groupAlarmsForTable(filtered)
      .filter((group) => code.has(alarmCodeForGroup(group)))
      .flatMap((group) => group.alarms.map((alarm) => alarm.id))
  );
  return filtered.filter((alarm) => selectedIds.has(alarm.id));
}

function alarmGroupKey(alarm) {
  return [alarm.title, alarm.module, alarm.stationId, alarm.location, alarm.source].join("||");
}

function alarmTimestamp(alarm, key = "warningTime") {
  return new Date(String(alarm[key] || "").replace(/\//g, "-")).getTime() || 0;
}

function alarmDurationHours(alarm) {
  return Math.max(1, ((alarm.id.length * 7) % 24) + (alarm.type === "level1" ? 6 : alarm.type === "level2" ? 3 : 1));
}

function beijingDateTimeLocal(date = new Date()) {
  const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return beijing.toISOString().slice(0, 16);
}

function formatDateTimeLocalLabel(value) {
  const [datePart = "", timePart = ""] = String(value || "").split("T");
  return `${datePart.replace(/-/g, "/")} ${timePart}`.trim();
}

function addDaysToDateTimeLocal(value, days) {
  const [datePart = "", timePart = "00:00"] = String(value || "").split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const date = Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
    ? new Date(year, month - 1, day, hour || 0, minute || 0)
    : new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function srFailureModesForAlarm(alarm) {
  const title = alarm.title || "";
  if (title.includes("铜排") || title.includes("螺栓")) return ["铜排螺栓松动", "绝缘子故障", "连接排发热", "装配力矩不足", "其他"];
  if (title.includes("绝缘")) return ["绝缘电阻异常", "线束松动", "绝缘子故障", "采样回路异常", "其他"];
  if (title.includes("电压")) return ["单体压差过大", "采样线束异常", "电芯一致性衰减", "BMS采样异常", "其他"];
  if (title.includes("温")) return ["热管理异常", "温度探头异常", "冷却回路异常", "电芯过热", "其他"];
  if (title.includes("通讯") || title.includes("通信")) return ["通讯链路中断", "网关离线", "规约解析异常", "设备地址冲突", "其他"];
  return ["设备状态异常", "传感器采样异常", "控制策略异常", "现场环境异常", "其他"];
}

function srReturnConclusionForAlarm(alarm) {
  const title = alarm.title || "";
  if (title.includes("铜排") || title.includes("螺栓")) return "现场已完成排查，确认该Pack存在铜排螺栓松动。";
  if (title.includes("绝缘")) return "现场已完成排查，确认该支路存在绝缘子老化及绝缘电阻下降。";
  if (title.includes("电压")) return "现场已完成排查，确认该Pack存在单体压差扩大及采样线束接触异常。";
  if (title.includes("温")) return "现场已完成排查，确认该设备存在温度探头漂移及局部散热不均。";
  if (title.includes("通讯") || title.includes("通信")) return "现场已完成排查，确认该设备存在网关链路不稳定及通讯中断。";
  return `现场已完成排查，确认${alarm.location}存在${alarm.title}相关异常。`;
}

function failureModeNeedsRootCause(mode) {
  return ["采样回路异常", "BMS采样异常", "传感器采样异常", "控制策略异常", "现场环境异常", "规约解析异常", "装配力矩不足", "其他"].includes(mode);
}

function renderRootCausePanel(alarm) {
  if (!alarm.pendingRootCause) return "";
  return `
    <div class="root-cause-panel">
      <div>
        <strong>根因补充</strong>
        <span>当前预警已关闭，需补充根因后完成最终闭环。</span>
      </div>
      <textarea id="alarmRootCauseInput" placeholder="请输入根因说明，例如：装配力矩不足导致铜排螺栓松动，复紧后绝缘恢复正常。">${alarm.rootCause || ""}</textarea>
      <button type="button" id="alarmRootCauseSubmit">提交根因</button>
    </div>
  `;
}

function renderStationHandledPanel(alarm) {
  if (!alarm.stationHandled) return "";
  return `
    <div class="station-handled-panel">
      <div><span>站端排查动作</span><strong>${alarm.stationAction || "站端已完成现场复核和参数复测。"}</strong></div>
      <div><span>站端排查结论</span><strong>${alarm.stationConclusion || "站端已处理完成，关联云端预警同步关闭。"}</strong></div>
    </div>
  `;
}

function renderClosedAlarmSummary(alarm) {
  if (!String(alarm.status || "").includes("关闭")) return "";
  const alarmNoun = alarmNounForSource(alarm.source);
  const srNo = alarm.srNo || "--";
  const actionLabel = alarm.stationHandled ? "处理动作" : "操作指导";
  const guide = alarm.srGuide || (alarm.stationHandled ? alarm.stationAction || "站端已完成现场处理，无需下发 SR。" : "--");
  const conclusion =
    alarm.srConclusion ||
    alarm.stationConclusion ||
    (alarm.closeReason ? `预警已按“${alarm.closeReason}”关闭。` : "预警已关闭，闭环信息已归档。");
  const accuracy = [alarm.srCloseReason, alarm.srTypeAccuracy].filter(Boolean).join(" / ") || (alarm.stationHandled ? "预警正确 / 类型准确" : "--");
  const failureMode = alarm.srFailureMode || (alarm.stationHandled ? srFailureModesForAlarm(alarm)[0] || "站端现场处置" : "--");
  const rootCause = alarm.rootCause || "";
  return `
    <div class="closed-summary-panel">
      <div><span>SR编号</span><strong>${srNo}</strong></div>
      <div><span>${actionLabel}</span><strong>${guide}</strong></div>
      <div><span>排查结论</span><strong>${conclusion}</strong></div>
      <div><span>${alarmNoun}准确性</span><strong>${accuracy}</strong></div>
      <div><span>失效类型</span><strong>${failureMode}</strong></div>
      ${rootCause ? `<div class="closed-summary-root-cause"><span>根因</span><strong>${rootCause}</strong></div>` : ""}
    </div>
  `;
}

function renderSrResultReview(group) {
  const alarm = group.latest;
  return `
    <div class="process-head"><strong>SR 返回结果</strong></div>
    <div class="sr-form-grid sr-return-grid">
      <label><span>SR编号</span><input value="${alarm.srNo || ""}" readonly /></label>
      <label><span>关联工单编号</span><input value="${alarm.srWorkOrderNo || alarm.workOrderNo || ""}" readonly /></label>
      <label class="sr-full-field"><span>排查结论</span><textarea readonly>${alarm.srConclusion || srReturnConclusionForAlarm(alarm)}</textarea></label>
      <label><span>确认结果</span><input value="${[alarm.srCloseReason, alarm.srTypeAccuracy || alarm.closeReason].filter(Boolean).join(" / ")}" readonly /></label>
      <label><span>失效模式</span><input value="${alarm.srFailureMode || ""}" readonly /></label>
      ${
        alarm.pendingRootCause
          ? `<label class="sr-full-field"><span>根因补充</span><textarea id="processRootCauseInput" placeholder="请输入根因说明，例如：装配力矩不足导致铜排螺栓松动，复紧后绝缘恢复正常。">${alarm.rootCause || ""}</textarea></label>`
          : ""
      }
    </div>
    ${
      alarm.pendingRootCause
        ? `<div class="process-actions"><button type="button" data-process-action="submit-root-cause">提交根因</button></div>`
        : ""
    }
  `;
}

function alarmNounForSource(source) {
  return String(source || "").includes("告警") ? "告警" : "预警";
}

function alarmTimeLabelForSource(source) {
  return `${alarmNounForSource(source)}时间`;
}

function renderSrAlarmContext(alarm) {
  const alarmNoun = alarmNounForSource(alarm.source);
  const stationLabel = `${alarm.stationId || ""}${alarm.stationName || ""}`;
  return `
    <div class="sr-alarm-context">
      <div><span>场站</span><strong title="${stationLabel}">${stationLabel}</strong></div>
      <div><span>位置</span><strong title="${alarm.location}">${alarm.location}</strong></div>
      <div><span>模块</span><strong>${alarm.module}</strong></div>
      <div><span>${alarmNoun}名称</span><strong>${alarm.title}</strong></div>
    </div>
  `;
}

function renderSrIssueForm(group, options = {}) {
  const alarm = group.latest;
  const hideContext = Boolean(options.hideContext);
  const srNo = alarm.srNo || `S${263 + (alarm.id.length % 70)}`;
  const srSendTime = alarm.srIssued ? alarm.srSendDate || beijingDateTimeLocal() : beijingDateTimeLocal();
  const srDueTime = alarm.srDueDate || addDaysToDateTimeLocal(srSendTime, 14);
  return `
    <div class="process-head"><strong>下发 SR</strong></div>
    ${hideContext ? "" : renderSrAlarmContext(alarm)}
    <div class="sr-form-grid">
      <label class="sr-full-field"><span>SR编号</span><input id="srNoInput" value="${srNo}" /></label>
      <label class="sr-guide-field"><span>操作指导</span><textarea id="srGuideInput"></textarea></label>
      <label class="sr-full-field"><span>附件</span><input id="srAttachmentInput" type="file" multiple /></label>
      <label><span>SR下发时间</span><input id="srSendDateInput" type="text" value="${formatDateTimeLocalLabel(srSendTime)}" data-sr-value="${srSendTime}" readonly /></label>
      <label><span>期望完成时间</span><input id="srDueDateInput" type="datetime-local" value="${srDueTime}" /></label>
    </div>
    <div class="process-actions">
      <button type="button" data-process-action="submit-sr">确认下发</button>
    </div>
  `;
}

function renderSrReturnConfirmation(group) {
  const alarm = group.latest;
  const modes = srFailureModesForAlarm(alarm);
  const conclusion = alarm.srConclusion || srReturnConclusionForAlarm(alarm);
  return `
    <div class="process-head"><strong>SR 返回确认</strong></div>
    <div class="sr-form-grid sr-return-grid">
      <label><span>SR编号</span><input id="srReturnNoInput" value="${alarm.srNo || ""}" readonly /></label>
      <label><span>关联工单编号</span><input id="srWorkOrderInput" value="${alarm.srWorkOrderNo || alarm.workOrderNo || `M${2276500 + (alarm.id.length % 900)}`}" /></label>
      <label class="sr-full-field"><span>排查结论</span><textarea id="srConclusionInput" readonly>${conclusion}</textarea></label>
      <div class="sr-full-field sr-decision-row">
        <span>确认结果</span>
        <div class="process-options">
          <label><input name="srVerdict" type="radio" value="预警正确" />预警正确</label>
          <label><input name="srVerdict" type="radio" value="预警错误" />预警错误</label>
        </div>
      </div>
      <div class="sr-full-field sr-decision-row sr-correct-options" hidden>
        <span>类型判断</span>
        <div class="process-options">
          <label><input name="srTypeAccuracy" type="radio" value="类型准确" />类型准确</label>
          <label><input name="srTypeAccuracy" type="radio" value="类型不准确" />类型不准确</label>
        </div>
      </div>
      <label class="sr-full-field sr-correct-options" hidden><span>类型选择</span><select id="srFailureModeSelect">
        <option value="">请选择类型</option>
        ${modes.map((mode) => `<option value="${mode}">${mode}</option>`).join("")}
      </select></label>
      <label class="sr-full-field sr-other-mode" hidden><span>具体类型</span><input id="srFailureModeOther" placeholder="请输入具体类型" /></label>
      <div class="sr-full-field sr-decision-row sr-error-options" hidden>
        <span>错误原因</span>
        <div class="process-options">
          ${["误报", "数据异常", "其他"].map((reason) => `<label><input name="srErrorReason" type="radio" value="${reason}" />${reason}</label>`).join("")}
        </div>
      </div>
      <label class="sr-full-field sr-error-other" hidden><span>具体原因</span><textarea id="srErrorOtherReason" placeholder="选择“其他”时必须填写具体原因"></textarea></label>
    </div>
    <div class="process-actions">
      <button type="button" data-process-action="confirm-sr-close">确认关闭</button>
    </div>
  `;
}

function groupAlarmsForTable(alarms) {
  const map = new Map();
  alarms.forEach((alarm) => {
    const id = alarmGroupKey(alarm);
    if (!map.has(id)) map.set(id, { id, alarms: [] });
    map.get(id).alarms.push(alarm);
  });
  return [...map.values()]
    .map((group) => {
      group.alarms.sort((a, b) => alarmTimestamp(b) - alarmTimestamp(a));
      group.latest = group.alarms[0];
      group.srIssued = group.alarms.some((alarm) => alarm.srIssued);
      group.srCompleted = group.alarms.some((alarm) => alarm.srCompleted);
      return group;
    })
    .sort((a, b) => alarmOrder(a.latest.type) - alarmOrder(b.latest.type) || alarmTimestamp(b.latest) - alarmTimestamp(a.latest));
}

function getAlarmGroupFromAlarm(alarm) {
  if (!alarm) return null;
  const source = alarm.source === "数据告警" ? state.homeDataAlarms : state.allAlarms;
  return groupAlarmsForTable(source.filter((item) => alarmGroupKey(item) === alarmGroupKey(alarm)))[0] || null;
}

function alarmCodeForGroup(group) {
  const alarm = group.latest || group.alarms?.[0] || {};
  const prefix = String(alarm.source || "").includes("云端")
    ? "CW"
    : String(alarm.source || "").includes("站端")
      ? "SW"
      : "EA";
  const date = String(alarm.dateISO || alarm.warningTime || "")
    .slice(0, 10)
    .replace(/\D/g, "")
    .padEnd(8, "0")
    .slice(0, 8);
  const key = group.id || `${alarm.id || ""}${alarm.title || ""}${alarm.stationId || ""}`;
  const serialSeed = Array.from(String(key)).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 3), 0);
  const serial = String((serialSeed % 99999) + 1).padStart(5, "0");
  return `${prefix}-${date}${serial}`;
}

function getAlarmGroup(groupOrAlarm) {
  if (!groupOrAlarm) return null;
  if (Array.isArray(groupOrAlarm.alarms)) return groupOrAlarm;
  return getAlarmGroupFromAlarm(groupOrAlarm);
}

function statusClass(status) {
  if (String(status).includes("排查中")) return "status-investigating";
  if (String(status).includes("关闭")) return "status-closed";
  return "status-pending";
}

function updateAlarmGroup(group, patch) {
  if (!group) return;
  const nextPatch = { ...patch };
  if (String(nextPatch.status || "").includes("关闭") && !nextPatch.closedAt) {
    nextPatch.closedAt = group.latest.closedAt || formatFullDateTime(new Date());
  }
  const ids = new Set(group.alarms.map((alarm) => alarm.id));
  const linkedGroupIds = new Set(group.alarms.map((alarm) => alarm.linkGroupId).filter(Boolean));
  if (linkedGroupIds.size) {
    state.allAlarms.forEach((alarm) => {
      if (linkedGroupIds.has(alarm.linkGroupId)) ids.add(alarm.id);
    });
  }
  state.allAlarms.forEach((alarm) => {
    if (ids.has(alarm.id)) Object.assign(alarm, nextPatch);
  });
  state.alarms.forEach((alarm) => {
    if (ids.has(alarm.id)) Object.assign(alarm, nextPatch);
  });
  state.selectedAlarmGroup = getAlarmGroupFromAlarm(group.latest);
  state.selectedAlarm = state.selectedAlarmGroup?.alarms.find((alarm) => alarm.id === state.activeModalAlarmId) || state.selectedAlarmGroup?.latest || null;
  renderAlarms();
  if (state.activePage === "alarm") {
    renderAlarmDetailFilters();
    renderAlarmDetailPage();
  }
}

function renderAlarmInspector(alarmOrGroup) {
  const group = getAlarmGroup(alarmOrGroup);
  const alarm = group?.alarms.find((item) => item.id === state.activeModalAlarmId) || group?.latest || null;
  if (!group || !alarm) {
    els.alarmInspectorBody.textContent = "点击任意预警查看完整内容";
    return;
  }
  const alarmTimeLabel = alarmTimeLabelForSource(alarm.source);
  els.alarmInspectorBody.innerHTML = `
    <div class="alarm-detail-hero alarm-hero-${alarm.type}">
      <span class="alarm-source-corner alarm-source-corner-${homeAlarmPillClass(alarm)}"><span>${alarmManagementTypeLabel(alarm)}</span></span>
      <strong>${alarm.title}</strong>
      <p>${alarm.level === "一级" ? "立即复核云端诊断结果并安排现场排查。" : alarm.level === "二级" ? "持续观察趋势，纳入当班巡检计划。" : "记录风险变化，按计划跟踪闭环。"}</p>
    </div>
    <div class="alarm-group-context">
      <div><span>模块</span><strong>${alarm.module}</strong></div>
      <div><span>场站</span><strong>${alarm.stationId}${alarm.stationName}</strong></div>
      <div><span>位置</span><strong>${alarm.location}</strong></div>
    </div>
    ${renderClosedAlarmSummary(group.latest)}
    <div class="alarm-group-table-wrap">
      <table class="alarm-group-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>等级</th>
            <th>事件时间</th>
            <th>${alarmTimeLabel}</th>
            <th>关闭时间</th>
            <th>持续时长</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${group.alarms
            .map(
              (item, index) => `
            <tr class="${item.id === alarm.id ? "active" : ""}" data-alarm-id="${item.id}">
              <td>${index + 1}</td>
              <td><span class="alarm-level-table ${alarmManagementLevelClass(item)}">${alarmManagementLevelLabel(item)}</span></td>
              <td>${item.eventTime}</td>
              <td>${item.warningTime}</td>
              <td>${item.closedAt || ""}</td>
              <td>${alarmDurationHours(item)} 小时</td>
              <td><span class="alarm-status-pill ${statusClass(item.status)}">${item.status}</span></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    ${renderRootCausePanel(group.latest)}
  `;
  els.alarmInspectorBody.querySelectorAll(".alarm-group-table tbody tr").forEach((row) => {
    row.addEventListener("click", () => {
      state.activeModalAlarmId = row.dataset.alarmId;
      state.selectedAlarm = group.alarms.find((item) => item.id === state.activeModalAlarmId) || group.latest;
      renderAlarmInspector(group);
      renderAlarmTrend(state.selectedAlarm);
      state.alarmProcessMode = null;
      closeAlarmProcessModal();
    });
  });
  const jumpButton = els.alarmInspectorBody.querySelector(".alarm-linked-jump");
  if (jumpButton) {
    jumpButton.addEventListener("click", () => {
      const target = state.allAlarms.find((item) => item.id === jumpButton.dataset.linkedId);
      if (target) openAlarmModal(target);
    });
  }
  const rootCauseSubmit = els.alarmInspectorBody.querySelector("#alarmRootCauseSubmit");
  rootCauseSubmit?.addEventListener("click", () => {
    const rootCause = els.alarmInspectorBody.querySelector("#alarmRootCauseInput")?.value.trim() || "";
    if (!rootCause) return;
    updateAlarmGroup(group, {
      status: group.latest.pendingFinalStatus || "关闭-正确-类型准确",
      rootCause,
      pendingRootCause: false,
    });
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmDetailPage();
  });
  if (els.alarmProcessBtn) {
    const locked = Boolean(group.latest.stationHandled);
    els.alarmProcessBtn.disabled = locked;
    els.alarmProcessBtn.title = locked ? "站端已处理完成，无需再次处理" : "";
  }
}

function renderAlarmOverview(alarms = filterAlarmDetailItems()) {
  renderSafely(() => renderRiskAlarmPie(alarms));
  renderSafely(() => renderRiskAlarmSourcePie(alarms));
  renderSafely(() => renderRiskModules(alarms));
  renderSafely(() => renderRiskAlarmNameTop(alarms));
}

function openAlarmModal(alarm) {
  const group = getAlarmGroup(alarm);
  if (!group) return;
  state.selectedAlarmGroup = group;
  state.selectedAlarm = group.latest;
  state.activeModalAlarmId = group.latest.id;
  state.alarmProcessMode = null;
  renderAlarmInspector(group);
  els.alarmDetailModal.classList.add("show");
  els.alarmDetailModal.setAttribute("aria-hidden", "false");
  renderAlarmTrend(group.latest);
  closeAlarmProcessModal();
}

function closeAlarmModal() {
  if (!els.alarmDetailModal) return;
  els.alarmDetailModal.classList.remove("show");
  els.alarmDetailModal.setAttribute("aria-hidden", "true");
  els.alarmTrendTooltip.classList.remove("show");
  if (els.alarmProcessBtn) {
    els.alarmProcessBtn.disabled = false;
    els.alarmProcessBtn.title = "";
  }
  state.alarmProcessMode = null;
  closeAlarmProcessModal();
}

function closeAlarmProcessModal() {
  if (!els.alarmProcessModal) return;
  els.alarmProcessModal.classList.remove("show");
  els.alarmProcessModal.setAttribute("aria-hidden", "true");
  state.alarmProcessMode = null;
  clearAlarmProcessBatch();
  if (els.alarmProcessPanel) {
    els.alarmProcessPanel.classList.remove("show");
    els.alarmProcessPanel.innerHTML = "";
  }
}

function renderAlarmProcessPanel() {
  if (!els.alarmProcessPanel) return;
  const groups = processAlarmGroups();
  const group = groups[0];
  if (!group || !state.alarmProcessMode) {
    els.alarmProcessModal?.classList.remove("show");
    els.alarmProcessModal?.setAttribute("aria-hidden", "true");
    els.alarmProcessPanel.classList.remove("show");
    els.alarmProcessPanel.innerHTML = "";
    return;
  }
  els.alarmProcessModal?.classList.add("show");
  els.alarmProcessModal?.setAttribute("aria-hidden", "false");
  els.alarmProcessPanel.classList.add("show");
  if (state.alarmProcessMode === "analysis") {
    return;
  }
  if (state.alarmProcessMode === "choose") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>处理方式</strong></div>
      <div class="process-choice-grid">
        <button type="button" data-process-action="close-now">关闭预警</button>
        <button type="button" data-process-action="open-sr">下发 SR</button>
      </div>
    `;
  } else if (state.alarmProcessMode === "close") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>关闭预警</strong><span>关闭后列表状态立即更新</span></div>
      <div class="process-options">
        ${["误报", "数据异常", "其他"].map((reason) => `<label><input name="closeReason" type="radio" value="${reason}" />${reason}</label>`).join("")}
      </div>
      <textarea id="alarmCloseRemark" placeholder="选择“其他”时必须填写具体原因"></textarea>
      <div class="process-actions">
        <button type="button" data-process-action="confirm-close">确认关闭</button>
      </div>
    `;
  } else if (state.alarmProcessMode === "sr") {
    const srNo = group.latest.srNo || `S${263 + (group.latest.id.length % 70)}`;
    const srSendTime = group.latest.srIssued ? group.latest.srSendDate || beijingDateTimeLocal() : beijingDateTimeLocal();
    const srDueTime = group.latest.srDueDate || addDaysToDateTimeLocal(srSendTime, 14);
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>下发 SR</strong></div>
      <div class="sr-form-grid">
        <label class="sr-full-field"><span>SR编号</span><input id="srNoInput" value="${srNo}" /></label>
        <label class="sr-guide-field"><span>操作指导</span><textarea id="srGuideInput"></textarea></label>
        <label class="sr-full-field"><span>附件</span><input id="srAttachmentInput" type="file" multiple /></label>
        <label><span>SR下发时间</span><input id="srSendDateInput" type="text" value="${formatDateTimeLocalLabel(srSendTime)}" data-sr-value="${srSendTime}" readonly /></label>
        <label><span>期望完成时间</span><input id="srDueDateInput" type="datetime-local" value="${srDueTime}" /></label>
      </div>
      <div class="process-actions">
        <button type="button" data-process-action="submit-sr">确认下发</button>
      </div>
    `;
  } else if (state.alarmProcessMode === "srSubmitted") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>SR 已下发</strong><span>列表状态已变更为“排查中”</span></div>
      <div class="sr-return-card">
        <span>${state.alarmProcessBatch ? "已对本次选中的全部条目下发 SR。" : "等待 SR 完成返回。演示态可点击下方按钮模拟返回，返回后列表状态列前会出现信封标记。"}</span>
        ${state.alarmProcessBatch ? "" : `<button type="button" data-process-action="complete-sr">模拟 SR 完成返回</button>`}
      </div>
    `;
  } else if (state.alarmProcessMode === "srClose") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>SR 返回确认</strong><span>请选择预警类型判断结果</span></div>
      <div class="process-options">
        <label><input name="srVerdict" type="radio" value="预警正确" />预警正确</label>
        <label><input name="srVerdict" type="radio" value="预警错误" />预警错误</label>
      </div>
      <div class="process-actions">
        <button type="button" data-process-action="confirm-sr-close">确认关闭</button>
      </div>
    `;
  }
  if (state.alarmProcessMode === "sr") {
    els.alarmProcessPanel.innerHTML = renderSrIssueForm(group, { hideContext: state.alarmProcessBatch });
  } else if (state.alarmProcessMode === "srClose") {
    els.alarmProcessPanel.innerHTML = renderSrReturnConfirmation(group);
  } else if (state.alarmProcessMode === "srResult") {
    els.alarmProcessPanel.innerHTML = renderSrResultReview(group);
  }
  bindAlarmProcessPanel();
}

function bindAlarmProcessPanel() {
  els.alarmProcessPanel.querySelectorAll("[data-process-action]").forEach((button) => {
    button.addEventListener("click", () => handleAlarmProcessAction(button.dataset.processAction));
  });
  els.alarmProcessPanel.querySelectorAll("input[name='srVerdict']").forEach((input) => {
    input.addEventListener("change", () => {
      const verdict = els.alarmProcessPanel.querySelector("input[name='srVerdict']:checked")?.value || "";
      const isCorrect = verdict === "预警正确";
      const isError = verdict === "预警错误";
      els.alarmProcessPanel.querySelectorAll(".sr-correct-options").forEach((item) => {
        item.hidden = !isCorrect;
      });
      els.alarmProcessPanel.querySelectorAll(".sr-error-options").forEach((item) => {
        item.hidden = !isError;
      });
      if (!isCorrect) {
        els.alarmProcessPanel.querySelectorAll("input[name='srTypeAccuracy']").forEach((item) => {
          item.checked = false;
        });
        const modeSelect = els.alarmProcessPanel.querySelector("#srFailureModeSelect");
        if (modeSelect) modeSelect.value = "";
        const otherModeField = els.alarmProcessPanel.querySelector(".sr-other-mode");
        if (otherModeField) otherModeField.hidden = true;
      }
      if (!isError) {
        els.alarmProcessPanel.querySelectorAll("input[name='srErrorReason']").forEach((item) => {
          item.checked = false;
        });
        const otherReasonField = els.alarmProcessPanel.querySelector(".sr-error-other");
        if (otherReasonField) otherReasonField.hidden = true;
      }
    });
  });
  const failureModeSelect = els.alarmProcessPanel.querySelector("#srFailureModeSelect");
  const otherModeField = els.alarmProcessPanel.querySelector(".sr-other-mode");
  failureModeSelect?.addEventListener("change", () => {
    if (!otherModeField) return;
    otherModeField.hidden = failureModeSelect.value !== "其他";
  });
  els.alarmProcessPanel.querySelectorAll("input[name='srErrorReason']").forEach((input) => {
    input.addEventListener("change", () => {
      const otherReasonField = els.alarmProcessPanel.querySelector(".sr-error-other");
      if (!otherReasonField) return;
      otherReasonField.hidden = input.value !== "其他" || !input.checked;
    });
  });
}

function handleAlarmProcessAction(action) {
  const groups = processAlarmGroups();
  const group = groups[0];
  if (!group) return;
  if (action === "close-now") {
    state.alarmProcessMode = "close";
    renderAlarmProcessPanel();
    return;
  }
  if (action === "open-sr") {
    state.alarmProcessMode = "sr";
    renderAlarmProcessPanel();
    return;
  }
  if (action === "confirm-close") {
    const reason = els.alarmProcessPanel.querySelector("input[name='closeReason']:checked")?.value;
    const remark = els.alarmProcessPanel.querySelector("#alarmCloseRemark")?.value.trim() || "";
    if (!reason || (reason === "其他" && !remark)) {
      showAlarmProcessError(reason === "其他" ? "请补充其他原因" : "请选择关闭原因");
      return;
    }
    groups.forEach((item) => updateAlarmGroup(item, {
      status: `关闭-错误-${reason}`,
      closeReason: reason,
      closeRemark: remark,
    }));
    if (state.alarmProcessBatch) {
      clearAlarmBatchSelection();
      clearAlarmProcessBatch();
      state.alarmProcessMode = null;
      renderAlarmProcessPanel();
      return;
    }
    state.alarmProcessMode = null;
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmProcessPanel();
    return;
  }
  if (action === "submit-sr") {
    const srPatch = {
      status: "排查中",
      srIssued: true,
      srCompleted: false,
      srNo: els.alarmProcessPanel.querySelector("#srNoInput")?.value.trim() || "",
      srGuide: els.alarmProcessPanel.querySelector("#srGuideInput")?.value.trim() || "",
      srSendDate: beijingDateTimeLocal(),
      srDueDate: els.alarmProcessPanel.querySelector("#srDueDateInput")?.value || "",
      srAttachmentCount: els.alarmProcessPanel.querySelector("#srAttachmentInput")?.files.length || 0,
    };
    groups.forEach((item) => updateAlarmGroup(item, srPatch));
    state.alarmProcessMode = "srSubmitted";
    if (state.alarmProcessBatch) {
      clearAlarmBatchSelection();
      renderAlarmProcessPanel();
      return;
    }
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmProcessPanel();
    return;
  }
  if (action === "complete-sr") {
    updateAlarmGroup(group, { srCompleted: true });
    state.alarmProcessMode = "srClose";
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmProcessPanel();
    return;
  }
  if (action === "submit-root-cause") {
    const rootCause = els.alarmProcessPanel.querySelector("#processRootCauseInput")?.value.trim() || "";
    if (!rootCause) {
      showAlarmProcessError("请输入根因说明");
      return;
    }
    updateAlarmGroup(group, {
      status: group.latest.pendingFinalStatus || "关闭-正确-类型准确",
      rootCause,
      pendingRootCause: false,
    });
    state.alarmProcessMode = "srResult";
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmDetailPage();
    renderAlarmProcessPanel();
    return;
  }
  if (action === "confirm-sr-close") {
    const verdict = els.alarmProcessPanel.querySelector("input[name='srVerdict']:checked")?.value;
    const typeAccuracy = els.alarmProcessPanel.querySelector("input[name='srTypeAccuracy']:checked")?.value;
    const errorReason = els.alarmProcessPanel.querySelector("input[name='srErrorReason']:checked")?.value;
    const errorRemark = els.alarmProcessPanel.querySelector("#srErrorOtherReason")?.value.trim() || "";
    const selectedMode = els.alarmProcessPanel.querySelector("#srFailureModeSelect")?.value || "";
    const customMode = els.alarmProcessPanel.querySelector("#srFailureModeOther")?.value.trim() || "";
    const failureMode = selectedMode === "其他" ? customMode : selectedMode;
    if (!verdict) {
      showAlarmProcessError("请选择预警正确或预警错误");
      return;
    }
    if (verdict === "预警错误") {
      if (!errorReason || (errorReason === "其他" && !errorRemark)) {
        showAlarmProcessError(errorReason === "其他" ? "请填写具体原因" : "请选择错误原因");
        return;
      }
      updateAlarmGroup(group, {
        status: `关闭-错误-${errorReason}`,
        srCloseReason: verdict,
        closeReason: errorReason,
        closeRemark: errorRemark,
        srWorkOrderNo: els.alarmProcessPanel.querySelector("#srWorkOrderInput")?.value.trim() || "",
        srConclusion: els.alarmProcessPanel.querySelector("#srConclusionInput")?.value.trim() || "",
        pendingRootCause: false,
        pendingFinalStatus: "",
      });
      state.alarmProcessMode = null;
      closeAlarmProcessModal();
      renderAlarmInspector(state.selectedAlarmGroup);
      renderAlarmDetailPage();
      return;
    }
    if (!typeAccuracy) {
      showAlarmProcessError("请选择类型准确或类型不准确");
      return;
    }
    if (!selectedMode || (selectedMode === "其他" && !customMode)) {
      showAlarmProcessError(selectedMode === "其他" ? "请输入具体类型" : "请选择类型");
      return;
    }
    const needsRootCause = typeAccuracy === "类型不准确" && failureModeNeedsRootCause(selectedMode);
    const finalStatus = typeAccuracy === "类型准确" ? "关闭-正确-类型准确" : "关闭-正确-类型不准确";
    updateAlarmGroup(group, {
      status: needsRootCause ? "关闭-正确-待补充根因" : finalStatus,
      srCloseReason: verdict,
      srTypeAccuracy: typeAccuracy,
      srWorkOrderNo: els.alarmProcessPanel.querySelector("#srWorkOrderInput")?.value.trim() || "",
      srConclusion: els.alarmProcessPanel.querySelector("#srConclusionInput")?.value.trim() || "",
      srFailureMode: failureMode,
      pendingRootCause: needsRootCause,
      pendingFinalStatus: finalStatus,
    });
    state.alarmProcessMode = null;
    closeAlarmProcessModal();
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmDetailPage();
  }
}

function showAlarmProcessError(message) {
  const old = els.alarmProcessPanel.querySelector(".process-error");
  old?.remove();
  const error = document.createElement("div");
  error.className = "process-error";
  error.textContent = message;
  els.alarmProcessPanel.appendChild(error);
}

function alarmTrendData(alarm) {
  const levelOffset = alarm.type === "level1" ? 18 : alarm.type === "level2" ? 10 : 4;
  const linkSeed = (alarm.linkGroupId || alarm.id).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const isCloudSource = isCloudAlarmSource(alarm.source);
  const sourceOffset = isCloudSource ? 6 : -4;
  const amplitude = isCloudSource ? 7.6 : 11.2;
  const phase = (linkSeed % 9) * 0.18 + (isCloudSource ? 0.25 : 0.88);
  const tailBoost = isCloudSource ? levelOffset / 4 : levelOffset / 6;
  const base = 46 + levelOffset + (linkSeed % 8) + sourceOffset;
  return Array.from({ length: 18 }, (_, index) => {
    const swing = Math.sin(index * 0.68 + phase) * amplitude;
    const ripple = Math.cos(index * 0.31 + (linkSeed % 5)) * (isCloudSource ? 3.2 : 4.6);
    const tail = index > 11 ? tailBoost + (isStationWarningSource(alarm.source) ? (index - 11) * 0.55 : (17 - index) * 0.18) : 0;
    const value = round(Math.max(20, Math.min(100, base + swing + ripple + tail)), 2);
    return {
      label: `${String(8 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`,
      value,
    };
  });
}

function renderAlarmTrend(alarm) {
  const canvas = setupCanvas(els.alarmTrendCanvas);
  const ctx = canvas.getContext("2d");
  const data = alarmTrendData(alarm);
  const pad = { left: 44, right: 22, top: 28, bottom: 34 };
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  const color = alarm.type === "level1" ? "#ff3d59" : alarm.type === "level2" ? "#f4a51c" : "#13c781";
  const gradient = ctx.createLinearGradient(0, pad.top, 0, canvas.height - pad.bottom);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(18, 152, 255, 0.02)");
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = pad.left + (index / (data.length - 1)) * (canvas.width - pad.left - pad.right);
    const y = valueY(point.value, pad, canvas.height);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(canvas.width - pad.right, canvas.height - pad.bottom);
  ctx.lineTo(pad.left, canvas.height - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  state.alarmTrendHitboxes = [];
  data.forEach((point, index) => {
    const x = pad.left + (index / (data.length - 1)) * (canvas.width - pad.left - pad.right);
    const y = valueY(point.value, pad, canvas.height);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    state.alarmTrendHitboxes.push({ x, y, ...point, color });
  });
  ctx.stroke();
  state.alarmTrendHitboxes.forEach((point, index) => {
    if (index % 3 === 0 || index === state.alarmTrendHitboxes.length - 1) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8f97a8";
      ctx.font = "11px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(point.label, point.x, canvas.height - 10);
    }
  });
}

function handleAlarmTrendHover(event) {
  const rect = els.alarmTrendCanvas.getBoundingClientRect();
  const scaleX = els.alarmTrendCanvas.width / rect.width;
  const scaleY = els.alarmTrendCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.alarmTrendHitboxes
    .map((point) => ({ ...point, distance: Math.hypot(point.x - x, point.y - y) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 14) {
    els.alarmTrendTooltip.classList.remove("show");
    return;
  }
  els.alarmTrendTooltip.innerHTML = `<strong>${hit.label}</strong><span style="color:${hit.color}">相关值 ${formatSosValue(hit.value)}</span>`;
  const box = els.alarmTrendChart.getBoundingClientRect();
  els.alarmTrendTooltip.style.left = `${Math.min(els.alarmTrendChart.clientWidth - 220, Math.max(8, event.clientX - box.left + 12))}px`;
  els.alarmTrendTooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  els.alarmTrendTooltip.classList.add("show");
}

function showDetail(id, initialTab = "overview") {
  const station = state.stations.find((item) => item.id === id);
  if (!station) return;
  state.selectedStation = station;
  state.selectedSubsystemNo = null;
  state.subsystemPageMode = "overview";
  state.subsystemPartFilter = null;
  state.trendRange = 7;
  state.sortSubsystemMode = "idAsc";
  state.detailTableSort = { key: "score", direction: "asc" };
  state.detailTrendHover = null;
  state.detailBarHoverName = null;
  state.overviewPowerHighlight = null;
  state.overviewChargeHighlight = null;
  state.detailAlarmType = "all";
  state.detailAlarmDays = "all";
  state.detailAlarmStartDate = "";
  state.detailAlarmEndDate = "";
  state.detailAlarmSource = "all";
  state.detailAlarmCategory = "all";
  state.detailAlarmSubfilter = "all";
  state.chargeStatWindow = "day";
  state.detailTab = ["overview", "diagnosis", "health"].includes(initialTab) ? initialTab : "overview";
  els.detailAlarmTabs.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.type === "all"));
  els.detailAlarmTimeButtons.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.days === "all"));
  els.detailAlarmStartDate.value = "";
  els.detailAlarmEndDate.value = "";
  els.backBtn.textContent = "‹ 返回场站列表";
  els.detailSectionTabs.hidden = false;
  els.listView.classList.remove("active-view");
  els.riskView.classList.remove("active-view");
  els.alarmDetailView.classList.remove("active-view");
  els.detailView.classList.add("active-view");
  document.getElementById("pageTitle").textContent = "";
  showDetailTab(state.detailTab, false);
  renderDetail(station);
  window.scrollTo({ top: 0, behavior: "smooth" });
  const url = new URL(window.location.href);
  url.searchParams.set("station", station.id);
  url.searchParams.delete("subsystem");
  window.history.replaceState({}, "", url);
}

function showSubsystemDetail(station, subsystemNo, mode = "overview") {
  if (!station || !subsystemNo) return;
  state.selectedStation = station;
  state.selectedSubsystemNo = Number(subsystemNo);
  state.subsystemPageMode = mode === "diagnosis" ? "diagnosis" : "overview";
  state.subsystemPartFilter = null;
  state.subsystemDiagnosisTrendHover = null;
  state.subsystemDiagnosisTrendHighlight = null;
  state.partAnalysisHover = null;
  state.detailTab = "overview";
  state.overviewPowerHighlight = null;
  state.overviewChargeHighlight = null;
  state.detailAlarmCategory = "all";
  state.detailAlarmSubfilter = "all";
  els.backBtn.textContent = state.subsystemPageMode === "diagnosis" ? "‹ 返回安全诊断" : "‹ 返回场站概览";
  els.detailSectionTabs.hidden = true;
  els.listView.classList.remove("active-view");
  els.riskView.classList.remove("active-view");
  els.alarmDetailView.classList.remove("active-view");
  els.detailView.classList.add("active-view");
  showDetailTab("overview", false);
  renderSubsystemDetail(station, state.selectedSubsystemNo);
  renderDetailAlarms(station);
  window.scrollTo({ top: 0, behavior: "smooth" });
  const url = new URL(window.location.href);
  url.searchParams.set("station", station.id);
  url.searchParams.set("subsystem", String(state.selectedSubsystemNo));
  if (state.subsystemPageMode === "diagnosis") url.searchParams.set("subsystemView", "diagnosis");
  else url.searchParams.delete("subsystemView");
  url.searchParams.delete("tab");
  window.history.replaceState({}, "", url);
}

function handleDetailBack() {
  if (state.selectedSubsystemNo && state.selectedStation) {
    const returnTab = state.subsystemPageMode === "diagnosis" ? "diagnosis" : "overview";
    state.selectedSubsystemNo = null;
    state.subsystemPageMode = "overview";
    state.subsystemPartFilter = null;
    els.backBtn.textContent = "‹ 返回场站列表";
    els.detailSectionTabs.hidden = false;
    state.detailTab = returnTab;
    renderDetail(state.selectedStation);
    showDetailTab(returnTab);
    const url = new URL(window.location.href);
    url.searchParams.set("station", state.selectedStation.id);
    url.searchParams.delete("subsystem");
    url.searchParams.delete("subsystemView");
    if (returnTab === "diagnosis") url.searchParams.set("tab", "diagnosis");
    else url.searchParams.delete("tab");
    window.history.replaceState({}, "", url);
    return;
  }
  showList();
}

function showList() {
  els.detailView.classList.remove("active-view");
  showPage(state.activePage || "overview");
  state.selectedStation = null;
  state.selectedSubsystemNo = null;
  state.subsystemPageMode = "overview";
  state.subsystemPartFilter = null;
  els.detailSectionTabs.hidden = false;
  els.backBtn.textContent = "‹ 返回场站列表";
  const url = new URL(window.location.href);
  url.searchParams.delete("station");
  url.searchParams.delete("subsystem");
  url.searchParams.delete("subsystemView");
  window.history.replaceState({}, "", url);
}

function renderDetail(station) {
  const risk = riskMeta[station.risk];
  els.detailTitle.textContent = `${station.id}${station.name}`;
  els.detailComm.textContent = commMeta[station.comm].label;
  els.detailComm.style.borderColor = commMeta[station.comm].color;
  els.detailComm.style.color = commMeta[station.comm].color;
  els.detailRisk.textContent = risk.label;
  els.detailRisk.style.borderColor = risk.color;
  els.detailRisk.style.color = risk.color;
  els.detailSos.textContent = `SOS ${formatSosValue(station.sos)}`;
  els.detailSos.style.borderColor = risk.color;
  els.detailSos.style.color = risk.color;
  els.gaugeValue.textContent = formatSosValue(station.sos);
  els.gaugeValue.style.color = "#f4f8ff";
  els.gaugeLabel.textContent = `当前风险等级：${risk.label}`;
  els.gaugeLabel.style.color = risk.color;
  els.gaugeLabel.style.borderColor = `${risk.color}66`;
  els.gaugeLabel.style.background = `${risk.color}1f`;
  drawSosGauge(els.gaugeCanvas, station.sos);
  els.rangeButtons.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.range === "7"));
  els.subsystemSortBtn.value = "idAsc";
  state.detailSubsystems = createSubsystems(station);
  renderStationOverview(station);
  renderDetailCharts(station);
  renderTable();
  renderDetailAlarms(station);
  syncDetailAlarmPanelHeight();
}

function showDetailTab(tabName, shouldRender = true) {
  state.detailTab = ["overview", "diagnosis", "health"].includes(tabName) ? tabName : "overview";
  els.detailSectionTabs?.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.detailTab === state.detailTab);
  });
  els.detailOverviewTab?.classList.toggle("active", state.detailTab === "overview");
  els.detailDiagnosisTab?.classList.toggle("active", state.detailTab === "diagnosis");
  els.detailHealthTab?.classList.toggle("active", state.detailTab === "health");
  if (shouldRender && state.selectedStation) {
    if (state.detailTab === "diagnosis") renderDetailCharts(state.selectedStation);
    if (state.detailTab === "overview") syncDetailAlarmPanelHeight();
  }
}

function renderMiniSocGauge(value) {
  const pct = Math.max(0, Math.min(100, Number(value || 0)));
  const angle = (-180 + pct * 1.8) * (Math.PI / 180);
  const needleLength = 33;
  const needleX = round(56 + Math.cos(angle) * needleLength, 2);
  const needleY = round(56 + Math.sin(angle) * needleLength, 2);
  return `
    <svg class="soc-gauge-svg" viewBox="0 0 112 78" role="img" aria-label="场站SOC ${pct.toFixed(1)}%">
      <path class="soc-gauge-track" d="M18 56 A38 38 0 0 1 94 56" pathLength="100"></path>
      <path class="soc-gauge-fill" d="M18 56 A38 38 0 0 1 94 56" pathLength="100" style="stroke-dasharray:${pct} 100"></path>
      <line class="soc-gauge-needle" x1="56" y1="56" x2="${needleX}" y2="${needleY}"></line>
      <circle class="soc-gauge-hub" cx="56" cy="56" r="3"></circle>
      <text class="soc-gauge-scale" x="13" y="70">0%</text>
      <text class="soc-gauge-scale" x="99" y="70" text-anchor="end">100%</text>
    </svg>`;
}

function renderStorageSocTank(value) {
  const pct = Math.max(0, Math.min(100, Number(value || 0)));
  const waveY = round(52 - pct * 0.42, 2);
  return `
    <svg class="storage-ring-svg" viewBox="0 0 64 78" role="img" aria-label="储能系统SOC ${pct}%">
      <defs>
        <clipPath id="storageSocClip">
          <circle cx="32" cy="30" r="25"></circle>
        </clipPath>
      </defs>
      <circle class="storage-ring-shell" cx="32" cy="30" r="25"></circle>
      <g clip-path="url(#storageSocClip)">
        <rect class="storage-ring-bg" x="7" y="5" width="50" height="50"></rect>
        <path class="storage-ring-wave" d="M7 ${waveY} C17 ${waveY - 4} 25 ${waveY + 4} 35 ${waveY} S52 ${waveY - 4} 57 ${waveY} L57 58 L7 58 Z"></path>
      </g>
      <circle class="storage-ring-outline" cx="32" cy="30" r="25"></circle>
      <text class="storage-ring-value" x="32" y="33">${pct.toFixed(1)}%</text>
      <text class="storage-ring-label" x="32" y="72">SOC</text>
    </svg>`;
}

function renderEnergyWave(value, label, colorClass) {
  const pct = Math.max(8, Math.min(92, Number(value) % 100));
  const waveY = round(55 - pct * 0.42, 2);
  return `
    <div class="energy-wave ${colorClass}">
      <svg viewBox="0 0 84 92" role="img" aria-label="${label}">
        <defs>
          <clipPath id="${colorClass}WaveClip">
            <circle cx="42" cy="42" r="31"></circle>
          </clipPath>
        </defs>
        <circle class="energy-wave-shell" cx="42" cy="42" r="31"></circle>
        <g clip-path="url(#${colorClass}WaveClip)">
          <rect class="energy-wave-bg" x="11" y="11" width="62" height="62"></rect>
          <path class="energy-wave-fill" d="M11 ${waveY} C24 ${waveY - 5} 36 ${waveY + 5} 49 ${waveY} S67 ${waveY - 5} 73 ${waveY} L73 76 L11 76 Z"></path>
        </g>
        <circle class="energy-wave-outline" cx="42" cy="42" r="31"></circle>
        <text class="energy-wave-value" x="42" y="39">${formatNumeric(value)}</text>
        <text class="energy-wave-unit" x="42" y="55">MWh</text>
      </svg>
      <span>${label}</span>
    </div>`;
}

function renderTopologyIcon(type) {
  const iconMap = {
    grid: "grid.svg",
    step: "step-up-station.svg",
    wind: "wind.svg",
  };
  return `<img src="assets/topology-icons/${iconMap[type] || iconMap.grid}" alt="" loading="lazy" />`;
}

function renderOverviewIndexGauge(value, label = "SOS") {
  const percent = Math.max(0, Math.min(100, Number(value) || 0));
  const ticks = Array.from({ length: 36 }, (_, index) => {
    const ratio = index / 35;
    const angle = Math.PI + ratio * Math.PI;
    const x1 = 150 + Math.cos(angle) * 88;
    const y1 = 118 + Math.sin(angle) * 88;
    const x2 = 150 + Math.cos(angle) * 116;
    const y2 = 118 + Math.sin(angle) * 116;
    const active = percent >= 99.999 || ratio * 100 <= percent;
    return `<line class="overview-gauge-tick ${active ? "active" : ""}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="--tick-color:${gaugeColor(ratio)}"></line>`;
  }).join("");
  const scale = [0, 20, 40, 60, 80, 100]
    .map((mark) => {
      const angle = Math.PI + (mark / 100) * Math.PI;
      const x1 = 150 + Math.cos(angle) * 62;
      const y1 = 118 + Math.sin(angle) * 62;
      const x2 = 150 + Math.cos(angle) * 72;
      const y2 = 118 + Math.sin(angle) * 72;
      return `<line class="overview-gauge-scale" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"></line>`;
    })
    .join("");
  return `
    <svg class="overview-index-gauge-svg" viewBox="0 0 300 150" role="img" aria-label="${label} ${formatSosValue(percent)}">
      <g>${ticks}</g>
      <g>${scale}</g>
      <text class="overview-gauge-label" x="150" y="118">${label}</text>
    </svg>`;
}

function renderOverviewIconMetric(type, value, label, unit = "%") {
  const safeValue = `${Math.round(Math.max(0, Math.min(100, Number(value) || 0)))}${unit}`;
  const icon =
    type === "battery"
      ? `<svg class="overview-index-icon battery" viewBox="0 0 96 96" role="img" aria-label="${label}">
          <rect class="icon-shell" x="31" y="16" width="34" height="64" rx="6"></rect>
          <path class="icon-cap" d="M40 10h16v8H40z"></path>
          <rect class="icon-fill" x="36" y="48" width="24" height="26" rx="4"></rect>
          <path class="icon-bolt" d="m51 26-15 24h11l-3 18 16-27H49l2-15Z"></path>
        </svg>`
      : `<svg class="overview-index-icon shield" viewBox="0 0 96 96" role="img" aria-label="${label}">
          <path class="icon-shell" d="M48 9 76 20v20c0 22-11 37-28 46-17-9-28-24-28-46V20L48 9Z"></path>
          <path class="icon-bolt" d="m53 27-18 28h13l-4 18 19-31H50l3-15Z"></path>
        </svg>`;
  return `
    <div class="overview-icon-metric">
      <div class="overview-icon-wrap">${icon}</div>
      <div class="overview-icon-copy">
        <span>${label}</span>
        <strong>${safeValue}</strong>
      </div>
    </div>`;
}

function renderOverviewGaugeMetric(value, label) {
  return `
    <div class="overview-icon-metric overview-gauge-metric">
      <div class="overview-icon-wrap gauge-wrap">${renderOverviewIndexGauge(value, "SOS")}</div>
      <div class="overview-icon-copy">
        <span>${label}</span>
        <strong>${formatSosValue(value)}</strong>
      </div>
    </div>`;
}

function subsystemAlarmSummary(station, subsystemNo) {
  const alarms = [...state.allAlarms, ...state.homeDataAlarms].filter(
    (alarm) => alarm.stationId === station.id && alarm.location.includes(`#${subsystemNo}子系统`)
  );
  if (!alarms.length) return "当前子系统暂无告警\n当前子系统暂无预警";
  const grouped = ["一级", "二级", "三级"].map((level) => `${level}${alarms.filter((alarm) => alarm.level === level).length}`).join(" / ");
  const latest = alarms[0];
  return `${grouped}\n最新：${latest.title}\n来源：${latest.source}`;
}

function subsystemAlarmsForStation(station, subsystemNo) {
  return detailBaseAlarmsForStation(station, subsystemNo);
}

function detailBaseAlarmsForStation(station, subsystemNo = null) {
  const subsystemToken = subsystemNo ? `#${subsystemNo}子系统` : "";
  const stationAlarms = [...state.allAlarms, ...state.homeDataAlarms]
    .filter((alarm) => alarm.stationId === station.id)
    .filter(homeVisibleAlarm)
    .filter((alarm) => !subsystemToken || alarm.location.includes(subsystemToken))
    .sort((a, b) => alarmOrder(a.type) - alarmOrder(b.type) || b.dateISO.localeCompare(a.dateISO));
  return filterAlarmsByWindow(
    stationAlarms,
    state.detailAlarmDays,
    state.detailAlarmStartDate,
    state.detailAlarmEndDate
  );
}

function subsystemStatusFromAlarms(station, item, alarms) {
  if (alarms.some((alarm) => homeAlarmCategory(alarm) === "alarm" && homeDeviceAlarmSeverity(alarm) === "fault")) return "故障";
  if (alarms.some((alarm) => homeAlarmCategory(alarm) === "alarm")) return "告警";
  if (station.comm === "offline") return "离线";
  return item.status;
}

function subsystemStatusClassFromAlarms(station, item, alarms) {
  return operationStateClass(subsystemStatusFromAlarms(station, item, alarms));
}

function subsystemAlarmTooltipHtml(station, subsystemNo) {
  const alarms = subsystemAlarmsForStation(station, subsystemNo);
  const tone = subsystemAlarmTone(alarms);
  const alarmItems = alarms.filter((alarm) => homeAlarmCategory(alarm) === "alarm");
  const warningItems = alarms.filter((alarm) => homeAlarmCategory(alarm) === "warning");
  const dataItems = alarms.filter((alarm) => homeAlarmCategory(alarm) === "data");
  const alarmSeverity = alarmItems.some((alarm) => homeDeviceAlarmSeverity(alarm) === "fault") ? "fault" : alarmItems.length ? "alarm" : "none";
  const isEmpty = !alarmItems.length && !warningItems.length && !dataItems.length;
  const emptyText = {
    "告警类": "当前子系统暂无告警",
    "预警类": "当前子系统暂无预警",
    "数据类": "当前子系统暂无数据",
  };
  const sectionHtml = (title, items, className) =>
    items.length
      ? `<div class="storage-tooltip-section ${className}"><strong>${title}：${items.length}</strong><ul>${items
          .slice(0, 8)
          .map((alarm) => `<li>${alarm.title}</li>`)
          .join("")}</ul></div>`
      : `<div class="storage-tooltip-section ${className} muted"><strong>${title}：0</strong><p>${emptyText[title] || `暂无${title}`}</p></div>`;
  return `
    <div class="storage-system-tooltip ${tone} ${alarmSeverity} ${isEmpty ? "empty" : ""}">
      ${sectionHtml("告警类", alarmItems, "alarm-section")}
      ${sectionHtml("预警类", warningItems, "warning-section")}
      ${dataItems.length ? sectionHtml("数据类", dataItems, "data-section") : ""}
    </div>`;
}

function subsystemAlarmTone(alarms) {
  const warnings = alarms.filter((alarm) => homeAlarmCategory(alarm) === "warning");
  if (warnings.some((alarm) => alarm.type === "level1" || alarm.level === "一级")) return "level1";
  if (warnings.some((alarm) => alarm.type === "level2" || alarm.level === "二级")) return "level2";
  if (warnings.some((alarm) => alarm.type === "level3" || alarm.level === "三级")) return "level3";
  return "none";
}

function subsystemSnapshot(station, subsystemNo) {
  const n = Number(subsystemNo) || 1;
  const total = Math.max(1, Math.round(Number(station.subsystemCount || 1)));
  const status = subsystemRunState(station, n, total);
  const localSoc = n % 7 === 0 ? 95 : n % 5 === 0 ? 47.9 : Math.max(5, Math.min(98, Number(station.soc || 0) + Math.sin(n * 0.92) * 8 - 4));
  const localSoh = round(96.8 + ((n * 0.23 + stationIndexSeed(station) * 0.01) % 2.6), 2);
  const localPower = subsystemPowerByState(station, status, n);
  const unitEnergy = Number(station.ratedEnergy || 0) / Math.max(1, total);
  const availableEnergy = round(unitEnergy * (localSoc / 100), 2);
  const score = state.detailSubsystems.find((item) => item.name === subsystemDisplayName(station, n))?.score
    ?? createSubsystems(station)[n - 1]?.score
    ?? station.sos;
  return {
    n,
    name: subsystemDisplayName(station, n),
    status,
    statusClass: operationStateClass(status),
    soc: round(localSoc, 2),
    soh: localSoh,
    power: localPower,
    ratedPower: round(Number(station.rated || 0) / Math.max(1, total), 2),
    ratedEnergy: round(unitEnergy, 2),
    availableEnergy,
    score,
    risk: getRisk(score),
  };
}

function subsystemChartStation(station, subsystemNo) {
  const snapshot = subsystemSnapshot(station, subsystemNo);
  return {
    ...station,
    active: snapshot.power,
    soc: snapshot.soc,
    rated: snapshot.ratedPower,
    ratedEnergy: snapshot.ratedEnergy,
    sos: snapshot.score,
    risk: snapshot.risk,
  };
}

function topologyFilterAttribute(filter) {
  if (!filter) return "";
  return `data-filter-key="${filter.key}" data-filter-label="${filter.label}" data-filter-tokens="${filter.tokens.join("|")}"`;
}

function topologyPartButtonClass(filter, extraClass = "") {
  const active = state.subsystemPartFilter?.key === filter.key ? " active" : "";
  return `subsystem-topology-node topology-filter ${extraClass}${active}`;
}

function subsystemPcsFilter(pcsNo) {
  const no = String(pcsNo).padStart(2, "0");
  return { key: `pcs-${no}`, label: `变流器 #${no}`, tokens: [`PCS${no}`] };
}

function subsystemRackFilter(rackNo) {
  return { key: `rack-${rackNo}`, label: `电池簇 ${rackNo}`, tokens: [`Rack${rackNo}`] };
}

function subsystemUtilityFilter(type) {
  if (type === "fire") return { key: "fire", label: "消防系统", tokens: ["消防系统", "TCQ01", "BankA"] };
  return { key: "hvac", label: "环控系统", tokens: ["环控系统", "AC101"] };
}

function alarmMatchesPartFilter(alarm, filter) {
  if (!filter) return true;
  const haystack = `${alarm.location || ""} ${alarm.module || ""} ${alarm.title || ""}`;
  return filter.tokens.some((token) => haystack.includes(token));
}

function bindSubsystemTopologyFilters(station) {
  els.stationOverviewPanel?.querySelectorAll(".topology-filter[data-filter-key]").forEach((button) => {
    const toggle = () => {
      const key = button.dataset.filterKey;
      state.subsystemPartFilter = state.subsystemPartFilter?.key === key
        ? null
        : {
            key,
            label: button.dataset.filterLabel || "",
            tokens: String(button.dataset.filterTokens || "").split("|").filter(Boolean),
          };
      syncSubsystemTopologyFilterState();
      renderDetailAlarms(station);
    };
    button.addEventListener("click", toggle);
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
}

function syncSubsystemTopologyFilterState() {
  els.stationOverviewPanel?.querySelectorAll(".topology-filter[data-filter-key]").forEach((button) => {
    button.classList.toggle("active", state.subsystemPartFilter?.key === button.dataset.filterKey);
  });
}

function renderSubsystemMetricCards(station, subsystemNo) {
  const snapshot = subsystemSnapshot(station, subsystemNo);
  const chargeMultiplierMap = { day: 1, month: 28, year: 330 };
  const chargeMultiplier = chargeMultiplierMap[state.chargeStatWindow] || chargeMultiplierMap.day;
  const charge = Math.max(0, snapshot.ratedEnergy * (0.22 + snapshot.soc / 420) * chargeMultiplier);
  const discharge = Math.max(0, snapshot.ratedEnergy * (0.18 + Math.max(0, 100 - snapshot.soc) / 460) * chargeMultiplier);
  return `
    <div class="subsystem-overview-top">
      <article class="panel station-run-panel subsystem-run-panel">
        <div class="panel-title"><span></span>子系统运行</div>
        <div class="run-overview">
          <div class="soc-gauge-mini">
            ${renderMiniSocGauge(snapshot.soc)}
            <div class="soc-gauge-readout"><span>子系统SOC</span><strong>${formatNumeric(snapshot.soc)}<em>%</em></strong></div>
          </div>
          <div class="run-kpis">
            <div><span>子系统运行状态</span><strong class="${snapshot.statusClass}">${snapshot.status}</strong></div>
            <div><span>子系统实时出力</span><strong>${formatNumeric(snapshot.power)} <em>kW</em></strong></div>
          </div>
        </div>
      </article>
      <article class="panel storage-summary-panel subsystem-charge-panel">
        <div class="panel-title-row">
          <div class="panel-title"><span></span>充放电统计</div>
          <div class="charge-stat-tabs" aria-label="子系统充放电统计时间窗口">
            <button class="${state.chargeStatWindow === "day" ? "active" : ""}" data-charge-window="day" type="button">当日</button>
            <button class="${state.chargeStatWindow === "month" ? "active" : ""}" data-charge-window="month" type="button">当月</button>
            <button class="${state.chargeStatWindow === "year" ? "active" : ""}" data-charge-window="year" type="button">当年</button>
          </div>
        </div>
        <div class="charge-stat-body">
          <div class="charge-stat-item">${renderEnergyWave(charge, "充电能量", "charge-wave")}</div>
          <div class="charge-stat-divider"></div>
          <div class="charge-stat-item">${renderEnergyWave(discharge, "放电能量", "discharge-wave")}</div>
        </div>
      </article>
    </div>`;
}

function topologyPartSosScore(station, subsystemNo, type, id = 0) {
  const snapshot = subsystemSnapshot(station, subsystemNo);
  const seed = stationIndexSeed(station) + Number(subsystemNo || 0) * 13 + Number(id || 0) * 0.37;
  const offsets = {
    hv: 2.8,
    pcs1: -3.4,
    pcs2: -4.8,
    hvac: 1.6,
    fire: 4.2,
    rack: -8.5,
  };
  const wobble = Math.sin(seed + String(type).length * 0.73) * 5.2;
  const base = snapshot.score + (offsets[type] ?? 0) + wobble;
  return round(Math.max(35, Math.min(100, base)), 2);
}

function topologyStyleForScore(score) {
  const risk = getRisk(score);
  return `--topology-color:${riskMeta[risk].color};--topology-glow:${riskMeta[risk].color}55;`;
}

function renderTopologySosText(score) {
  return `<span>SOS ${formatSosValue(score)}</span>`;
}

function renderSubsystemPartIcon(type, label) {
  const title = `<title>${label}</title>`;
  if (type === "hv") {
    return `<svg class="topology-svg-icon" viewBox="0 0 64 64" role="img" aria-label="${label}">${title}<rect x="21" y="8" width="22" height="34" rx="4" fill="rgba(255,255,255,.16)" stroke="currentColor" stroke-width="2"/><path d="M32 42v9M24 51h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M28 17h8l-5 10h7l-10 16 3-12h-6z" fill="currentColor"/><circle cx="24" cy="46" r="2.5" fill="currentColor"/><circle cx="40" cy="46" r="2.5" fill="currentColor"/></svg>`;
  }
  if (type === "pcs") {
    return `<svg class="topology-svg-icon" viewBox="0 0 64 64" role="img" aria-label="${label}">${title}<rect x="12" y="12" width="40" height="40" rx="5" fill="rgba(255,255,255,.13)" stroke="currentColor" stroke-width="2"/><path d="M18 25c4-5 8 5 12 0s8-5 16 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M19 39h26" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".58"/><circle cx="22" cy="45" r="2" fill="currentColor"/><circle cx="31" cy="45" r="2" fill="currentColor" opacity=".76"/><circle cx="40" cy="45" r="2" fill="currentColor" opacity=".56"/></svg>`;
  }
  if (type === "rack") {
    return `<svg class="topology-svg-icon rack-svg-icon" viewBox="0 0 48 64" role="img" aria-label="${label}">${title}<rect x="10" y="9" width="28" height="46" rx="3" fill="rgba(255,255,255,.12)" stroke="currentColor" stroke-width="1.7"/><path d="M14 18h20M14 28h20M14 38h20M14 48h20" stroke="currentColor" stroke-width="1.1" opacity=".62"/><rect x="16" y="13" width="16" height="4" rx="1" fill="currentColor" opacity=".7"/></svg>`;
  }
  if (type === "fire") {
    return `<svg class="topology-svg-icon" viewBox="0 0 64 64" role="img" aria-label="${label}">${title}<rect x="18" y="16" width="28" height="34" rx="4" fill="rgba(255,255,255,.13)" stroke="currentColor" stroke-width="2"/><path d="M32 43c7-4 8-10 3-16-1 4-4 6-7 8 0-5-2-8-5-11 1 9-5 11-3 17 2 7 9 9 12 2z" fill="currentColor"/><circle cx="42" cy="22" r="2.5" fill="currentColor" opacity=".8"/></svg>`;
  }
  return `<svg class="topology-svg-icon" viewBox="0 0 64 64" role="img" aria-label="${label}">${title}<rect x="16" y="14" width="32" height="36" rx="5" fill="rgba(255,255,255,.13)" stroke="currentColor" stroke-width="2"/><path d="M25 39l14-14M25 25h14v14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 48v6M41 48v6M25 10v6M39 10v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function renderSubsystemPartsTopology(station, subsystemNo) {
  const snapshot = subsystemSnapshot(station, subsystemNo);
  const leftRacks = Array.from({ length: 9 }, (_, index) => 101 + index);
  const rightRacks = Array.from({ length: 9 }, (_, index) => 201 + index);
  const hvacFilter = subsystemUtilityFilter("hvac");
  const fireFilter = subsystemUtilityFilter("fire");
  const hvScore = topologyPartSosScore(station, subsystemNo, "hv", subsystemNo);
  const pcs1Score = topologyPartSosScore(station, subsystemNo, "pcs1", 1);
  const pcs2Score = topologyPartSosScore(station, subsystemNo, "pcs2", 2);
  const hvacScore = topologyPartSosScore(station, subsystemNo, "hvac", 1);
  const fireScore = topologyPartSosScore(station, subsystemNo, "fire", 2);
  const hvFilter = { key: `hv-${subsystemNo}`, label: `箱变 #${String(subsystemNo).padStart(2, "0")}`, tokens: [`箱变 #${String(subsystemNo).padStart(2, "0")}`] };
  return `
    <article class="panel subsystem-parts-panel">
      <div class="panel-title"><span></span>拓扑图</div>
      <div class="subsystem-topology">
        <svg class="subsystem-wires" viewBox="0 0 1000 386" preserveAspectRatio="none" aria-hidden="true">
          <path d="M500 84 V126 M250 126 H750 M250 126 V145 M750 126 V145 M250 187 V252 H97 M250 252 H440 M750 187 V252 H597 M750 252 H940" />
          ${leftRacks.map((_, index) => `<path d="M ${97 + index * 43} 252 V294" />`).join("")}
          ${rightRacks.map((_, index) => `<path d="M ${597 + index * 43} 252 V294" />`).join("")}
        </svg>
        <div class="subsystem-aux-list" aria-label="辅助系统">
          <button class="topology-filter subsystem-aux-item${state.subsystemPartFilter?.key === hvacFilter.key ? " active" : ""}" style="${topologyStyleForScore(hvacScore)}" type="button" ${topologyFilterAttribute(hvacFilter)}>
            ${renderSubsystemPartIcon("hvac", "环控系统")}<span><strong>环控系统</strong>${renderTopologySosText(hvacScore)}</span>
          </button>
          <button class="topology-filter subsystem-aux-item${state.subsystemPartFilter?.key === fireFilter.key ? " active" : ""}" style="${topologyStyleForScore(fireScore)}" type="button" ${topologyFilterAttribute(fireFilter)}>
            ${renderSubsystemPartIcon("fire", "消防系统")}<span><strong>消防系统</strong>${renderTopologySosText(fireScore)}</span>
          </button>
        </div>
        <button class="${topologyPartButtonClass(hvFilter, "hv-node")}" style="${topologyStyleForScore(hvScore)}" type="button" ${topologyFilterAttribute(hvFilter)}>
          <span class="topology-node-icon">${renderSubsystemPartIcon("hv", "箱变")}</span>
          <span class="topology-node-text"><strong>箱变 #${String(subsystemNo).padStart(2, "0")}</strong>${renderTopologySosText(hvScore)}</span>
        </button>
        <button class="${topologyPartButtonClass(subsystemPcsFilter(1), "pcs-node left")}" style="${topologyStyleForScore(pcs1Score)}" type="button" ${topologyFilterAttribute(subsystemPcsFilter(1))}>
          <span class="topology-node-icon">${renderSubsystemPartIcon("pcs", "变流器")}</span>
          <span class="topology-node-text"><strong>变流器 #01</strong>${renderTopologySosText(pcs1Score)}</span>
        </button>
        <button class="${topologyPartButtonClass(subsystemPcsFilter(2), "pcs-node right")}" style="${topologyStyleForScore(pcs2Score)}" type="button" ${topologyFilterAttribute(subsystemPcsFilter(2))}>
          <span class="topology-node-icon">${renderSubsystemPartIcon("pcs", "变流器")}</span>
          <span class="topology-node-text"><strong>变流器 #02</strong>${renderTopologySosText(pcs2Score)}</span>
        </button>
        <div class="rack-row left">
          <div class="rack-group-metrics" aria-hidden="true"><span>SOS:</span></div>
          ${leftRacks.map((rack) => {
            const filter = subsystemRackFilter(rack);
            const score = topologyPartSosScore(station, subsystemNo, "rack", rack);
            return `<button class="topology-filter rack-node${state.subsystemPartFilter?.key === filter.key ? " active" : ""}" style="${topologyStyleForScore(score)}" type="button" ${topologyFilterAttribute(filter)}>${renderSubsystemPartIcon("rack", `Rack ${rack}`)}<strong>${rack}</strong><span class="rack-values"><span>${formatSosValue(score)}</span></span></button>`;
          }).join("")}
        </div>
        <div class="rack-row right">
          <div class="rack-group-metrics" aria-hidden="true"><span>SOS:</span></div>
          ${rightRacks.map((rack) => {
            const filter = subsystemRackFilter(rack);
            const score = topologyPartSosScore(station, subsystemNo, "rack", rack);
            return `<button class="topology-filter rack-node${state.subsystemPartFilter?.key === filter.key ? " active" : ""}" style="${topologyStyleForScore(score)}" type="button" ${topologyFilterAttribute(filter)}>${renderSubsystemPartIcon("rack", `Rack ${rack}`)}<strong>${rack}</strong><span class="rack-values"><span>${formatSosValue(score)}</span></span></button>`;
          }).join("")}
        </div>
      </div>
    </article>`;
}

function renderSubsystemDetail(station, subsystemNo) {
  const snapshot = subsystemSnapshot(station, subsystemNo);
  const risk = riskMeta[snapshot.risk];
  els.detailTitle.textContent = snapshot.name;
  els.detailComm.textContent = commMeta[station.comm].label;
  els.detailComm.style.borderColor = commMeta[station.comm].color;
  els.detailComm.style.color = commMeta[station.comm].color;
  els.detailRisk.textContent = risk.label;
  els.detailRisk.style.borderColor = risk.color;
  els.detailRisk.style.color = risk.color;
  els.detailSos.textContent = `SOS ${formatSosValue(snapshot.score)}`;
  els.detailSos.style.borderColor = risk.color;
  els.detailSos.style.color = risk.color;
  if (state.subsystemPageMode === "diagnosis") {
    renderSubsystemDiagnosisDetail(station, subsystemNo, snapshot);
    return;
  }
  els.stationOverviewPanel.innerHTML = `
    ${renderSubsystemMetricCards(station, subsystemNo)}
    ${renderSubsystemPartsTopology(station, subsystemNo)}
    <article class="panel station-power-panel subsystem-chart-panel">
      <div class="panel-title-row">
        <div class="panel-title"><span></span>子系统功率</div>
        <div class="chart-date-range alarm-detail-date" data-chart-range="power"><input type="date" value="${state.overviewPowerStartDate}" aria-label="开始日期" /><span>→</span><input type="date" value="${state.overviewPowerEndDate}" aria-label="结束日期" /></div>
      </div>
      <div class="overview-chart-wrap">
        <canvas id="overviewPowerCanvas" width="900" height="250"></canvas>
        <div id="overviewPowerTooltip" class="risk-bars-tooltip"></div>
      </div>
      <div class="chart-legend interactive-chart-legend" data-chart-legend="power">
        <button class="${state.overviewPowerHighlight === "active" ? "active" : ""}" data-series="active" type="button"><span class="blue-line">有功功率</span></button>
        <button class="${state.overviewPowerHighlight === "reactive" ? "active" : ""}" data-series="reactive" type="button"><span class="cyan-line">无功功率</span></button>
        <button class="${state.overviewPowerHighlight === "soc" ? "active" : ""}" data-series="soc" type="button"><span class="yellow-line">荷电状态</span></button>
      </div>
    </article>
    <article class="panel charge-chart-panel subsystem-chart-panel">
      <div class="panel-title-row">
        <div class="panel-title"><span></span>子系统充放电表现</div>
        <div class="chart-date-range alarm-detail-date" data-chart-range="charge"><input type="date" value="${state.overviewChargeStartDate}" aria-label="开始日期" /><span>→</span><input type="date" value="${state.overviewChargeEndDate}" aria-label="结束日期" /></div>
      </div>
      <div class="overview-chart-wrap">
        <canvas id="overviewChargeCanvas" width="900" height="250"></canvas>
        <div id="overviewChargeTooltip" class="risk-bars-tooltip"></div>
      </div>
      <div class="chart-legend interactive-chart-legend" data-chart-legend="charge">
        <button class="${state.overviewChargeHighlight === "charge" ? "active" : ""}" data-series="charge" type="button"><span class="teal-bar">充电量</span></button>
        <button class="${state.overviewChargeHighlight === "discharge" ? "active" : ""}" data-series="discharge" type="button"><span class="blue-bar">放电量</span></button>
        <button class="${state.overviewChargeHighlight === "cycles" ? "active" : ""}" data-series="cycles" type="button"><span class="purple-line">循环次数</span></button>
      </div>
    </article>`;
  els.overviewPowerCanvas = document.getElementById("overviewPowerCanvas");
  els.overviewPowerTooltip = document.getElementById("overviewPowerTooltip");
  els.overviewChargeCanvas = document.getElementById("overviewChargeCanvas");
  els.overviewChargeTooltip = document.getElementById("overviewChargeTooltip");
  bindSubsystemTopologyFilters(station);
  renderOverviewCharts(subsystemChartStation(station, subsystemNo));
  syncDetailAlarmPanelHeight();
}

function renderSubsystemDiagnosisDetail(station, subsystemNo, snapshot = subsystemSnapshot(station, subsystemNo)) {
  els.stationOverviewPanel.innerHTML = `
    ${renderSubsystemPartsTopology(station, subsystemNo)}
    <article class="panel subsystem-sos-trend-panel">
      <div class="panel-title-row">
        <div class="panel-title"><span></span>SOS安全指数与相关数据趋势</div>
        <div class="subsystem-chart-tools">
          <div class="chart-date-range alarm-detail-date" data-chart-range="diagnosis"><input type="date" value="${state.subsystemDiagnosisStartDate}" aria-label="开始日期" /><span>→</span><input type="date" value="${state.subsystemDiagnosisEndDate}" aria-label="结束日期" /></div>
          <label class="diagnosis-series-select"><select id="diagnosisSeriesSelect" multiple size="1" aria-label="选择趋势参数">
              ${subsystemDiagnosisSeriesOptions().map((series) => `<option value="${series.key}" ${state.subsystemDiagnosisTrendSeries.has(series.key) ? "selected" : ""}>${series.label}</option>`).join("")}
            </select>
          </label>
        </div>
      </div>
      <div class="subsystem-diagnosis-chart">
        <canvas id="subsystemDiagnosisTrendCanvas" width="900" height="300"></canvas>
        <div id="subsystemDiagnosisTrendTooltip" class="risk-bars-tooltip"></div>
      </div>
      <div class="chart-legend interactive-chart-legend diagnosis-trend-legend" data-chart-legend="diagnosis">
        ${renderSubsystemDiagnosisLegend()}
      </div>
    </article>
    <article class="panel subsystem-part-analysis-panel">
      <div class="panel-title"><span></span>各部件SOS安全指数分析</div>
      <div class="part-analysis-grid">
        ${["电池系统", "电气系统", "环控系统", "消防系统"].map((part, index) => renderPartAnalysisCard(part, snapshot, index)).join("")}
      </div>
      <div id="partAnalysisTooltip" class="risk-bars-tooltip"></div>
    </article>`;
  bindSubsystemTopologyFilters(station);
  renderSubsystemDiagnosisTrend(snapshot);
  renderPartAnalysisCharts(snapshot);
  syncDetailAlarmPanelHeight();
}

function renderPartAnalysisCard(part, snapshot, index) {
  const values = [
    { value: Math.max(35, snapshot.score - 3), risk: "high", action: "立即检修", issue: "温度传感器失效、SOC不一致" },
    { value: Math.min(95, snapshot.score + 13), risk: "mid", action: "及时检修", issue: "高压线缆绝缘失效" },
    { value: Math.min(98, snapshot.score + 27), risk: "low", action: "加强监控", issue: "环境系统动液、欠压" },
    { value: Math.min(99, snapshot.score + 31), risk: "healthy", action: "保持监控", issue: "无" },
  ];
  const item = values[index];
  return `
    <div class="part-analysis-card risk-${riskMeta[item.risk].className}">
      <div class="part-analysis-head">
        <strong>${part}</strong>
        <span>${riskMeta[item.risk].label}</span>
      </div>
      <div class="part-analysis-summary">
        <div><span>当前指数</span><strong style="color:${riskMeta[item.risk].color}">${formatSosValue(item.value)}</strong><em>7天内 ↑ 3%</em></div>
        <div><span>建议措施</span><strong>${item.action}</strong><em>主要问题：${item.issue}</em></div>
      </div>
      <canvas class="part-analysis-canvas" data-part-index="${index}" width="430" height="180"></canvas>
    </div>`;
}

function subsystemDiagnosisSeriesOptions() {
  return [
    { key: "charge", label: "充电能量", color: "#20d3c5", type: "bar", unit: "kWh" },
    { key: "discharge", label: "放电能量", color: "#1689ff", type: "bar", unit: "kWh" },
    { key: "soh", label: "SOH", color: "#ffd437", type: "bar", unit: "%" },
    { key: "avgTemp", label: "平均温度", color: "#b95cff", type: "bar", unit: "℃" },
    { key: "maxTemp", label: "最高温度", color: "#ff8a3d", type: "bar", unit: "℃" },
    { key: "cycles", label: "循环次数", color: "#8fcfff", type: "bar", unit: "次" },
  ];
}

function renderSubsystemDiagnosisLegend() {
  const visibleSeries = [
    { key: "sos", label: "SOS指数", color: "#ff526a", type: "line", unit: "" },
    ...subsystemDiagnosisSeriesOptions().filter((series) => state.subsystemDiagnosisTrendSeries.has(series.key)),
  ];
  const highlight = state.subsystemDiagnosisTrendHighlight;
  return visibleSeries
    .map((series) => `<button class="${!highlight || highlight === series.key ? "active" : ""}" data-series="${series.key}" type="button"><span style="--legend-color:${series.color}">${series.label}</span></button>`)
    .join("");
}

function subsystemDiagnosisTrendData(snapshot) {
  return subsystemDiagnosisDateRange().map((date, index) => {
    const day = date.getDate();
    const charge = round(28 + Math.sin(index * 0.9) * 18 + (index % 4) * 9 + snapshot.n * 0.8, 2);
    const discharge = round(32 + Math.cos(index * 0.72) * 20 + (index % 3) * 7 + snapshot.n * 0.6, 2);
    const sos = round(Math.max(20, Math.min(98, snapshot.score - 16 + index * 1.8 + Math.sin(index * 0.55) * 5)), 2);
    const soh = round(Math.max(90, Math.min(99.8, 97.1 - index * 0.06 + Math.cos(index * 0.4) * 0.5)), 2);
    const avgTemp = round(24 + Math.sin(index * 0.5) * 4 + snapshot.n * 0.08, 2);
    const maxTemp = round(avgTemp + 7 + Math.cos(index * 0.7) * 2, 2);
    const cycles = round(0.12 + index * 0.018 + (snapshot.n % 4) * 0.015, 2);
    return {
      label: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      charge,
      discharge,
      sos,
      soh,
      avgTemp,
      maxTemp,
      cycles,
    };
  });
}

function subsystemDiagnosisDateRange() {
  const start = parseDateInputValue(state.subsystemDiagnosisStartDate) || new Date(2025, 4, 1);
  const end = parseDateInputValue(state.subsystemDiagnosisEndDate) || new Date(2025, 4, 15);
  const [from, to] = start <= end ? [start, end] : [end, start];
  const maxDays = 31;
  const days = Math.min(maxDays, Math.max(1, Math.round((to - from) / 86400000) + 1));
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(from);
    date.setDate(from.getDate() + index);
    return date;
  });
}

function axisRangeForValues(values, fallbackMax = 100) {
  const finite = values.filter((value) => Number.isFinite(value));
  if (!finite.length) return { min: 0, max: fallbackMax };
  let min = Math.min(...finite);
  let max = Math.max(...finite);
  if (min === max) {
    const spread = Math.max(1, Math.abs(max) * 0.12);
    min -= spread;
    max += spread;
  }
  const padding = (max - min) * 0.16;
  min = Math.max(0, min - padding);
  max += padding;
  return { min, max };
}

function axisTicks(range, count = 6) {
  return Array.from({ length: count }, (_, index) => {
    const value = range.max - ((range.max - range.min) * index) / Math.max(1, count - 1);
    return Number(value || 0).toFixed(range.max - range.min > 20 ? 0 : 2);
  });
}

function renderSubsystemDiagnosisTrend(snapshot) {
  const canvas = document.getElementById("subsystemDiagnosisTrendCanvas");
  if (!canvas) return;
  const ctx = setupCanvas(canvas).getContext("2d");
  const data = subsystemDiagnosisTrendData(snapshot);
  const options = [
    { key: "sos", label: "SOS指数", color: "#ff526a", type: "line", unit: "" },
    ...subsystemDiagnosisSeriesOptions(),
  ];
  const selectedOptions = options.filter((series) => series.key === "sos" || state.subsystemDiagnosisTrendSeries.has(series.key));
  const rightSeries = selectedOptions.filter((series) => series.key !== "sos");
  const rightRange = axisRangeForValues(rightSeries.flatMap((series) => data.map((item) => item[series.key])), 100);
  const pad = { left: 54, right: 58, top: 34, bottom: 54 };
  clear(ctx, canvas.width, canvas.height);
  drawOverviewDualGrid(ctx, canvas, pad, {
    leftTicks: ["100", "80", "60", "40", "20", "0"],
    rightTicks: axisTicks(rightRange),
    leftUnit: "SOS安全指数",
    rightUnit: rightSeries.length ? "参数值" : "",
  });
  const xFor = (index) => pad.left + (index / Math.max(1, data.length - 1)) * (canvas.width - pad.left - pad.right);
  const yIndex = (value) => mapLinear(value, 0, 100, canvas.height - pad.bottom, pad.top);
  const yParam = (value) => mapLinear(value, rightRange.min, rightRange.max, canvas.height - pad.bottom, pad.top);
  state.subsystemDiagnosisTrendHitboxes = [];
  data.forEach((item, index) => {
    const x = xFor(index);
    const isHover = state.subsystemDiagnosisTrendHover?.index === index;
    if (isHover) drawOverviewHoverGuide(ctx, x, pad, canvas.height);
    const barSeries = rightSeries.filter((series) => series.type === "bar");
    const slotWidth = (canvas.width - pad.left - pad.right) / Math.max(1, data.length);
    const barGap = 2;
    const barWidth = Math.max(4, Math.min(12, (slotWidth * 0.62 - barGap * Math.max(0, barSeries.length - 1)) / Math.max(1, barSeries.length)));
    const totalBarWidth = barSeries.length * barWidth + Math.max(0, barSeries.length - 1) * barGap;
    barSeries.forEach((series, seriesIndex) => {
      const barX = x - totalBarWidth / 2 + seriesIndex * (barWidth + barGap);
      const barY = yParam(item[series.key]);
      drawOverviewBar(ctx, barX, barY, barWidth, canvas.height - pad.bottom - barY, series.color, seriesAlpha(state.subsystemDiagnosisTrendHighlight, series.key));
    });
    drawOverviewXAxis(ctx, item.label, x, canvas.height, pad, index, data.length);
    state.subsystemDiagnosisTrendHitboxes.push({ index, x, item });
  });
  selectedOptions.filter((series) => series.type === "line").forEach((series) => {
    const mapper = series.key === "sos" ? yIndex : yParam;
    const points = data.map((item, index) => ({ x: xFor(index), y: mapper(item[series.key]) }));
    const alpha = seriesAlpha(state.subsystemDiagnosisTrendHighlight, series.key);
    drawOverviewLine(ctx, points, series.color, alpha);
    points.forEach((point, index) => drawOverviewPoint(ctx, point.x, point.y, series.color, state.subsystemDiagnosisTrendHover?.index === index || state.subsystemDiagnosisTrendHighlight === series.key, alpha));
  });
}

function renderPartAnalysisCharts(snapshot) {
  state.partAnalysisHitboxes = [];
  document.querySelectorAll(".part-analysis-canvas").forEach((canvas, cardIndex) => {
    const ctx = setupCanvas(canvas).getContext("2d");
    const pad = { left: 34, right: 16, top: 20, bottom: 28 };
    const base = [snapshot.score - 38, snapshot.score - 31, snapshot.score - 24, snapshot.score - 18][cardIndex] || snapshot.score - 25;
    const color = ["#ff526a", "#f4a51c", "#13c781", "#1689ff"][cardIndex] || "#1689ff";
    const data = Array.from({ length: 7 }, (_, index) => ({
      label: `05-${String(index + 1).padStart(2, "0")}`,
      value: round(Math.max(10, Math.min(98, base + index * (5.2 + cardIndex * 0.35) + Math.sin(index * 0.6) * 2)), 2),
    }));
    clear(ctx, canvas.width, canvas.height);
    drawGrid(ctx, pad, canvas.width, canvas.height);
    const points = data.map((item, index) => ({
      x: pad.left + (index / (data.length - 1)) * (canvas.width - pad.left - pad.right),
      y: valueY(item.value, pad, canvas.height),
      ...item,
    }));
    drawOverviewLine(ctx, points, color, 1);
    points.forEach((point, index) => {
      const isHover = state.partAnalysisHover?.cardIndex === cardIndex && state.partAnalysisHover?.index === index;
      if (isHover) drawOverviewHoverGuide(ctx, point.x, pad, canvas.height);
      drawOverviewPoint(ctx, point.x, point.y, color, isHover || index === points.length - 1, 1);
      ctx.fillStyle = "#8f97a8";
      ctx.font = "10px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(point.label, point.x, canvas.height - 8);
      state.partAnalysisHitboxes.push({ cardIndex, index, x: point.x, y: point.y, item: point, color, canvas });
    });
  });
}

function renderStationOverview(station) {
  if (!els.stationOverviewPanel) return;
  const systemCount = Math.max(1, Math.round(Number(station.subsystemCount || 12)));
  const activePower = formatNumeric(station.active);
  const soc = formatNumeric(station.soc);
  const chargeMultiplierMap = { day: 1, month: 28, year: 330 };
  const chargeMultiplier = chargeMultiplierMap[state.chargeStatWindow] || chargeMultiplierMap.day;
  const dailyCharge = formatNumeric(Math.max(0, Number(station.ratedEnergy || 0) * 1000 * (0.18 + Number(station.soc || 0) / 360) * chargeMultiplier));
  const dailyDischarge = formatNumeric(Math.max(0, Number(station.ratedEnergy || 0) * 1000 * (0.14 + Math.max(0, 100 - Number(station.soc || 0)) / 420) * chargeMultiplier));
  const remaining = formatRemainingEnergy(station);
  const runClass = operationStateClass(station.run);
  const runLabel = station.comm === "offline" ? "离线" : station.run;
  const healthIndex = Math.round(Math.max(72, Math.min(99, 100 - Math.max(0, 100 - Number(station.sos || 0)) * 0.18)));
  const availablePercent = Math.round(Math.max(5, Math.min(100, (Number(remaining) / Math.max(1, Number(station.ratedEnergy || 1) * 1000)) * 100)));
  const systemItems = Array.from({ length: systemCount }, (_, index) => {
    const n = index + 1;
    const localSoc = n % 7 === 0 ? 95 : n % 5 === 0 ? 47.9 : 5;
    const localSoh = 97.5 + ((n * 0.17) % 2);
    const status = subsystemRunState(station, n, systemCount);
    const localPower = subsystemPowerByState(station, status, n);
    return { n, localSoc, localSoh, localPower, status, statusClass: operationStateClass(status) };
  });
  const systemOptions = systemItems
    .map((item) => `<option value="${item.n}">${subsystemDisplayName(station, item.n)}</option>`)
    .join("");
  const systems = systemItems.map((item) => {
    const subsystemAlarms = subsystemAlarmsForStation(station, item.n);
    const alarmTone = subsystemAlarmTone(subsystemAlarms);
    const displayStatus = subsystemStatusFromAlarms(station, item, subsystemAlarms);
    const displayStatusClass = subsystemStatusClassFromAlarms(station, item, subsystemAlarms);
    return `
    <div class="storage-system-card ${displayStatusClass} alarm-${alarmTone}" data-system="${item.n}" role="button" tabindex="0" aria-label="查看${subsystemDisplayName(station, item.n)}">
      <div class="storage-system-head"><strong>${subsystemDisplayName(station, item.n)}</strong><span class="system-status-pill ${displayStatusClass}">${displayStatus}</span></div>
      <div class="system-row"><span>系统有功(PCS)功率</span><strong>${formatNumeric(item.localPower)} kW</strong></div>
      <div class="system-row"><span>系统SOC</span><strong>${formatNumeric(item.localSoc)} %</strong></div>
      <div class="mini-bars">${Array.from({ length: 12 }, (_, bar) => `<i style="opacity:${bar < Math.round(item.localSoc / 8.4) ? 0.95 : 0.18}"></i>`).join("")}</div>
      <div class="system-row"><span>系统SOH</span><strong>${formatNumeric(item.localSoh)} %</strong></div>
      ${subsystemAlarmTooltipHtml(station, item.n)}
    </div>`;
  }).join("");
  els.stationOverviewPanel.innerHTML = `
    <div class="overview-index-row">
      <article class="panel overview-index-card">
        ${renderOverviewGaugeMetric(station.sos, "安全指数")}
      </article>
      <article class="panel overview-index-card">
        ${renderOverviewIconMetric("shield", healthIndex, "健康指数")}
      </article>
      <article class="panel overview-index-card">
        ${renderOverviewIconMetric("battery", availablePercent, "当前可用电量")}
      </article>
    </div>
    <div class="station-overview-top">
      <article class="panel station-run-panel">
        <div class="panel-title"><span></span>场站运行</div>
        <div class="run-overview">
          <div class="soc-gauge-mini">
            ${renderMiniSocGauge(station.soc)}
            <div class="soc-gauge-readout"><span>场站SOC</span><strong>${soc}<em>%</em></strong></div>
          </div>
          <div class="run-kpis">
            <div><span>场站运行状态</span><strong class="${runClass}">${runLabel}</strong></div>
            <div><span>场站实时出力</span><strong>${activePower} <em>kW</em></strong></div>
          </div>
        </div>
      </article>
      <article class="panel station-attr-panel">
        <div class="panel-title"><span></span>场站属性</div>
        <div class="overview-metrics">
          <div><span>场站类型</span><strong>${station.stationType || "配套储能"}</strong></div>
          <div><span>系统数量</span><strong>${systemCount} <em>套</em></strong></div>
          <div><span>额定容量</span><strong>${formatNumeric(station.ratedEnergy)} <em>MWh</em></strong></div>
          <div><span>额定功率</span><strong>${formatNumeric(station.rated)} <em>MW</em></strong></div>
        </div>
      </article>
      <article class="panel storage-summary-panel">
        <div class="panel-title-row">
          <div class="panel-title"><span></span>充放电统计</div>
          <div class="charge-stat-tabs" aria-label="充放电统计时间窗口">
            <button class="${state.chargeStatWindow === "day" ? "active" : ""}" data-charge-window="day" type="button">当日</button>
            <button class="${state.chargeStatWindow === "month" ? "active" : ""}" data-charge-window="month" type="button">当月</button>
            <button class="${state.chargeStatWindow === "year" ? "active" : ""}" data-charge-window="year" type="button">当年</button>
          </div>
        </div>
        <div class="charge-stat-body">
          <div class="charge-stat-item">
            ${renderEnergyWave(Number(dailyCharge) / 1000, "充电能量", "charge-wave")}
          </div>
          <div class="charge-stat-divider"></div>
          <div class="charge-stat-item">
            ${renderEnergyWave(Number(dailyDischarge) / 1000, "放电能量", "discharge-wave")}
          </div>
        </div>
      </article>
    </div>
    <article class="panel topology-panel">
      <div class="topology-toolbar">
        <div class="panel-title"><span></span>拓扑图</div>
      </div>
      <div class="storage-system-grid">
        <svg id="storageBundleSvg" class="storage-bundle-svg" aria-hidden="true"></svg>
        ${systems}
      </div>
    </article>
    <article class="panel station-power-panel">
      <div class="panel-title-row">
        <div class="panel-title"><span></span>场站功率</div>
        <div class="chart-date-range alarm-detail-date" data-chart-range="power"><input type="date" value="${state.overviewPowerStartDate}" aria-label="开始日期" /><span>→</span><input type="date" value="${state.overviewPowerEndDate}" aria-label="结束日期" /></div>
      </div>
      <div class="overview-chart-wrap">
        <canvas id="overviewPowerCanvas" width="900" height="250"></canvas>
        <div id="overviewPowerTooltip" class="risk-bars-tooltip"></div>
      </div>
      <div class="chart-legend interactive-chart-legend" data-chart-legend="power">
        <button class="${state.overviewPowerHighlight === "active" ? "active" : ""}" data-series="active" type="button"><span class="blue-line">有功功率</span></button>
        <button class="${state.overviewPowerHighlight === "reactive" ? "active" : ""}" data-series="reactive" type="button"><span class="cyan-line">无功功率</span></button>
        <button class="${state.overviewPowerHighlight === "soc" ? "active" : ""}" data-series="soc" type="button"><span class="yellow-line">荷电状态</span></button>
      </div>
    </article>
    <article class="panel charge-chart-panel">
      <div class="panel-title-row">
        <div class="panel-title"><span></span>场站充放电表现</div>
        <div class="chart-date-range alarm-detail-date" data-chart-range="charge"><input type="date" value="${state.overviewChargeStartDate}" aria-label="开始日期" /><span>→</span><input type="date" value="${state.overviewChargeEndDate}" aria-label="结束日期" /></div>
      </div>
      <div class="overview-chart-wrap">
        <canvas id="overviewChargeCanvas" width="900" height="250"></canvas>
        <div id="overviewChargeTooltip" class="risk-bars-tooltip"></div>
      </div>
      <div class="chart-legend interactive-chart-legend" data-chart-legend="charge">
        <button class="${state.overviewChargeHighlight === "charge" ? "active" : ""}" data-series="charge" type="button"><span class="teal-bar">充电量</span></button>
        <button class="${state.overviewChargeHighlight === "discharge" ? "active" : ""}" data-series="discharge" type="button"><span class="blue-bar">放电量</span></button>
        <button class="${state.overviewChargeHighlight === "cycles" ? "active" : ""}" data-series="cycles" type="button"><span class="purple-line">循环次数</span></button>
      </div>
    </article>`;
  els.overviewPowerCanvas = document.getElementById("overviewPowerCanvas");
  els.overviewPowerTooltip = document.getElementById("overviewPowerTooltip");
  els.overviewChargeCanvas = document.getElementById("overviewChargeCanvas");
  els.overviewChargeTooltip = document.getElementById("overviewChargeTooltip");
  requestAnimationFrame(renderStorageBundleLines);
  bindSubsystemCardNavigation(station);
  renderOverviewCharts(station);
  syncDetailAlarmPanelHeight();
}

function bindSubsystemCardNavigation(station) {
  els.stationOverviewPanel?.querySelectorAll(".storage-system-card[data-system]").forEach((card) => {
    const open = () => showSubsystemDetail(station, Number(card.dataset.system));
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function syncDetailAlarmPanelHeight() {
  requestAnimationFrame(() => {
    const panel = els.detailAlarmList?.closest(".detail-alarm-panel");
    if (!panel || !els.stationOverviewPanel || state.detailTab !== "overview") return;
    const leftHeight = Math.ceil(els.stationOverviewPanel.getBoundingClientRect().height);
    panel.style.setProperty("--detail-alarm-height", `${Math.max(420, leftHeight)}px`);
  });
}

function renderStorageBundleLines() {
  const grid = els.stationOverviewPanel?.querySelector(".storage-system-grid");
  const svg = document.getElementById("storageBundleSvg");
  if (!grid || !svg) return;
  const cards = [...grid.querySelectorAll(".storage-system-card")];
  const gridRect = grid.getBoundingClientRect();
  if (!cards.length || gridRect.width <= 0 || gridRect.height <= 0) {
    svg.innerHTML = "";
    return;
  }
  const trunkX = 15;
  const cardRects = cards.map((card) => {
    const rect = card.getBoundingClientRect();
    return {
      top: rect.top - gridRect.top,
      bottom: rect.bottom - gridRect.top,
      centerX: rect.left - gridRect.left + rect.width / 2,
      branchY: Math.max(16, rect.top - gridRect.top - 14),
    };
  });
  const rows = [...cardRects.reduce((map, rect) => {
    const key = Math.round(rect.branchY);
    const row = map.get(key) || { y: rect.branchY, minX: rect.centerX, maxX: rect.centerX, cards: [] };
    row.minX = Math.min(row.minX, rect.centerX);
    row.maxX = Math.max(row.maxX, rect.centerX);
    row.cards.push(rect);
    map.set(key, row);
    return map;
  }, new Map()).values()].sort((a, b) => a.y - b.y);
  const busTopY = Math.max(8, rows[0].y - 12);
  const maxY = rows[rows.length - 1].y;
  const paths = [
    `M ${trunkX - 9} ${busTopY} H ${trunkX + 12}`,
    `M ${trunkX} ${busTopY} V ${maxY}`,
    ...rows.map((row) => {
      return [
        `M ${trunkX} ${row.y} H ${row.maxX}`,
        ...row.cards.map((rect) => `M ${rect.centerX} ${row.y} V ${Math.max(rect.top - 2, row.y)}`),
      ].join(" ");
    }),
  ];
  svg.setAttribute("viewBox", `0 0 ${Math.ceil(gridRect.width)} ${Math.ceil(gridRect.height)}`);
  svg.innerHTML = `<path d="${paths.join(" ")}" />`;
}

function createOverviewChartData(station, chartType = "power") {
  const range = overviewChartDateRange(chartType);
  return range.map((date, index) => {
    const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const wave = Math.sin(index * 1.37 + Number(station.soc || 0) / 18);
    const active = round(Math.max(-14, Math.min(15, (Number(station.active || 0) / 2.4) + wave * 8 + Math.cos(index * 0.9) * 4 - 2)), 2);
    const reactive = round(Math.max(-10, Math.min(10, active * 0.42 + Math.sin(index * 0.82 + Number(station.rated || 0)) * 3.4)), 2);
    const soc = round(Math.max(8, Math.min(92, Number(station.soc || 0) + Math.sin(index * 1.1) * 18 - 12)), 2);
    const charge = round(Math.max(8, 48 + Math.sin(index * 0.83 + 0.4) * 24 + (index % 4) * 3), 2);
    const discharge = round(Math.max(4, 42 + Math.cos(index * 0.76 + 0.2) * 26 - (index % 3) * 4), 2);
    const cycles = round(Math.max(0.1, Math.min(0.9, 0.45 + Math.sin(index * 0.72) * 0.28 + (index % 5) * 0.03)), 2);
    return { label, active, reactive, soc, charge, discharge, cycles };
  });
}

function overviewChartDateRange(chartType = "power") {
  const isCharge = chartType === "charge";
  const startValue = isCharge ? state.overviewChargeStartDate : state.overviewPowerStartDate;
  const endValue = isCharge ? state.overviewChargeEndDate : state.overviewPowerEndDate;
  const start = parseDateInputValue(startValue) || new Date(2026, 1, 3);
  const end = parseDateInputValue(endValue) || new Date(2026, 1, 13);
  const [from, to] = start <= end ? [start, end] : [end, start];
  const maxDays = 31;
  const days = Math.min(maxDays, Math.max(1, Math.round((to - from) / 86400000) + 1));
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(from);
    date.setDate(from.getDate() + index);
    return date;
  });
}

function parseDateInputValue(value) {
  const parts = String(value || "").split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function renderOverviewCharts(station) {
  if (!els.overviewPowerCanvas || !els.overviewChargeCanvas) return;
  renderOverviewPowerChart(createOverviewChartData(station, "power"));
  renderOverviewChargeChart(createOverviewChartData(station, "charge"));
}

function renderOverviewPowerChart(data) {
  const canvas = setupCanvas(els.overviewPowerCanvas);
  const ctx = canvas.getContext("2d");
  const pad = { left: 58, right: 58, top: 34, bottom: 44 };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawOverviewDualGrid(ctx, canvas, pad, {
    leftTicks: ["15", "10", "5", "0", "-5", "-10", "-15"],
    rightTicks: ["100", "80", "60", "40", "20", "0"],
    leftUnit: "MW",
    rightUnit: "SOC",
  });
  const yPower = (value) => mapLinear(value, -15, 15, canvas.height - pad.bottom, pad.top);
  const ySoc = (value) => mapLinear(value, 0, 100, canvas.height - pad.bottom, pad.top);
  const xFor = (index) => pad.left + (index / Math.max(1, data.length - 1)) * (canvas.width - pad.left - pad.right);
  state.overviewPowerHitboxes = [];
  const powerHighlight = state.overviewPowerHighlight;
  drawOverviewLine(ctx, data.map((item, index) => ({ x: xFor(index), y: yPower(item.active) })), "#1689ff", seriesAlpha(powerHighlight, "active"));
  drawOverviewLine(ctx, data.map((item, index) => ({ x: xFor(index), y: yPower(item.reactive) })), "#20d3c5", seriesAlpha(powerHighlight, "reactive"));
  drawOverviewLine(ctx, data.map((item, index) => ({ x: xFor(index), y: ySoc(item.soc) })), "#ffd437", seriesAlpha(powerHighlight, "soc"));
  data.forEach((item, index) => {
    const x = xFor(index);
    const isHover = state.overviewPowerHover?.index === index;
    if (isHover) drawOverviewHoverGuide(ctx, x, pad, canvas.height);
    drawOverviewPoint(ctx, x, yPower(item.active), "#1689ff", isHover || powerHighlight === "active", seriesAlpha(powerHighlight, "active"));
    drawOverviewPoint(ctx, x, yPower(item.reactive), "#20d3c5", isHover || powerHighlight === "reactive", seriesAlpha(powerHighlight, "reactive"));
    drawOverviewPoint(ctx, x, ySoc(item.soc), "#ffd437", isHover || powerHighlight === "soc", seriesAlpha(powerHighlight, "soc"));
    drawOverviewXAxis(ctx, item.label, x, canvas.height, pad, index, data.length);
    state.overviewPowerHitboxes.push({ index, x, item });
  });
}

function renderOverviewChargeChart(data) {
  const canvas = setupCanvas(els.overviewChargeCanvas);
  const ctx = canvas.getContext("2d");
  const pad = { left: 58, right: 58, top: 34, bottom: 44 };
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawOverviewDualGrid(ctx, canvas, pad, {
    leftTicks: ["90", "70", "50", "30", "10", "0"],
    rightTicks: ["0.9", "0.7", "0.5", "0.3", "0.1", "0"],
    leftUnit: "MWh",
    rightUnit: "次",
  });
  const yEnergy = (value) => mapLinear(value, 0, 90, canvas.height - pad.bottom, pad.top);
  const yCycles = (value) => mapLinear(value, 0, 0.9, canvas.height - pad.bottom, pad.top);
  const slot = (canvas.width - pad.left - pad.right) / data.length;
  state.overviewChargeHitboxes = [];
  const linePoints = [];
  const chargeHighlight = state.overviewChargeHighlight;
  data.forEach((item, index) => {
    const x = pad.left + slot * index + slot / 2;
    const isHover = state.overviewChargeHover?.index === index;
    if (isHover) drawOverviewHoverGuide(ctx, x, pad, canvas.height);
    ctx.globalAlpha = seriesAlpha(chargeHighlight, "charge");
    ctx.fillStyle = "rgba(32, 211, 197, 0.82)";
    ctx.fillRect(x - 16, yEnergy(item.charge), 12, canvas.height - pad.bottom - yEnergy(item.charge));
    ctx.globalAlpha = seriesAlpha(chargeHighlight, "discharge");
    ctx.fillStyle = "rgba(22, 137, 255, 0.86)";
    ctx.fillRect(x + 4, yEnergy(item.discharge), 12, canvas.height - pad.bottom - yEnergy(item.discharge));
    ctx.globalAlpha = 1;
    linePoints.push({ x, y: yCycles(item.cycles) });
    drawOverviewXAxis(ctx, item.label, x, canvas.height, pad, index, data.length);
    state.overviewChargeHitboxes.push({ index, x, item });
  });
  drawOverviewLine(ctx, linePoints, "#b95cff", seriesAlpha(chargeHighlight, "cycles"));
  linePoints.forEach((point, index) => drawOverviewPoint(ctx, point.x, point.y, "#b95cff", state.overviewChargeHover?.index === index || chargeHighlight === "cycles", seriesAlpha(chargeHighlight, "cycles")));
}

function seriesAlpha(activeKey, key) {
  return !activeKey || activeKey === key ? 1 : 0.26;
}

function drawOverviewGrid(ctx, canvas, pad, ticks, unit) {
  ctx.strokeStyle = "rgba(142, 151, 170, 0.18)";
  ctx.lineWidth = 1;
  ticks.forEach((tick, index) => {
    const y = pad.top + (index / Math.max(1, ticks.length - 1)) * (canvas.height - pad.top - pad.bottom);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(canvas.width - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = "#7f8798";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(tick, pad.left - 10, y + 4);
  });
  ctx.fillStyle = "#8f98aa";
  ctx.textAlign = "left";
  ctx.fillText(unit, pad.left - 34, pad.top - 4);
}

function drawOverviewDualGrid(ctx, canvas, pad, options) {
  const { leftTicks, rightTicks, leftUnit, rightUnit } = options;
  ctx.strokeStyle = "rgba(142, 151, 170, 0.18)";
  ctx.lineWidth = 1;
  leftTicks.forEach((tick, index) => {
    const y = pad.top + (index / Math.max(1, leftTicks.length - 1)) * (canvas.height - pad.top - pad.bottom);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(canvas.width - pad.right, y);
    ctx.stroke();
    ctx.fillStyle = "#7f8798";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";
    ctx.fillText(tick, pad.left - 10, y + 4);
  });
  rightTicks.forEach((tick, index) => {
    const y = pad.top + (index / Math.max(1, rightTicks.length - 1)) * (canvas.height - pad.top - pad.bottom);
    ctx.fillStyle = "#7f8798";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(tick, canvas.width - pad.right + 10, y + 4);
  });
  ctx.fillStyle = "#8f98aa";
  ctx.textAlign = "left";
  ctx.fillText(leftUnit, pad.left - 50, pad.top - 18);
  ctx.textAlign = "right";
  ctx.fillText(rightUnit, canvas.width - 8, pad.top - 18);
}

function mapLinear(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / Math.max(0.0001, inMax - inMin)) * (outMax - outMin);
}

function drawOverviewLine(ctx, points, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((point, index) => {
    index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.restore();
}

function drawOverviewBar(ctx, x, y, width, height, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const gradient = ctx.createLinearGradient(0, y, 0, y + height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(22, 137, 255, 0.12)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  ctx.restore();
}

function drawOverviewPoint(ctx, x, y, color, isHover, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, isHover ? 4 : 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawOverviewHoverGuide(ctx, x, pad, height) {
  ctx.strokeStyle = "rgba(210, 221, 242, 0.32)";
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x, pad.top);
  ctx.lineTo(x, height - pad.bottom);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawOverviewXAxis(ctx, label, x, height, pad, index, length) {
  if (index % 2 !== 0 && index !== length - 1) return;
  ctx.fillStyle = "#777f90";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.fillText(label.slice(5), x, height - pad.bottom + 24);
}

function handleOverviewChartHover(event) {
  if (event.target === els.overviewPowerCanvas) {
    handleOverviewCanvasHover(event, "power");
  } else if (event.target === els.overviewChargeCanvas) {
    handleOverviewCanvasHover(event, "charge");
  } else if (event.target?.id === "subsystemDiagnosisTrendCanvas") {
    handleSubsystemDiagnosisTrendHover(event);
  } else if (event.target?.classList?.contains("part-analysis-canvas")) {
    handlePartAnalysisHover(event);
  }
}

function handleOverviewDateClick(event) {
  const legendButton = event.target.closest("[data-chart-legend] button[data-series]");
  if (legendButton) {
    const legend = legendButton.closest("[data-chart-legend]");
    const key = legendButton.dataset.series;
    if (legend.dataset.chartLegend === "diagnosis") {
      state.subsystemDiagnosisTrendHighlight = state.subsystemDiagnosisTrendHighlight === key ? null : key;
      legend.querySelectorAll("button").forEach((button) => button.classList.toggle("active", !state.subsystemDiagnosisTrendHighlight || button.dataset.series === state.subsystemDiagnosisTrendHighlight));
      if (state.selectedStation && state.selectedSubsystemNo) renderSubsystemDiagnosisTrend(subsystemSnapshot(state.selectedStation, state.selectedSubsystemNo));
    } else if (legend.dataset.chartLegend === "power") {
      state.overviewPowerHighlight = state.overviewPowerHighlight === key ? null : key;
      if (state.selectedStation) renderOverviewPowerChart(createOverviewChartData(overviewChartStation(), "power"));
    } else {
      state.overviewChargeHighlight = state.overviewChargeHighlight === key ? null : key;
      if (state.selectedStation) renderOverviewChargeChart(createOverviewChartData(overviewChartStation(), "charge"));
    }
    const activeKey = legend.dataset.chartLegend === "power" ? state.overviewPowerHighlight : state.overviewChargeHighlight;
    if (legend.dataset.chartLegend !== "diagnosis") legend.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.series === activeKey));
    return;
  }
  const chargeButton = event.target.closest("[data-charge-window]");
  if (chargeButton) {
    state.chargeStatWindow = chargeButton.dataset.chargeWindow;
    if (state.selectedStation && state.selectedSubsystemNo) renderSubsystemDetail(state.selectedStation, state.selectedSubsystemNo);
    else if (state.selectedStation) renderStationOverview(state.selectedStation);
    return;
  }
  const range = event.target.closest(".chart-date-range");
  if (!range || event.target.matches("input")) return;
  const input = range.querySelector("input[type='date']");
  input?.showPicker?.();
  input?.focus();
}

function handleDiagnosisSeriesSelectChange(select) {
  const selected = Array.from(select.selectedOptions).map((option) => option.value).slice(0, 5);
  state.subsystemDiagnosisTrendSeries = new Set(selected);
  if (state.subsystemDiagnosisTrendHighlight && state.subsystemDiagnosisTrendHighlight !== "sos" && !state.subsystemDiagnosisTrendSeries.has(state.subsystemDiagnosisTrendHighlight)) {
    state.subsystemDiagnosisTrendHighlight = null;
  }
  const legend = els.stationOverviewPanel?.querySelector(".diagnosis-trend-legend");
  if (legend) legend.innerHTML = renderSubsystemDiagnosisLegend();
  if (state.selectedStation && state.selectedSubsystemNo) renderSubsystemDiagnosisTrend(subsystemSnapshot(state.selectedStation, state.selectedSubsystemNo));
}

function handleOverviewDateChange(event) {
  const seriesSelect = event.target.closest("#diagnosisSeriesSelect");
  if (seriesSelect) {
    handleDiagnosisSeriesSelectChange(seriesSelect);
    return;
  }
  const input = event.target.closest(".chart-date-range input[type='date']");
  if (!input) return;
  const range = input.closest(".chart-date-range");
  if (range?.dataset.chartRange === "diagnosis") {
    const inputs = [...range.querySelectorAll("input[type='date']")];
    const oldStart = parseDateInputValue(state.subsystemDiagnosisStartDate) || new Date(2025, 4, 1);
    const oldEnd = parseDateInputValue(state.subsystemDiagnosisEndDate) || new Date(2025, 4, 15);
    const changedIndex = inputs.indexOf(input);
    let nextStart = parseDateInputValue(inputs[0]?.value) || oldStart;
    let nextEnd = parseDateInputValue(inputs[1]?.value) || oldEnd;
    if (nextStart > nextEnd) {
      if (changedIndex === 0) nextEnd = new Date(nextStart);
      else nextStart = new Date(nextEnd);
    }
    state.subsystemDiagnosisStartDate = formatDateInput(nextStart);
    state.subsystemDiagnosisEndDate = formatDateInput(nextEnd);
    syncOverviewDateInputs();
    if (state.selectedStation && state.selectedSubsystemNo) renderSubsystemDiagnosisTrend(subsystemSnapshot(state.selectedStation, state.selectedSubsystemNo));
    return;
  }
  const chartType = range?.dataset.chartRange === "charge" ? "charge" : "power";
  const inputs = [...range.querySelectorAll("input[type='date']")];
  const oldStartValue = chartType === "charge" ? state.overviewChargeStartDate : state.overviewPowerStartDate;
  const oldEndValue = chartType === "charge" ? state.overviewChargeEndDate : state.overviewPowerEndDate;
  const oldStart = parseDateInputValue(oldStartValue) || new Date(2026, 1, 3);
  const oldEnd = parseDateInputValue(oldEndValue) || new Date(2026, 1, 13);
  const changedIndex = inputs.indexOf(input);
  let nextStart = parseDateInputValue(inputs[0]?.value) || oldStart;
  let nextEnd = parseDateInputValue(inputs[1]?.value) || oldEnd;
  if (nextStart > nextEnd) {
    if (changedIndex === 0) nextEnd = new Date(nextStart);
    else nextStart = new Date(nextEnd);
  }
  if (chartType === "charge") {
    state.overviewChargeStartDate = formatDateInput(nextStart);
    state.overviewChargeEndDate = formatDateInput(nextEnd);
  } else {
    state.overviewPowerStartDate = formatDateInput(nextStart);
    state.overviewPowerEndDate = formatDateInput(nextEnd);
  }
  syncOverviewDateInputs();
  if (state.selectedStation) {
    const data = createOverviewChartData(overviewChartStation(), chartType);
    chartType === "charge" ? renderOverviewChargeChart(data) : renderOverviewPowerChart(data);
  }
}

function overviewChartStation() {
  if (state.selectedStation && state.selectedSubsystemNo) return subsystemChartStation(state.selectedStation, state.selectedSubsystemNo);
  return state.selectedStation;
}

function syncOverviewDateInputs() {
  els.stationOverviewPanel?.querySelectorAll(".chart-date-range").forEach((range) => {
    const inputs = range.querySelectorAll("input[type='date']");
    const rangeType = range.dataset.chartRange;
    const isCharge = rangeType === "charge";
    if (rangeType === "diagnosis") {
      if (inputs[0]) inputs[0].value = state.subsystemDiagnosisStartDate;
      if (inputs[1]) inputs[1].value = state.subsystemDiagnosisEndDate;
    } else {
      if (inputs[0]) inputs[0].value = isCharge ? state.overviewChargeStartDate : state.overviewPowerStartDate;
      if (inputs[1]) inputs[1].value = isCharge ? state.overviewChargeEndDate : state.overviewPowerEndDate;
    }
  });
}

function handleOverviewCanvasHover(event, type) {
  const canvas = type === "power" ? els.overviewPowerCanvas : els.overviewChargeCanvas;
  const hitboxes = type === "power" ? state.overviewPowerHitboxes : state.overviewChargeHitboxes;
  if (!canvas || !hitboxes.length || !state.selectedStation) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (event.clientX - rect.left) * scaleX;
  const hit = hitboxes.map((item) => ({ ...item, distance: Math.abs(item.x - x) })).sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 34) return;
  if (type === "power") {
    state.overviewPowerHover = hit;
    renderOverviewPowerChart(createOverviewChartData(overviewChartStation(), "power"));
    showOverviewTooltip(els.overviewPowerTooltip, event, `<strong>${hit.item.label}</strong><span style="color:#1689ff">有功功率 ${formatNumeric(hit.item.active)} MW</span><span style="color:#20d3c5">无功功率 ${formatNumeric(hit.item.reactive)} MVar</span><span style="color:#ffd437">荷电状态 ${formatNumeric(hit.item.soc)}</span>`);
  } else {
    state.overviewChargeHover = hit;
    renderOverviewChargeChart(createOverviewChartData(overviewChartStation(), "charge"));
    showOverviewTooltip(els.overviewChargeTooltip, event, `<strong>${hit.item.label}</strong><span style="color:#20d3c5">充电量 ${formatNumeric(hit.item.charge)} MWh</span><span style="color:#1689ff">放电量 ${formatNumeric(hit.item.discharge)} MWh</span><span style="color:#b95cff">循环次数 ${formatNumeric(hit.item.cycles)} 次</span>`);
  }
}

function handleSubsystemDiagnosisTrendHover(event) {
  const canvas = document.getElementById("subsystemDiagnosisTrendCanvas");
  const tooltip = document.getElementById("subsystemDiagnosisTrendTooltip");
  if (!canvas || !tooltip || !state.subsystemDiagnosisTrendHitboxes.length) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (event.clientX - rect.left) * scaleX;
  const hit = state.subsystemDiagnosisTrendHitboxes
    .map((item) => ({ ...item, distance: Math.abs(item.x - x) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 34) {
    if (state.subsystemDiagnosisTrendHover) {
      state.subsystemDiagnosisTrendHover = null;
      if (state.selectedStation && state.selectedSubsystemNo) renderSubsystemDiagnosisTrend(subsystemSnapshot(state.selectedStation, state.selectedSubsystemNo));
    }
    tooltip.classList.remove("show");
    return;
  }
  state.subsystemDiagnosisTrendHover = { index: hit.index };
  if (state.selectedStation && state.selectedSubsystemNo) renderSubsystemDiagnosisTrend(subsystemSnapshot(state.selectedStation, state.selectedSubsystemNo));
  const selected = [
    { key: "sos", label: "SOS指数", color: "#ff526a", type: "line", unit: "" },
    ...subsystemDiagnosisSeriesOptions().filter((series) => state.subsystemDiagnosisTrendSeries.has(series.key)),
  ];
  tooltip.innerHTML = `<strong>${hit.item.label}</strong>${selected
    .map((series) => `<span style="color:${series.color}">${series.label} ${formatNumeric(hit.item[series.key])}${series.unit ? ` ${series.unit}` : ""}</span>`)
    .join("")}`;
  showOverviewTooltip(tooltip, event, tooltip.innerHTML);
}

function handlePartAnalysisHover(event) {
  const canvas = event.target;
  const tooltip = document.getElementById("partAnalysisTooltip");
  if (!canvas || !tooltip) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const x = (event.clientX - rect.left) * scaleX;
  const canvasHits = state.partAnalysisHitboxes.filter((item) => item.canvas === canvas);
  const hit = canvasHits.map((item) => ({ ...item, distance: Math.abs(item.x - x) })).sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 26) {
    if (state.partAnalysisHover) {
      state.partAnalysisHover = null;
      if (state.selectedStation && state.selectedSubsystemNo) renderPartAnalysisCharts(subsystemSnapshot(state.selectedStation, state.selectedSubsystemNo));
    }
    tooltip.classList.remove("show");
    return;
  }
  state.partAnalysisHover = { cardIndex: hit.cardIndex, index: hit.index };
  if (state.selectedStation && state.selectedSubsystemNo) renderPartAnalysisCharts(subsystemSnapshot(state.selectedStation, state.selectedSubsystemNo));
  const panel = document.querySelector(".subsystem-part-analysis-panel");
  const box = panel.getBoundingClientRect();
  tooltip.innerHTML = `<strong>${hit.item.label}</strong><span style="color:${hit.color}">SOS ${formatSosValue(hit.item.value)}</span>`;
  tooltip.style.left = `${Math.min(panel.clientWidth - 220, Math.max(8, event.clientX - box.left + 12))}px`;
  tooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  tooltip.classList.add("show");
}

function showOverviewTooltip(tooltip, event, html) {
  if (!tooltip) return;
  const box = tooltip.parentElement.getBoundingClientRect();
  tooltip.innerHTML = html;
  tooltip.style.left = `${Math.min(tooltip.parentElement.clientWidth - 220, Math.max(8, event.clientX - box.left + 12))}px`;
  tooltip.style.top = `${Math.max(8, event.clientY - box.top - 18)}px`;
  tooltip.classList.add("show");
}

function renderDetailCharts(station) {
  renderTrend(station, state.trendRange);
  renderDonut(state.detailSubsystems);
  renderBars(state.detailSubsystems);
  renderBoxPlot(station);
}

function createSubsystems(station) {
  const total = Math.max(1, Math.round(Number(station.subsystemCount || 30)));
  return Array.from({ length: total }, (_, index) => {
    const n = index + 1;
    const drift = Math.sin((n + station.sos) * 0.55) * 14 - (n % 8 === 0 ? 22 : 0) + (n % 6 === 0 ? 9 : 0);
    const score = round(Math.min(100, Math.max(35, station.sos + drift)), 2);
    return {
      no: n,
      name: subsystemDisplayName(station, n),
      score,
      risk: getRisk(score),
    };
  });
}

function trendData(station, range) {
  const endDate = new Date(2026, 3, 15);
  return Array.from({ length: range }, (_, index) => {
    const dayOffset = range - index;
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - range + 1 + index);
    const value = round(Math.min(100, Math.max(38, station.sos + Math.sin((index + 1) * 0.9) * 6 - (dayOffset % 10 === 0 ? 8 : 0))), 2);
    return {
      label: `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      value,
    };
  });
}

function renderTrend(station, range) {
  const canvas = setupCanvas(els.trendCanvas);
  const ctx = canvas.getContext("2d");
  const data = trendData(station, range);
  const pad = { left: 46, right: 20, top: 28, bottom: 34 };
  const w = canvas.width;
  const h = canvas.height;
  clear(ctx, w, h);
  drawGrid(ctx, pad, w, h);
  drawThreshold(ctx, pad, w, h, 60, "#ff3d59");
  drawThreshold(ctx, pad, w, h, 80, "#f4a51c");
  state.detailTrendHitboxes = [];
  if (state.detailTrendHover) {
    const x = pad.left + (state.detailTrendHover.index / Math.max(1, data.length - 1)) * (w - pad.left - pad.right);
    ctx.save();
    ctx.strokeStyle = "rgba(238, 247, 255, 0.36)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, h - pad.bottom);
    ctx.stroke();
    ctx.restore();
  }
  const color = riskMeta[station.risk].color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = pad.left + (index / Math.max(1, data.length - 1)) * (w - pad.left - pad.right);
    const y = valueY(point.value, pad, h);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
  data.forEach((point, index) => {
    const x = pad.left + (index / Math.max(1, data.length - 1)) * (w - pad.left - pad.right);
    const y = valueY(point.value, pad, h);
    const isHover = state.detailTrendHover && state.detailTrendHover.index === index;
    ctx.fillStyle = "#111622";
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 6 : 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = isHover ? 3 : 2;
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 6 : 4.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 3 : 2, 0, Math.PI * 2);
    ctx.fill();
    state.detailTrendHitboxes.push({ x, y, index, ...point, color });
    const labelEvery = range <= 7 ? 1 : range <= 15 ? 3 : 5;
    if (index % labelEvery === 0 || index === data.length - 1) {
      ctx.fillStyle = "#8f97a8";
      ctx.font = "12px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(point.label, x, h - 10);
    }
  });
}

function handleDetailTrendHover(event) {
  const rect = els.trendCanvas.getBoundingClientRect();
  const scaleX = els.trendCanvas.width / rect.width;
  const x = (event.clientX - rect.left) * scaleX;
  const hit = state.detailTrendHitboxes
    .map((point) => ({ ...point, distance: Math.abs(point.x - x) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 14) {
    if (state.detailTrendHover) {
      state.detailTrendHover = null;
      renderTrend(state.selectedStation, state.trendRange);
    }
    els.detailTrendTooltip.classList.remove("show");
    return;
  }
  if (!state.detailTrendHover || state.detailTrendHover.index !== hit.index) {
    state.detailTrendHover = { index: hit.index };
    renderTrend(state.selectedStation, state.trendRange);
  }
  els.detailTrendTooltip.innerHTML = `
    <strong>${hit.label}</strong>
    <span style="color:${hit.color}">SOS ${formatSosValue(hit.value)}</span>
  `;
  const box = els.detailTrendChart.getBoundingClientRect();
  els.detailTrendTooltip.style.left = `${Math.min(els.detailTrendChart.clientWidth - 230, Math.max(8, event.clientX - box.left + 12))}px`;
  els.detailTrendTooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  els.detailTrendTooltip.classList.add("show");
}

function renderDonut(subsystems) {
  const canvas = setupCanvas(els.donutCanvas);
  const ctx = canvas.getContext("2d");
  const counts = summarizeSubsystems(subsystems);
  const entries = [
    ["high", counts.high],
    ["mid", counts.mid],
    ["low", counts.low],
    ["healthy", counts.healthy],
  ];
  const total = subsystems.length;
  clear(ctx, canvas.width, canvas.height);
  drawDonutChart(ctx, canvas, entries, (key) => riskMeta[key].color, {
    radius: 62,
    lineWidth: 30,
    font: "22px Microsoft YaHei",
    centerYOffset: 7,
  });
  els.donutLegend.innerHTML = entries
    .map(
      ([key, count]) => `
      <div class="legend-item" style="--legend-color:${riskMeta[key].color}">
        <span>${riskMeta[key].label}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function drawDonutChart(ctx, canvas, entries, colorForKey, options = {}) {
  const radius = options.radius ?? 82;
  const lineWidth = options.lineWidth ?? 42;
  const font = options.font ?? "24px Microsoft YaHei";
  const centerYOffset = options.centerYOffset ?? 8;
  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  const denominator = total || 1;
  clear(ctx, canvas.width, canvas.height);
  let start = -Math.PI / 2;
  entries.forEach(([key, count]) => {
    const angle = (count / denominator) * Math.PI * 2;
    if (angle <= 0) return;
    ctx.beginPath();
    ctx.strokeStyle = colorForKey(key);
    ctx.lineWidth = lineWidth;
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, start, start + angle);
    ctx.stroke();
    start += angle;
  });
  ctx.fillStyle = "#f1f3f7";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.fillText(String(total), canvas.width / 2, canvas.height / 2 + centerYOffset);
}

function renderBars(subsystems) {
  const data = sortSubsystemBars(subsystems);
  const pad = { left: 42, right: 18, top: 28, bottom: 52 };
  const viewportWidth = Math.max(0, els.detailBarsViewport?.clientWidth || 0);
  const desiredSlot = data.length > 40 ? 18 : data.length > 16 ? 28 : 72;
  const desiredWidth = Math.max(viewportWidth, pad.left + pad.right + data.length * desiredSlot);
  els.barCanvas.style.width = `${Math.ceil(desiredWidth)}px`;
  const canvas = setupCanvas(els.barCanvas);
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  clear(ctx, w, h);
  drawGrid(ctx, pad, w, h);
  drawThreshold(ctx, pad, w, h, 60, "#ff3d59");
  drawThreshold(ctx, pad, w, h, 80, "#f4a51c");
  const slot = (w - pad.left - pad.right) / data.length;
  const barWidth = Math.max(4, Math.min(8, slot * 0.34));
  const labelStep = getSubsystemBarLabelStep(data.length, slot);
  state.detailBarHitboxes = [];
  data.forEach((item, index) => {
    const x = pad.left + index * slot + (slot - barWidth) / 2;
    const y = valueY(item.score, pad, h);
    const barHeight = h - pad.bottom - y;
    const isHover = state.detailBarHoverName === item.name;
    if (isHover) {
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(x - 2, pad.top, barWidth + 4, h - pad.top - pad.bottom);
    }
    const gradient = ctx.createLinearGradient(0, y, 0, h - pad.bottom);
    gradient.addColorStop(0, riskMeta[item.risk].color);
    gradient.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.shadowColor = riskMeta[item.risk].color;
    ctx.shadowBlur = isHover ? 16 : 5;
    ctx.fillRect(x, y, barWidth, Math.min(3, barHeight));
    ctx.shadowBlur = 0;
    state.detailBarHitboxes.push({ x: x - 4, y, width: barWidth + 8, height: barHeight, item });
    if (index % labelStep === 0 || index === data.length - 1) {
      ctx.fillStyle = "#8f97a8";
      ctx.font = "11px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(`#${item.no || subsystemNumber(item)}`, x + barWidth / 2, h - 18);
    }
  });
}

function getSubsystemBarLabelStep(length, slotWidth) {
  if (length <= 0) return 1;
  if (length <= 8) return 1;
  const estimatedLabelWidth = 24;
  return Math.max(1, Math.ceil(estimatedLabelWidth / Math.max(1, slotWidth)));
}

function sortSubsystemBars(subsystems) {
  return [...subsystems].sort((a, b) => {
    const aNo = subsystemNumber(a);
    const bNo = subsystemNumber(b);
    if (state.sortSubsystemMode === "idDesc") return bNo - aNo || b.name.localeCompare(a.name, "zh-CN");
    if (state.sortSubsystemMode === "sosAsc") return a.score - b.score || aNo - bNo;
    if (state.sortSubsystemMode === "sosDesc") return b.score - a.score || aNo - bNo;
    return aNo - bNo || a.name.localeCompare(b.name, "zh-CN");
  });
}

function subsystemNumber(item) {
  const match = String(item?.name || "").match(/#(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function handleDetailBarHover(event) {
  const rect = els.barCanvas.getBoundingClientRect();
  const scaleX = els.barCanvas.width / rect.width;
  const scaleY = els.barCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.detailBarHitboxes.find((box) => x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height);
  if (!hit) {
    if (state.detailBarHoverName) {
      state.detailBarHoverName = null;
      renderBars(state.detailSubsystems);
    }
    els.detailBarsTooltip.classList.remove("show");
    return;
  }
  if (state.detailBarHoverName !== hit.item.name) {
    state.detailBarHoverName = hit.item.name;
    renderBars(state.detailSubsystems);
  }
  els.detailBarsTooltip.innerHTML = `
    <strong>${hit.item.name}</strong>
    <span style="color:${riskMeta[hit.item.risk].color}">SOS ${formatSosValue(hit.item.score)}</span>
  `;
  const box = els.detailBarsViewport.getBoundingClientRect();
  const tooltipWidth = 230;
  const rawLeft = event.clientX - box.left + els.detailBarsViewport.scrollLeft + 12;
  const minLeft = els.detailBarsViewport.scrollLeft + 8;
  const maxLeft = els.detailBarsViewport.scrollLeft + els.detailBarsViewport.clientWidth - tooltipWidth - 8;
  els.detailBarsTooltip.style.left = `${Math.max(minLeft, Math.min(maxLeft, rawLeft))}px`;
  els.detailBarsTooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  els.detailBarsTooltip.classList.add("show");
}

function boxPlotParts(station) {
  const names = ["电池系统", "电气系统", "环控系统", "消防系统"];
  return names.map((name, index) => {
    const base = station.sos - index * 4 + Math.sin(index + station.sos) * 8;
    const low = round(Math.max(14, base - 30), 2);
    const q1 = round(Math.max(24, base - 13), 2);
    const mid = round(Math.max(30, base + (index === 0 ? 2 : 0)), 2);
    const q3 = round(Math.min(94, base + 16), 2);
    const high = round(Math.min(100, base + 28), 2);
    const mean = round((low + q1 + mid + q3 + high) / 5, 2);
    const outliers = [];
    if (index !== 1) {
      outliers.push({
        value: round(Math.max(8, low - 7 - index * 2), 2),
        subsystem: `#${1 + ((index * 3 + Math.round(station.sos)) % Math.max(1, station.subsystemCount))}子系统`,
      });
    }
    if (index === 2 || station.risk === "high") {
      outliers.push({
        value: round(Math.min(100, high + 6), 2),
        subsystem: `#${2 + ((index * 5 + Math.round(station.sos)) % Math.max(2, station.subsystemCount))}子系统`,
      });
    }
    return { name, low, q1, mid, q3, high, mean, outliers };
  });
}

function renderBoxPlot(station) {
  const canvas = setupCanvas(els.boxCanvas);
  const ctx = canvas.getContext("2d");
  const parts = boxPlotParts(station);
  const pad = { left: 48, right: 28, top: 32, bottom: 46 };
  const w = canvas.width;
  const h = canvas.height;
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  state.detailBoxHitboxes = [];
  parts.forEach((part, index) => {
    const plotWidth = w - pad.left - pad.right;
    const x = pad.left + (index + 0.5) * (plotWidth / parts.length);
    const boxWidth = Math.min(44, Math.max(28, plotWidth / 15));
    const yLow = valueY(part.low, pad, h);
    const yHigh = valueY(part.high, pad, h);
    const yQ1 = valueY(part.q1, pad, h);
    const yQ3 = valueY(part.q3, pad, h);
    const yMid = valueY(part.mid, pad, h);
    const yMean = valueY(part.mean, pad, h);
    ctx.strokeStyle = "#1689ff";
    ctx.fillStyle = "rgba(22, 137, 255, 0.24)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, yHigh);
    ctx.lineTo(x, yLow);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - boxWidth * 0.28, yHigh);
    ctx.lineTo(x + boxWidth * 0.28, yHigh);
    ctx.moveTo(x - boxWidth * 0.28, yLow);
    ctx.lineTo(x + boxWidth * 0.28, yLow);
    ctx.stroke();
    ctx.fillRect(x - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
    ctx.strokeRect(x - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
    ctx.beginPath();
    ctx.moveTo(x - boxWidth / 2, yMid);
    ctx.lineTo(x + boxWidth / 2, yMid);
    ctx.stroke();
    ctx.fillStyle = "#1689ff";
    ctx.beginPath();
    ctx.moveTo(x, yMean - 7);
    ctx.lineTo(x + 6, yMean + 5);
    ctx.lineTo(x - 6, yMean + 5);
    ctx.closePath();
    ctx.fill();
    part.outliers.forEach((outlier) => {
      const oy = valueY(outlier.value, pad, h);
      ctx.fillStyle = "#ff526a";
      ctx.beginPath();
      ctx.moveTo(x, oy - 7);
      ctx.lineTo(x + 6, oy);
      ctx.lineTo(x, oy + 7);
      ctx.lineTo(x - 6, oy);
      ctx.closePath();
      ctx.fill();
      state.detailBoxHitboxes.push({ type: "outlier", x, y: oy, part, outlier });
    });
    ctx.fillStyle = "#8f97a8";
    ctx.font = "12px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(part.name.replace("系统", ""), x, h - 14);
    state.detailBoxHitboxes.push({ type: "box", x, y: (yQ1 + yQ3) / 2, boxWidth, yQ1, yQ3, part });
  });
}

function handleBoxHover(event) {
  const rect = els.boxCanvas.getBoundingClientRect();
  const scaleX = els.boxCanvas.width / rect.width;
  const scaleY = els.boxCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.detailBoxHitboxes
    .map((item) => {
      if (item.type === "box") {
        const inBox = Math.abs(item.x - x) <= item.boxWidth / 2 + 12 && y >= item.yQ3 - 12 && y <= item.yQ1 + 12;
        return { ...item, distance: inBox ? 0 : Math.hypot(item.x - x, item.y - y) };
      }
      return { ...item, distance: Math.hypot(item.x - x, item.y - y) };
    })
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 22) {
    els.boxTooltip.classList.remove("show");
    return;
  }
  if (hit.type === "outlier") {
    els.boxTooltip.innerHTML = `
      <strong>${hit.part.name}</strong>
      <span style="color:#ff526a">${hit.outlier.subsystem} ${formatSosValue(hit.outlier.value)}</span>`;
  } else {
    els.boxTooltip.innerHTML = `
      <strong>${hit.part.name}</strong>
      <span style="color:#1689ff">上边缘 ${formatSosValue(hit.part.high)}</span>
      <span style="color:#1689ff">上四分位 ${formatSosValue(hit.part.q3)}</span>
      <span style="color:#1689ff">中位数 ${formatSosValue(hit.part.mid)}</span>
      <span style="color:#1689ff">均值 ${formatSosValue(hit.part.mean)}</span>
      <span style="color:#1689ff">下四分位 ${formatSosValue(hit.part.q1)}</span>
      <span style="color:#1689ff">下边缘 ${formatSosValue(hit.part.low)}</span>`;
  }
  const box = els.boxChartWrap.getBoundingClientRect();
  els.boxTooltip.style.left = `${Math.min(els.boxChartWrap.clientWidth - 230, Math.max(8, event.clientX - box.left + 12))}px`;
  els.boxTooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  els.boxTooltip.classList.add("show");
}

function renderDetailAlarms(station) {
  const subsystemNo = state.selectedSubsystemNo;
  const warningOnly = state.subsystemPageMode === "diagnosis" && Boolean(subsystemNo);
  const snapshot = subsystemNo ? subsystemSnapshot(station, subsystemNo) : null;
  const partFilter = subsystemNo ? state.subsystemPartFilter : null;
  const rangeAlarms = detailBaseAlarmsForStation(station, subsystemNo)
    .filter((alarm) => !warningOnly || homeAlarmCategory(alarm) === "warning")
    .filter((alarm) => alarmMatchesPartFilter(alarm, partFilter));
  const activeCategory = warningOnly ? "warning" : state.detailAlarmCategory;
  const activeSubfilter = warningOnly ? state.detailAlarmSubfilter : state.detailAlarmSubfilter;
  const categoryAlarms = rangeAlarms.filter((alarm) => activeCategory === "all" || homeAlarmCategory(alarm) === activeCategory);
  const alarms = categoryAlarms.filter((alarm) => homeAlarmSubfilterMatch(alarm, activeSubfilter));
  const filterSuffix = partFilter ? ` · ${partFilter.label}` : "";
  const panelTitle = els.detailAlarmList.closest(".alarm-panel")?.querySelector(".alarm-head .panel-title");
  if (panelTitle) panelTitle.innerHTML = `<span></span>${warningOnly ? "预警清单" : "预警/告警清单"}`;
  els.detailAlarmList.closest(".detail-alarm-panel")?.classList.toggle("diagnosis-aside-split", warningOnly);
  els.detailAlarmSubtitle.textContent = subsystemNo ? `${subsystemDisplayName(station, subsystemNo)}${filterSuffix}` : `${station.id}${station.name}`;
  const sideSosPanel = document.getElementById("detailSosSidePanel");
  if (sideSosPanel) {
    sideSosPanel.hidden = !warningOnly;
    if (warningOnly && snapshot) {
      sideSosPanel.innerHTML = `
        <div class="panel-title"><span></span>当前 SOS 安全指数</div>
        <div class="detail-side-gauge">
          <canvas id="detailSideSosGaugeCanvas" width="300" height="180"></canvas>
          <strong>${formatSosValue(snapshot.score)}</strong>
        </div>
        <div class="detail-side-date"><span>更新日期</span><strong>2025-05-07</strong></div>`;
      drawSosGauge(document.getElementById("detailSideSosGaugeCanvas"), snapshot.score);
    }
  }
  if (els.detailAlarmTabs) {
    if (warningOnly) {
      const warningTabCounts = {
        all: rangeAlarms.length,
        level1: rangeAlarms.filter((alarm) => alarm.type === "level1").length,
        level2: rangeAlarms.filter((alarm) => alarm.type === "level2").length,
        level3: rangeAlarms.filter((alarm) => alarm.type === "level3").length,
      };
      const warningTabs = [
        { key: "all", label: "全部" },
        { key: "level1", label: "一级" },
        { key: "level2", label: "二级" },
        { key: "level3", label: "三级" },
      ];
      els.detailAlarmTabs.innerHTML = warningTabs
        .map((tab) => `<button class="${activeSubfilter === tab.key ? "active" : ""}" data-type="${tab.key}" type="button">${tab.label} <span id="detailAlarmCount${tab.key === "all" ? "All" : tab.key === "level1" ? "Level1" : tab.key === "level2" ? "Level2" : "Level3"}">${warningTabCounts[tab.key]}</span></button>`)
        .join("");
      els.detailAlarmTabs.hidden = false;
    } else {
      els.detailAlarmTabs.innerHTML = "";
      els.detailAlarmTabs.hidden = true;
    }
    els.detailAlarmTabs.classList.toggle("warning-only", warningOnly);
  }
  const setDetailCount = (id, value) => {
    const target = document.getElementById(id);
    if (target) target.textContent = value;
  };
  setDetailCount("detailAlarmCountAll", rangeAlarms.length);
  setDetailCount("detailAlarmCountLevel1", rangeAlarms.filter((alarm) => homeAlarmCategory(alarm) === "warning" && alarm.type === "level1").length);
  setDetailCount("detailAlarmCountLevel2", rangeAlarms.filter((alarm) => homeAlarmCategory(alarm) === "warning" && alarm.type === "level2").length);
  setDetailCount(
    "detailAlarmCountLevel3",
    warningOnly
      ? rangeAlarms.filter((alarm) => homeAlarmCategory(alarm) === "warning" && alarm.type === "level3").length
      : rangeAlarms.filter((alarm) => homeAlarmCategory(alarm) === "data").length
  );
  const sourceSummary = els.detailAlarmList.closest(".alarm-panel")?.querySelector(".alarm-source-summary");
  if (sourceSummary) sourceSummary.hidden = warningOnly;
  if (!warningOnly) {
    renderHomeAlarmCategorySummary(sourceSummary, rangeAlarms, {
      interactive: true,
      activeCategory,
      activeSubfilter,
      onChange: (category) => {
        state.detailAlarmCategory = category;
        state.detailAlarmSubfilter = "all";
        renderDetailAlarms(station);
      },
      onSubChange: (category, subfilter) => {
        const wasActive = state.detailAlarmCategory === category && state.detailAlarmSubfilter === subfilter;
        state.detailAlarmCategory = category;
        state.detailAlarmSubfilter = wasActive ? "all" : subfilter;
        renderDetailAlarms(station);
      },
    });
  }
  els.detailAlarmList.innerHTML = alarms.length
    ? alarms
        .map(
          (alarm) => {
            const leftTags = homeAlarmLeftTags(alarm);
            return `
        <button class="alarm-item alarm-${alarm.type}" type="button" data-alarm-id="${alarm.id}">
          <div class="alarm-body">
            <div class="alarm-row">
              <div class="alarm-tags">
                ${leftTags}
              </div>
              <span class="alarm-source alarm-source-${homeAlarmPillClass(alarm)}">${homeAlarmRightLabel(alarm)}</span>
            </div>
            <strong>${alarm.title}</strong>
            <div class="alarm-meta">
              <span class="alarm-station-name">${alarm.location}</span>
              <time>${alarm.time}</time>
            </div>
          </div>
        </button>`;
          }
        )
        .join("")
    : `<div class="empty detail-alarm-empty">${
        partFilter
          ? `当前${subsystemNo ? "子系统" : "场站"}暂无与${partFilter.label}相关的${warningOnly ? "预警" : "预警/告警"}`
          : activeCategory === "all"
            ? `当前${subsystemNo ? "子系统" : "场站"}暂无${warningOnly ? "预警" : "预警/告警"}`
            : `当前${subsystemNo ? "子系统" : "场站"}无${homeAlarmEmptyLabel(activeCategory)}`
      }</div>`;
  els.detailAlarmList.querySelectorAll(".alarm-item").forEach((item) => {
    item.addEventListener("click", () => {
      const alarm = alarms.find((entry) => entry.id === item.dataset.alarmId);
      openAlarmModal(alarm);
    });
  });
  syncDetailAlarmPanelHeight();
}

function homeAlarmEmptyLabel(category) {
  if (category === "data") return "数据告警";
  if (category === "warning") return "预警";
  return "告警";
}

function renderTable() {
  const descriptions = {
    high: "Pack 温差偏高，簇级电压离散度异常",
    mid: "监测参数持续波动，建议跟踪运行趋势",
    low: "存在优化项，建议纳入下次巡检",
    healthy: "健康",
  };
  const suggestions = {
    high: "立即复核 BMS 数据并安排现场排查",
    mid: "观察 2 小时趋势，必要时调整运行策略",
    low: "记录优化项，按计划维护",
    healthy: "保持当前运行策略",
  };
  const rows = state.detailSubsystems.map((item, index) => ({
    ...item,
    date: `2026-04-${String(15 - (index % 7)).padStart(2, "0")}`,
    description: descriptions[item.risk],
    suggestion: suggestions[item.risk],
  }));
  const sorted = sortDetailTableRows(rows);
  updateDetailTableSortHeaders();
  els.alertTable.innerHTML = sorted
    .map(
      (item, index) => `
      <tr data-row="${index}" data-subsystem="${item.no}">
        <td>${subsystemShortName(item.no)}</td>
        <td class="${scoreClass(item.score)}">${formatSosValue(item.score)}</td>
        <td>${item.date}</td>
        <td>${item.description}</td>
        <td>${item.suggestion}</td>
      </tr>`
    )
    .join("");
  els.alertTable.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      els.alertTable.querySelectorAll("tr").forEach((item) => item.classList.remove("selected"));
      row.classList.add("selected");
      if (state.selectedStation && row.dataset.subsystem) {
        showSubsystemDetail(state.selectedStation, Number(row.dataset.subsystem), "diagnosis");
      }
    });
  });
}

function sortDetailTableRows(rows) {
  const { key, direction } = state.detailTableSort;
  const factor = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    let result = 0;
    if (key === "score") result = a.score - b.score;
    else if (key === "date") result = a.date.localeCompare(b.date, "zh-CN");
    else if (key === "risk") result = riskMeta[a.risk].order - riskMeta[b.risk].order || a.score - b.score;
    else if (key === "suggestion") result = a.suggestion.localeCompare(b.suggestion, "zh-CN");
    else result = a.name.localeCompare(b.name, "zh-CN");
    return result * factor;
  });
}

function updateDetailTableSortHeaders() {
  document.querySelectorAll(".table-sort-btn").forEach((button) => {
    const active = button.dataset.sortKey === state.detailTableSort.key;
    button.classList.toggle("active", active);
    button.classList.toggle("asc", active && state.detailTableSort.direction === "asc");
    button.classList.toggle("desc", active && state.detailTableSort.direction === "desc");
  });
}

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  if (canvas.dataset.squareCanvas === "true") {
    const cssWidth = canvas.offsetWidth || rect.width || 180;
    const cssHeight = canvas.offsetHeight || rect.height || cssWidth;
    const side = Math.max(120, Math.round(Math.min(cssWidth, cssHeight)));
    canvas.width = side;
    canvas.height = side;
    return canvas;
  }
  const width = Math.max(320, Math.round(rect.width));
  const cssHeight = Number(canvas.getAttribute("height"));
  canvas.width = width;
  canvas.height = cssHeight;
  return canvas;
}

function clear(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

function drawGrid(ctx, pad, w, h) {
  ctx.strokeStyle = "#303440";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.fillStyle = "#747c8f";
  ctx.font = "12px Microsoft YaHei";
  ctx.textAlign = "right";
  [0, 20, 40, 60, 80, 100].forEach((value) => {
    const y = valueY(value, pad, h);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText(String(value), pad.left - 8, y + 4);
  });
  ctx.setLineDash([]);
}

function drawThreshold(ctx, pad, w, h, value, color, label = "") {
  const y = valueY(value, pad, h);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(pad.left, y);
  ctx.lineTo(w - pad.right, y);
  ctx.stroke();
  ctx.setLineDash([]);
  if (label) {
    ctx.fillStyle = color;
    ctx.font = "12px Microsoft YaHei";
    ctx.textAlign = "left";
    ctx.fillText(label, pad.left + 6, y - 6);
  }
  ctx.globalAlpha = 1;
}

function valueY(value, pad, h) {
  return pad.top + (100 - value) * ((h - pad.top - pad.bottom) / 100);
}

function summarizeSubsystems(subsystems) {
  return subsystems.reduce(
    (acc, item) => {
      acc[item.risk] += 1;
      return acc;
    },
    { high: 0, mid: 0, low: 0, healthy: 0 }
  );
}

function alarmOrder(type) {
  return { level1: 0, level2: 1, level3: 2 }[type] ?? 3;
}

function levelToType(level) {
  return { 一级: "level1", 二级: "level2", 三级: "level3" }[level] ?? "level3";
}

function alarmTemplateWeight(template) {
  const weightMap = {
    "铜排螺栓松动/绝缘子故障": 7,
    "多电芯容量偏高异常": 6,
    "PCS控制参数调整-进口水温偏低": 5,
    "单电芯温度偏低": 4,
    "多颗电芯温度偏低/电芯温度一致性差": 3,
    "单电芯SOC偏高异常": 3,
    "多电芯SOC偏高异常": 2,
    "直流主控配电柜空调长时间温度异常": 2,
  };
  return weightMap[template.name] ?? 1;
}

function pickRiskTemplate(templates, index) {
  const fallback = { name: "子系统SOC不均衡提示", module: "电池系统", level: "三级", locationFormat: "#1子系统-Rack101-Pack1-Cell2" };
  if (!templates.length) return fallback;
  const level = index < 35 ? "一级" : index < 105 ? "二级" : "三级";
  const pool = templates.filter((item) => item.level === level);
  const source = pool.length ? pool : templates;
  const weightedPool = source.flatMap((item) => Array.from({ length: alarmTemplateWeight(item) }, () => item));
  return weightedPool[index % weightedPool.length];
}

function createAlarmLocation(format, station, index) {
  const subsystemTotal = Math.max(1, Number(station.subsystemCount) || 1);
  const subsystem = 1 + (index % subsystemTotal);
  const rack = `${index % 2 === 0 ? 1 : 2}${String(1 + ((index * 5) % 12)).padStart(2, "0")}`;
  const pack = 1 + ((index * 3) % 8);
  const pcs = `PCS${String(1 + (index % 2)).padStart(2, "0")}`;
  const cells = [0, 1, 2].map((offset) => 1 + ((index * 7 + offset * 9) % 28));
  return format
    .replace(/#\d+子系统/g, `#${subsystem}子系统`)
    .replace(/LCC\d+/g, pcs)
    .replace(/Rack\d+/g, `Rack${rack}`)
    .replace(/Pack\d+/g, `Pack${pack}`)
    .replace(/Cell\d+(?:,\d+)*/g, (match) => {
      const count = match.replace(/^Cell/, "").split(",").length;
      return `Cell${cells.slice(0, count).join(",")}`;
    });
}

function formatDateInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatSosValue(value) {
  return value === 100 ? "100" : Number(value).toFixed(2);
}

function formatNumeric(value) {
  return Number(value || 0).toFixed(2);
}

function formatRemainingEnergy(station) {
  return formatNumeric(Number(station.ratedEnergy || 0) * (Number(station.soc || 0) / 100) * 1000);
}

function formatSopSoe(station) {
  const ratedPower = Number(station.rated || 0);
  const ratedEnergy = Number(station.ratedEnergy || 0);
  const seed = stationIndexSeed(station);
  const powerRatio = 0.88 + (seed % 6) * 0.01;
  const energyRatio = 0.87 + (seed % 7) * 0.01;
  const sop = Math.max(0.1, ratedPower * powerRatio);
  const soe = Math.max(0.1, ratedEnergy * energyRatio);
  return `${formatCompactCapacity(sop)}MW/${formatCompactCapacity(soe)}MWh`;
}

function formatCompactCapacity(value) {
  const num = Number(value || 0);
  if (Math.abs(num) >= 100) return String(Math.round(num));
  if (Math.abs(num) >= 10) return num.toFixed(1).replace(/\.0$/, "");
  return num.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function stationHealthScore(station) {
  const seed = stationIndexSeed(station);
  const sos = Number(station.sos || 0);
  const base = 92 + (seed % 9) * 0.45;
  const penalty = Math.max(0, 72 - sos) * 0.08;
  return Math.round(Math.max(86, Math.min(98.5, base - penalty)) * 10) / 10;
}

function stationIndexSeed(station) {
  const numericId = String(station.id || "").match(/\d+/g)?.join("") || "0";
  return Number(numericId.slice(-4)) || 0;
}

function scoreClass(score) {
  const risk = getRisk(score);
  return `score-${risk}`;
}

function round(value, digits) {
  return Number(value.toFixed(digits));
}

function tickClock() {
  const now = new Date();
  els.clock.textContent = now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function openPageFromUrl() {
  const page = new URLSearchParams(window.location.search).get("page");
  if (["overview", "risk", "alarm"].includes(page)) showPage(page);
}

function openStationFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const stationId = params.get("station");
  if (!stationId) return;
  showDetail(stationId);
  const subsystemNo = Number(params.get("subsystem"));
  if (Number.isFinite(subsystemNo) && subsystemNo > 0) {
    const station = state.stations.find((item) => item.id === stationId);
    if (station) showSubsystemDetail(station, subsystemNo, params.get("subsystemView") === "diagnosis" ? "diagnosis" : "overview");
    return;
  }
  if (params.get("tab") === "diagnosis") showDetailTab("diagnosis");
}

function bindSosRangeEvents() {
  if (!els.sosMinInput || !els.sosMaxInput || !els.sosMinRange || !els.sosMaxRange) return;
  const applyFromInputs = () => {
    const min = Number(els.sosMinInput.value);
    const max = Number(els.sosMaxInput.value);
    setSosRange(min, max);
  };
  const applyFromRanges = () => {
    const min = Number(els.sosMinRange.value);
    const max = Number(els.sosMaxRange.value);
    setSosRange(min, max);
  };
  ["input", "change"].forEach((eventName) => {
    els.sosMinInput.addEventListener(eventName, applyFromInputs);
    els.sosMaxInput.addEventListener(eventName, applyFromInputs);
    els.sosMinRange.addEventListener(eventName, applyFromRanges);
    els.sosMaxRange.addEventListener(eventName, applyFromRanges);
  });
  setSosRange(state.sosMin, state.sosMax, false);
}

function setSosRange(minValue, maxValue, shouldApply = true) {
  let min = Number.isFinite(minValue) ? minValue : 0;
  let max = Number.isFinite(maxValue) ? maxValue : 100;
  min = Math.max(0, Math.min(100, Math.round(min)));
  max = Math.max(0, Math.min(100, Math.round(max)));
  if (min > max) [min, max] = [max, min];
  state.sosMin = min;
  state.sosMax = max;
  syncSosRangeControls();
  if (shouldApply) applyFilters();
}

function syncSosRangeControls() {
  if (!els.sosMinInput || !els.sosMaxInput || !els.sosMinRange || !els.sosMaxRange || !els.sosRangeFill) return;
  els.sosMinInput.value = String(state.sosMin);
  els.sosMaxInput.value = String(state.sosMax);
  els.sosMinRange.value = String(state.sosMin);
  els.sosMaxRange.value = String(state.sosMax);
  els.sosRangeFill.style.left = `${state.sosMin}%`;
  els.sosRangeFill.style.right = `${100 - state.sosMax}%`;
}
