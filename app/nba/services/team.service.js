const axios = require('axios');
/**
 * Gets the list of all NBA teams their identification info for ESPN.
 * @example
 * get list of teams
 * const result = await sdv.nbaTeams.getTeamList();
 */
const getTeamList = async ({
}) => {
    const baseUrl = 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams';
    const params = {
        limit: 1000
    };

    const res = await axios.get(baseUrl, {
        params
    });

    return res.data;
}
/**
 * Gets the team info for a specific NBA team.
 * @param {number} id - Team Id
 * @example
 * get individual team data
 * const teamId = 16;
 * const result = await sdv.nbaTeams.getTeamInfo(teamId);
 */
const getTeamInfo = async (id) => {
    const baseUrl = `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${id}`;

    const res = await axios.get(baseUrl);
    return res.data;
}
/**
 * Gets the team roster information for a specific NBA team.
 * @param {number} id - Team Id
 * @example
 * get team roster data
 * const teamId = 16;
 * const result = await sdv.nbaTeams.getTeamPlayers(teamId);
 */
const getTeamPlayers = async (id) => {
    const baseUrl = `http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${id}`;
    const params = {
        enable: "roster"
    };

    const res = await axios.get(baseUrl, {
        params
    });

    return res.data;
}

module.exports = {
    getTeamList,
    getTeamInfo,
    getTeamPlayers
}