<a name="wbb"></a>

## wbb : <code>object</code>
Operations for WBB.

**Kind**: global namespace  

* [wbb](#wbb) : <code>object</code>
    * [.getPlayByPlay(id)](#wbb.getPlayByPlay) ⇒
    * [.getBoxScore(id)](#wbb.getBoxScore) ⇒
    * [.getSummary(id)](#wbb.getSummary) ⇒
    * [.getRankings(year, week)](#wbb.getRankings) ⇒
    * [.getSchedule(year, month, day, group, seasontype, limit)](#wbb.getSchedule) ⇒
    * [.getScoreboard(year, month, day, group, seasontype, limit)](#wbb.getScoreboard) ⇒
    * [.getConferences(year, group)](#wbb.getConferences) ⇒
    * [.getStandings(year, group)](#wbb.getStandings) ⇒
    * [.getTeamList(group)](#wbb.getTeamList) ⇒
    * [.getTeamInfo(id)](#wbb.getTeamInfo) ⇒
    * [.getTeamPlayers(id)](#wbb.getTeamPlayers) ⇒

<a name="wbb.getPlayByPlay"></a>

### wbb.getPlayByPlay(id) ⇒
Gets the Women's College Basketball game play-by-play data for a specified game.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Game id. |

**Example**  
```js
const result = await sdv.wbb.getPlayByPlay(401260565);
```
<a name="wbb.getBoxScore"></a>

### wbb.getBoxScore(id) ⇒
Gets the Women's College Basketball game box score data for a specified game.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Game id. |

**Example**  
```js
const result = await sdv.wbb.getBoxScore(401260565);
```
<a name="wbb.getSummary"></a>

### wbb.getSummary(id) ⇒
Gets the Women's College Basketball game summary data for a specified game.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Game id. |

**Example**  
```js
const result = await sdv.wbb.getSummary(401260565);
```
<a name="wbb.getRankings"></a>

### wbb.getRankings(year, week) ⇒
Gets the WBB rankings data for a specified year and week if available.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>\*</code> | Year (YYYY) |
| week | <code>\*</code> | Week |

**Example**  
```js
const result = await sdv.wbb.getRankings(
```
<a name="wbb.getSchedule"></a>

### wbb.getSchedule(year, month, day, group, seasontype, limit) ⇒
Gets the Women's College Basketball schedule data for a specified date if available.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>\*</code> | Year (YYYY) |
| month | <code>\*</code> | Month (MM) |
| day | <code>\*</code> | Day (DD) |
| group | <code>number</code> | Group is 50 for Division-I, 51 for Division-II, 52 for Division-III |
| seasontype | <code>number</code> | Pre-Season: 1, Regular Season: 2, Postseason: 3, Off-season: 4 |
| limit | <code>number</code> | Limit on the number of results @default 300 |

**Example**  
```js
const result = await sdv.wbb.getSchedule(
```
<a name="wbb.getScoreboard"></a>

### wbb.getScoreboard(year, month, day, group, seasontype, limit) ⇒
Gets the Women's College Basketball scoreboard data for a specified date if available.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>\*</code> | Year (YYYY) |
| month | <code>\*</code> | Month (MM) |
| day | <code>\*</code> | Day (DD) |
| group | <code>number</code> | Group is 50 for Division-I, 51 for Division-II, 52 for Division-III |
| seasontype | <code>number</code> | Pre-Season: 1, Regular Season: 2, Postseason: 3, Off-season: 4 |
| limit | <code>number</code> | Limit on the number of results @default 300 |

**Example**  
```js
const result = await sdv.wbb.getScoreboard(
```
<a name="wbb.getConferences"></a>

### wbb.getConferences(year, group) ⇒
Gets the list of all Women's College Basketball conferences and their identification info for ESPN.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Season |
| group | <code>number</code> | Group is 50 for Division-I, 51 for Division-II, 52 for Division-III |

**Example**  
```js
const yr = 2021;
```
<a name="wbb.getStandings"></a>

### wbb.getStandings(year, group) ⇒
Gets the team standings for Women's College Basketball.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Season |
| group | <code>number</code> | Group is 50 for Division-I, 51 for Division-II, 52 for Division-III, see wbb.getConferences() for more info |

**Example**  
```js
const yr = 2020;
```
<a name="wbb.getTeamList"></a>

### wbb.getTeamList(group) ⇒
Gets the list of all Women's College Basketball teams their identification info for ESPN.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| group | <code>number</code> | Group is 50 for Division I, 51 for Division II, 52 for Division III |

**Example**  
```js
get list of teams
```
<a name="wbb.getTeamInfo"></a>

### wbb.getTeamInfo(id) ⇒
Gets the team info for a specific WBB team.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Team Id |

**Example**  
```js
const teamId = 52;
```
<a name="wbb.getTeamPlayers"></a>

### wbb.getTeamPlayers(id) ⇒
Gets the team roster information for a specific WBB team.

**Kind**: static method of [<code>wbb</code>](#wbb)  
**Returns**: json  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Team Id |

**Example**  
```js
const teamId = 52;
```