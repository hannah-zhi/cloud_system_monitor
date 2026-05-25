# Safety Warning System Skill

## Purpose

Use this skill to recreate or extend the储能云端安全预警系统的“安全预警”页面，包括首页场站矩阵、右侧预警清单、单站安全诊断详情、数据清洗规则和 UI 风格规范。

## Visual Style

- Use a dark operations-console style inspired by the安全诊断 reference.
- Base background: near-black navy/charcoal.
- Panels: dark translucent surfaces, subtle borders, light blue left accent lines, restrained gradients.
- Primary accent: bright technology blue.
- Risk colors:
  - 高风险 / 一级: red.
  - 中风险 / 二级: amber.
  - 低风险 / 三级: green.
  - 健康: blue.
- Source colors:
  - 云端预警: blue.
  - 站端预警: green.
  - 设备告警: purple.
  - 数据告警: cyan, overview-only.
- Keep typography compact and stable. Numeric badges should not dominate labels.

## Layout

- Sidebar system name: 远景数智运营系统.
- Sidebar menu uses a two-level structure for this module:
  - 一级：全景概览、安全预警、健康管理、运营评估、交易协同、数据分析、数据运营。
  - 二级（安全预警下）：安全监测、安全评估、预警管理、风险运营。
- Page mapping:
  - 安全监测 -> 原“场站总览”页面。
  - 安全评估 -> 原“风险透视”页面。
  - 预警管理 -> 原“预警详情”页面。
- Only the active second-level page should use the strong blue selected state. The first-level “安全预警” stays in expanded state without competing highlight.
- 场站总览:
  - Left: station filters and fixed-size station cards.
  - Right: 预警清单 panel.
  - Keep a clear left gutter between the station search toolbar and the sidebar divider; the search field must not visually collide with the sidebar.
  - Do not show a 查看详情 jump action in the top-right of the 预警清单 panel.
- Station cards must not stretch to fill leftover space after filtering.
- On ???? station cards, the capacity label should read ?????/???.
- Prewarning list must stay visually consistent with station cards and panel style.
- 风险透视:
  - The first row contains three panels in this order: 风险场站 TOP5, 全量场站平均 SOS, and 场站风险等级占比.
  - 风险场站 TOP5 is a vertical list, one station per row, with SOS and a risk-colored progress bar.
  - Rename the average metric to 全量场站平均 SOS.
  - Keep 全量场站平均 SOS as a standalone first-row gauge panel, calculated from all valid stations and unaffected by current station filters. The gauge should use a smooth red/yellow/green gradient, sparse readable ticks, and should not show 当前风险等级 text. Do not use a standalone 高/中风险场站 KPI card.
  - Do not use standalone KPI cards for 预警总量 and 一级预警; represent alarm severity totals with a pie/donut chart.
  - Group SOS-related charts together and alarm-related charts together.
  - Include SOS distribution bars, risk distribution donut, full-station SOS trend point-lines, alarm severity donut, module distribution donut, and alarm-type TOP5.
  - Place 场站SOS分布 and 全量场站SOS趋势 on the same row, with 场站SOS分布 on the left and 全量场站SOS趋势 on the right.
  - Do not include an SOS band statistics chart unless explicitly requested.
  - Donut legends should sit closer to the chart center instead of hugging the right edge.
  - SOS bar chart is titled 场站SOS分布. It should use slim vertical bars, risk-colored thresholds, fixed visible horizontal scrolling for many stations, station-number x labels, and hover tooltip with full station name plus SOS value. Add sort options: 场站编号-顺序, 场站编号-倒序, SOS数值-从低到高, SOS数值-从高到低. The SOS value color should match the bar color. Hovering a bar should use a narrow translucent vertical highlight around one bar, not a white stroke box. Do not draw a miniature curve behind the x-axis labels.
  - Trend chart is titled 全量场站SOS趋势 and is a point-line chart showing full-station average, maximum, and minimum with 7/15/30 day quick range buttons and `MM-DD` x-axis labels such as `04-01`. The legend label for the average is 全量场站平均值, while tooltip rows use 平均值. Hovering a date column should show a vertical guide line, highlight all three points for that date, and display maximum, average, and minimum values together. The minimum line is purple; the 80 line is yellow dashed and the 60 line is red dashed.
  - 预警模块分布 should be a donut/pie chart for 电池系统、电气系统、环控系统、消防系统.
  - 预警类型 TOP5 should use a progress-list layout similar to 风险场站 TOP5. Counts should vary, and colors should be red, yellow, green, cyan, purple in order.
  - Charts should update from the current station filter.
- 预警详情:
  - Use a top horizontal filter bar and full-width alarm table, similar to the provided 风险预警列表 reference.
  - The three summary charts above the alarm table must share the same filtered alarm dataset as the table below, and update together when time, level, status, module, alarm name, station, location, or source filters change.
  - Alarm-type TOP5 counts and bar lengths must come from the real filtered aggregation result; do not add demo-only offsets to the numbers.
  - In the unfiltered default state, the alarm-type TOP5 should show a naturally descending distribution rather than five identical counts.
  - Query bar contains filters for time, level, status, module, alarm name, station, location, and source. Put the status filter immediately after level, and make it wider than the level filter.
  - Level, module, and source are multi-select dropdowns. Alarm name, station, and location are searchable multi-select dropdowns. Time uses a start/end date range.
  - Multi-select dropdowns must reuse the same visual pattern as the station search dropdown on 场站总览: trigger box, arrow behavior, search input, option row, selected checkmark, shadow, and high z-index overlay. Treat this as the shared system component style for future dropdowns.
  - In 预警管理, each filter trigger arrow should sit flush to the right edge in a consistent position across all filter boxes, and should keep the same downward state when the menu opens.
  - Non-searchable dropdown menus in 预警管理 should open at trigger width, while searchable dropdown menus may expand wider for content search.
  - Table columns: 编号, 等级, 预警名称, 模块, 场站, 位置, 事件时间, 预警时间, 状态, 来源. Use stable row codes such as `CW-2026010200001`, where source prefixes are `CW` for 云端预警, `SW` for 站端预警, and `EA` for 设备告警.
  - In 预警管理, aggregate rows by `预警名称 + 模块 + 场站 + 位置 + 来源`. Cloud-side and station-side alarms must stay in separate rows and separate detail modal groups, while 等级、事件时间、预警时间、状态 use the latest alarm in that group.
  - The 状态 column follows this lifecycle:
    - Initial generated alarm: `待处理`.
    - First-step close: `关闭-误报`, `关闭-数据异常`, or `关闭-其他`.
    - SR issued: `排查中`.
    - SR returned and final close: `关闭-准确` or `关闭-类型不准确`; when the selected failure mode needs more root-cause detail, use `关闭-待补充根因` until root cause is submitted.
  - All `关闭-XXX` status pills must use a gray visual style.
  - Some station-side alarms start as `关闭-站端已处理`; if they have a linked cloud-side alarm, the linked cloud alarm also becomes `关闭-站端已处理`.
  - After an SR is issued and completed/returned, show an envelope marker inside the 状态 column before the status pill for the corresponding aggregated alarm row.
  - Alarm table column priority: keep 等级 and 模块 relatively compact; keep 来源 wide enough for one-line source pills; give more width to 预警名称, 场站, 位置; keep 事件时间 and 预警时间 visually stable.
  - The alarm table starts with a `编号` column and must not renumber visible rows from `1` after filtering. Keep row codes stable and source/date based.
  - Keep the 编号 column compact while preserving single-line `CW/SW/EA-date-serial` display.
  - The SR envelope belongs to the `状态` column, not the `编号` column. Position it as an absolute prefix between `预警时间` and `状态`, so status pill text always starts at the same x position and aligns with the 状态 header whether the envelope is present or not.
  - Reserve left prefix padding inside the `状态` column so the SR envelope never overlaps the `预警时间` column.
  - Keep source pills (`云端预警`, `站端预警`, `设备告警`) on one line in the source column.
  - The warning-management page source scope is only `云端预警`, `站端预警`, and `设备告警`; do not include `站端告警` or `数据告警`.
  - On the warning management overview, show a `预警来源分布` donut chart immediately after `预警等级占比`; source chart colors must match the source pills.
  - Warning-management overview donut charts must render from a square canvas coordinate system so CSS sizing cannot stretch them into ellipses.
  - Keep the warning-management donut chart and legend group visually centered. Legend labels and numbers should use compact fixed columns and must not stretch apart or clip on external-display layouts or 67% browser zoom.
  - Do not place details at the page bottom. Open alarm details in a modal when an aggregated row is clicked.
  - The alarm modal should behave like a card for the aggregate group: show multiple time-specific alarms as table rows in the upper section, newest first by 预警时间 descending, and update the lower trend chart when a different row is selected.
  - Above the grouped alarm rows, show three compact context boxes for 模块, 场站, and 位置. The grouped alarm rows themselves use only these columns: 序号, 等级, 事件时间, 预警时间, 关闭时间, 持续时长, 状态. Use plain numeric sequence values such as `1`, `2`, `3`; make 序号 and 等级 slightly wider and center aligned; keep 持续时长 narrower; widen the timestamp columns. Do not include 来源 or 位置 columns in the row table. 关闭时间 is auto-filled when the warning is closed and stays blank while open. The first few risk-warning-list groups should include multiple same-group rows with different times and different levels so selecting different rows switches the trend chart.
  - The modal should emphasize alarm name and handling suggestion. Keep 来源 as an upper-left triangular hero marker with only the triangular background and outline, no extra inner box. Rotate the source text 45 degrees, using blue for 云端 and green for 站端, and keep it large enough to read. Do not show level/module tags such as `一级` or `电池系统` in the hero card. If a linked cloud/station alarm exists, place a jump button in the hero card's bottom-right corner, colored to match the linked alarm source: blue for 云端 and green for 站端. Do not render separate boxed metadata cards for 来源、事件时间、预警时间、持续时长、当前状态.
  - The modal hero gradient should match severity: 一级 uses red-blue, 二级 uses yellow-blue, and 三级 uses green-blue.
  - Full timestamps in the alarm detail page and modal should include seconds, using `YYYY/MM/DD HH:mm:ss`.
  - The modal should include an interactive trend curve for alarm-related data, with `处理` and `分析` action buttons below the chart.
  - Clicking `处理` opens a separate centered processing modal rather than expanding content at the bottom of the detail modal:
    - First choose `关闭预警` or `下发 SR`, without explanatory microcopy such as `请选择本组预警闭环路径`.
    - If closing directly, require one of `误报`, `数据异常`, or `其他`; `其他` requires a manual reason.
    - If issuing SR, show `场站`, `位置`, `模块`, and `预警名称` at the top of the SR modal, then render four form rows: first `SR编号`, second editable blank `操作指导`, third attachment upload, fourth `SR下发时间` and `期望完成时间`. Do not show `工单编号` in the issue form. `SR下发时间` is read-only and is set to the current Beijing time when the SR form opens; only `期望完成时间` remains selectable.
    - After SR issue, update the group status to `排查中`. Once the SR is returned/completed, the row gets an envelope marker and the modal close flow shows `SR编号` plus `关联工单编号`, read-only deterministic returned `排查结论` such as `现场已完成排查，确认该Pack存在铜排螺栓松动`, the `类型准确` / `类型不准确` confirmation choice, and a final alarm-related failure-mode dropdown. Include `其他` in that dropdown and require a manual failure-mode entry when `其他` is selected.
    - Some failure modes require root-cause completion. After confirm close, set the group status to `关闭-待补充根因`, render a root-cause input area at the bottom of the alarm card, and only change to `关闭-准确` or `关闭-类型不准确` after the root cause is submitted.
    - After `类型准确/类型不准确` and failure mode are selected, reopening `处理` should show a read-only SR result review instead of the selection form. Only `关闭-待补充根因` shows a root-cause input at the bottom of that result modal.
    - For `关闭-站端已处理` alarms, show station-side action and conclusion inside the closure summary, disable the `处理` button, and do not require any additional processing.
- Single-station detail:
  - Apply every change through the shared station detail template so all station pages behave consistently.
  - Clicking any station in 安全评估 / 风险场站 TOP5 should open that station detail page directly on the `安全诊断` horizontal tab.
  - Do not show the breadcrumb line `集团安全中心 / 安全预警 / 场站名称`.
  - Keep the top station title plus communication, risk, and SOS badges. Risk and SOS colors must match the risk palette: red/yellow/green/blue.
  - Remove the top metric strip for rated power, active power, remaining energy, SOC, and current alarms.
  - Use a two-column layout: left side for station charts and SOS detail table, right side for the station-scoped 预警清单.
  - The right-side station alarm list should visually match the 场站总览 alarm panel, list only alarms belonging to the current station, and align its bottom with the bottom of the left-side SOS detail table.
  - Do not show the alarm-location hover overlay in the station-scoped right-side alarm list.
  - The station-scoped right-side alarm list should keep feature parity with 场站总览: level tabs, source counts, quick time windows, manual date range, and filtered alarm cards.
  - Gauges, donut charts, bar charts, trend charts, box plots, and tables should use the same dark technology style and risk color rules as 风险透视 and 预警详情.
  - The station SOS gauge should use the same segmented half-gauge style as 风险透视's 全量场站平均 SOS card, not a solid block arc.
  - The station SOS gauge number should use a fixed light color and sit visually centered inside the half gauge.
  - Trend and bar charts should use the same hover pattern as 风险透视: current point/bar highlight plus tooltip with date/subsystem and SOS value.
  - The subsystem SOS bar chart should use slim bars with spacing larger than bar width.
  - The station trend chart should not show threshold text such as 高风险/中风险 and should not show a y-axis title. X-axis labels always use `MM-DD`; longer ranges may show fewer labels but must keep that format.
  - The subsystem SOS bar chart should have a right-side sort dropdown with 子系统编号-顺序, 子系统编号-倒序, SOS数值-从低到高, and SOS数值-从高到低, plus a risk legend matching 风险透视.
  - Subsystem SOS bar chart x-axis labels use two-digit labels with `#`, such as `#01` and `#02`.
  - 设备部件 SOS 指数分析 must be a box plot. Show upper edge, upper quartile, median, mean, lower quartile, lower edge, and outliers. Hovering the box shows statistical parameters; hovering an outlier shows the specific subsystem.
  - Keep clear spacing between box-plot boxes.
  - SOS 安全指数详情清单 and the subsystem SOS bar chart must read from the same subsystem SOS dataset. Each table row's subsystem id and SOS value must match the corresponding bar in the chart.
  - SOS 安全指数详情清单 defaults to sorting by current SOS ascending. Sortable headers toggle ascending/descending order.
  - SOS 安全指数详情清单 has a sticky translucent header matching the alarm detail table. Only 子系统, 当前 SOS 指数, and 更新日期 are sortable; 风险描述 and 处置建议 are plain text headers. Sort toggles must not cause column width shifts. Do not use placeholder wording such as “超长字段” in risk descriptions.

## Station Data Rules

- Source file: `site_config.xlsx`.
- Required fields: project number, project name, rated capacity, rated energy, total set count.
- Drop any station missing required fields.
- Group multi-row station records by project number and sum total set count.
- Normalize station names by replacing English parentheses `()` with Chinese parentheses `（）`.
- Drop known incomplete entries:
  - `待定`
  - `K-北方片区`
- Station name display format: project number immediately followed by project name, e.g. `K-0005远景乌兰察布电网侧储能`.

## SOS Rules

- `< 60`: 高风险.
- `>= 60 && < 80`: 中风险.
- `>= 80 && < 100`: 低风险.
- `= 100`: 健康.
- Display rule: `100` remains `100`; all other SOS values use two decimal places.
- Homepage target distribution currently keeps 健康 at 21 stations and shifts the remaining population to 中风险/低风险.

## Alarm Data Rules

- Source file: `risk_list_demo.xlsx`.
- Required fields: 预警名称, 模块, 风险等级, 位置格式.
- The global alarm list contains 273 generated alarms:
  - 一级: 35.
  - 二级: 70.
  - 三级: 168.
- Generate the 273 alarms once from the full station set. Do not regenerate alarms after filtering.
- When station filters change, filter the fixed global alarm list by `stationId`.
- Alarm counts in the right panel must reflect the current station filter, alarm level filter, and time filter.
- Warning-management alarm source options are `云端预警`, `站端预警`, and `设备告警`.
- The central-monitoring home right-panel source counts are `云端预警`, `站端预警`, `设备告警`, and overview-only `数据告警`; do not show `站端告警` there.

## Alarm Location Rules

- Location format comes from `risk_list_demo.xlsx`.
- Replace subsystem number dynamically:
  - `#N子系统`, where N is within `1 - station.totalSets`.
- Rack format:
  - Starts with 1 or 2.
  - Last two digits are 01-12.
  - Examples: `Rack101`, `Rack212`.
- Pack range: 1-8.
- Cell range: 1-28.
- Preserve non-battery suffixes such as `LCC01`, `BankA-TCQ01`, `AC101`.

## Interaction Rules

- Station search/dropdown multi-select filters station cards and prewarning list together.
- Risk buttons filter station cards and prewarning list together.
- Risk perspective charts also follow the current station filters.
- The alarm detail page uses the currently scoped alarm set, then applies its own advanced filters.
- Alarm level tabs filter alarm list and source counts together.
- Alarm time controls:
  - Default: 全部.
  - Shortcuts: 最近30天, 最近7天, 最近3天.
  - Manual date range supported.
- Alarm card hover/focus reveals 预警位置.
- Clicking a station card opens the single-station detail page.
- Clicking an alarm card on 场站总览 or 单站详情 opens the same modal alarm detail card used by the 预警详情 page, including handling suggestion and interactive trend chart.
- Alarm detail modals must sit above all page controls, including station filters, dropdowns, and floating selector menus.

## 2026-05-08 Alarm Detail Update Notes

- For closed alarms, the detail modal homepage must directly show the closure summary: `SR编号`, `操作指导`, `排查结论`, `预警准确/不准确`, and `失效类型`. Only alarms still in `关闭-待补充根因` should show a root-cause input; closed alarms that do not need root cause must not show that input when processing is reopened.
- After root cause is submitted, show the submitted root cause in the detail modal homepage closure summary. For alarms that do not need root cause, do not render a read-only `无需补充根因` field in the SR result modal.
- Show submitted root cause as a full-width row in the closure summary.
- When cloud-side and station-side alarms are linked, processing either side must synchronize closure state and fields to the other side, including SR metadata, investigation conclusion, accuracy result, failure mode, pending root-cause state, final root cause, and closed time.
- For `关闭-站端已处理` alarms, do not render separate station action/conclusion boxes. Use the closure summary only: rename `操作指导` to `处理动作`, fill it from station-side investigation action, label accuracy as `预警准确性`, set it to `类型准确`, and fill failure mode from the alarm-related failure mode options.
- When an SR has already been issued and the group is still `排查中`, reopening 处理 should resume the SR flow at the simulated SR return button, not show the initial `关闭预警 / 下发 SR` path choice again.
- Keep the first K-0005 demo warning groups processable; do not seed them as `关闭-站端已处理`.
- The alarm-detail status filter sits immediately after level. Its trigger should stay compact, while its dropdown can be wider than the trigger, like searchable station/location filters. The dropdown must float above the table header without clipping, and the filter bar should wrap instead of showing horizontal scrolling.
- The main alarm table's `等级` header and pills must be horizontally centered in the same column; normal browsing mode should not reserve checkbox placeholder space.
- In the grouped alarm row table inside the modal, keep the three timestamp columns slightly compact so `持续时长` and `状态` remain visible without overlap.

## 2026-05-13 Central Monitoring Compatibility Notes

- Promote the original `安全监测` page out of the `安全预警` submenu and expose it as a first-level sidebar item named `集中监测`, immediately after `全景概览`.
- Keep `安全预警` as the parent for `安全评估`, `预警管理`, and `风险运营`.
- The `集中监测` station card should be an operations-monitoring card, not an SOS card.
- Add a top-left operation state pill on each station card. Supported states are `充电`, `放电`, `待机`, and `停机`.
- Keep the original basic station-card fields: `通讯状态`, `额定能量/容量`, and `子系统数量`.
- Remove the station-card `SOS` line and the `场站类型` field from the central monitoring card.
- Show these station-card metrics: `场站SOC`, `场站有功功率`, and `剩余电量`.
- Do not show the `SOS范围` filter panel on `集中监测`.
- Color each station card's top border and top-right dot by communication status: `通讯中断` red, `部分通讯中断` amber, `通讯正常` green, and `离线` gray.
- Keep station cards sorted by station number ascending and remove the visible sort selector from `集中监测`.
- Replace overview quick-filter chips with three clickable donut filters: SOS index (`高风险`, `中风险`, `低风险`, `健康`), highest station warning level (`一级`, `二级`, `三级`, `无预警`), and communication status (`通讯正常`, `部分通讯中断`, `通讯中断`, `离线`). Clicking either a donut segment or its legend filters the station cards below.
- The three overview donut titles are `SOS`, `站内最高预警/告警等级`, and `通讯状态`.
- Add a sort select next to the station search box. Default sort is `SOS数值-从低到高`; options also include `SOS数值-从高到低`, `场站编号-顺序`, and `场站编号-倒序`.
- Keep the central-monitoring sort dropdown behavior consistent with the station-search dropdown: clicking either text or arrow toggles open/closed, the arrow flips while open, and menu option text has adequate left padding.
- Station cards show an SOS value plus horizontal bar. The card top color is based on SOS risk, while the top-right dot color is based only on communication status.
- The home right panel title is `预警/告警清单`. Its four source statistic boxes are clickable filters for the alarm list below; clicking the active source again clears the source filter.
- The home `预警/告警清单` must use a flexible scroll area so the final item remains fully visible at the bottom of the scroll range and the panel aligns visually with the station-card workbench.
- Use an orange tone for `数据告警` source boxes, source pills, and corner marks so it is clearly distinct from blue `云端预警`.
- Offline station cards should use the offline communication color and hide the charging/discharging/standby/stopped operation tag.
- For central-monitoring demo data, mark about half of stations as `离线` so the offline communication state is easy to validate in filters, donuts, and cards.
- In the right-side alarm panel, source statistic boxes must use border/label colors that match the corresponding source pills below.
- Single-station detail uses horizontal tabs. The first tab is `场站概览`; the second tab is `安全诊断`; add `健康管理` after `安全诊断`.
- `健康管理` is currently a non-navigating fake tab/button.
- Add three top indicator cards to `场站概览`: `安全指数`, `健康指数`, and `当前可用电量`. Use a horizontal composition for all three cards: graphic on the left and label/value on the right. The safety index graphic is an SOS gauge, health uses a shield icon, and available energy uses a battery icon; keep graphic size, label position, and value hierarchy consistent.
- Do not show extra titles inside the three top indicator cards. Keep right-side label/value groups centered and compact, with restrained numeric size and a readable `SOS` label inside the gauge.
- `场站概览` keeps the station-scoped warning panel on the right and uses the left side for `场站运行`, `场站属性`, `储能系统`, `拓扑图`, `场站有功功率`, and `场站充放电表现`.
- The station-scoped right panel title is also `预警/告警清单`; its source summary includes `云端预警`, `站端预警`, `设备告警`, and `数据告警`, and each source box filters the station alarm list.
- `场站运行` should use a semicircle gauge for station SOC and show running state plus real-time output.
- Replace the former `储能系统` top card with `充放电统计`. Provide clickable `当日 / 当月 / 当年` time-window buttons at the top right, default to `当日`; switching buttons updates the active state and charge/discharge energy values. Use two circular water-wave visuals for charge energy and discharge energy.
- The storage subsystem selector should only show the dropdown; do not display an extra `子系统` text label next to it.
- Keep the three top overview cards (`场站运行`, `场站属性`, `储能系统`) balanced: gauges/water-wave visuals should be smaller than the text columns and must not crowd labels, values, or titles.
- Implement the station SOC gauge and storage SOC water tank as stable proportional graphics, with arc/water level, pointer, values, and labels sharing one coordinate system so they cannot drift when the card resizes.
- Keep the station SOC numeric value outside the dark gauge arc, in a bottom readout row, so white text stays legible. Arrange running state and real-time output as two stacked KPI blocks.
- Keep the station running gauge and KPI text as a centered, slightly right-shifted fixed-width group, and keep 0%/100% scale labels clear of the gauge arc.
- Give the `场站属性` metric block visible top spacing from the title.
- Use compact numeric size and row spacing in `场站属性`, while preserving bottom breathing room.
- `场站属性` should show `场站类型`, `系统数量`, `额定容量`, and `额定功率`; do not show remaining energy in this card.
- `储能系统` must show numeric values for daily charge and daily discharge; do not use `--` placeholders.
- Center the storage SOC visual plus daily charge/discharge metric group inside the card instead of leaving the content pinned left.
- Keep topology subsystem card typography compact so active power, SOC, and SOH values do not dominate or distort the card proportion.
- Topology nodes for grid, step-up station, and wind power should use equipment-style icons rather than plain text blocks.
- In `场站概览`, keep the previous compact subsystem-card grid topology instead of the grid/step-up/wind icon scene or a busbar topology. Hovering a subsystem card should show its warning/alarm summary.
- Show topology wire bundles behind the subsystem-card grid: a left-top trunk/bus line connects to every subsystem card, and the bundle should be redrawn from actual card positions when subsystem count or wrapping changes.
- For multi-row subsystem grids, keep bundle lines visible in the row gaps and avoid card occlusion. The top-left bundle convergence should derive from actual row count, with each row bus connected to the top horizontal bar.
- The topology grid should fit six subsystem cards per row by default, and the top-left bus convergence must avoid crossed wires.
- If a station has only one subsystem row and fewer than six subsystem cards, center the whole subsystem-card group.
- Color subsystem cards by the highest warning/alarm level inside that subsystem: level 1 red, level 2 yellow, level 3 green, and no warning/alarm gray. Match the hover popover color to the same level.
- Subsystem-card hover content should be a structured top-layer popover: show the total warning/alarm count first, then list warning/alarm names below, and ensure the popover is not clipped by surrounding panels.
- When a station has only a few subsystems, let the topology panel shrink to its content so it does not leave a large empty lower area.
- Topology icons should use a unified gray-tone refined device-line drawing style on a consistent isometric base. Grid towers, step-up station, and wind support must be visually distinct; grid tower lines should stay visually clean, wind blades should be spaced 120 degrees apart, the wind support pole should stand perpendicular to the base, and each node base center should align with its connection line.
- Keep the `风电配套` topology label clear of the dotted branch line.
- Store topology icons as separate project SVG assets under `assets/topology-icons/` and reference them from the topology nodes instead of building complex device graphics from CSS pseudo-elements.
- Do not show a `更多` action on topology subsystem cards.
- `场站有功功率` and `场站充放电表现` should include a top-right time range control, visible X-axis time labels, legends, and hover tooltips showing the concrete values for each point/bar on the hovered date.
- Move the former single-station SOS diagnosis content into `安全诊断` and remove its right-side warning panel.
- In `安全诊断`, keep the subsystem risk distribution donut at a medium size so it does not dominate the card or squeeze the legend.
- The `安全诊断` subsystem risk distribution donut must render as a true circle; avoid non-uniform CSS scaling that turns the chart into an ellipse.
- In `安全预警 / 安全评估`, keep the `场站风险等级占比` donut at a readable medium size, true-circle aspect ratio, and fully visible without clipped edges.
- Size the `场站风险等级占比` donut close to the reference card proportion: larger than the minimum fix, but still fully visible.
- Compute remaining energy as `ratedEnergy(MWh) * SOC / 100 * 1000`, display in `kWh`, and keep two decimal places.
- Keep card typography compact and numeric values right-aligned with tabular numerals so cards remain stable in dense grids.
- The topology subsystem-card count must match the station system/subsystem count rather than a fixed default count.
- In the `场站概览` topology area, keep the previous subsystem-card grid layout with subsystem name, status, active power, SOC, SOH, and compact bar indicators.
- Overview chart time filters must use native calendar date inputs for start and end dates.
- The station running SOC gauge should include 0%/100% labels, a pointer, and a percent unit, matching the compact semicircle gauge reference.
- The storage system SOC visual should use a circular water-tank/wave treatment.
- Do not show a `显示场站结构` checkbox in the topology panel.
- Overview chart date controls should reuse the risk-warning-list date-range bar styling and update the chart window after date selection.
- When either overview chart date changes, move the other date by the existing window length and never allow start date to be later than end date.
- On the central monitoring home page, keep the communication quick filters and clear-filter action on one right-aligned row with their bottoms aligned.
- On central monitoring station cards, show SOS plus a health-score progress bar, remove active-power and remaining-energy rows, and show `SOP/SOE` as approximately 90% of rated power/energy in the form `20MW/43MWh`.
- In station overview topology cards, derive subsystem operation state from the station state so one station never mixes charging and discharging; most subsystems should share the station state with only a small minority in standby or stopped state.
- In station overview topology cards, bind the mini progress bars to `SOH` rather than `SOC`, so the bar fill visually matches the SOH value.
- Label the station-card health row as `健康度`, align its label/value/bar columns with the SOS row, and use a distinct non-risk purple tone for the health bar.
- Label the station-card SOP/SOE row as `场站SOP/SOE`.
- For offline station details, show every topology subsystem status as `离线` in the top-left of the card; for non-offline stations, color top-left subsystem status pills for charging, discharging, standby, and stopped states consistently with the home-card operation tags.
- Topology subsystem mini bars should follow `系统SOC`, not SOH, unless explicitly changed again.
- On the central monitoring home page, keep the station-card scroll region and the right `预警/告警清单` panel in one shared workbench height so their bottom edges align; scrolling should happen inside each region.
- Central-monitoring station cards must fully show every metric row without clipping. Use fixed label/value columns in the card metric area, right-align values, and keep `额定能量/容量` plus `场站SOP/SOE` on one line.
- In single-station `场站概览`, keep the left-side panel heights independent from the right `预警/告警清单`; the right panel should use the same fixed-height, internal-list-scroll behavior as the central-monitoring home right panel, including bottom padding so the last item is fully visible.
- In single-station `场站概览`, align the right alarm panel bottom with the left content bottom while keeping the right alarm list internally scrollable.
- After filtering central-monitoring station cards down to one or a few items, keep each card at its normal fixed width/height and prevent CSS grid row stretching.
- For K-0005 and other stations with many right-panel alarms, cap the detail alarm panel to the viewport height and scroll only the alarm list; keep the left overview grid rows sized by content so panels do not stretch.
- For single-station `场站概览`, synchronize the right alarm panel height from the left overview panel's natural rendered height. The left panels must keep content-sized rows; only the right alarm list scrolls when its content exceeds the synchronized panel height.

- On the central-monitoring home page, keep the three overview donut filter cards visually centered in each card. The donut plus legend should use a compact fixed-width group so the legend label and number do not spread apart on wide external displays or at 67% browser zoom.
- The communication-status donut legend must show full labels, including the longest `部分通讯中断` label, without ellipsis. Keep legend numbers in a fixed right-aligned column so the counts line up vertically.
- In the single-station `安全诊断` tab, the `各子系统 SOS 安全指数` X-axis labels must adapt to subsystem count and available slot width. When the number of bars is small, show every subsystem label instead of applying fixed thinning such as every fifth label.
- When `各子系统 SOS 安全指数` contains many subsystem bars, render the chart on a wider canvas inside a horizontal scroll viewport instead of compressing all bars into the visible panel. Keep bar spacing readable, avoid clipped X-axis labels, and sort subsystem IDs numerically so `#90` appears before `#104` in ascending order.
- In the alarm-management main mixed list and filter bar, table headers and filter labels that include `预警` must use `预警/告警`, such as `预警/告警名称`, `预警/告警时间`, and `全部预警/告警名称`. In the detail modal, labels must follow the selected alarm source: use `预警` for `云端预警` and `站端预警`, and use `告警` for `设备告警` or other `*告警` sources.
- On central-monitoring home station cards, derive the visible state tag with priority `故障 > 告警 > 充电/放电/待机/停机`; hide the tag only for offline stations without warning/fault state. Fault cards use a red gradient background, warning cards use a yellow gradient background, and the top-right dot still follows communication status.
- Central-monitoring overview filters include four donut cards: `SOS`, `场站预警分布`, `场站告警分布`, and `通讯状态`. `场站告警分布` has `故障` and `告警` slices and sits immediately to the left of `通讯状态`.
- Provide a station-card collapse mode from the home toolbar. The collapse button sits before `清空筛选`; collapsed cards keep only operation/alarm state, communication status, SOS, and `场站SOP/SOE`.
- The right-side `预警/告警清单` on both central-monitoring home and station overview excludes `站端预警`. Its source summary is a three-box row: `告警`, `故障`, and `数据`. Display cloud warnings as `告警`, device alarms as either `告警` or `故障`, and data alarms as `数据`.
- In the right-side alarm panel, only expose `一级`, `二级`, and `数据` quick filters besides `全部`; data alarms are filtered as a separate ungraded category.
- Keep `场站告警分布` vertically aligned with the other top donut cards by using the same donut-content height even though it has only two legend entries.
- Warning/fault gradient backgrounds on station cards must not override the SOS-derived border color. The border remains risk/SOS based; only the interior background and inner glow reflect warning/fault state.
- In collapsed station-card mode, show only the state tag, communication dot, SOS row, and `场站SOP/SOE`; do not show the `通讯状态` text row.
- The right-side panel categories are `预警 / 告警 / 数据`: `预警` maps to cloud warnings and keeps level semantics (only 一级/二级 quick tabs are shown in the side panel), `告警` maps to device alarms and list pills distinguish `告警` versus `故障`, and `数据` maps to data alarms without levels.
- The `场站告警分布` donut must include `故障 / 告警 / 无告警`, and its center total must equal the full station count, currently 158.
- Collapsed station cards should be compact, with no unnecessary vertical blank space beyond the state tag, communication dot, SOS row, and `场站SOP/SOE`.
- In the right-side `预警/告警清单`, all three large source boxes filter the list. Use a purple tone for the `告警` box. Remove the separate top-level 一级/二级 quick filter row; put `一级/二级` subfilter buttons inside the `预警` box and `故障/告警` subfilter buttons inside the `告警` box.
- Keep subfilter buttons on the right side of their large source box, stacked vertically, with distinct colors for 一级, 二级, 故障, and 告警 so labels never overflow the box.
- In side-panel list items, device alarms show `告警` in the top-right source pill and use the top-left pill to distinguish `故障` versus `告警`; data items show no top-left tag and use `数据` in the top-right pill.

## Deliverables To Maintain

- Static HTML/CSS/JS implementation.
- `deliverables/PRD_safety_warning_system.md`.
- This reusable skill document.
- Keep all three synchronized whenever behavior, data rules, or UI conventions change.
