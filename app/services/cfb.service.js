import axios from 'axios';
import cheerio from 'cheerio';
/**
 * Operations for College Football.
 *
 * @namespace cfb
 */
export default {
    /**
     * Gets the College Football game play-by-play data for a specified game.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} id - Game id.
     * @returns json
     * @example
     * const result = await sdv.cfb.getPlayByPlay(401256194);
     */
    getPlayByPlay: async function (id) {
        const baseUrl = 'http://cdn.espn.com/core/college-football/playbyplay';
        const params = {
            gameId: id,
            xhr: 1,
            render: 'false',
            userab: 18
        };

        const res = await axios.get(baseUrl, {
            params
        });

        return {
            teams: res.data.gamepackageJSON.header.competitions[0].competitors,
            id: res.data.gameId,
            drives: res.data.gamepackageJSON.drives,
            competitions: res.data.gamepackageJSON.header.competitions,
            season: res.data.gamepackageJSON.header.season,
            week: res.data.gamepackageJSON.header.week,
            boxScore: res.data.gamepackageJSON.boxscore,
            scoringPlays: res.data.gamepackageJSON.scoringPlays,
            standings: res.data.gamepackageJSON.standings
        };
    },
    /**
     * Gets the College Football game box score data for a specified game.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} id - Game id.
     * @returns json
     * @example
     * const result = await sdv.cfb.getBoxScore(401256194);
     */
    getBoxScore: async function (id) {
        const baseUrl = 'http://cdn.espn.com/core/college-football/boxscore';
        const params = {
            gameId: id,
            xhr: 1,
            render: false,
            device: 'desktop',
            userab: 18
        };

        const res = await axios.get(baseUrl, {
            params
        });

        const game = res.data.gamepackageJSON.boxscore;
        game.id = res.data.gameId;

        return game;
    },
    /**
     * Gets the College Football game summary data for a specified game.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} id - Game id.
     * @returns json
     * @example
     * const result = await sdv.cfb.getSummary(401256194);
     */
    getSummary: async function (id) {
        const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/summary';
        const params = {
            event: id
        };

        const res = await axios.get(baseUrl, {
            params
        });

        return {
            id: parseInt(res.data.header.id),
            boxScore: res.data.boxscore,
            gameInfo: res.data.gameInfo,
            drives: res.data.drives,
            leaders: res.data.leaders,
            header: res.data.header,
            teams: res.data.header.competitions[0].competitors,
            scoringPlays: res.data.scoringPlays,
            winProbability: res.data.winprobability,
            leaders: res.data.leaders,
            competitions: res.data.header.competitions,
            season: res.data.header.season,
            week: res.data.header.week,
            standings: res.data.standings
        };
    },
    /**
     * Gets the College Football PickCenter data for a specified game.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} id - Game id.
     * @returns json
     * @example
     * const result = await sdv.cfb.getPicks(401256194);
     */
    getPicks: async function (id) {
        const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/summary';
        const params = {
            event: id
        };

        const res = await axios.get(baseUrl, {
            params
        });

        return {
            id: parseInt(res.data.header.id),
            gameInfo: res.data.gameInfo,
            leaders: res.data.leaders,
            header: res.data.header,
            teams: res.data.header.competitions[0].competitors,
            competitions: res.data.header.competitions,
            winProbability: res.data.winprobability,
            pickcenter: res.data.winprobability,
            againstTheSpread: res.data.againstTheSpread,
            odds: res.data.odds,
            season: res.data.header.season,
            week: res.data.header.week,
            standings: res.data.standings
        };
    },

    /**
     * Gets the College Football Player recruiting data for a specified year, page, position, state and institution type if available.
     * @memberOf cfb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {number} page - Page (50 per page)
     * @param {"HighSchool"|"JuniorCollege"|"PrepSchool"} group - Institution Type
     * @param {"Composite"|"247"} rankingsType - Ranking Type
     * @param {string} state - State of recruit
     * @returns json
     * @example
     * const result = await sdv.cfb.getPlayerRankings({year: 2016});
     */
    getPlayerRankings: async function ({
        year,
        page = 1,
        group = "HighSchool",
        position = null,
        state = null,
        rankingsType = "Composite"
    }) {
       const params = {
            InstitutionGroup: group,
            Page: page,
            Position: position,
            State: state
        };

        let baseUrl;
        if (rankingsType === 'Composite') {
            baseUrl = `http://247sports.com/Season/${year}-Football/CompositeRecruitRankings`;
        } else if (rankingsType === '247') {
            baseUrl = `http://247sports.com/Season/${year}-Football/recruitrankings`;
        } else {
            throw new Error("Invalid rankings type");
        }
        
        const res = await axios.get(baseUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
            },
            params
        });

        
        let $ = cheerio.load(res.data);

        let players = [];

        // Couldn't grab the rank correctly with JQuery so it's manually calculated
        let rank = 1 + 50 * (page - 1);

        $('ul.rankings-page__list > li.rankings-page__list-item:not(.rankings-page__list-item--header)').each(function (index) {
            let html = $(this);

            let metrics = html.find('.metrics').text().split('/');

            let player = {
                ranking: rank,
                name: html.find('.rankings-page__name-link').text().trim(),
                highSchool: html.find('span.meta').text().trim(),
                position: html.find('.position').text().trim(),
                height: metrics[0],
                weight: metrics[1],
                stars: html.find('.rankings-page__star-and-score > .yellow').length,
                rating: html.find('.score').text().trim().trim(),
                college: html.find('.img-link > img').attr('title') || 'uncommitted'
            };

            players.push(player);
            rank++;
        });

        return players;
    },
    /**
     * Gets the College Football School recruiting data for a specified year and page if available.
     * @memberOf cfb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {number} page - Page (50 per page)
     * @returns json
     * @example
     * const result = await sdv.cfb.getSchoolRankings({year: 2016});
     */
    getSchoolRankings: async function (year, page = 1) {
        const baseUrl = `http://247sports.com/Season/${year}-Football/CompositeTeamRankings`;

        const res = await axios.get(baseUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
            },
            params: {
                Page: page
            }
        });

        let $ = cheerio.load(res.data);
        let schools = [];

        $('.rankings-page__list-item').each(function (index) {
            let html = $(this);

            let school = {
                rank: html.find('.rank-column .primary').text().trim(),
                school: html.find('.rankings-page__name-link').text().trim(),
                totalCommits: html.find('.total a').text().trim(),
                fiveStars: $(html.find('ul.star-commits-list > li > div')[0]).text().replace('5: ', '').trim(),
                fourStars: $(html.find('ul.star-commits-list > li > div')[1]).text().replace('4: ', '').trim(),
                threeStars: $(html.find('ul.star-commits-list > li > div')[2]).text().replace('3: ', '').trim(),
                averageRating: html.find('.avg').text().trim(),
                points: html.find('.number').text().trim()
            };

            schools.push(school);
        });

        return schools;
    },
    /**
     * Gets the College Football School commitment data for a specified school and year.
     * @memberOf cfb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {string} school - School
     * @returns json
     * @example
     * const result = await sdv.cfb.getSchoolCommits({school: 'Florida State', year: 2021});
     */
    getSchoolCommits: async function (school, year) {
        const baseUrl = `http://${school}.247sports.com/Season/${year}-Football/Commits`;

        const res = await axios.get(baseUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
            }
        });

        let $ = cheerio.load(res.data);

        let players = [];

        $('.ri-page__list-item').each(function (index) {
            let html = $(this);

            let metrics = html.find('.metrics').text().split('/');

            let player = {
                name: html.find('.ri-page__name-link').text().trim(),
                highSchool: html.find('span.meta').text().trim(),
                position: $(html.find('.position')).text().trim(),
                height: metrics[0],
                weight: metrics[1],
                stars: html.find('.ri-page__star-and-score .yellow').length,
                rating: html.find('span.score').clone().children().remove().end().text().trim(),
                nationalRank: html.find('.natrank').first().text().trim(),
                stateRank: html.find('.sttrank').first().text().trim(),
                positionRank: html.find('.posrank').first().text().trim()
            };

            players.push(player);
        });

        // Some empty player objects were being created.  This removes them
        const result = players.filter(
            player => player.name !== '' && player.rating !== ''
        );

        return result;
    },
    /**
     * Gets the CFB rankings data for a specified year and week if available.
     * @memberOf cfb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {*} week - Week
     * @returns json
     * @example
     * const result = await sdv.cfb.getRankings(year = 2020, week = 4)
     */
    getRankings: async function ({ year, week }) {
        const baseUrl = 'http://cdn.espn.com/core/college-football/rankings';
        const params = {};

        if (year) {
            params.year = year;
        }

        if (week) {
            params.week = week;
        }

        const res = await axios.get(baseUrl, {
            params
        });
        return res.data;
    },
    /**
     * Gets the College Football schedule data for a specified date if available.
     * @memberOf cfb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {*} month - Month (MM)
     * @param {*} day - Day (DD)
     * @param {number} group - Group is 80 for FBS, 81 for FCS
     * @param {number} seasontype - Pre-Season: 1, Regular Season: 2, Postseason: 3, Off-season: 4
     * @returns json
     * @example
     * const result = await sdv.cfb.getSchedule(year = 2019, month = 11, day = 16, group=80)
     */
    getSchedule: async function ({ year, month, day, groups = 80, seasontype = 2 }) {
        const baseUrl = `http://cdn.espn.com/core/college-football/schedule`;
        const params = {
            groups: groups,
            seasontype: seasontype,
            xhr: 1,
            render: false,
            device: 'desktop',
            userab: 18
        };
        if (year && month && day) {
            params.dates = `${year}${parseInt(month) <= 9 ? "0" + parseInt(month) : parseInt(month)}${parseInt(day) <= 9 ? "0" + parseInt(day) : parseInt(day)}`;
        }

        const res = await axios.get(baseUrl, {
            params
        });
        return res.data.content.schedule;
    },
    /**
     * Gets the College Football scoreboard data for a specified date if available.
     * @memberOf cfb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {*} month - Month (MM)
     * @param {*} day - Day (DD)
     * @param {number} group - Group is 80 for FBS, 81 for FCS
     * @param {number} seasontype - Pre-Season: 1, Regular Season: 2, Postseason: 3, Off-season: 4
     * @param {number} limit - Limit on the number of results @default 300
     * @returns json
     * @example
     * const result = await sdv.cfb.getScoreboard(
     * year = 2019, month = 11, day = 16, group=80
     * )
     */
    getScoreboard: async function ({ year, month, day, groups = 80, seasontype = 2, limit = 300 }) {

        const baseUrl = `http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard`;
        const params = {
            groups: groups,
            seasontype,
            limit
        };
        if (year && month && day) {
            params.dates = `${year}${parseInt(month) <= 9 ? "0" + parseInt(month) : parseInt(month)}${parseInt(day) <= 9 ? "0" + parseInt(day) : parseInt(day)}`;
        }

        const res = await axios.get(baseUrl, {
            params
        });

        return res.data;
    },
    /**
     * Gets the list of all College Football conferences and their identification info for ESPN.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} year - Season
     * @param {number} group - Group is 80 for FBS, 81 for FCS
     * @returns json
     * @example
     * const yr = 2021;
     * const result = await sdv.cfb.getConferences(year = yr, group = 80);
     */
    getConferences: async function ({ year = new Date().getFullYear(), group = 80 }) {
        const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard/conferences';

        const params = {
            season: year,
            group: group
        };
        const res = await axios.get(baseUrl, {
            params
        });
        return res.data;
    },
    /**
     * Gets the team standings for College Football.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} year - Season
     * @param {number} group - Group is 80 for FBS, 81 for FCS
     * @returns json
     * @example
     * const yr = 2020;
     * const result = await sdv.cfb.getStandings(year = yr);
     */
    getStandings: async function ({ year = new Date().getFullYear(), group = 80 }) {
        const baseUrl = `https://site.web.api.espn.com/apis/v2/sports/football/college-football/standings`;
        const params = {
            region: 'us',
            lang: 'en',
            contentorigin: 'espn',
            season: year,
            group: group,
            type: 0,
            level: 1,
            sort: 'winpercent:desc,leaguewinpercent:desc,vsconf_winpercent:desc,' +
                'vsconf_gamesbehind:asc,vsconf_playoffseed:asc,wins:desc,' +
                'losses:desc,playoffseed:asc,alpha:asc'
        };
        const res = await axios.get(baseUrl, {
            params
        });
        return res.data;
    },
    /**
     * Gets the list of all College Football teams their identification info for ESPN.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} group - Group is 80 for FBS, 81 for FCS
     * @returns json
     * @example
     * const result = await sdv.cfb.getTeamList(group=80);
     */
    getTeamList: async function ({ group = 80 }) {
        const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams';
        const params = {
            group,
            limit: 1000
        };

        const res = await axios.get(baseUrl, {
            params
        });

        return res.data;
    },
    /**
     * Gets the team info for a specific College Football team.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} id - Team Id
     * @returns json
     * @example
     * const teamId = 52;
     * const result = await sdv.cfb.getTeamInfo(teamId);
     */
    getTeamInfo: async function (id) {
        const baseUrl = `http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${id}`;

        const res = await axios.get(baseUrl);
        return res.data;
    },
    /**
     * Gets the team roster information for a specific College Football team.
     * @memberOf cfb
     * @async
     * @function
     * @param {number} id - Team Id
     * @example
     * const teamId = 52;
     * const result = await sdv.cfb.getTeamPlayers(teamId);
     */
    getTeamPlayers: async function (id) {
        const baseUrl = `http://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${id}`;
        const params = {
            enable: "roster"
        };

        const res = await axios.get(baseUrl, {
            params
        });

        return res.data;
    }
}


