const pool = require('../public/db');

const reportControl = {
    async renderTopHospital(req, res) {
        try {
            const island = req.body.getTopHospi;
            const topHospital = await pool.getTopHospital(island);
    
            // Construct HTML response
            let tableHtml = `
                <a href="/" style="text-decoration: none; padding: 8px 16px; background-color: rgb(141, 67, 67); color: white; border-radius: 4px; margin-bottom: 10px; display: inline-block;">Back</a>
                <div style="overflow-x: auto;">
                    <table class="top-hospital-table" style="border-collapse: collapse; width: 100%;">
                        <tr class="top-hospital-headings" style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Hospital Name</th>
                            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Hospital Count</th>
                        </tr>
                        <tr class="top-hospital-results" style="background-color: #ffffff;">
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${topHospital.hospitalname}</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${topHospital.hospital_count}</td>
                        </tr>
                    </table>
                </div>
            `;
    
            res.send(tableHtml); 
        } catch (error) {
            console.error('Error fetching top hospital:', error);
            return res.status(500).send('Error fetching top hospital.');
        }
    },

    async renderTopCity(req, res) {
        try {
            const island = req.body.getTopCity;
            const topCity = await pool.getTopCity(island);
    
            // Construct HTML response
            let tableHtml = `
                <a href="/" style="text-decoration: none; padding: 8px 16px; background-color: rgb(141, 67, 67); color: white; border-radius: 4px; margin-bottom: 10px; display: inline-block;">Back</a>
                <div style="overflow-x: auto;">
                    <table class="top-city-table" style="border-collapse: collapse; width: 100%;">
                        <tr class="top-city-headings" style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">City</th>
                            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">City Count</th>
                        </tr>
                        <tr class="top-city-results" style="background-color: #ffffff;">
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${topCity.city}</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${topCity.city_count}</td>
                        </tr>
                    </table>
                </div>
            `;
    
            res.send(tableHtml); 
        } catch (error) {
            console.error('Error fetching top city:', error);
            return res.status(500).send('Error fetching top city.');
        }
    },

    async renderTopSpecialization(req, res) {
        try {
            const island = req.body.getTopSpec;
            const topSpecialization = await pool.getTopSpecialization(island);
            let tableHtml = `
                <a href="/" style="text-decoration: none; padding: 8px 16px; background-color: rgb(141, 67, 67); color: white; border-radius: 4px; margin-bottom: 10px; display: inline-block;">Back</a>
                <div style="overflow-x: auto;">
                    <table class="top-specialization-table" style="border-collapse: collapse; width: 100%;">
                        <tr class="top-specialization-headings" style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Main Specialty</th>
                            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Popularity</th>
                        </tr>
                        <tr class="top-specialization-results" style="background-color: #ffffff;">
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${topSpecialization.mainspecialty}</td>
                            <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${topSpecialization.popularity}</td>
                        </tr>
                    </table>
                </div>
            `;

            res.send(tableHtml); // Send the constructed HTML table
        } catch (error) {
            console.error('Error fetching top specialization:', error);
            return res.status(500).send('Error fetching top specialization.');
        }
    }
};

module.exports = reportControl;
