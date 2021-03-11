const axios = require('axios');
/**
 * Gets the team standings for the NFL.
 * @param {number} year - Season
 * @param {number} group - acceptable group names: 'league','conference','division'
 * @example
 * get NFL standings
 * const yr = 2016;
 * const result = await sdv.nbaStandings.getStandings(year = yr);
 */
exports.getStandings = async ({
// acceptable group names: ['league','conference','division']
    year = new Date().getFullYear(),
    group = 'league'
}) => {
    const baseUrl = `http://cdn.espn.com/core/nfl/standings/_/season/${year}/group/${group}`;

    const params = {
        xhr: 1,
        render: false,
        device: 'desktop',
        userab: 18
    };

    const res = await axios.get(baseUrl, {
        params
    });

    return res.content.standings.groups;
};