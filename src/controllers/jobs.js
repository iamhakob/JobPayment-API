const { getProfileUnpaidJobs, payJob } = require('../services/jobs');

module.exports = {
  getProfileUnpaidJobs: async (req, res) => {
    const { id } = req.profile;

    const unpaidJobs = await getProfileUnpaidJobs(id);

    res.json(unpaidJobs);
  },

  payJob: async (req, res) => {
    const clientId = req.profile.id;
    const jobId = req.params.job_id;

    await payJob(jobId, clientId);

    res.json({ message: 'OK' });
  },
};
