const axios = require('axios');
const cheerio = require('cheerio');
/**
 * Operations for Men's College Basketball.
 *
 * @namespace mbb
 */
module.exports = {
    /**
     * Gets the Men's College Basketball game play-by-play data for a specified game.
     * @memberOf mbb
     * @async
     * @function
     * @param {number} id - Game id.
     * @returns json
     * @example
     * const result = await sdv.mbb.getPlayByPlay(401260281);
     */
    getPlayByPlay: async function (id) {
        const baseUrl = 'http://cdn.espn.com/core/mens-college-basketball/playbyplay';
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
            id: res.data.gamepackageJSON.header.id,
            plays: res.data.gamepackageJSON.plays,
            competitions: res.data.gamepackageJSON.header.competitions,
            season: res.data.gamepackageJSON.header.season,
            boxScore: res.data.gamepackageJSON.boxscore
        };
    },
    /**
     * Gets the Men's College Basketball game box score data for a specified game.
     * @memberOf mbb
     * @async
     * @function
     * @param {number} id - Game id.
     * @returns json
     * @example
     * const result = await sdv.mbb.getBoxScore(401260281);
     */
    getBoxScore: async function (id) {
        const baseUrl = 'http://cdn.espn.com/core/mens-college-basketball/boxscore';
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
     * Gets the Men's College Basketball game summary data for a specified game.
     * @memberOf mbb
     * @async
     * @function
     * @param {number} id - Game id.
     * @returns json
     * @example
     * const result = await sdv.mbb.getSummary(401260281);
     */
    getSummary: async function (id) {
        const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/summary';
        const params = {
            event: id
        };

        const res = await axios.get(baseUrl, {
            params
        });

        return {
            boxScore: res.data.boxscore,
            gameInfo: res.data.gameInfo,
            leaders: res.data.leaders,
            winProbability: res.data.winprobability,
            header: res.data.header,
            plays: res.data.plays,
            standings: res.data.standings
        };
    },
    /**
     * Gets the Men's College Basketball game PickCenter data for a specified game.
     * @memberOf mbb
     * @async
     * @function
     * @param {number} id - Game id.
     * @returns json
     * @example
     * const result = await sdv.mbb.getPicks(401260281);
     */
    getPicks: async function (id) {
        const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/summary';
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
            standings: res.data.standings
        };
    },

    /**
     * Gets the Men's College Basketball rankings data for a specified year and week if available.
     * @memberOf mbb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {*} week - Week
     * @returns json
     * @example
     * const result = await sdv.mbb.getRankings(
     * year = 2020, week = 15
     * )
     */
    getRankings: async function ({ year, week }) {
        const baseUrl = 'http://cdn.espn.com/core/mens-college-basketball/rankings';
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
     * Gets the Men's College Basketball Player recruiting data for a specified year, page, position and institution type if available.
     * @memberOf mbb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {number} page - Page (50 per page)
     * @param {"HighSchool"|"JuniorCollege"|"PrepSchool"} group - Institution Type
     * @returns json
     * @example
     * const result = await sdv.mbb.getPlayerRankings({year: 2016});
     */
    getPlayerRankings: async function ({
        year,
        page = 1,
        group = "HighSchool",
        position = null,
        state = null
    }) {
        const baseUrl = `http://247sports.com/Season/${year}-Basketball/CompositeRecruitRankings`;
        const params = {
            InstitutionGroup: group,
            Page: page,
            Position: position,
            State: state
        };
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
     * Gets the Men's College Basketball School recruiting data for a specified year, page, position and institution type if available.
     * @memberOf mbb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {number} page - Page (50 per page)
     * @returns json
     * @example
     * const result = await sdv.mbb.getSchoolRankings({year: 2016});
     */
    getSchoolRankings: async function (year, page = 1) {
        const baseUrl = `http://247sports.com/Season/${year}-Basketball/CompositeTeamRankings`;
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
     * Gets the Men's College Basketball School commitment data for a specified school and year.
     * @memberOf mbb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {string} school - School
     * @returns json
     * @example
     * const result = await sdv.mbb.getSchoolCommits({school: 'Clemson', year: 2016});
     */
    getSchoolCommits: async function (school, year) {
        const baseUrl = `http://${school}.247sports.com/Season/${year}-Basketball/Commits`;
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
     * Gets the Men's College Basketball schedule data for a specified date if available.
     * @memberOf mbb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {*} month - Month (MM)
     * @param {*} day - Day (DD)
     * @param {number} group - Group is 50 for Division-I, 51 for Division-II, 52 for Division-III
     * @param {number} seasontype - Pre-Season: 1, Regular Season: 2, Postseason: 3, Off-season: 4
     * @returns json
     * @example
     * const result = await sdv.mbb.getSchedule(
     * year = 2021, month = 02, day = 15, group=50
     * )
     */
    getSchedule: async function ({
        year = null,
        month = null,
        day = null,
        group = 50,
        seasontype = 2
    }) {
        const baseUrl = `http://cdn.espn.com/core/mens-college-basketball/schedule?dates=${year}${parseInt(month) <= 9 ? "0" + parseInt(month) : parseInt(month)}${parseInt(day) <= 9 ? "0" + parseInt(day) : parseInt(day)}`;
        const params = {
            groups: group,
            seasontype: seasontype,
            xhr: 1
        };

        const res = await axios.get(baseUrl, {
            params
        });
        return res.data.content.schedule;
    },
    /**
     * Gets the Men's College Basketball scoreboard data for a specified date if available.
     * @memberOf mbb
     * @async
     * @function
     * @param {*} year - Year (YYYY)
     * @param {*} month - Month (MM)
     * @param {*} day - Day (DD)
     * @param {number} group - Group is 50 for Division-I, 51 for Division-II, 52 for Division-III
     * @param {number} seasontype - Pre-Season: 1, Regular Season: 2, Postseason: 3, Off-season: 4
     * @param {number} limit - Limit on the number of results @default 300
     * @returns json
     * @example
     * const result = await sdv.mbb.getScoreboard(
     * year = 2021, month = 02, day = 15, group=50
     * )
     */
    getScoreboard: async function ({
        year,
        month,
        day,
        group = 50,
        seasontype = 2,
        limit = 1000 }) {
        const baseUrl = `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard`;
        const params = {
            groups: group,
            seasontype: seasontype || 2,
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
     * Gets the Men's College Basketball Conferences.
     * @memberOf mbb
     * @async
     * @function
     * @param {number} year - Season
     * @param {number} group - Group is 50 for Division-I, 51 for Division-II, 52 for Division-III
     * @returns json
     * @example
     * const yr = 2021;
     * const result = await sdv.mbb.getConferences(year = yr, group = 50);
     */
    getConferences: async function ({ year = new Date().getFullYear(), group = 50 }) {
        const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard/conferences';

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
     * Gets the team standings for Men's College Basketball.
     * @memberOf mbb
     * @async
     * @function
     * @param {number} year - Season
     * @param {number} group - Group is 50 for Division-I, 51 for Division-II, 52 for Division-III, see wbb.getConferences() for more info
     * @returns json
     * @example
     * const yr = 2020;
     * const result = await sdv.mbb.getStandings(year = yr);
     */
    getStandings: async function ({ year = new Date().getFullYear(), group = 50 }) {
        const baseUrl = `https://site.web.api.espn.com/apis/v2/sports/basketball/mens-college-basketball/standings`;
        const params = {
            region: 'us',
            lang: 'en',
            contentorigin: 'espn',
            season: year,
            group: group,
            type: 0,
            level: 1,
            sort: 'leaguewinpercent:desc,vsconf_winpercent:desc,' +
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
     * @memberOf mbb
     * @async
     * @function
     * @param {number} group - Group is 50 for Division-I, 51 for Division-II, 52 for Division-III
     * @returns json
     * @example
     * const result = await sdv.mbb.getTeamList(group=50);
     */
    getTeamList: async function ({
        group = 50
    }) {
        const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams';
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
     * Gets the team info for a specific College Basketball team.
     * @memberOf mbb
     * @async
     * @function
     * @param {number} id - Team Id
     * @returns json
     * @example
     * const teamId = 52;
     * const result = await sdv.mbb.getTeamInfo(teamId);
     */
    getTeamInfo: async function (id) {
        const baseUrl = `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${id}`;

        const res = await axios.get(baseUrl);
        return res.data;
    },
    /**
     * Gets the team roster information for a specific Men's College Basketball team.
     * @memberOf mbb
     * @async
     * @function
     * @param {number} id - Team Id
     * @returns json
     * @example
     * const teamId = 52;
     * const result = await sdv.mbb.getTeamPlayers(teamId);
     */
    getTeamPlayers: async function (id) {
        const baseUrl = `http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/${id}`;
        const params = {
            enable: "roster"
        };

        const res = await axios.get(baseUrl, {
            params
        });

        return res.data;
    }
}
